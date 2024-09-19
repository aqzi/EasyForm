import React, { useState } from 'react';
import { Form } from '@/services/formService';
import { useSession } from 'next-auth/react';
import { getFormWithResponse } from '@/services/formService';
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import ActionButtons from './actionButtons';

const TableBody: React.FC<{ forms: Form[] }> = ({ forms }) => {
    const session = useSession();
    const [expandedFormId, setExpandedFormId] = useState<string | null>(null);

    const queryClient = useQueryClient();

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
                    <tr 
                        className="hover:bg-gray-700 transition-colors duration-200 cursor-pointer" 
                        onClick={() => toggleExpand(form.formId, form.responses)}
                    >
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
                            <ActionButtons formId={form.formId} showEditBtn={form.responses.length === 0}/>
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
        </tbody>
    );
}

export default TableBody