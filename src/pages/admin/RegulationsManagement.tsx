import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Settings, Plus, Edit, Trash2, BookOpen } from 'lucide-react';

// Mock data type
interface Regulation {
    id: string;
    title: string;
    description: string;
    category: string;
    applicableTo: string[];
    dueDateRule: string;
}

const RegulationsManagement: React.FC = () => {
    const [regulations, setRegulations] = useState<Regulation[]>([
        {
            id: '1',
            title: 'CAC Annual Returns',
            description: 'File annual returns with Corporate Affairs Commission',
            category: 'CAC',
            applicableTo: ['All Businesses'],
            dueDateRule: 'Annually by Dec 31'
        },
        {
            id: '2',
            title: 'Monthly VAT Remittance',
            description: 'Remit Value Added Tax for qualifying transactions',
            category: 'Tax',
            applicableTo: ['Limited Liability Company'],
            dueDateRule: '21st of following month'
        },
        {
            id: '3',
            title: 'Pension Contribution',
            description: 'Remit employee pension contributions',
            category: 'Pension',
            applicableTo: ['Employers with 5+ staff'],
            dueDateRule: '7 days after salary payment'
        },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this regulation?')) {
            setRegulations(regulations.filter(r => r.id !== id));
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Regulations</h1>
                        <p className="text-gray-600 mt-1">Manage compliance rules and templates</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Regulation
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {regulations.map((reg) => (
                        <div key={reg.id} className="card p-6 bg-white flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">{reg.title}</h3>
                                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                                        {reg.category}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-3">{reg.description}</p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold text-gray-700">Applies to:</span>
                                        {reg.applicableTo.join(', ')}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold text-gray-700">Due:</span>
                                        {reg.dueDateRule}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 md:border-l md:pl-4 md:border-gray-100">
                                <button
                                    className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(reg.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-50 rounded transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Simple Modal Placeholder */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Add New Regulation</h2>
                            <p className="text-gray-500 mb-6">
                                This feature will allow adding new global compliance rules that automatically generate tasks for matching businesses.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        alert('Regulation created (simulation)');
                                    }}
                                    className="btn-primary"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default RegulationsManagement;
