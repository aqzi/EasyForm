import React, { useRef, useEffect, useState } from 'react';
import { sortableItem, formActivity } from '../../protocol';
import useFormEditorStore from '@/store/formEditor';
import { jsonToObject, objectToJson } from '../../utils';
import { protocol } from './protocol';

const Config = ({ responseItem, formActivity }: { responseItem: sortableItem, formActivity: formActivity }) => {
    const { setConfig } = useFormEditorStore((state) => ({
        setConfig: state.setConfig
    }));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfig(responseItem.id, objectToJson({ options: e.target.value })); // Update the config dynamically
    };

    return (
        <div className="text-response relative w-full max-w-lg mx-auto bg-[#232323] p-4 rounded-lg shadow-lg">
            <label htmlFor="placeholder-input" className="block text-gray-300 text-md mb-3">
                There are no configurations available for this response type.
            </label>
        </div>
    );
};

export default Config;