import React from 'react';
import useFormEditorStore from '@/store/formEditor';
import { responseItem } from '../responseRender';

const YesOrNoResponse = ({ responseItem }: { responseItem: responseItem }) => {
    const { setResponse, creatorModeIsActive, setPlaceholder } = useFormEditorStore((state) => ({
        setResponse: state.setResponse,
        creatorModeIsActive: state.creatorModeIsActive,
        setPlaceholder: state.setPlaceholder,
    }));

    const handleClick = (option: string) => {
        if (creatorModeIsActive) {
            setPlaceholder(responseItem.id, (responseItem.placeholder === option) ? undefined : option);
        } else {
            setResponse(responseItem.id, option);
        }
    };

    return (
        <div className="flex space-x-3 mt-3">
            {['Yes', 'No'].map((option) => (
                <button
                    key={option}
                    onClick={() => handleClick(option)}
                    className={`
                        px-4 rounded-full font-medium text-sm
                        ${(creatorModeIsActive && responseItem.placeholder === option) || (!creatorModeIsActive && responseItem.response === option)
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }
                        border border-transparent
                        transition-all duration-200 ease-in-out
                    `}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default YesOrNoResponse;
