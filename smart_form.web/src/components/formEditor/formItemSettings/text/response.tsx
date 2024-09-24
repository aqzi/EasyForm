import React, { useRef, useEffect } from 'react';
import useFormEditorStore from '@/store/formEditor';
import { sortableItem } from '../../protocol';
import { formActivity } from '../../formRender';

const Response = ({ responseItem, formActivity }: { responseItem: sortableItem, formActivity: formActivity }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { setResponse, setPlaceholder } = useFormEditorStore((state) => ({
        setResponse: state.setResponse,
        setPlaceholder: state.setPlaceholder,
    }));

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [responseItem.response]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (formActivity === 'createOrEdit') {
            setPlaceholder(responseItem.id, e.target.value);
        } else if (formActivity === 'reply') {
            setResponse(responseItem.id, e.target.value);
        }
    };

    function stringToObject(str?: string): any {
        try {
            if (!str) return null;
            return JSON.parse(str);
        } catch (e) {
            return null;
        }
    }

    return (
        <div className="text-response relative w-full text-white text-sm mt-2">
            <textarea
                ref={textareaRef}
                value={formActivity === 'createOrEdit' ? responseItem.placeholder : responseItem.response}
                onChange={handleChange}
                className={`
                    w-full min-h-[1.5em] py-2 px-2 resize-none overflow-hidden focus:outline-none 
                    bg-transparent border border-gray-500 rounded text-white
                    ${formActivity === 'createOrEdit' && 'text-gray-400'}
                    ${formActivity === 'view' && 'cursor-default'}
                `}
                style={{ width: '100%' }}
                rows={1}
                placeholder={stringToObject(responseItem.config)?.placeholder || 'Type your response here...'}
                readOnly={formActivity === 'view'}
            />
        </div>
    );
};

export default Response;