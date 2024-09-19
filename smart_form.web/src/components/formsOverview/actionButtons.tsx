import SharePopup from "../sharePopup";
import { useState } from "react";
import Link from 'next/link'
import { Copy, Share2, Eye, EyeOff, Edit } from 'lucide-react';
import { useSession } from "next-auth/react";


const ActionButtons: React.FC<{formId: string, showEditBtn: boolean}> = ({formId, showEditBtn}) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [shareFormId, setShareFormId] = useState<string | null>(null);

    const session = useSession();

    const handleShare = (formId: string) => {
        setShareFormId(formId);
    };

    return (
        <div className="flex space-x-4">
            <button
                onClick={() => handleShare(formId)}
                className="text-green-400 hover:text-green-300 transition-colors duration-200"
                title={copiedId === formId ? 'Copied!' : 'Share Form'}
            >
                {copiedId === formId ? <Copy size={18} /> : <Share2 size={18} />}
            </button>
            {
                showEditBtn &&
                <Link
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    title="Edit Form"
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