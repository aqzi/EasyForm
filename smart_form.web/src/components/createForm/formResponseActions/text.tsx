import React, { useRef, useEffect } from 'react';
import useFormEditorStore from '@/store/formEditor';
import { responseItem } from '../responseRender';

const TextResponse = ({ responseItem }: { responseItem: responseItem }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { creatorModeIsActive, sortableItems, setResponse, setPlaceholder } = useFormEditorStore((state) => ({
        creatorModeIsActive: state.creatorModeIsActive,
        sortableItems: state.sortableItems,
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
        if (creatorModeIsActive) {
            setPlaceholder(responseItem.id, e.target.value);
        } else {
            setResponse(responseItem.id, e.target.value);
        }
    };

    return (
        <div className="text-response relative w-full text-white text-sm mt-2">
            <textarea
                ref={textareaRef}
                value={creatorModeIsActive ? responseItem.placeholder : responseItem.response}
                onChange={handleChange}
                className={`w-full min-h-[1.5em] py-2 px-2 resize-none overflow-hidden focus:outline-none bg-transparent border border-gray-500 rounded ${creatorModeIsActive ? 'text-gray-400' : 'text-white'}`}
                style={{ width: '100%' }}
                rows={1}
                placeholder={responseItem.placeholder || 'Type your response here...'}
            />
        </div>
    );
};

export default TextResponse;