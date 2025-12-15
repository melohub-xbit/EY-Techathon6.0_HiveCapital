import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Upload, Bot, User, Sparkles, RotateCcw, CheckCircle, Download, FileText } from 'lucide-react';
import { sendMessage } from '@/api';
import { v4 as uuidv4 } from 'uuid';

interface Message {
    id: string;
    role: 'user' | 'agent';
    content: string;
    agentName?: string;
    timestamp: Date;
    sanctionLetterUrl?: string; // URL to download sanction letter if applicable
}

// Get API base URL for download links
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:8000');

// Trigger file download using fetch and blob for reliable browser downloads
const downloadFile = async (url: string, filename: string) => {
    try {
        const fullUrl = `${API_BASE_URL}${url}`;
        const response = await fetch(fullUrl);

        if (!response.ok) {
            throw new Error('Download failed');
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Download error:', error);
        // Fallback: open in new tab
        window.open(`${API_BASE_URL}${url}`, '_blank');
    }
};

// Utility function to strip system messages from agent responses
const stripSystemMessages = (content: string): string => {
    // Remove patterns like "(System: ...)" or "(System: Transferring to ...)"
    return content.replace(/\n*\(System:.*?\)/gi, '').trim();
};

// Check if user wants to end the session
const isSessionEndRequest = (message: string): boolean => {
    const endKeywords = ['all done', 'done', 'exit', 'bye', 'thank you', 'thanks', 'goodbye', 'start over', 'new chat', 'clear chat'];
    const lowerMessage = message.toLowerCase().trim();
    return endKeywords.some(keyword => lowerMessage.includes(keyword));
};

// Agent colors and info
const agentConfig: Record<string, { gradient: string; icon: string; label: string }> = {
    MASTER: {
        gradient: 'from-slate-600 to-slate-800',
        icon: '🤖',
        label: 'Master Agent'
    },
    SALES: {
        gradient: 'from-emerald-500 to-emerald-600',
        icon: '💼',
        label: 'Sales Agent'
    },
    VERIFICATION: {
        gradient: 'from-blue-500 to-blue-600',
        icon: '🔍',
        label: 'Verification Agent'
    },
    UNDERWRITING: {
        gradient: 'from-amber-500 to-amber-600',
        icon: '📊',
        label: 'Underwriting Agent'
    },
    SANCTION: {
        gradient: 'from-purple-500 to-purple-600',
        icon: '📄',
        label: 'Sanction Agent'
    },
};

const AgentAvatar = ({ agent }: { agent?: string }) => {
    const config = agentConfig[agent || 'MASTER'] || agentConfig.MASTER;

    return (
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-lg shadow-lg`}>
            {config.icon}
        </div>
    );
};

const UserAvatar = () => (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
        <User className="w-5 h-5 text-white" />
    </div>
);

// Typing indicator
const TypingIndicator = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-end gap-3"
    >
        <AgentAvatar agent="MASTER" />
        <div className="px-5 py-4 rounded-2xl rounded-bl-none bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-1.5">
                <motion.div
                    className="w-2 h-2 rounded-full bg-emerald-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                    className="w-2 h-2 rounded-full bg-emerald-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                />
                <motion.div
                    className="w-2 h-2 rounded-full bg-emerald-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                />
            </div>
        </div>
    </motion.div>
);

// Agent status bar
const AgentStatusBar = ({ currentAgent }: { currentAgent: string }) => {
    const agents = ['SALES', 'VERIFICATION', 'UNDERWRITING', 'SANCTION'];

    return (
        <div className="flex items-center gap-3">
            {agents.map((agent) => {
                const isActive = currentAgent === agent;
                const config = agentConfig[agent];

                return (
                    <motion.div
                        key={agent}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${isActive
                            ? 'bg-emerald-500/20 border border-emerald-500/30'
                            : 'bg-white/5 border border-white/10'
                            }`}
                        animate={{ scale: isActive ? 1.05 : 1 }}
                    >
                        <span className="text-sm">{config.icon}</span>
                        <span className={`text-xs font-medium hidden sm:inline ${isActive ? 'text-emerald-400' : 'text-white/40'
                            }`}>
                            {agent}
                        </span>
                        {isActive && (
                            <motion.div
                                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
};

// Session Complete Banner
const SessionCompleteBanner = ({ onNewChat }: { onNewChat: () => void }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 mx-auto max-w-md"
    >
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center mb-6 border border-emerald-500/30"
        >
            <CheckCircle className="w-10 h-10 text-emerald-400" />
        </motion.div>
        <h3 className="text-xl font-semibold text-white mb-2">Session Complete</h3>
        <p className="text-white/50 text-center mb-6">
            Thank you for using Hive Capital AI Assistant. Your session has ended.
        </p>
        <motion.button
            onClick={onNewChat}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium flex items-center gap-2 glow-emerald hover:glow-emerald-lg transition-all"
        >
            <RotateCcw className="w-4 h-4" />
            Start New Conversation
        </motion.button>
    </motion.div>
);

export const ChatInterface = () => {
    const [sessionId, setSessionId] = useState(uuidv4());
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentAgent, setCurrentAgent] = useState('MASTER');
    const [sessionComplete, setSessionComplete] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const hasStartedRef = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus input when agent finishes responding
    useEffect(() => {
        if (!isLoading && !sessionComplete) {
            inputRef.current?.focus();
        }
    }, [isLoading, sessionComplete]);

    const handleSendInternal = useCallback(async (text: string, currentSessionId: string) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: uuidv4(),
            role: 'user',
            content: text,
            timestamp: new Date()
        };

        // Don't add "Hi" message to visible messages (it's just for triggering)
        if (text !== "Hi") {
            setMessages(prev => [...prev, userMsg]);
        }
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await sendMessage(currentSessionId, text);

            // Strip system messages from the response
            const cleanedContent = stripSystemMessages(response.message);

            // Check if sanction letter URL is in the response
            const sanctionLetterUrl = response.state_snapshot?.sanction_letter_url as string | undefined;

            const agentMsg: Message = {
                id: uuidv4(),
                role: 'agent',
                content: cleanedContent,
                agentName: response.agent_name,
                timestamp: new Date(),
                sanctionLetterUrl: sanctionLetterUrl
            };

            setCurrentAgent(response.agent_name);
            setMessages(prev => [...prev, agentMsg]);

            // Auto-download sanction letter if available
            if (sanctionLetterUrl) {
                setTimeout(() => {
                    downloadFile(sanctionLetterUrl, `Hive_Capital_Sanction_Letter.txt`);
                }, 500);
            }
        } catch (error) {
            console.error("Chat Error", error);
            const errorMsg: Message = {
                id: uuidv4(),
                role: 'agent',
                content: "I'm sorry, I encountered an error. Please try again.",
                agentName: 'MASTER',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSend = useCallback(async (text: string = inputValue) => {
        if (!text.trim()) return;

        // Check if user wants to end the session
        if (isSessionEndRequest(text)) {
            const userMsg: Message = {
                id: uuidv4(),
                role: 'user',
                content: text,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, userMsg]);

            // Add a farewell message
            const farewellMsg: Message = {
                id: uuidv4(),
                role: 'agent',
                content: "Thank you for using Hive Capital! If you need any further assistance, feel free to start a new conversation. Have a great day! 🙌",
                agentName: 'MASTER',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, farewellMsg]);
            setInputValue('');

            // Show session complete banner after a short delay
            setTimeout(() => setSessionComplete(true), 1000);
            return;
        }

        handleSendInternal(text, sessionId);
    }, [inputValue, handleSendInternal, sessionId]);

    // Reset session to start fresh
    const resetSession = useCallback(() => {
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
        setMessages([]);
        setCurrentAgent('MASTER');
        setSessionComplete(false);
        // Directly trigger the greeting with the new session ID
        handleSendInternal("Hi", newSessionId);
    }, [handleSendInternal]);

    // Initial Greeting - only runs once on mount
    useEffect(() => {
        if (!hasStartedRef.current) {
            hasStartedRef.current = true;
            handleSendInternal("Hi", sessionId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-[#0A0F0D] to-[#0F1A14]">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-[#0A0F0D]/80 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center glow-emerald">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                AI Loan Assistant
                                <Sparkles className="w-4 h-4 text-gold-400" />
                            </h2>
                            <p className="text-sm text-white/50 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                {sessionComplete ? 'Session Ended' : (agentConfig[currentAgent]?.label || 'Online')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* New Chat Button */}
                        <motion.button
                            onClick={resetSession}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-emerald-500/30 transition-all text-sm"
                            title="Start New Chat"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span className="hidden sm:inline">New Chat</span>
                        </motion.button>

                        {/* Agent Status Bar */}
                        <div className="hidden md:block">
                            <AgentStatusBar currentAgent={currentAgent} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 20 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-end gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                }`}>
                                {/* Avatar */}
                                {msg.role === 'agent' ? (
                                    <AgentAvatar agent={msg.agentName} />
                                ) : (
                                    <UserAvatar />
                                )}

                                {/* Message Bubble */}
                                <div className={`
                                    px-5 py-4 rounded-2xl backdrop-blur-sm
                                    ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-br-none glow-emerald'
                                        : 'bg-white/5 border border-white/10 text-white/90 rounded-bl-none'
                                    }
                                `}>
                                    {/* Agent name badge */}
                                    {msg.role === 'agent' && msg.agentName && (
                                        <div className="text-xs text-emerald-400 font-medium mb-2">
                                            {agentConfig[msg.agentName]?.label || msg.agentName}
                                        </div>
                                    )}

                                    {/* Message content */}
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                        {msg.content}
                                    </p>

                                    {/* Sanction Letter Download Button */}
                                    {msg.sanctionLetterUrl && (
                                        <motion.button
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={() => downloadFile(msg.sanctionLetterUrl!, 'Hive_Capital_Sanction_Letter.txt')}
                                            className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium text-sm hover:from-emerald-600 hover:to-emerald-700 transition-all glow-emerald hover:glow-emerald-lg"
                                        >
                                            <FileText className="w-4 h-4" />
                                            <span>Download Sanction Letter</span>
                                            <Download className="w-4 h-4" />
                                        </motion.button>
                                    )}

                                    {/* Timestamp */}
                                    <div className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-emerald-100/70' : 'text-white/30'
                                        }`}>
                                        {msg.timestamp.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    {isLoading && <TypingIndicator />}

                    {/* Session Complete Banner */}
                    {sessionComplete && <SessionCompleteBanner onNewChat={resetSession} />}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {!sessionComplete && (
                <div className="px-2 py-2 border-t border-white/10 bg-[#0A0F0D]/80 backdrop-blur-xl">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex gap-2 items-center max-w-4xl mx-auto"
                    >
                        {/* File Upload (when in UNDERWRITING phase) */}
                        {currentAgent === 'UNDERWRITING' && (
                            <div className="relative">
                                <motion.button
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    type="button"
                                    onClick={() => handleSend("I am uploading my Salary Slip [Simulated Attachment]")}
                                    className="p-2 rounded-lg bg-gold-500/20 border border-gold-500/30 text-gold-400 hover:bg-gold-500/30 transition-all"
                                    title="Upload Salary Slip"
                                >
                                    <Upload className="w-4 h-4" />
                                </motion.button>
                                {/* Animated tooltip */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: 0.3, duration: 0.3 }}
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap"
                                >
                                    <div className="relative px-3 py-2 rounded-lg bg-gold-500 text-black text-xs font-medium shadow-lg">
                                        <motion.span
                                            animate={{ opacity: [1, 0.7, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            👆 Click to upload salary slip
                                        </motion.span>
                                        {/* Arrow */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gold-500" />
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {/* Input Field */}
                        <div className="relative flex-1">
                            <input
                                ref={inputRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type your message..."
                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Send Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                p-2 rounded-lg transition-all
                                ${inputValue.trim() && !isLoading
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white glow-emerald hover:glow-emerald-lg'
                                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                                }
                            `}
                        >
                            <Send className="w-5 h-5" />
                        </motion.button>
                    </form>

                </div>
            )}
        </div>
    );
};

