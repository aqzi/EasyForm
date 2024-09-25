import React from 'react';
import { sortableItem, formActivity } from '../../protocol';

const Config = ({ responseItem, formActivity }: { responseItem: sortableItem, formActivity: formActivity }) => {
    return (
        <div className="text-response relative w-full max-w-lg mx-auto bg-[#232323] p-4 rounded-lg shadow-lg">
            <label htmlFor="placeholder-input" className="block text-gray-300 text-md mb-3">
                No configurations available yet for this response type.
            </label>
        </div>
    );
};

export default Config;