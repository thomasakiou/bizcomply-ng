import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { subscriptionService } from '../services/subscriptionService';
import { LoadScript, PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"; // Assuming hypothetical or illustrative
import { Check, Star, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Subscription: React.FC = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const plans = [
        {
            id: 'basic',
            name: 'Starter',
            price: billingCycle === 'annual' ? 15000 : 1500,
            description: 'For small businesses just starting out.',
            features: ['Basic Compliance Checklist', '5 Document Uploads', 'Email Support'],
            icon: Zap,
            recommended: false
        },
        {
            id: 'pro',
            name: 'Growth',
            price: billingCycle === 'annual' ? 35000 : 3500,
            description: 'Everything you need for growing compliance.',
            features: ['Full Compliance Suite', 'Unlimited Documents', 'AI Assistant Access', 'Priority Support'],
            icon: Star,
            recommended: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: billingCycle === 'annual' ? 80000 : 8000,
            description: 'For large organizations with complex needs.',
            features: ['Dedicated Account Manager', 'Custom Regulations', 'Agent Access', 'API Access', 'Audit Logs'],
            icon: Shield,
            recommended: false
        }
    ];

    const handleSubscribe = async (plan: any) => {
        if (!currentUser) return;

        // This is a placeholder for actual payment integration (Paystack/Flutterwave/Stripe)
        // For Nigerian context, Paystack/Flutterwave is standard.
        // We will simulate a successful payment here.
        if (confirm(`Proceed to subscribe to ${plan.name} Plan for ₦${plan.price.toLocaleString()}?`)) {
            try {
                // Simulate processing
                await new Promise(r => setTimeout(r, 1500));

                await subscriptionService.create(
                    currentUser.uid,
                    plan.id,
                    plan.price,
                    billingCycle === 'annual' ? 12 : 1
                );

                alert(`Successfully subscribed to ${plan.name}!`);
                navigate('/');
            } catch (error) {
                console.error('Subscription error:', error);
                alert('Failed to process subscription');
            }
        }
    };

    return (
        <div className="flex flex-row min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Upgrade Your Plan</h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Unlock the full potential of BizComply NG with our premium features.
                        Choose the plan that fits your business stage.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
                            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${billingCycle === 'annual' ? 'bg-primary' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${billingCycle === 'annual' ? 'translate-x-9' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                        <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
                            Yearly <span className="text-primary text-xs font-bold">(Save 20%)</span>
                        </span>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative flex flex-col p-8 bg-white rounded-2xl transition-all duration-300 ${plan.recommended
                                    ? 'border-2 border-primary shadow-xl scale-105 z-10'
                                    : 'border border-gray-100 shadow-sm hover:shadow-md'
                                    }`}
                            >
                                {plan.recommended && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto ${plan.recommended ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        <plan.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                    <p className="text-gray-500 text-sm mt-2 h-10">{plan.description}</p>
                                </div>

                                <div className="mb-8">
                                    <span className="text-4xl font-bold text-gray-900">₦{plan.price.toLocaleString()}</span>
                                    <span className="text-gray-500">/{billingCycle === 'annual' ? 'yr' : 'mo'}</span>
                                </div>

                                <ul className="flex-1 space-y-4 mb-8 text-left">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                                            <Check className="w-5 h-5 text-green-500 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    className={`w-full py-4 rounded-xl font-bold transition-all ${plan.recommended
                                        ? 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl'
                                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    Choose {plan.name}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-sm text-gray-500 max-w-lg mx-auto">
                        <p className="flex items-center justify-center gap-2">
                            <Shield className="w-4 h-4" />
                            Secure payment processing provided by Paystack. Cancel anytime.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Subscription;
