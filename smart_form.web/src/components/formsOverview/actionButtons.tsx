import SharePopup from "../sharePopup";
import { useState, MouseEvent } from "react";
import Link from 'next/link'
import { Copy, Share2, Edit, FileX2 } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteForm } from "@/services/formService";


const ActionButtons: React.FC<{formId: string, showEditBtn: boolean}> = ({formId, showEditBtn}) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [shareFormId, setShareFormId] = useState<string | null>(null);

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

    const shareForm = (event: MouseEvent<HTMLButtonElement>, formId: string) => {
        event.stopPropagation();
        setShareFormId(formId);
    };

    const removeForm = (event: MouseEvent<HTMLButtonElement>, formId: string) => {
        event.stopPropagation();
        mutation.mutate(formId);
    }

    return (
        <div className="flex space-x-4">
            <button
                onClick={(e) => shareForm(e, formId)}
                className="text-green-400 hover:text-green-300 transition-colors duration-200"
                title={copiedId === formId ? 'Copied!' : 'Share Form'}
            >
                {copiedId === formId ? <Copy size={18} /> : <Share2 size={18} />}
            </button>
            <button
                onClick={(e) => removeForm(e, formId)}
                className="text-red-400 hover:text-red-300 transition-colors duration-200"
            >
                <FileX2 size={18} />
            </button>
            {
                showEditBtn &&
                <Link
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    title="Edit Form"
                    onClick={(e) => e.stopPropagation()}
                    href={`/${session?.data?.user?.name?.replace(/\s+/g, "")}/editForm?formId=${formId}`}
                >
                    <Edit size={18} />
                </Link>
            }
            {shareFormId && (
                <SharePopup
                    url={`${window.location.origin}/respondForm?formId=${shareFormId}`}
                    onClose={() => setShareFormId(null)}
                />
            )}
        </div>
    )
}

export default ActionButtons