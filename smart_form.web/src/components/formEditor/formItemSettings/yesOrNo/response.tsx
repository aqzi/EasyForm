import React from 'react';
import useFormEditorStore from '@/store/formEditor';
import { sortableItem, formActivity } from '../../protocol';

const Response = ({ responseItem, formActivity }: { responseItem: sortableItem, formActivity: formActivity }) => {
    const { setResponse } = useFormEditorStore((state) => ({
        setResponse: state.setResponse,
    }));

    const getButtonClasses = (option: string) => {
        if (formActivity === 'createOrEdit') {
            return 'bg-transparent hover:bg-transparent'
        } else if (responseItem.response === option) {
            return 'bg-blue-500 shadow-sm'
        } else {
            return 'bg-transparent hover:bg-[#2b2b2c]'
        }
    };

    const handleClick = (option: string) => {
        if (formActivity === 'reply') {
            setResponse(responseItem.id, option);
        }
    };

    return (
        <div className="flex space-x-3 mt-3 ml-1">
            {['Yes', 'No'].map((option) => (
                <button
                    key={option}
                    onClick={() => handleClick(option)}
                    className={`
                        px-4 rounded-md font-medium text-sm border border-gray-500
                        ${getButtonClasses(option)} // Updated to use the function
                         text-white
                        transition-all duration-200 ease-in-out
                        ${formActivity !== 'reply' && 'cursor-default'}
                    `}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default Response;
