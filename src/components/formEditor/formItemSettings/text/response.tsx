import React, { useRef, useEffect } from 'react';
import useFormEditorStore from '@/store/formEditor';
import { formField, formActivity } from '../../protocol';
import { jsonToObject, objectToJson } from '../../utils';
import { protocol } from './protocol'

const Response = ({ field, formActivity }: { field: formField, formActivity: formActivity }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { setFormFieldResponse, setFormFieldConfig } = useFormEditorStore((state) => ({
        setFormFieldResponse: state.setFormFieldResponse,
        setFormFieldConfig: state.setFormFieldConfig,
    }));

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [field.response]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (formActivity === 'createOrEdit') {
            setFormFieldConfig(field.id, objectToJson({ placeholder: e.target.value }));
        } else if (formActivity === 'reply') {
            setFormFieldResponse(field.id, e.target.value);
        }
    };

    return (
        <div className="text-response relative w-full text-white mt-2">
            <textarea
                ref={textareaRef}
                value={formActivity === 'createOrEdit' ? jsonToObject<protocol>(field.config)?.placeholder : field.response}
                onChange={handleChange}
                className={`
                    w-full min-h-[1.5em] py-2 px-2 resize-none overflow-hidden focus:outline-none 
                    bg-transparent border border-gray-500 rounded
                    ${formActivity === 'createOrEdit' && 'text-gray-400'}
                    ${formActivity === 'view' && 'cursor-default'}
                `}
                style={{ width: '100%' }}
                rows={1}
                placeholder={jsonToObject<protocol>(field.config)?.placeholder || 'Type your response here...'}
                readOnly={formActivity === 'view'}
            />
        </div>
    );
};

export default Response;