'use client'

import React, { useState, useEffect } from 'react'
import Skeleton from '@/components/layout/skeleton';
import { useSession } from 'next-auth/react';
import { Edit, Eye, EyeOff, Share2, Copy } from 'lucide-react';
import SharePopup from '@/components/sharePopup';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Form, fetchForms, getFormWithResponse } from '@/services/formService';
import useFormEditorStore from '@/store/formEditor';

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
    const session = useSession();
    const [expandedFormId, setExpandedFormId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [shareFormId, setShareFormId] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const handleShare = (formId: string) => {
        setShareFormId(formId);
    };

    const toggleExpand = async (formId: string, formResponses: {responseId: string, submittedAt: string}[]) => {
        setExpandedFormId(prevId => prevId === formId ? null : formId);

        // Prefetch form responses to optimize the user experience
        await Promise.all(
            formResponses.map(({ responseId }) =>
                queryClient.prefetchQuery({
                    queryKey: ['formResponse', responseId],
                    queryFn: () => getFormWithResponse(responseId),
                })
            )
        );
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
                                    onClick={() => handleShare(form.formId)}
                                    className="text-green-400 hover:text-green-300 transition-colors duration-200"
                                    title={copiedId === form.formId ? 'Copied!' : 'Share Form'}
                                >
                                    {copiedId === form.formId ? <Copy size={18} /> : <Share2 size={18} />}
                                </button>
                                <button 
                                    onClick={() => toggleExpand(form.formId, form.responses)}
                                    className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                                    title={expandedFormId === form.formId ? 'Hide Responses' : 'Show Responses'}
                                >
                                    {expandedFormId === form.formId ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                {
                                    form.responses.length === 0 &&
                                    // <button
                                    //     onClick={() => handleEdit(form.formId)}
                                    //     className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                    //     title="Edit Form"
                                    // >
                                    //     <Edit size={18} />
                                    // </button>
                                    <Link
                                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                        title="Edit Form"
                                        href={`/${session?.data?.user?.name?.replace(/\s+/g, "")}/editForm?formId=${form.formId}`}
                                    >
                                        <Edit size={18} />
                                    </Link>
                                }
                            </div>
                        </td>
                    </tr>
                    {expandedFormId === form.formId && (
                        <tr>
                            <td colSpan={4} className="px-6 py-4">
                                <div className="bg-[#292929] p-4 rounded-md">
                                    {
                                        form.responses.length === 0 ?
                                        <p>No responses received yet</p>
                                        :
                                        <>
                                            <h3 className="text-lg font-semibold mb-2">Responses: </h3>
                                            <table className="w-full border-separate border-spacing-y-2">
                                                <tbody>
                                                    {form.responses.map(r => (
                                                        <tr key={r.responseId} className="hover:bg-gray-700 transition-colors duration-200">
                                                            <td className="whitespace-nowrap h-full w-full text-sm text-gray-400 bg-[#303030] hover:bg-[#454545]">
                                                                <Link
                                                                    className='w-full h-full block text-left py-2 px-2'
                                                                    href={`/${session?.data?.user?.name?.replace(/\s+/g, "")}/viewForm?formId=${r.responseId}`}
                                                                    // prefetch={true}
                                                                >
                                                                    {new Date(r.submittedAt).toLocaleDateString()}
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </>
                                    }
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

const MyForms: React.FC = () => {
    const router = useRouter();
    const session = useSession();

    if (!session.data?.user) {
        router.push(`/register`);
        return null;
    }
    
    const { resetForm } = useFormEditorStore((state) => ({
        resetForm: state.resetForm
    }))

    const { isPending, error, data } = useQuery({
        queryKey: ['forms'],
        queryFn: fetchForms
    });

    useEffect(() => {
        resetForm();
    }, [])

    // Derive formMsg from the current state
    const formMsg = isPending ? 'Loading...' : 
                    error ? error.message :
                    data.length === 0 ? 'No forms found. Create your first form!' : 
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
                {!isPending && !error && data.length > 0 && (
                    <div className="overflow-hidden bg-transparent shadow-lg rounded-lg">
                        <table className="w-full border-separate border-spacing-y-2">
                            <TableHeader />
                            <TableBody forms={data} />
                        </table>
                    </div>
                )}
            </div>
        </Skeleton>
    );
};

export default MyForms;
