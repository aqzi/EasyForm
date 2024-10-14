import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { getFormResponse } from '@/services/formService';
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import ActionButtons from './actionButtons';
import { form } from '../formEditor/protocol';

const TableBody: React.FC<{ forms: form[] }> = ({ forms }) => {
    const session = useSession();
    const [expandedFormId, setExpandedFormId] = useState<string | null>(null);
    const [hoveredItem, setHoveredItem] = useState<number|undefined>(); //number indicates the row that is hovered

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
            {forms.map((f, idx) => (
                <React.Fragment key={f.formId}>
                    <tr
                        className={`hover:bg-gray-700 transition-colors duration-200 cursor-pointer ${expandedFormId === f.formId ? 'bg-[#1a1a1a]' : ''}`}
                        onMouseEnter={() => setHoveredItem(idx)}
                        onMouseLeave={() => setHoveredItem(undefined)}
                        onClick={() => toggleExpand(f.formId, f.responses, idx)}
                    >
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-200">{f.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">{new Date(f.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">{f.responses.length}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <ActionButtons formId={f.formId} showEditBtn={f.responses.length === 0} showMenu={idx === hoveredItem}/>
                        </td>
                    </tr>
                    {expandedFormId === f.formId && (
                        <tr>
                            <td colSpan={4} className="px-6 py-4">
                                <div className="bg-[#292929] p-4 rounded-md">
                                    {
                                        f.responses.length === 0 ?
                                        <p>No responses received yet</p>
                                        :
                                        <>
                                            <h3 className="text-lg font-semibold mb-2">Responses: </h3>
                                            <table className="w-full border-separate border-spacing-y-3">
                                                <tbody>
                                                    {f.responses.map((r) => (
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