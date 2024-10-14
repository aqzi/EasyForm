import React, { useEffect, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronUp, ArrowLeft } from 'lucide-react';
import { responseRender } from './formResponses/responseRender';
import useFormEditorStore from '@/store/formEditor';
import { configRender } from './formResponses/configRender';
import { responseLabels, formField, formActivity } from './protocol';

const FormField = ({ item, seqNumber, formActivity }: { 
    item: formField,
    seqNumber: number,
    formActivity: formActivity
}) => {
    const [showAllResponseTypes, setShowAllResponseTypes] = useState<boolean>(true);
    const [isExpanded, setIsExpanded] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })

    const { setFormFieldQuestion, setFormFieldResponseType, setFormFieldConfig } = useFormEditorStore((state) => ({
        setFormFieldQuestion: state.setFormFieldQuestion,
        setFormFieldResponseType: state.setFormFieldResponseType,
        setFormFieldConfig: state.setFormFieldConfig
    }))
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    useEffect(() => {
        if (textareaRef.current) {
            // Reset the height to auto to allow it to shrink on text deletion
            textareaRef.current.style.height = 'auto';
            // Set the height based on the scroll height (text content)
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [item.question]);

    const handleMouseLeave = () => {
        setIsExpanded(false);
    };

    return (
        <div
            ref={setNodeRef} 
            style={style} 
            className="group flex flex-col p-2 pb-1 hover:bg-[#202020] rounded text-2xl"
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex items-start mb-2">
                {formActivity === 'createOrEdit' && (
                    <div {...attributes} {...listeners} className="opacity-0 group-hover:opacity-100 cursor-move mr-2 mt-1">
                        <GripVertical size={22} className="text-gray-400" />
                    </div>
                )}
                <div className='flex flex-col w-full'>
                    <div className='flex flex-row items-start'>
                        <span className="text-gray-400 mr-3">{seqNumber}.</span>
                        <div className='flex flex-col w-full'>
                            <textarea
                                value={item.question}
                                ref={textareaRef}
                                onChange={(e) => setFormFieldQuestion(item.id, e.target.value)}
                                placeholder="Enter your question"
                                className={`w-full bg-transparent text-gray-200 focus:outline-none resize-none overflow-hidden ${formActivity === 'view' ? 'cursor-default' : ''}`}
                                rows={1}
                                style={{ minHeight: '1.5em' }}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = `${target.scrollHeight}px`;
                                }}
                                wrap="soft"
                                readOnly={formActivity === 'view'}
                            />
                            <div className='mt-2 text-xl'>
                                {responseRender({ field: item, formActivity: formActivity  })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {formActivity === 'createOrEdit' && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex justify-center items-center text-gray-400 hover:text-gray-200 transition-colors duration-200 opacity-0 group-hover:opacity-100 mt-1"
                    aria-label={isExpanded ? 'Hide options' : 'Show more options'}
                >
                    <div className="flex items-center space-x-2">
                        <div className="w-32 h-px bg-gray-600"></div>
                            <ChevronUp
                                size={22}
                                className={`transform transition-transform duration-300 ${
                                    isExpanded ? 'rotate-0' : 'rotate-180'
                                }`}
                            />
                        <div className="w-32 h-px bg-gray-600"></div>
                    </div>
                </button>
            )}

            {isExpanded && (
                <div className="mt-4 rounded-md p-4 mb-1 border border-gray-700 text-xl">
                    {!showAllResponseTypes && (
                        <button
                            onClick={() => setShowAllResponseTypes(true)}
                            className="flex items-center mb-4 text-gray-400 font-semibold rounded-lg shadow-md hover:text-white"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
            
                    {showAllResponseTypes && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xl">
                            {responseLabels.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => {
                                        if (type.value !== item.responseType) {
                                            setFormFieldConfig(item.id, undefined)
                                        }

                                        setFormFieldResponseType(item.id, type.value as any)
                                        setShowAllResponseTypes(false)
                                    }}
                                    className={`py-1 px-2 rounded text-left text-lg ${
                                        item.responseType === type.value
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium'
                                        : 'bg-[#2c2c2c] text-gray-200 hover:bg-[#4f4f4f]'
                                    }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    )}
                    
                    {!showAllResponseTypes && (
                        <div className='text-xl'>
                            {configRender({ field: item, formActivity: formActivity  })}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default FormField;