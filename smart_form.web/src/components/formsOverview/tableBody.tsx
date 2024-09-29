import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { getFormResponse } from '@/services/formService';
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import ActionButtons from './actionButtons';
import { Form } from '../formEditor/protocol';

const TableBody: React.FC<{ forms: Form[] }> = ({ forms }) => {
    const session = useSession();
    const [expandedFormId, setExpandedFormId] = useState<string | null>(null);
    const [hoveredItem, setHoveredItem] = useState<number|undefined>(); //number indicates the row that is hovered
    const [activeItem, setActiveItem] = useState<number|undefined>(); //number indicates the row that is hovered

    const queryClient = useQueryClient();

    const toggleExpand = async (formId: string, formResponses: {responseId: string, submittedAt: string}[], itemIdx: number) => {
        setExpandedFormId(prevId => prevId === formId ? null : formId);

        // Prefetch form responses when clicking on a row to optimize the user experience
        if (!expandedFormId) {
            await Promise.all(
                formResponses.map(({ responseId }) =>
                    queryClient.prefetchQuery({
                        queryKey: ['formResponse', responseId],
                        queryFn: () => getFormResponse(responseId),
                    })
                )
            );
        }
    };

    return (
        <tbody className="bg-[#212121] divide-y-2 divide-[#1a1a1a]">
            {forms.map((form, idx) => (
                <React.Fragment key={form.formId}>
                    <tr
                        className={`hover:bg-gray-700 transition-colors duration-200 cursor-pointer ${expandedFormId === form.formId ? 'bg-[#1a1a1a]' : ''}`}
                        onMouseEnter={() => setHoveredItem(idx)}
                        onMouseLeave={() => setHoveredItem(undefined)}
                        onClick={() => toggleExpand(form.formId, form.responses, idx)}
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
                            <ActionButtons formId={form.formId} showEditBtn={form.responses.length === 0} showMenu={idx === hoveredItem}/>
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
                                            <table className="w-full border-separate border-spacing-y-3">
                                                <tbody>
                                                    {form.responses.map((r) => (
                                                    <tr
                                                        key={r.responseId}
                                                        className="transition-colors duration-200"
                                                    >
                                                        <td className="h-full w-full text-sm text-gray-300 bg-[#303030] hover:bg-[#454545] rounded-lg">
                                                            <Link
                                                                className="w-full h-full block text-left py-3 px-4"
                                                                href={`/${session?.data?.user?.name?.replace(/\s+/g, "")}/viewForm?formId=${r.responseId}`}
                                                            >
                                                                {new Date(r.submittedAt).toLocaleDateString()}
                                                            </Link>
                                                        </td>
                                                        <td className="pl-4 text-sm text-gray-300">
                                                            <p className="py-3 px-4 rounded-lg text-left text-nowrap">{r.responder}</p>
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