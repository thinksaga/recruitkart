'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, Github, Linkedin, Save, Loader2, AlertCircle, CheckCircle, Briefcase, GraduationCap, Code, Languages, Plus, Trash2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';

// Define schema for form validation (simplified for UI, API handles strict validation)
// We'll use manual validation or rely on API for complex nested structures for now to speed up UI dev
// Ideally, we replicate the Zod schema from the API here.

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<any>({
        defaultValues: {
            experience: [],
            education: [],
            projects: [],
            languages: [],
        }
    });

    const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
        control,
        name: "experience"
    });

    const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
        control,
        name: "education"
    });

    const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
        control,
        name: "projects"
    });

    const { fields: languageFields, append: appendLanguage, remove: removeLanguage } = useFieldArray({
        control,
        name: "languages"
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/candidate/profile');
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Failed to fetch profile: ${res.status}`);
            }

            const data = await res.json();
            const profile = data.profile;

            // Populate form
            setValue('full_name', profile.full_name);
            setValue('phone', profile.phone);
            setValue('bio', profile.bio || '');
            setValue('dob', profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : '');
            setValue('gender', profile.gender || '');
            setValue('nationality', profile.nationality || '');
            setValue('address', profile.address || '');
            setValue('city', profile.city || '');
            setValue('state', profile.state || '');
            setValue('country', profile.country || '');
            setValue('zip_code', profile.zip_code || '');
            setValue('years_of_experience', profile.years_of_experience || 0);
            setValue('current_ctc', profile.current_ctc || '');
            setValue('expected_ctc', profile.expected_ctc || '');
            setValue('notice_period', profile.notice_period || '');
            setValue('resume_url', profile.resume_url || '');
            setValue('skills_primary', profile.skills_primary.join(', '));
            setValue('skills_secondary', profile.skills_secondary.join(', '));

            if (profile.social_links) {
                setValue('social_links.linkedin', profile.social_links.linkedin);
                setValue('social_links.github', profile.social_links.github);
                setValue('social_links.portfolio', profile.social_links.portfolio);
            }

            // Populate arrays
            if (profile.experience) {
                setValue('experience', profile.experience.map((exp: any) => ({
                    ...exp,
                    start_date: exp.start_date ? new Date(exp.start_date).toISOString().split('T')[0] : '',
                    end_date: exp.end_date ? new Date(exp.end_date).toISOString().split('T')[0] : '',
                    skills_used: exp.skills_used ? exp.skills_used.join(', ') : '',
                })));
            }

            if (profile.education) {
                setValue('education', profile.education.map((edu: any) => ({
                    ...edu,
                    start_date: edu.start_date ? new Date(edu.start_date).toISOString().split('T')[0] : '',
                    end_date: edu.end_date ? new Date(edu.end_date).toISOString().split('T')[0] : '',
                })));
            }

            if (profile.projects) {
                setValue('projects', profile.projects.map((proj: any) => ({
                    ...proj,
                    start_date: proj.start_date ? new Date(proj.start_date).toISOString().split('T')[0] : '',
                    end_date: proj.end_date ? new Date(proj.end_date).toISOString().split('T')[0] : '',
                    skills_used: proj.skills_used ? proj.skills_used.join(', ') : '',
                })));
            }

            if (profile.languages) {
                setValue('languages', profile.languages);
            }
        } catch (error: any) {
            console.error('Error fetching profile:', error);
            setStatus('error');
            setMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        setStatus('idle');
        setMessage('');

        try {
            // Transform data for API
            const formattedData = {
                ...data,
                years_of_experience: data.years_of_experience ? parseFloat(data.years_of_experience) : undefined,
                current_ctc: data.current_ctc ? parseFloat(data.current_ctc) : undefined,
                expected_ctc: data.expected_ctc ? parseFloat(data.expected_ctc) : undefined,
                skills_primary: data.skills_primary.split(',').map((s: string) => s.trim()).filter(Boolean),
                skills_secondary: data.skills_secondary.split(',').map((s: string) => s.trim()).filter(Boolean),
                // personal_details: {
                //     ...data.personal_details,
                //     preferred_locations: data.personal_details.preferred_locations.split(',').map((s: string) => s.trim()).filter(Boolean),
                // },
                experience: data.experience.map((exp: any) => ({
                    ...exp,
                    skills_used: exp.skills_used ? exp.skills_used.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
                })),
                projects: data.projects.map((proj: any) => ({
                    ...proj,
                    skills_used: proj.skills_used ? proj.skills_used.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
                })),
            };

            const res = await fetch('/api/candidate/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formattedData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to update profile');
            }

            setStatus('success');
            setMessage('Profile updated successfully');
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-slate-400">Manage your comprehensive professional profile.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm"
                >
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-cyan-500" />
                        Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                            <input
                                {...register('full_name')}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
                            <input
                                {...register('phone')}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-2">Professional Bio</label>
                            <textarea
                                {...register('bio')}
                                rows={3}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                placeholder="Brief overview of your professional background..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Date of Birth</label>
                            <input
                                type="date"
                                {...register('dob')}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Gender</label>
                            <select
                                {...register('gender')}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            >
                                <option value="">Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Nationality</label>
                            <input
                                {...register('nationality')}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Years of Experience</label>
                            <input
                                type="number"
                                step="0.1"
                                {...register('years_of_experience')}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Current CTC (LPA)</label>
                            <input
                                type="number"
                                step="0.1"
                                {...register('current_ctc')}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Expected CTC (LPA)</label>
                            <input
                                type="number"
                                step="0.1"
                                {...register('expected_ctc')}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Notice Period</label>
                            <select
                                {...register('notice_period')}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            >
                                <option value="">Select...</option>
                                <option value="Immediate">Immediate</option>
                                <option value="15 Days">15 Days</option>
                                <option value="30 Days">30 Days</option>
                                <option value="60 Days">60 Days</option>
                                <option value="90 Days">90 Days</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-2">Address</label>
                            <input
                                {...register('address')}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                placeholder="Street Address"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">City</label>
                            <input
                                {...register('city')}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">State</label>
                            <input
                                {...register('state')}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Country</label>
                            <input
                                {...register('country')}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Zip Code</label>
                            <input
                                {...register('zip_code')}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Resume URL</label>
                            <input
                                {...register('resume_url')}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                placeholder="Link to your resume file"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Experience */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-purple-500" />
                            Work Experience
                        </h2>
                        <button
                            type="button"
                            onClick={() => appendExperience({ company: '', role: '', start_date: '', is_current: false })}
                            className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" /> Add Experience
                        </button>
                    </div>

                    <div className="space-y-6">
                        {experienceFields.map((field, index) => (
                            <div key={field.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-800 relative group">
                                <button
                                    type="button"
                                    onClick={() => removeExperience(index)}
                                    className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Company</label>
                                        <input
                                            {...register(`experience.${index}.company`)}
                                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Role</label>
                                        <input
                                            {...register(`experience.${index}.role`)}
                                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            {...register(`experience.${index}.start_date`)}
                                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            {...register(`experience.${index}.end_date`)}
                                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs text-slate-500 mb-1">Description</label>
                                        <textarea
                                            {...register(`experience.${index}.description`)}
                                            rows={2}
                                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs text-slate-500 mb-1">Skills Used (comma separated)</label>
                                        <input
                                            {...register(`experience.${index}.skills_used`)}
                                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Education */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-blue-500" />
                            Education
                        </h2>
                        <button
                            type="button"
                            onClick={() => appendEducation({ institution: '', degree: '', start_date: '' })}
                            className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" /> Add Education
                        </button>
                    </div>

                    <div className="space-y-6">
                        {educationFields.map((field, index) => (
                            <div key={field.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-800 relative group">
                                <button
                                    type="button"
                                    onClick={() => removeEducation(index)}
                                    className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Institution</label>
                                        <input
                                            {...register(`education.${index}.institution`)}
                                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Degree</label>
                                        <input
                                            {...register(`education.${index}.degree`)}
                                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            {...register(`education.${index}.start_date`)}
                                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            {...register(`education.${index}.end_date`)}
                                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Grade</label>
                                        <input
                                            {...register(`education.${index}.grade`)}
                                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Projects */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Code className="w-5 h-5 text-emerald-500" />
                            Projects
                        </h2>
                        <button
                            type="button"
                            onClick={() => appendProject({ title: '' })}
                            className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" /> Add Project
                        </button>
                    </div>

                    <div className="space-y-6">
                        {projectFields.map((field, index) => (
                            <div key={field.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-800 relative group">
                                <button
                                    type="button"
                                    onClick={() => removeProject(index)}
                                    className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Title</label>
                                        <input
                                            {...register(`projects.${index}.title`)}
                                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">URL</label>
                                        <input
                                            {...register(`projects.${index}.url`)}
                                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs text-slate-500 mb-1">Description</label>
                                        <textarea
                                            {...register(`projects.${index}.description`)}
                                            rows={2}
                                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs text-slate-500 mb-1">Skills Used (comma separated)</label>
                                        <input
                                            {...register(`projects.${index}.skills_used`)}
                                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Languages */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Languages className="w-5 h-5 text-orange-500" />
                            Languages
                        </h2>
                        <button
                            type="button"
                            onClick={() => appendLanguage({ language: '', proficiency: '' })}
                            className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" /> Add Language
                        </button>
                    </div>

                    <div className="space-y-4">
                        {languageFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-800 relative group">
                                <button
                                    type="button"
                                    onClick={() => removeLanguage(index)}
                                    className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="flex-1">
                                    <label className="block text-xs text-slate-500 mb-1">Language</label>
                                    <input
                                        {...register(`languages.${index}.language`)}
                                        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs text-slate-500 mb-1">Proficiency</label>
                                    <select
                                        {...register(`languages.${index}.proficiency`)}
                                        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm"
                                    >
                                        <option value="">Select...</option>
                                        <option value="Native">Native</option>
                                        <option value="Professional">Professional</option>
                                        <option value="Conversational">Conversational</option>
                                        <option value="Elementary">Elementary</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Status Message */}
                {status !== 'idle' && (
                    <div className={`p-4 rounded-xl flex items-center gap-2 ${status === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                        {status === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {message}
                    </div>
                )}

                <div className="flex justify-end sticky bottom-8">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
