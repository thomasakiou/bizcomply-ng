import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Bell, Send, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const BroadcastAlerts: React.FC = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const [audience, setAudience] = useState('all');
    const [sending, setSending] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !message) return;

        setSending(true);
        // Simulate sending
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSending(false);

        alert('Broadcast sent successfully!');
        setTitle('');
        setMessage('');
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Broadcast Alerts</h1>
                <p className="text-gray-600 mb-8">
                    Send system-wide notifications to users. Use this for critical compliance deadlines, system maintenance, or announcements.
                </p>

                <div className="card bg-white p-8 border-l-4 border-l-primary">
                    <form onSubmit={handleSend} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alert Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Critical Deadline Reminder: VAT Filing"
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Type</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setType('info')}
                                        className={`p-3 rounded-lg border text-center flex flex-col items-center gap-2 transition-colors ${type === 'info' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Info className="w-5 h-5" />
                                        <span className="text-xs font-medium">Info</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setType('warning')}
                                        className={`p-3 rounded-lg border text-center flex flex-col items-center gap-2 transition-colors ${type === 'warning' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <AlertTriangle className="w-5 h-5" />
                                        <span className="text-xs font-medium">Warning</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setType('success')}
                                        className={`p-3 rounded-lg border text-center flex flex-col items-center gap-2 transition-colors ${type === 'success' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="text-xs font-medium">Success</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                                <select
                                    value={audience}
                                    onChange={(e) => setAudience(e.target.value)}
                                    className="input-field h-[52px]" // Match height of buttons
                                >
                                    <option value="all">All Users</option>
                                    <option value="active">Active Businesses Only</option>
                                    <option value="inactive">Inactive Businesses Only</option>
                                    <option value="limited">Limited Liability Companies Only</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={5}
                                placeholder="Enter detailed message..."
                                className="input-field resize-none"
                                required
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                                This will send a push notification and in-app alert to {audience === 'all' ? 'all registered users' : 'selected users'}.
                            </p>
                            <button
                                type="submit"
                                disabled={sending || !title || !message}
                                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {sending ? (
                                    <>Sending...</>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Send Broadcast
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default BroadcastAlerts;
