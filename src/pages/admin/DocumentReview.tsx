import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { documentService } from '../../services/documentService';
import { businessService } from '../../services/businessService';
import { Document, BusinessProfile } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Search, FileText, Download, Trash2, Calendar, AlertTriangle } from 'lucide-react';

const DocumentReview: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('All');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [allDocs, allBusinesses] = await Promise.all([
                documentService.getAll(),
                businessService.getAll()
            ]);
            setDocuments(allDocs);
            setBusinesses(allBusinesses);
        } catch (error) {
            console.error('Error loading documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const getBusinessName = (profileId: string) => {
        return businesses.find(b => b.id === profileId)?.businessName || 'Unknown Business';
    };

    const handleDelete = async (docId: string, fileName: string) => {
        if (!confirm(`Are you sure you want to delete "${fileName}"? This cannot be undone.`)) return;

        try {
            await documentService.delete(docId);
            setDocuments(documents.filter(d => d.id !== docId));
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Failed to delete document');
        }
    };

    const handleDownload = (url: string) => {
        window.open(url, '_blank');
    };

    const filteredDocuments = documents.filter(doc => {
        const businessName = getBusinessName(doc.businessProfileId);
        const matchesSearch =
            doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            businessName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === 'All' || doc.category === filterCategory;

        return matchesSearch && matchesCategory;
    });

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-full">
                    <LoadingSpinner size="lg" />
                </div>
            </AdminLayout>
        );
    }

    const categories = ['All', ...Array.from(new Set(documents.map(d => d.category)))];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Document Review</h1>

                {/* Filters */}
                <div className="card p-6 mb-6 bg-white">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by file or business name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="input-field w-auto"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocuments.map((doc) => (
                        <div key={doc.id} className="card p-4 bg-white hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <FileText className="w-8 h-8 text-gray-600" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDownload(doc.downloadUrl)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                        title="Download"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doc.id, doc.fileName)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-3">
                                <h3 className="font-medium text-gray-900 truncate" title={doc.fileName}>
                                    {doc.fileName}
                                </h3>
                                <p className="text-sm text-gray-500 truncate">
                                    {getBusinessName(doc.businessProfileId)}
                                </p>
                            </div>

                            <div className="space-y-2 text-xs text-gray-500">
                                <div className="flex justify-between">
                                    <span>Category:</span>
                                    <span className="font-medium text-gray-700">{doc.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Size:</span>
                                    <span className="font-medium text-gray-700">{formatFileSize(doc.fileSize)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Uploaded:</span>
                                    <span className="font-medium text-gray-700">
                                        {doc.uploadedAt?.toDate().toLocaleDateString()}
                                    </span>
                                </div>
                                {doc.expiryDate && (
                                    <div className={`flex justify-between ${doc.expiryDate.toDate() < new Date() ? 'text-red-600' : 'text-gray-500'
                                        }`}>
                                        <span className="flex items-center gap-1">
                                            {doc.expiryDate.toDate() < new Date() && <AlertTriangle className="w-3 h-3" />}
                                            Expires:
                                        </span>
                                        <span className="font-medium">
                                            {doc.expiryDate.toDate().toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredDocuments.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                        <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No documents found matching your criteria</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default DocumentReview;
