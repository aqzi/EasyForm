import React, { useRef, useEffect, useState } from 'react';
import useFormEditorStore from '@/store/formEditor';
import { sortableItem, formActivity } from '../../protocol';
import { jsonToObject, objectToJson } from '../../utils';

const Config = ({ responseItem, formActivity }: { responseItem: sortableItem, formActivity: formActivity }) => {
    const { setConfig } = useFormEditorStore((state) => ({
        setConfig: state.setConfig
    }));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // setPlaceholder(value);
        setConfig(responseItem.id, objectToJson({ placeholder: value })); // Update the config dynamically
    };

    return (
        <div className="text-response relative w-full max-w-lg mx-auto bg-[#232323] p-4 rounded-lg shadow-lg">
            <label htmlFor="placeholder-input" className="block text-gray-300 text-md mb-3">
                Enter Placeholder:
            </label>
            <input
                id="placeholder-input"
                type="text"
                value={jsonToObject<protocol>(responseItem.config)?.placeholder}
                onChange={handleInputChange}
                placeholder="Type something..."
                className="w-full px-3 py-1 text-sm text-gray-200 bg-transparent border border-gray-600 rounded-lg outline-none transition-colors duration-200 ease-in-out"
            />
        </div>
    );
};

export default Config;