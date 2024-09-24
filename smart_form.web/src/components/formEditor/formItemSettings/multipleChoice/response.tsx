import React from 'react';
import useFormEditorStore from '@/store/formEditor';
import { sortableItem, formActivity } from '../../protocol';

const Response = ({ responseItem, formActivity }: { responseItem: sortableItem, formActivity: formActivity }) => {
    const { setResponse, setPlaceholder } = useFormEditorStore((state) => ({
        setResponse: state.setResponse,
        setPlaceholder: state.setPlaceholder,
    }));

    const getButtonClasses = (option: string) => {
        if (formActivity === 'createOrEdit' && responseItem.placeholder === option) {
            return 'bg-blue-500 text-white shadow-sm'
        } else if (formActivity !== 'createOrEdit' && responseItem.response === option) {
            return 'bg-blue-500 text-white shadow-sm'
        } else {
            return 'bg-gray-50 text-gray-700 hover:bg-gray-100'
        }
    };

    const handleClick = (option: string) => {
        if (formActivity === 'createOrEdit') {
            setPlaceholder(responseItem.id, (responseItem.placeholder === option) ? undefined : option);
        } else if (formActivity === 'reply') {
            setResponse(responseItem.id, option);
        }
    };

    return (
        <div className="flex space-x-3 mt-3 ml-1">
            {['Option 1', 'Option 2', 'Option 3'].map((option) => (
                <button
                    key={option}
                    onClick={() => handleClick(option)}
                    className={`
                        px-4 rounded-full font-medium text-sm
                        ${getButtonClasses(option)} // Updated to use the function
                        border border-transparent
                        transition-all duration-200 ease-in-out
                        ${formActivity === 'view' && 'cursor-default'}
                    `}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default Response;