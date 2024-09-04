import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { responseTypes, responseRender, responseLabels } from './responseRender';
import useFormEditorStore from '@/store/formEditor';
import { sortableItem } from '@/store/formEditor';

const SortableItemRender = ({ item, seqNumber, creatorModeIsActive }: { 
    item: sortableItem,
    seqNumber: number,
    creatorModeIsActive: boolean
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })
    const { setQuestion, setResponseType, setResponse } = useFormEditorStore((state) => ({
        setQuestion: state.setQuestion,
        setResponseType: state.setResponseType,
        setResponse: state.setResponse,
    }))
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const [isExpanded, setIsExpanded] = useState(false);

    const handleMouseLeave = () => {
        setIsExpanded(false);
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className="group flex flex-col p-2 pb-1 hover:bg-[#202020] rounded"
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex items-start mb-2">
                {creatorModeIsActive && (
                    <div {...attributes} {...listeners} className="opacity-0 group-hover:opacity-100 cursor-move mr-2 mt-1">
                        <GripVertical size={16} className="text-gray-400" />
                    </div>
                )}
                <div className='flex flex-col w-full'>
                    <div className='flex flex-row items-start'>
                        <span className="text-gray-400 mr-3">{seqNumber}.</span>
                        <div className='flex flex-col w-full'>
                            <textarea
                                value={item.question}
                                onChange={(e) => setQuestion(item.id, e.target.value)}
                                placeholder="Enter your question"
                                className="w-full bg-transparent text-gray-200 focus:outline-none resize-none overflow-hidden"
                                rows={1}
                                style={{ minHeight: '1.5em' }}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = `${target.scrollHeight}px`;
                                }}
                                wrap="soft"
                            />
                            <div className='mt-2'>
                                {responseRender({ responseItem: item, creatorModeIsActive: creatorModeIsActive })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {creatorModeIsActive && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex justify-center items-center text-gray-400 hover:text-gray-200 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    aria-label={isExpanded ? 'Hide options' : 'Show more options'}
                >
                    <div className="flex items-center space-x-2">
                        <div className="w-16 h-px bg-gray-600"></div>
                            <ChevronUp
                                size={16}
                                className={`transform transition-transform duration-300 ${
                                    isExpanded ? 'rotate-0' : 'rotate-180'
                                }`}
                            />
                        <div className="w-16 h-px bg-gray-600"></div>
                    </div>
                </button>
            )}

            {isExpanded && (
                <div className="mt-4 bg-[#2f2f2f] rounded-md p-4 mb-1 border border-gray-700">
                    <h3 className="text-gray-200 font-medium mb-2">Select Response Type</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {responseLabels.map((type) => (
                            <button
                                key={type.value}
                                onClick={() => setResponseType(item.id, type.value as any)}
                                className={`p-2 rounded text-left text-sm ${
                                    item.responseType === type.value 
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium' 
                                        : 'bg-[#3f3f3f] text-gray-200 hover:bg-[#4f4f4f]'
                                }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SortableItemRender;