import React, { useRef, useEffect } from 'react';
import useFormEditorStore from '@/store/formEditor';
import { sortableItem, formActivity } from '../../protocol';
import { jsonToObject, objectToJson } from '../../utils';
import { protocol } from './protocol'

const Response = ({ responseItem, formActivity }: { responseItem: sortableItem, formActivity: formActivity }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { setResponse, setConfig } = useFormEditorStore((state) => ({
        setResponse: state.setResponse,
        setConfig: state.setConfig,
    }));

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [responseItem.response]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (formActivity === 'createOrEdit') {
            setConfig(responseItem.id, objectToJson({ placeholder: e.target.value }));
        } else if (formActivity === 'reply') {
            setResponse(responseItem.id, e.target.value);
        }
    };

    return (
        <div className="text-response relative w-full text-white mt-2">
            <textarea
                ref={textareaRef}
                value={formActivity === 'createOrEdit' ? jsonToObject<protocol>(responseItem.config)?.placeholder : responseItem.response}
                onChange={handleChange}
                className={`
                    w-full min-h-[1.5em] py-2 px-2 resize-none overflow-hidden focus:outline-none 
                    bg-transparent border border-gray-500 rounded
                    ${formActivity === 'createOrEdit' && 'text-gray-400'}
                    ${formActivity === 'view' && 'cursor-default'}
                `}
                style={{ width: '100%' }}
                rows={1}
                placeholder={jsonToObject<protocol>(responseItem.config)?.placeholder || 'Type your response here...'}
                readOnly={formActivity === 'view'}
            />
        </div>
    );
};

export default Response;