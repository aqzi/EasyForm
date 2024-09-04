import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Copy, X } from 'lucide-react';

interface SharePopupProps {
    url: string;
    onClose: () => void;
}

const SharePopup: React.FC<SharePopupProps> = ({ url, onClose }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
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

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Share Form</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex items-center bg-gray-700 rounded-md overflow-hidden">
                    <input
                        type="text"
                        value={url}
                        readOnly
                        className="flex-grow px-3 py-2 bg-transparent text-white"
                    />
                    <button
                        onClick={handleCopy}
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
