'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import FormOptionsDropdown from '@/components/layout/dropdown';
import Skeleton from '@/components/layout/skeleton';
import { useSession } from 'next-auth/react';
import { Edit, Eye, Share2 } from 'lucide-react';

interface Form {
    id: string;
    title: string;
    createdAt: string;
    responses: number;
}

interface FormSelection {
    createdAt: string;
    form: Form;
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

const TableBody: React.FC<{ forms: FormSelection[], handlePublish: (formId: string, formTitle: string) => void }> = ({ forms, handlePublish }) => {
    const router = useRouter();
    const session = useSession();

    const handleEdit = (formId: string) => {
        router.push(`/${session?.data?.user?.name?.replace(/\s+/g, "")}/createForm?formId=${formId}`);
    };

    return (
        <tbody className="bg-[#202020] divide-y divide-gray-700">
            {forms.map((form) => (
                <tr key={form.form.id} className="hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-200">{form.form.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">{new Date(form.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">{form.form.responses ?? 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                            onClick={() => handleEdit(form.form.id)} 
                            className="text-blue-400 hover:text-blue-300 mr-2 transition-colors duration-200 inline-flex items-center"
                        >
                            <Edit className="h-4 w-4" />
                        </button>
                        <Link href={`/forms/${form.form.id}/responses`} className="text-blue-400 hover:text-blue-300 mr-2 transition-colors duration-200 inline-flex items-center">
                            <Eye className="h-4 w-4" />
                        </Link>
                        <button
                            className="text-green-400 hover:text-green-300 transition-colors duration-200 inline-flex items-center"
                            onClick={() => handlePublish(form.form.id, form.form.title)}
                        >
                            <Share2 className="h-4 w-4" />
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

const UserForms: React.FC = () => {
    const [forms, setForms] = useState<FormSelection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await fetch('/api/form');

                if (!response.ok) {
                    throw new Error('Failed to fetch forms');
                }

                const data = await response.json();
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

    const handlePublish = async (formId: string, formTitle: string) => {
        try {
            const uniqueId = generateUniqueId(); // Implement this function
            const publicUrl = `/EasyForm/${encodeURIComponent(formTitle)}/${uniqueId}`;
            
            const response = await fetch(`/api/form/${formId}/publish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ publicUrl }),
            });

            if (!response.ok) {
                throw new Error('Failed to publish form');
            }

            const updatedForm = await response.json();
            setForms(forms.map(f => f.form.id === formId ? { ...f, form: updatedForm } : f));
            console.log(`Form published at: ${publicUrl}`);
        } catch (err) {
            console.error('Error publishing form:', err);
            // Show error message to user
        }
    };

    // Add this helper function
    const generateUniqueId = () => {
        return Math.random().toString(36).substr(2, 9);
    };

    return (
        <Skeleton options={['createForm', 'statistics', 'settings']}>
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
                            <TableBody forms={forms} handlePublish={handlePublish} />
                        </table>
                    </div>
                )}
            </div>
        </Skeleton>
    );
};

export default UserForms;
