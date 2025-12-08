import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../src/hooks/useAuth';
import { businessService } from '../src/services/businessService';
import { complianceService } from '../src/services/complianceService';
import { BusinessProfileFormData, BusinessType } from '../src/types';
import LoadingSpinner from '../src/components/ui/LoadingSpinner';
import Button from '../src/components/ui/Button';

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState<BusinessProfileFormData>({
    businessName: '',
    businessType: 'Limited Liability Company',
    industry: 'Technology',
    cacRegNo: '',
    state: 'Lagos',
    taxOffice: '',
    tin: '',
    vatStatus: 'Not Registered',
  });

  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProfile();
  }, [currentUser]);

  const loadProfile = async () => {
    if (!currentUser) return;

    try {
      const profile = await businessService.getByUserId(currentUser.uid);
      if (profile) {
        setProfileId(profile.id);
        setFormData({
          businessName: profile.businessName,
          businessType: profile.businessType,
          industry: profile.industry,
          cacRegNo: profile.cacRegNo,
          state: profile.state,
          taxOffice: profile.taxOffice,
          tin: profile.tin,
          vatStatus: profile.vatStatus,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const validateForm = (): boolean => {
    if (!formData.businessName.trim()) {
      setError('Business name is required');
      return false;
    }
    if (!formData.cacRegNo.trim()) {
      setError('CAC Registration Number is required');
      return false;
    }
    if (!formData.tin.trim()) {
      setError('TIN is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!currentUser) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (profileId) {
        // Update existing profile
        await businessService.update(profileId, formData);
        setSuccess('Profile updated successfully!');
      } else {
        // Create new profile
        const newId = await businessService.create(currentUser.uid, formData);
        setProfileId(newId);

        // Generate default compliance tasks
        await complianceService.generateDefaultTasks(
          currentUser.uid,
          newId,
          formData.businessType as BusinessType
        );

        setSuccess('Profile created successfully! Default compliance tasks have been generated.');

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {profileId ? 'Update Business Profile' : 'Set Up Your Business Profile'}
            </h1>
            <p className="text-gray-600 mt-2">
              This information helps us tailor your compliance checklist and requirements.
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your business name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CAC Registration Number *
                  </label>
                  <input
                    type="text"
                    name="cacRegNo"
                    value={formData.cacRegNo}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., RC 123456"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Identification Number (TIN) *
                  </label>
                  <input
                    type="text"
                    name="tin"
                    value={formData.tin}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your 10-digit TIN"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Business Structure */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Business Structure</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Limited Liability Company', 'Sole Proprietorship', 'Partnership', 'NGO'].map((type) => (
                  <label
                    key={type}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.businessType === type
                        ? 'border-primary bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="businessType"
                      value={type}
                      checked={formData.businessType === type}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="font-medium text-gray-900">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location & Tax Details */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location & Tax Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja (FCT)">Abuja (FCT)</option>
                    <option value="Rivers">Rivers</option>
                    <option value="Kano">Kano</option>
                    <option value="Oyo">Oyo</option>
                    <option value="Delta">Delta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Office
                  </label>
                  <input
                    type="text"
                    name="taxOffice"
                    value={formData.taxOffice}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Ikeja Tax Office"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VAT Status
                  </label>
                  <select
                    name="vatStatus"
                    value={formData.vatStatus}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="Not Registered">Not Registered</option>
                    <option value="Registered">Registered</option>
                    <option value="Exempt">Exempt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Saving...</span>
                  </>
                ) : (
                  profileId ? 'Update Profile' : 'Create Profile'
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfileSetup;