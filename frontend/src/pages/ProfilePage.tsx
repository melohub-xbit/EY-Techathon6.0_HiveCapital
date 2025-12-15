import { motion } from "framer-motion";
import { User, Settings } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

export const ProfilePage = () => {
    return (
        <DashboardLayout title="Profile" subtitle="Account">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center mb-8 border border-emerald-500/30"
                >
                    <User className="w-12 h-12 text-emerald-400" />
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl font-bold text-foreground mb-4"
                >
                    Profile
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground text-lg max-w-md mb-8"
                >
                    Your profile settings and account information will be available here soon.
                </motion.p>

                {/* Coming Soon Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/30"
                >
                    <Settings className="w-4 h-4 text-emerald-400 animate-spin-slow" />
                    <span className="text-emerald-400 font-medium">Coming Soon</span>
                </motion.div>

                {/* Placeholder Info Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl"
                >
                    {[
                        { label: "Personal Info", value: "Edit your details" },
                        { label: "Security", value: "Password & 2FA" },
                        { label: "Preferences", value: "Customize experience" }
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-2xl bg-card border border-border text-left hover:border-emerald-500/30 transition-colors"
                        >
                            <p className="text-muted-foreground text-sm mb-1">{item.label}</p>
                            <p className="text-foreground font-medium">{item.value}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </DashboardLayout>
    );
};
