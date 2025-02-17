import React, { use, useEffect, useState } from 'react';
import useFormEditorStore from '@/store/formEditor';
import { formField, formActivity } from '../../protocol';
import { LucidePlus, LucideX } from 'lucide-react';
import { jsonToObject, objectToJson } from '../../utils';
import { protocol } from './protocol';

const Response = ({ field, formActivity }: { field: formField, formActivity: formActivity }) => {
    const [hoveredOption, setHoveredOption] = useState<number>(-1); // Track the hovered option by index
    const [hoveredResponse, setHoveredResponse] = useState(false);

    const { setFormFieldResponse, setFormFieldConfig, setErrorMessage } = useFormEditorStore((state) => ({
        setFormFieldResponse: state.setFormFieldResponse,
        setFormFieldConfig: state.setFormFieldConfig,
        setErrorMessage: state.setErrorMessage,
    }));

    useEffect(() => {
        console.log(field.config)
        if(!field.config) {
            setFormFieldConfig(field.id, JSON.stringify({ options: ['', '', ''] })); // Update the config dynamically
            setErrorMessage('Give all the multiple choice options a value.');
        }
    }, [])

    const handleClick = (option: string) => {
        if (formActivity === 'reply') {
            setFormFieldResponse(field.id, option);
        }
    };

    const handleInputChange = (index: number, value: string) => {
        const tmp = jsonToObject<protocol>(field.config)?.options;
        if (tmp) {
            const updatedOptions = [...tmp];
            updatedOptions[index] = value;
            setFormFieldConfig(field.id, objectToJson({ options: updatedOptions }));

            if (updatedOptions.includes('')) {
                setErrorMessage('Give all the multiple choice options a value.');
            } else {
                setErrorMessage(undefined);
            }
        }
    };

    const addNewInput = () => {
        const tmp = jsonToObject<protocol>(field.config)?.options;
        if (tmp) {
            setFormFieldConfig(field.id, objectToJson({ options: [...tmp, ''] }));
        }
    };

    const removeInput = (index: number) => {
        const updatedOptions = jsonToObject<protocol>(field.config)?.options.filter((_, i) => i !== index);
        if (updatedOptions) {
            setFormFieldConfig(field.id, objectToJson({ options: updatedOptions }));
        }
    };

    return (
        <div 
            className="flex flex-wrap gap-3 mt-3 ml-1"
            onMouseEnter={() => setHoveredResponse(true)}
            onMouseLeave={() => {
                setHoveredOption(-1)
                setHoveredResponse(false)
            }}
        >
            {jsonToObject<protocol>(field.config)?.options.map((option, index) => (
                <div key={index} className="relative group flex flex-row">
                    {formActivity === 'createOrEdit' ?
                        <input
                            value={option}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onMouseEnter={() => setHoveredOption(index)}
                            className={`
                                px-4 rounded-md font-medium border border-gray-500
                                transition-all duration-200 ease-in-out outline-none w-32 bg-transparent
                                hover:bg-transparent text-white
                            `}
                            placeholder={`Option ${index + 1}`}
                        />
                        :
                        <button
                            onClick={() => handleClick(option)}
                            className={`
                                px-4 rounded-md font-medium border border-gray-500
                                 text-white
                                transition-all duration-200 ease-in-out w-32 text-left
                                ${field.response === option ? 'bg-blue-500 shadow-sm' : 'hover:bg-[#2b2b2c]'}
                                ${formActivity === 'view' && 'cursor-default'}
                            `}
                        >
                            {option}
                        </button>
                    }
                    {(hoveredOption === index && formActivity === 'createOrEdit') && (
                        <button
                            onClick={() => removeInput(index)}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-red-400 bg-[#2c2c2c]"
                            aria-label="Remove input"
                        >
                            <LucideX size={14} />
                        </button>
                    )}
                </div>
            ))}
            {(hoveredResponse && formActivity === 'createOrEdit') && (
                <button
                    onClick={addNewInput}
                    className="flex items-center justify-center text-gray-400 rounded-md hover:text-white transition duration-200"
                    aria-label="Add new input"
                >
                    <LucidePlus size={18} />
                </button>
            )}
        </div>
    );
};

export default Response;
