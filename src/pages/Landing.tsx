import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Shield, Clock, FileText, Users, TrendingUp, ArrowRight } from 'lucide-react';

const Landing: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">BizComply NG</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-gray-700 hover:text-primary font-medium">
                                Login
                            </Link>
                            <Link to="/signup" className="btn-primary">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="bg-gradient-primary py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Smart Business Compliance for Nigerian Businesses
                        </h1>
                        <p className="text-xl text-gray-700 mb-8">
                            Automate CAC, TIN, VAT, PAYE, and all your compliance requirements from one powerful dashboard.
                            Stay compliant, avoid penalties, and focus on growing your business.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to="/signup" className="btn-primary text-lg px-8 py-3">
                                Start Free Trial
                                <ArrowRight className="inline-block ml-2 w-5 h-5" />
                            </Link>
                            <a href="#features" className="btn-outline text-lg px-8 py-3">
                                Learn More
                            </a>
                        </div>
                        <p className="text-sm text-gray-600 mt-4">
                            No credit card required • 14-day free trial • Cancel anytime
                        </p>
                    </div>
                </div>
            </section>

            {/* What BizComply NG Does */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            What BizComply NG Does
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to manage your business compliance in Nigeria
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card p-8 text-center">
                            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Automated Compliance Tracking
                            </h3>
                            <p className="text-gray-600">
                                Track CAC annual returns, TIN registration, VAT, PAYE, and all regulatory requirements automatically.
                            </p>
                        </div>

                        <div className="card p-8 text-center">
                            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Deadline Reminders
                            </h3>
                            <p className="text-gray-600">
                                Never miss a deadline again. Get timely notifications for upcoming compliance requirements and renewals.
                            </p>
                        </div>

                        <div className="card p-8 text-center">
                            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Secure Document Storage
                            </h3>
                            <p className="text-gray-600">
                                Store all your compliance documents securely in the cloud with expiry tracking and easy retrieval.
                            </p>
                        </div>

                        <div className="card p-8 text-center">
                            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Expert Support
                            </h3>
                            <p className="text-gray-600">
                                Access to compliance experts and AI-powered assistance for all your regulatory questions.
                            </p>
                        </div>

                        <div className="card p-8 text-center">
                            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Compliance Dashboard
                            </h3>
                            <p className="text-gray-600">
                                Real-time compliance score and risk assessment to help you stay on top of all requirements.
                            </p>
                        </div>

                        <div className="card p-8 text-center">
                            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Task Management
                            </h3>
                            <p className="text-gray-600">
                                Organize and prioritize compliance tasks with our intuitive task management system.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Compliance Benefits */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Why Compliance Matters for Your Business
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Avoid Penalties</h4>
                                        <p className="text-gray-600">
                                            Non-compliance can result in heavy fines, business closure, or legal action. Stay compliant and protect your business.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Build Trust</h4>
                                        <p className="text-gray-600">
                                            Compliance demonstrates professionalism and builds trust with customers, partners, and investors.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Access Opportunities</h4>
                                        <p className="text-gray-600">
                                            Many contracts and funding opportunities require proof of compliance. Don't miss out on growth opportunities.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Save Time & Money</h4>
                                        <p className="text-gray-600">
                                            Automate compliance tasks and reduce the time and resources spent on manual tracking and filing.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Nigerian Compliance Checklist
                            </h3>
                            <div className="space-y-3">
                                {[
                                    'CAC Business Registration',
                                    'Tax Identification Number (TIN)',
                                    'VAT Registration (if applicable)',
                                    'PAYE Registration',
                                    'Pension Registration (PFA)',
                                    'ITF & NSITF Compliance',
                                    'Annual Returns Filing',
                                    'Local Government Permits',
                                    'Industry-Specific Licenses',
                                    'Environmental Compliance'
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Plans */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-xl text-gray-600">
                            Choose the plan that's right for your business
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Free Plan */}
                        <div className="card p-8 border-2 border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                            <p className="text-gray-600 mb-6">For startups getting started</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">₦0</span>
                                <span className="text-gray-600">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span className="text-gray-700">1 Business Profile</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span className="text-gray-700">Basic Compliance Tracking</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span className="text-gray-700">Email Reminders</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span className="text-gray-700">10 Document Uploads</span>
                                </li>
                            </ul>
                            <Link to="/signup" className="btn-outline w-full block text-center">
                                Get Started
                            </Link>
                        </div>

                        {/* Professional Plan */}
                        <div className="card p-8 border-2 border-primary relative">
                            <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                                Popular
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                            <p className="text-gray-600 mb-6">For growing businesses</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">₦15,000</span>
                                <span className="text-gray-600">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span className="text-gray-700">5 Business Profiles</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span className="text-gray-700">Advanced Compliance Tracking</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span className="text-gray-700">SMS & Email Reminders</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span className="text-gray-700">Unlimited Documents</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span className="text-gray-700">AI Compliance Assistant</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span className="text-gray-700">Priority Support</span>
                                </li>
                            </ul>
                            <Link to="/signup" className="btn-primary w-full block text-center">
                                Start Free Trial
                            </Link>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="card p-8 border-2 border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                            <p className="text-gray-600 mb-6">For large organizations</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">Custom</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span className="text-gray-700">Unlimited Business Profiles</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span className="text-gray-700">Custom Compliance Workflows</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span className="text-gray-700">Multi-channel Notifications</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span className="text-gray-700">Dedicated Account Manager</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span className="text-gray-700">API Access</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span className="text-gray-700">Custom Integrations</span>
                                </li>
                            </ul>
                            <a href="mailto:sales@bizcomplyng.com" className="btn-outline w-full block text-center">
                                Contact Sales
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Trusted by Nigerian Businesses
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="card p-6 text-center">
                            <div className="text-4xl font-bold text-primary mb-2">500+</div>
                            <div className="text-gray-600">Businesses</div>
                        </div>
                        <div className="card p-6 text-center">
                            <div className="text-4xl font-bold text-primary mb-2">98%</div>
                            <div className="text-gray-600">Compliance Rate</div>
                        </div>
                        <div className="card p-6 text-center">
                            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                            <div className="text-gray-600">Support</div>
                        </div>
                        <div className="card p-6 text-center">
                            <div className="text-4xl font-bold text-primary mb-2">100%</div>
                            <div className="text-gray-600">Secure</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-navy text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold">BizComply NG</span>
                            </div>
                            <p className="text-gray-300">
                                Smart compliance management for Nigerian businesses.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li><a href="#features" className="text-gray-300 hover:text-white">Features</a></li>
                                <li><a href="#pricing" className="text-gray-300 hover:text-white">Pricing</a></li>
                                <li><Link to="/signup" className="text-gray-300 hover:text-white">Sign Up</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Blog</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2">
                                <li className="text-gray-300">support@bizcomplyng.com</li>
                                <li className="text-gray-300">+234 800 123 4567</li>
                                <li className="text-gray-300">Lagos, Nigeria</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-8 text-center text-gray-300">
                        <p>&copy; 2024 BizComply NG. All rights reserved.</p>
                        <div className="mt-2 space-x-4">
                            <a href="#" className="hover:text-white">Privacy Policy</a>
                            <a href="#" className="hover:text-white">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
