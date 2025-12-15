import { motion } from "framer-motion";
import { Settings, Sliders, Bell, Shield, Palette } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

export const SettingsPage = () => {
    return (
        <DashboardLayout title="Settings" subtitle="Configuration">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gold-400/20 to-gold-500/10 flex items-center justify-center mb-8 border border-gold-400/30"
                >
                    <Settings className="w-12 h-12 text-gold-400" />
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl font-bold text-white mb-4"
                >
                    Settings
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/60 text-lg max-w-md mb-8"
                >
                    Application settings and configuration options will be available here soon.
                </motion.p>

                {/* Coming Soon Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-400/10 border border-gold-400/30"
                >
                    <Sliders className="w-4 h-4 text-gold-400" />
                    <span className="text-gold-400 font-medium">Coming Soon</span>
                </motion.div>

                {/* Placeholder Settings Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl"
                >
                    {[
                        { icon: <Bell className="w-5 h-5" />, label: "Notifications", desc: "Manage alerts" },
                        { icon: <Shield className="w-5 h-5" />, label: "Privacy", desc: "Data controls" },
                        { icon: <Palette className="w-5 h-5" />, label: "Appearance", desc: "Theme options" },
                        { icon: <Sliders className="w-5 h-5" />, label: "Advanced", desc: "Pro settings" }
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="p-5 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-gold-400/30 transition-colors group"
                        >
                            <div className="text-white/40 group-hover:text-gold-400 transition-colors mb-3">
                                {item.icon}
                            </div>
                            <p className="text-white font-medium mb-1">{item.label}</p>
                            <p className="text-white/40 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </DashboardLayout>
    );
};
