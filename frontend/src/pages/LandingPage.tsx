import { motion } from "framer-motion";
import {
    ArrowRight,
    Bot,
    ShieldCheck,
    Zap,
    TrendingUp,
    Clock,
    CheckCircle,
    Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Animated gradient background component
const AnimatedBackground = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F0D] via-[#0F1A14] to-[#0A0F0D]" />

        {/* Animated mesh gradients */}
        <div className="absolute inset-0 opacity-60">
            <motion.div
                className="absolute top-0 -left-40 w-[600px] h-[600px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)' }}
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)' }}
                animate={{
                    x: [0, -80, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-0 left-1/3 w-[700px] h-[700px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(52, 211, 153, 0.2) 0%, transparent 70%)' }}
                animate={{
                    x: [0, 60, 0],
                    y: [0, -80, 0],
                    scale: [1, 1.15, 1]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>

        {/* Subtle grid overlay */}
        <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
            }}
        />
    </div>
);

// Premium button component
const PremiumButton = ({
    children,
    variant = "primary",
    onClick,
    className = ""
}: {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "ghost";
    onClick?: () => void;
    className?: string;
}) => {
    const baseStyles = "relative px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-2 overflow-hidden";

    const variants = {
        primary: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 glow-emerald hover:glow-emerald-lg active:scale-95",
        secondary: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-emerald-400/50 active:scale-95",
        ghost: "text-white/80 hover:text-white hover:bg-white/5 active:scale-95"
    };

    return (
        <motion.button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {variant === "primary" && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
            )}
            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </motion.button>
    );
};

// Feature card component with bento grid support
const FeatureCard = ({
    icon,
    title,
    description,
    delay,
    size = "normal"
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: number;
    size?: "normal" | "tall" | "wide" | "large";
}) => {
    const sizeClasses = {
        normal: "",
        tall: "md:row-span-2",
        wide: "md:col-span-2",
        large: "md:col-span-2 md:row-span-2"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className={`group relative p-8 rounded-3xl glass-emerald card-hover cursor-pointer ${sizeClasses[size]}`}
        >
            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-emerald-500/10 to-gold-500/5" />

            {/* Icon */}
            <div className="relative mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center border border-emerald-500/30 group-hover:glow-emerald transition-all duration-300">
                {icon}
            </div>

            {/* Content */}
            <h3 className="relative text-xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                {title}
            </h3>
            <p className="relative text-white/60 leading-relaxed">
                {description}
            </p>

            {/* Extra content for larger cards */}
            {(size === "tall" || size === "large") && (
                <div className="relative mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Active & Processing
                    </div>
                </div>
            )}
        </motion.div>
    );
};

// // Stats component
// const StatCard = ({
//     value,
//     label,
//     delay
// }: {
//     value: string;
//     label: string;
//     delay: number;
// }) => (
//     <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         whileInView={{ opacity: 1, scale: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.5, delay }}
//         className="text-center p-6"
//     >
//         <div className="text-4xl md:text-5xl font-bold text-gradient-emerald-gold mb-2">
//             {value}
//         </div>
//         <div className="text-white/50 text-sm uppercase tracking-wider">
//             {label}
//         </div>
//     </motion.div>
// );

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen text-white overflow-hidden">
            <AnimatedBackground />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center glow-emerald">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gradient-emerald">Hive Capital</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden md:flex items-center gap-8"
                    >
                        <a href="#features" className="text-white/70 hover:text-emerald-400 transition-colors">Features</a>
                        <a href="#about" className="text-white/70 hover:text-emerald-400 transition-colors">About</a>
                        <button
                            onClick={() => navigate('/chat')}
                            className="px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                        >
                            Get Started
                        </button>
                    </motion.div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-400 text-sm font-medium">AI-Powered Loan Processing</span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                    >
                        <span className="text-white">Personal Loans</span>
                        <br />
                        <span className="text-gradient-emerald-gold">Made Intelligent</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed"
                    >
                        Experience the future of financial services with our multi-agent AI system.
                        <span className="text-emerald-400"> Smart. Secure. Seamless.</span>
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <PremiumButton variant="primary" onClick={() => navigate('/chat')}>
                            Start Your Application <ArrowRight className="w-5 h-5" />
                        </PremiumButton>
                        <PremiumButton variant="secondary" onClick={() => navigate('/mock-dashboard')}>
                            View Demo Data
                        </PremiumButton>
                    </motion.div>

                    {/* Floating elements */}
                    <div className="absolute bottom-20 left-1/4 hidden lg:block">
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="w-20 h-20 rounded-2xl glass-emerald flex items-center justify-center"
                        >
                            <TrendingUp className="w-10 h-10 text-emerald-400" />
                        </motion.div>
                    </div>
                    <div className="absolute bottom-40 right-1/4 hidden lg:block">
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-16 h-16 rounded-2xl glass flex items-center justify-center"
                        >
                            <CheckCircle className="w-8 h-8 text-gold-400" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            {/* <section className="relative py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-3xl glass-emerald">
                        <StatCard value="50K+" label="Loans Processed" delay={0} />
                        <StatCard value="99.9%" label="Uptime" delay={0.1} />
                        <StatCard value="<2min" label="Approval Time" delay={0.2} />
                        <StatCard value="4.9★" label="Customer Rating" delay={0.3} />
                    </div>
                </div>
            </section> */}

            {/* Features Section */}
            <section id="features" className="relative py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-white">Powered by </span>
                            <span className="text-gradient-emerald">Multi-Agent AI</span>
                        </h2>
                        <p className="text-white/50 text-xl max-w-2xl mx-auto">
                            Our specialized AI agents work together to provide you with the fastest, most accurate loan processing experience.
                        </p>
                    </motion.div>

                    {/* Bento Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
                        <FeatureCard
                            icon={<Bot className="w-7 h-7 text-emerald-400" />}
                            title="Multi-Agent System"
                            description="Specialized AI agents for sales, verification, underwriting, and documentation working together seamlessly."
                            delay={0}
                            size="tall"
                        />
                        <FeatureCard
                            icon={<Zap className="w-7 h-7 text-gold-400" />}
                            title="Instant Analysis"
                            description="Real-time document verification and credit assessment powered by advanced AI."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="w-7 h-7 text-emerald-400" />}
                            title="Bank-Grade Security"
                            description="Enterprise-level encryption and security protocols protect your data."
                            delay={0.15}
                        />
                        <FeatureCard
                            icon={<TrendingUp className="w-7 h-7 text-gold-400" />}
                            title="Smart Recommendations"
                            description="Get personalized loan offers based on your unique financial profile and needs."
                            delay={0.2}
                            size="tall"
                        />
                        <FeatureCard
                            icon={<Clock className="w-7 h-7 text-emerald-400" />}
                            title="24/7 Availability"
                            description="Apply for loans anytime, anywhere. Our AI assistants never sleep."
                            delay={0.25}
                            size="wide"
                        />
                        <FeatureCard
                            icon={<CheckCircle className="w-7 h-7 text-gold-400" />}
                            title="Transparent Process"
                            description="Track your application status in real-time with complete transparency."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="relative py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left - Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                <span className="text-white">About </span>
                                <span className="text-gradient-emerald">Hive Capital</span>
                            </h2>
                            <p className="text-white/60 text-lg leading-relaxed mb-6">
                                Hive Capital is a next-generation financial services platform powered by cutting-edge
                                Multi-Agent AI technology. We're revolutionizing the personal loan experience by making
                                it faster, smarter, and more transparent than ever before.
                            </p>
                            <p className="text-white/60 text-lg leading-relaxed mb-8">
                                Our mission is to democratize access to credit by leveraging artificial intelligence
                                to streamline verification, underwriting, and approval processes—reducing wait times
                                from days to minutes while maintaining the highest standards of security and compliance.
                            </p>

                            {/* Key Stats - Bento Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="col-span-2 md:col-span-1 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20"
                                >
                                    <div className="text-3xl font-bold text-gradient-emerald">4</div>
                                    <div className="text-white/50 text-sm mt-1">AI Agents</div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="p-5 rounded-2xl bg-white/5 border border-white/10"
                                >
                                    <div className="text-3xl font-bold text-gradient-gold">&lt;2m</div>
                                    <div className="text-white/50 text-sm mt-1">Response</div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    className="p-5 rounded-2xl bg-white/5 border border-white/10"
                                >
                                    <div className="text-3xl font-bold text-white">24/7</div>
                                    <div className="text-white/50 text-sm mt-1">Available</div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Right - Visual */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="relative p-8 rounded-3xl glass-emerald">
                                {/* Decorative glow */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/30 rounded-full blur-3xl" />
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold-400/20 rounded-full blur-3xl" />

                                {/* Agent Flow Diagram */}
                                <div className="relative space-y-4">
                                    <h3 className="text-xl font-semibold text-white mb-6 text-center">Our AI Agent Workflow</h3>
                                    {[
                                        { icon: '💼', name: 'Sales Agent', desc: 'Qualifying & matching offers' },
                                        { icon: '🔍', name: 'Verification Agent', desc: 'KYC & identity verification' },
                                        { icon: '📊', name: 'Underwriting Agent', desc: 'Credit assessment & analysis' },
                                        { icon: '📄', name: 'Sanction Agent', desc: 'Approval & documentation' }
                                    ].map((agent, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 + i * 0.1 }}
                                            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors group"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-gold-400/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                {agent.icon}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{agent.name}</p>
                                                <p className="text-white/40 text-sm">{agent.desc}</p>
                                            </div>
                                            {i < 3 && (
                                                <div className="ml-auto text-emerald-400/50">→</div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-12 md:p-16 rounded-3xl glass-emerald relative overflow-hidden"
                    >
                        {/* Background glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />

                        <h2 className="relative text-4xl md:text-5xl font-bold mb-6">
                            <span className="text-white">Ready to Get </span>
                            <span className="text-gradient-gold">Started?</span>
                        </h2>
                        <p className="relative text-white/60 text-xl mb-8 max-w-2xl mx-auto">
                            Join thousands of customers who have already experienced the future of loan processing.
                        </p>
                        <PremiumButton variant="primary" onClick={() => navigate('/chat')}>
                            Start Your Journey <ArrowRight className="w-5 h-5" />
                        </PremiumButton>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative py-12 px-6 border-t border-white/10">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-white/80">Hive Capital</span>
                    </div>
                    <p className="text-white/40 text-sm">
                        © 2024 Hive Capital. Powered by EY Techathon 6.0
                    </p>
                </div>
            </footer>
        </div>
    );
};
