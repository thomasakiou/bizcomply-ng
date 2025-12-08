import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../src/hooks/useAuth';
import { businessService } from '../src/services/businessService';
import { documentService } from '../src/services/documentService';
import { Document as DocumentType } from '../src/types';
import LoadingSpinner from '../src/components/ui/LoadingSpinner';
import Button from '../src/components/ui/Button';
import { Upload, Download, Trash2, FileText } from 'lucide-react';

const DocumentVault: React.FC = () => {
  const { currentUser } = useAuth();

  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [businessProfileId, setBusinessProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState('CAC Documents');
  const [expiryDate, setExpiryDate] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    if (!currentUser) return;

    try {
      // Load business profile
      const profile = await businessService.getByUserId(currentUser.uid);
      if (profile) {
        setBusinessProfileId(profile.id);
      }

      // Load documents
      const docs = await documentService.getByUserId(currentUser.uid);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentUser || !businessProfileId) {
      alert('Please select a file and ensure you have a business profile');
      return;
    }

    setUploading(true);
    try {
      const expiry = expiryDate ? new Date(expiryDate) : undefined;

      await documentService.upload(
        currentUser.uid,
        businessProfileId,
        selectedFile,
        category,
        expiry
      );

      // Reset form
      setSelectedFile(null);
      setCategory('CAC Documents');
      setExpiryDate('');

      // Reload documents
      await loadData();

      alert('Document uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: DocumentType) => {
    try {
      window.open(doc.downloadUrl, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download document');
    }
  };

  const handleDelete = async (docId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return;

    try {
      await documentService.delete(docId);
      await loadData();
      alert('Document deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete document');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (timestamp: any): string => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isExpiringSoon = (doc: DocumentType): boolean => {
    if (!doc.expiryDate) return false;
    const expiryDate = doc.expiryDate.toDate();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (doc: DocumentType): boolean => {
    if (!doc.expiryDate) return false;
    return doc.expiryDate.toDate() < new Date();
  };

  const filteredDocuments = filterCategory === 'All'
    ? documents
    : documents.filter(doc => doc.category === filterCategory);

  const categories = ['All', 'CAC Documents', 'Tax Documents', 'Licenses', 'Certificates', 'Other'];

  const stats = {
    total: documents.length,
    expiringSoon: documents.filter(isExpiringSoon).length,
    expired: documents.filter(isExpired).length,
  };

  if (loading) {
    return (
      <div className="flex flex-row min-h-screen bg-white">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-row min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Document Vault</h1>
            <p className="text-gray-600 mt-2">
              Securely store and manage all your compliance documents.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Expiring Soon</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Expired</p>
              <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
            </div>
          </div>

          {/* Upload Section */}
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upload New Document</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File
                </label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="input-field"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field"
                >
                  <option value="CAC Documents">CAC Documents</option>
                  <option value="Tax Documents">Tax Documents</option>
                  <option value="Licenses">Licenses</option>
                  <option value="Certificates">Certificates</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div className="mt-4">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                variant="primary"
              >
                {uploading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Filter */}
          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${filterCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Documents List */}
          <div className="card">
            {filteredDocuments.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No documents found</p>
                <p className="text-sm mt-2">Upload your first document to get started</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${isExpired(doc) ? 'bg-red-50' : isExpiringSoon(doc) ? 'bg-yellow-50' : ''
                      }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {doc.fileName}
                          </h3>
                          {isExpired(doc) && (
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                              Expired
                            </span>
                          )}
                          {isExpiringSoon(doc) && !isExpired(doc) && (
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                              Expiring Soon
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span>Category: {doc.category}</span>
                          <span>Size: {formatFileSize(doc.fileSize)}</span>
                          <span>Uploaded: {formatDate(doc.uploadedAt)}</span>
                          {doc.expiryDate && (
                            <span>Expires: {formatDate(doc.expiryDate)}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-2 text-primary hover:bg-primary-50 rounded-lg"
                          title="Download"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id, doc.fileName)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentVault;