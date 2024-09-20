import SharePopup from "./sharePopup";
import { useState, useEffect, useRef } from "react";
import Link from 'next/link'
import { Copy, MessageCircleMore, Edit, FileX2, EllipsisVertical } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteForm, getFormWithoutResponse } from "@/services/formService";


const ActionButtons: React.FC<{formId: string, showEditBtn: boolean, showMenu: boolean}> = ({formId, showEditBtn, showMenu}) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [shareFormId, setShareFormId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const session = useSession();
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
        mutationFn: deleteForm,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['forms']});
        },
        onError: (error) => {
            console.error('Error deleting the form:', error);
        },
    });

    const shareForm = (event: React.MouseEvent<HTMLButtonElement>, formId: string) => {
        event.stopPropagation();
        setIsOpen(false);
        setShareFormId(formId);
    };

    const removeForm = (event: React.MouseEvent<HTMLButtonElement>, formId: string) => {
        event.stopPropagation();
        mutation.mutate(formId);
    }

    const onMenuOpen = async () => {
        setIsOpen(true);

        // Prefetch form to optimize the user experience
        await queryClient.prefetchQuery({
            queryKey: ['form', formId],
            queryFn: () => getFormWithoutResponse(formId),
        })
    }

    return (
        <>
            <div 
                className={`relative ${showMenu ? 'visible' : 'invisible'}`}
                onMouseEnter={onMenuOpen}
                onMouseLeave={() => setIsOpen(false)}
                ref={menuRef}
            >
                <button
                    className="text-gray-400 hover:text-gray-200 transition-colors duration-200 px-2"
                    title="More options"
                >
                    <EllipsisVertical size={18} />
                </button>
                <div 
                    className={`absolute right-0 w-36 rounded-lg shadow-lg bg-[#1e1e1e] ring-1 ring-gray-700 transition-all duration-200 ease-in-out z-20 ${
                        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                >
                    <div className="py-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <button
                            onClick={(e) => shareForm(e, formId)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors duration-150"
                            title={copiedId === formId ? 'Copied!' : 'Share Form'}
                        >
                            <Copy size={18} className={`mr-3 text-green-400`} />
                            <span className="font-medium">Share</span>
                        </button>
                        <Link
                            onClick={(e) => e.stopPropagation()}
                            href={`/${session?.data?.user?.name?.replace(/\s+/g, "")}/respondForm?formId=${formId}`}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors duration-150"
                        >
                            <MessageCircleMore size={18} className={`mr-3 text-orange-400`} />
                            <span className="font-medium">Respond</span>
                        </Link>
                        {
                            showEditBtn &&
                            <Link
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors duration-150"
                                title="Edit Form"
                                onClick={(e) => e.stopPropagation()}
                                href={`/${session?.data?.user?.name?.replace(/\s+/g, "")}/editForm?formId=${formId}`}
                            >
                                <Edit size={18} className={`mr-3 text-blue-400`} />
                                <span className="font-medium">Edit</span>
                            </Link>
                        }
                        <button
                            onClick={(e) => removeForm(e, formId)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors duration-150"
                        >
                            <FileX2 size={18} className={`mr-3 text-red-400`} />
                            <span className="font-medium">Remove</span>
                        </button>
                    </div>
                </div>
            </div>
            {shareFormId && (
                <SharePopup
                    url={`${window.location.origin}/respondFormWithPublicLink?formId=${shareFormId}`}
                    onClose={() => setShareFormId(null)}
                />
            )}
        </>
    )
}

export default ActionButtons