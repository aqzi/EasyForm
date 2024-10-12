import React, { useState, useEffect, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { Copy, X } from 'lucide-react';

interface SharePopupProps {
    url: string;
    onClose: () => void;
}

const SharePopup: React.FC<SharePopupProps> = ({ url, onClose }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    function handleMouseClose(e: MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        onClose();
    }

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#1e1e1e] text-white p-6 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Share Form</h3>
                    <button onClick={(e) => handleMouseClose(e)} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex items-center bg-[#404040] rounded-md overflow-hidden">
                    <input
                        type="text"
                        value={url}
                        readOnly
                        className="flex-grow px-3 py-2 bg-transparent text-white"
                    />
                    <button
                        onClick={(e) => handleCopy(e)}
                        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        {copied ? 'Copied!' : <Copy size={18} />}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SharePopup;
