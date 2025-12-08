import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MailCheck, AlertCircle, CheckCircle } from 'lucide-react';

const EmailVerification: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const { currentUser, resendVerificationEmail, logout } = useAuth();
    const navigate = useNavigate();

    const handleResend = async () => {
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            await resendVerificationEmail();
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to resend verification email.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-navy-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
                        <MailCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
                    <p className="text-gray-600">We've sent a verification link to</p>
                    <p className="text-gray-900 font-medium mt-1">{currentUser?.email}</p>
                </div>

                {/* Verification Info */}
                <div className="card p-8">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-green-800">Verification email sent successfully!</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-900">
                                <strong>Next steps:</strong>
                            </p>
                            <ol className="mt-2 text-sm text-blue-800 space-y-1 list-decimal list-inside">
                                <li>Check your email inbox</li>
                                <li>Click the verification link in the email</li>
                                <li>Return here and refresh the page</li>
                            </ol>
                        </div>

                        <div className="text-center text-sm text-gray-600">
                            <p>Didn't receive the email?</p>
                            <button
                                onClick={handleResend}
                                disabled={loading || success}
                                className="mt-2 text-primary hover:text-primary-600 font-medium disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Resend verification email'}
                            </button>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <button
                                onClick={handleLogout}
                                className="w-full btn-outline"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>Having trouble? Contact support at</p>
                    <a href="mailto:support@bizcomplyng.com" className="text-primary hover:text-primary-600">
                        support@bizcomplyng.com
                    </a>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
