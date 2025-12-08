'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Building2, MapPin, Globe, Calendar, Users,
    Save, Loader2, Upload, FileText, Trash2,
    Linkedin, Twitter, AlertCircle, CheckCircle, ShieldCheck
} from 'lucide-react';
import Image from 'next/image';

interface Document {
    name: string;
    url: string;
    type: string;
    uploaded_at: string;
}

export default function CompanyDetailsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploadingCert, setIsUploadingCert] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        industry: '',
        size: '',
        founded_year: '',
        website: '',
        branding_color: '#000000',
        gstin: '',
        gst_certificate_url: '',
        address: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: ''
        },
        social_links: {
            linkedin: '',
            twitter: ''
        },
        documents: [] as Document[]
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/company/profile');
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    name: data.name || '',
                    description: data.description || '',
                    industry: data.industry || '',
                    size: data.size || '',
                    founded_year: data.founded_year?.toString() || '',
                    website: data.website || '',
                    branding_color: data.branding_color || '#e11d48',
                    gstin: data.gstin || '',
                    gst_certificate_url: data.gst_certificate_url || '',
                    address: {
                        street: data.address?.street || '',
                        city: data.address?.city || '',
                        state: data.address?.state || '',
                        zip: data.address?.zip || '',
                        country: data.address?.country || ''
                    },
                    social_links: {
                        linkedin: data.social_links?.linkedin || '',
                        twitter: data.social_links?.twitter || ''
                    },
                    documents: data.documents || []
                });
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            setMessage({ type: 'error', text: 'Failed to load company details' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddressChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [field]: value }
        }));
    };

    const handleSocialChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            social_links: { ...prev.social_links, [field]: value }
        }));
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'doc' | 'gst') => {
        if (!e.target.files || e.target.files.length === 0) return;

        if (type === 'doc') setIsUploading(true);
        else setIsUploadingCert(true);

        const file = e.target.files[0];
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData
            });

            if (res.ok) {
                const data = await res.json();

                if (type === 'doc') {
                    const newDoc: Document = {
                        name: data.name,
                        url: data.url,
                        type: data.type,
                        uploaded_at: new Date().toISOString()
                    };
                    setFormData(prev => ({
                        ...prev,
                        documents: [...prev.documents, newDoc]
                    }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        gst_certificate_url: data.url
                    }));
                }

                setMessage({ type: 'success', text: type === 'doc' ? 'Document uploaded successfully' : 'Certificate uploaded successfully' });
            } else {
                setMessage({ type: 'error', text: 'Upload failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Upload error' });
        } finally {
            if (type === 'doc') setIsUploading(false);
            else setIsUploadingCert(false);
            e.target.value = '';
        }
    };

    const removeDocument = (index: number) => {
        setFormData(prev => ({
            ...prev,
            documents: prev.documents.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/company/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Company details updated successfully' });
            } else {
                setMessage({ type: 'error', text: 'Failed to update details' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Company Details</h1>
                    <p className="text-slate-400">Manage your company profile, KYC, and documents.</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-all disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-rose-500" />
                            General Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    readOnly
                                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-800 rounded-lg text-slate-400 cursor-not-allowed"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                                    placeholder="Tell us about your company..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Industry</label>
                                <input
                                    type="text"
                                    value={formData.industry}
                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                                    placeholder="e.g. Technology"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Company Size</label>
                                <select
                                    value={formData.size}
                                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                                >
                                    <option value="">Select Size</option>
                                    <option value="1-10">1-10 Employees</option>
                                    <option value="11-50">11-50 Employees</option>
                                    <option value="51-200">51-200 Employees</option>
                                    <option value="201-500">201-500 Employees</option>
                                    <option value="500+">500+ Employees</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Founded Year</label>
                                <input
                                    type="number"
                                    value={formData.founded_year}
                                    onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                                    placeholder="e.g. 2020"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Website</label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-rose-500" />
                            Address
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-1">Street Address</label>
                                <input
                                    type="text"
                                    value={formData.address.street}
                                    onChange={(e) => handleAddressChange('street', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">City</label>
                                <input
                                    type="text"
                                    value={formData.address.city}
                                    onChange={(e) => handleAddressChange('city', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">State</label>
                                <input
                                    type="text"
                                    value={formData.address.state}
                                    onChange={(e) => handleAddressChange('state', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">ZIP Code</label>
                                <input
                                    type="text"
                                    value={formData.address.zip}
                                    onChange={(e) => handleAddressChange('zip', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Country</label>
                                <input
                                    type="text"
                                    value={formData.address.country}
                                    onChange={(e) => handleAddressChange('country', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info - KYC & Social */}
                <div className="space-y-6">
                    {/* KYC Section */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            KYC Details
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">GSTIN</label>
                            <input
                                type="text"
                                value={formData.gstin}
                                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                                placeholder="GST Number"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-slate-400">GST Certificate</label>
                                <label className={`cursor-pointer text-xs font-medium text-rose-500 hover:text-rose-400 ${isUploadingCert ? 'opacity-50 pointer-events-none' : ''}`}>
                                    {isUploadingCert ? 'Uploading...' : 'Upload'}
                                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleUpload(e, 'gst')} />
                                </label>
                            </div>

                            {formData.gst_certificate_url ? (
                                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-white truncate max-w-[150px]">
                                        <FileText className="w-4 h-4 text-emerald-500" />
                                        <span className="truncate">Certificate Uploaded</span>
                                    </div>
                                    <a
                                        href={formData.gst_certificate_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-slate-400 hover:text-white"
                                    >
                                        View
                                    </a>
                                </div>
                            ) : (
                                <div className="p-4 border border-dashed border-slate-700 rounded-lg text-center text-sm text-slate-500">
                                    No certificate uploaded
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Globe className="w-5 h-5 text-rose-500" />
                            Social Media
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-2">
                                    <Linkedin className="w-4 h-4" /> LinkedIn
                                </label>
                                <input
                                    type="url"
                                    value={formData.social_links.linkedin}
                                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                                    placeholder="LinkedIn Profile URL"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-2">
                                    <Twitter className="w-4 h-4" /> Twitter
                                </label>
                                <input
                                    type="url"
                                    value={formData.social_links.twitter}
                                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                                    placeholder="Twitter Profile URL"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-rose-500" />
                                Other Documents
                            </h2>
                            <label className={`cursor-pointer flex items-center gap-2 text-xs font-medium px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                                Upload
                                <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'doc')} />
                            </label>
                        </div>

                        {formData.documents.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 text-sm">
                                No documents uploaded yet.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {formData.documents.map((doc, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 bg-rose-500/10 rounded flex items-center justify-center flex-shrink-0">
                                                <FileText className="w-4 h-4 text-rose-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{doc.name}</p>
                                                <p className="text-xs text-slate-500">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 text-slate-400 hover:text-white transition-colors"
                                                title="View"
                                            >
                                                <Globe className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => removeDocument(index)}
                                                className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
