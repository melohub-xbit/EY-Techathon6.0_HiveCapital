import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getCustomers,
    getCreditScore,
    getOffers,
    uploadSalarySlip,
    Customer,
    CreditScore,
    Offer
} from '@/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
    User,
    CreditCard,
    Gift,
    Upload,
    Search,
    MapPin,
    Phone,
    Mail,
    IndianRupee,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Loader2
} from 'lucide-react';

// Credit Score Gauge Component
const CreditScoreGauge = ({ score }: { score: number }) => {
    const percentage = (score / 900) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getScoreColor = (score: number) => {
        if (score >= 750) return '#10B981'; // Emerald - Excellent
        if (score >= 650) return '#F59E0B'; // Gold - Good
        if (score >= 550) return '#F97316'; // Orange - Fair
        return '#EF4444'; // Red - Poor
    };

    const getScoreLabel = (score: number) => {
        if (score >= 750) return 'Excellent';
        if (score >= 650) return 'Good';
        if (score >= 550) return 'Fair';
        return 'Poor';
    };

    return (
        <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full -rotate-90">
                {/* Background Circle */}
                <circle
                    cx="80"
                    cy="80"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                />
                {/* Score Arc */}
                <motion.circle
                    cx="80"
                    cy="80"
                    r="45"
                    fill="none"
                    stroke={getScoreColor(score)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    className="text-4xl font-bold text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {score}
                </motion.span>
                <span className="text-sm" style={{ color: getScoreColor(score) }}>
                    {getScoreLabel(score)}
                </span>
            </div>
        </div>
    );
};

// Info Row Component
const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
        <div className="text-emerald-400">{icon}</div>
        <div className="flex-1">
            <p className="text-xs text-white/40">{label}</p>
            <p className="text-sm text-white font-medium">{value}</p>
        </div>
    </div>
);

// Customer Card Component
const CustomerCard = ({
    customer,
    isSelected,
    onClick
}: {
    customer: Customer;
    isSelected: boolean;
    onClick: () => void;
}) => (
    <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
            p-4 rounded-2xl cursor-pointer transition-all duration-300 border
            ${isSelected
                ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border-emerald-500/50 glow-emerald'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }
        `}
    >
        <div className="flex items-center gap-3">
            <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold
                ${isSelected
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                    : 'bg-white/10 text-white/60'
                }
            `}>
                {customer.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className={`font-semibold truncate ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                    {customer.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-white/40">
                    <MapPin className="w-3 h-3" />
                    <span>{customer.city}</span>
                </div>
            </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-white/40">Income</span>
            <span className="text-emerald-400 font-medium">₹{customer.monthly_income.toLocaleString()}</span>
        </div>
    </motion.div>
);

export const MockDashboard: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [creditScore, setCreditScore] = useState<CreditScore | null>(null);
    const [offer, setOffer] = useState<Offer | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadCustomers();
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            setFilteredCustomers(
                customers.filter(c =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.id.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        } else {
            setFilteredCustomers(customers);
        }
    }, [searchQuery, customers]);

    const loadCustomers = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
            setFilteredCustomers(data);
        } catch (error) {
            console.error("Failed to load customers", error);
        }
    };

    const handleSelectCustomer = async (customer: Customer) => {
        setSelectedCustomer(customer);
        setCreditScore(null);
        setOffer(null);
        setUploadStatus('');
        setLoading(true);

        try {
            try {
                const scoreData = await getCreditScore(customer.id);
                setCreditScore(scoreData);
            } catch {
                console.log("No score found");
            }

            try {
                const offerData = await getOffers(customer.id);
                setOffer(offerData);
            } catch {
                console.log("No offer found");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadStatus('Uploading...');
            try {
                const res = await uploadSalarySlip(e.target.files[0]);
                setUploadStatus(`Success: ${res.message}`);
            } catch {
                setUploadStatus('Upload Failed');
            }
        }
    };

    return (
        <DashboardLayout title="Customer Data" subtitle="Mock Database">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Customer List Panel */}
                <div className="lg:col-span-4 xl:col-span-3">
                    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden">
                        {/* Search Header */}
                        <div className="p-4 border-b border-white/10">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Search customers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50"
                                />
                            </div>
                            <p className="text-xs text-white/40 mt-3">
                                {filteredCustomers.length} customers found
                            </p>
                        </div>

                        {/* Customer List */}
                        <div className="p-4 max-h-[calc(100vh-300px)] overflow-y-auto space-y-3 scrollbar-thin">
                            {filteredCustomers.map(c => (
                                <CustomerCard
                                    key={c.id}
                                    customer={c}
                                    isSelected={selectedCustomer?.id === c.id}
                                    onClick={() => handleSelectCustomer(c)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Details Panel */}
                <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center h-64 rounded-2xl bg-white/5 border border-white/10"
                            >
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
                                    <p className="text-white/40">Loading customer data...</p>
                                </div>
                            </motion.div>
                        ) : selectedCustomer ? (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                {/* KYC Details Card */}
                                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                                            <User className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">{selectedCustomer.name}</h2>
                                            <p className="text-sm text-white/40">Customer ID: {selectedCustomer.id}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <InfoRow icon={<User className="w-4 h-4" />} label="Age" value={`${selectedCustomer.age} years`} />
                                        <InfoRow icon={<CreditCard className="w-4 h-4" />} label="PAN" value={selectedCustomer.pan} />
                                        <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={selectedCustomer.phone} />
                                        <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={selectedCustomer.email} />
                                        <InfoRow icon={<MapPin className="w-4 h-4" />} label="City" value={selectedCustomer.city} />
                                        <InfoRow icon={<IndianRupee className="w-4 h-4" />} label="Monthly Income" value={`₹${selectedCustomer.monthly_income.toLocaleString()}`} />
                                    </div>

                                    {/* Existing Loans */}
                                    {selectedCustomer.existing_loans.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-white/10">
                                            <h3 className="text-sm font-semibold text-white/60 mb-3">Existing Loans</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedCustomer.existing_loans.map((loan, i) => (
                                                    <div key={i} className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                                        <span className="text-amber-400 text-sm font-medium">{loan.type}</span>
                                                        <span className="text-white/40 text-xs ml-2">EMI: ₹{loan.emi.toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Bento Grid for Score and Offer */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Credit Score Card - Takes 1 column */}
                                    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
                                                <TrendingUp className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-white">Credit Score</h3>
                                        </div>

                                        {creditScore ? (
                                            <CreditScoreGauge score={creditScore.score} />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-40 text-white/40">
                                                <AlertCircle className="w-10 h-10 mb-2" />
                                                <p className="text-sm">Score unavailable</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Pre-Approved Offer Card - Takes 2 columns */}
                                    <div className="md:col-span-2 rounded-2xl bg-gradient-to-br from-gold-500/10 to-gold-600/5 border border-gold-500/20 backdrop-blur-sm p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 rounded-xl bg-gold-500/20 border border-gold-500/30">
                                                <Gift className="w-5 h-5 text-gold-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-white">Pre-Approved Offer</h3>
                                        </div>

                                        {offer ? (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="md:col-span-2 p-6 rounded-xl bg-gold-500/10 border border-gold-500/20">
                                                    <p className="text-xs text-gold-400/60 uppercase tracking-wider mb-1">Maximum Loan Limit</p>
                                                    <p className="text-4xl font-bold text-gold-400">
                                                        ₹{offer.pre_approved_limit.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                        <p className="text-white/40 text-xs">Interest Rate</p>
                                                        <p className="text-xl font-bold text-white">{offer.interest_rate}%</p>
                                                    </div>
                                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                        <p className="text-white/40 text-xs">Valid Until</p>
                                                        <p className="text-lg font-semibold text-white">{offer.validity}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-40 text-white/40">
                                                <AlertCircle className="w-10 h-10 mb-2" />
                                                <p className="text-sm">No offers available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Upload Section */}
                                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 rounded-xl bg-teal-500/20 border border-teal-500/30">
                                            <Upload className="w-5 h-5 text-teal-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Upload Salary Slip</h3>
                                    </div>

                                    <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-teal-500/50 hover:bg-teal-500/5 transition-all">
                                        <Upload className="w-10 h-10 text-white/40 mb-3" />
                                        <p className="text-white/60 text-sm">Click to upload or drag and drop</p>
                                        <p className="text-white/30 text-xs mt-1">PDF, PNG, JPG up to 10MB</p>
                                        <input
                                            type="file"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            accept=".pdf,.png,.jpg,.jpeg"
                                        />
                                    </label>

                                    {uploadStatus && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${uploadStatus.includes('Success')
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : uploadStatus.includes('Failed')
                                                    ? 'bg-rose-500/20 text-rose-400'
                                                    : 'bg-blue-500/20 text-blue-400'
                                                }`}
                                        >
                                            {uploadStatus.includes('Success') ? (
                                                <CheckCircle2 className="w-4 h-4" />
                                            ) : (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            )}
                                            <span className="text-sm">{uploadStatus}</span>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-96 rounded-2xl bg-white/5 border border-white/10 border-dashed"
                            >
                                <User className="w-16 h-16 text-white/20 mb-4" />
                                <h3 className="text-xl font-semibold text-white/40 mb-2">No Customer Selected</h3>
                                <p className="text-white/20 text-sm">Select a customer from the list to view details</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </DashboardLayout>
    );
};
