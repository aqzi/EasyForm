'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Skeleton from '@/components/layout/skeleton';
import { useSession } from 'next-auth/react';
import { Edit, Eye, EyeOff, Share2, Copy } from 'lucide-react';
import SharePopup from '@/components/sharePopup';

interface Form
{
    formId: string;
    title: string;
    createdAt: string;
    responses: {
        responseId: string;
        submittedAt: string;
    }[];
}

const TableHeader: React.FC = () => (
    <thead className="bg-[#3b3b3b]">
        <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Responses</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
        </tr>
    </thead>
);

const TableBody: React.FC<{ forms: Form[] }> = ({ forms }) => {
    const router = useRouter();
    const session = useSession();
    const [expandedFormId, setExpandedFormId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [shareFormId, setShareFormId] = useState<string | null>(null);

    const handleEdit = (formId: string) => {
        router.push(`/${session?.data?.user?.name?.replace(/\s+/g, "")}/editForm?formId=${formId}`);
    };

    const handleShare = (formId: string) => {
        setShareFormId(formId);
    };

    const toggleExpand = (formId: string) => {
        setExpandedFormId(prevId => prevId === formId ? null : formId);
    };

    return (
        <tbody className="bg-[#202020] divide-y divide-gray-700">
            {forms.map((form) => (
                <React.Fragment key={form.formId}>
                    <tr className="hover:bg-gray-700 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-200">{form.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">{new Date(form.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">{form.responses.length}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleEdit(form.formId)}
                                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                    title="Edit Form"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleShare(form.formId)}
                                    className="text-green-400 hover:text-green-300 transition-colors duration-200"
                                    title={copiedId === form.formId ? 'Copied!' : 'Share Form'}
                                >
                                    {copiedId === form.formId ? <Copy size={18} /> : <Share2 size={18} />}
                                </button>
                                <button 
                                    onClick={() => toggleExpand(form.formId)}
                                    className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                                    title={expandedFormId === form.formId ? 'Hide Responses' : 'Show Responses'}
                                >
                                    {expandedFormId === form.formId ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </td>
                    </tr>
                    {expandedFormId === form.formId && (
                        <tr>
                            <td colSpan={4} className="px-6 py-4">
                                <div className="bg-gray-800 p-4 rounded-md">
                                    <h3 className="text-lg font-semibold mb-2">Responses for &quot;{form.title}&quot;</h3>
                                    {/* Add a table or list of responses here */}
                                    <p className="text-gray-400">Response details will be displayed here.</p>
                                    {form.responses.map(r => (
                                        <div key={r.responseId}>
                                            <p>Submitted at: {new Date(r.submittedAt).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    )}
                </React.Fragment>
            ))}
            {shareFormId && (
                <SharePopup
                    url={`${window.location.origin}/respondForm?formId=${shareFormId}`}
                    onClose={() => setShareFormId(null)}
                />
            )}
        </tbody>
    );
};

const UserForms: React.FC = () => {
    const [forms, setForms] = useState<Form[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await fetch('/api/formOverview');

                if (!response.ok) {
                    throw new Error('Failed to fetch forms');
                }

                const data = await response.json();

                console.log(data);

                setForms(data);
            } catch (err) {
                setError('Error fetching forms. Please try again later.');
                console.error('Error fetching forms:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchForms();
    }, []);

    // Derive formMsg from the current state
    const formMsg = isLoading ? 'Loading...' : 
                    error ? error :
                    forms.length === 0 ? 'No forms found. Create your first form!' : 
                    null;

    return (
        <Skeleton options={['createForm', 'settings']}>
            <div className='max-w-3xl mx-auto mt-8 w-[650px]'>
                <div className="relative mb-12">
                    <h1
                        className="text-4xl font-bold mb-2 text-gray-200 w-full bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-500 px-2 py-4 rounded"
                    >
                        My Forms
                    </h1>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gray-400 to-transparent"></div>
                </div>
                {formMsg && <p className="text-center text-gray-400">{formMsg}</p>}
                {!isLoading && !error && forms.length > 0 && (
                    <div className="overflow-hidden bg-transparent shadow-lg rounded-lg">
                        <table className="w-full border-separate border-spacing-y-2">
                            <TableHeader />
                            <TableBody forms={forms} />
                        </table>
                    </div>
                )}
            </div>
        </Skeleton>
    );
};

export default UserForms;
