import React from 'react';
import { sortableItem, formActivity } from '../../protocol';

const Config = ({ responseItem, formActivity }: { responseItem: sortableItem, formActivity: formActivity }) => {
    return (
        <div className="text-response relative w-full bg-[#232323] p-4 rounded-lg shadow-lg">
            <label htmlFor="placeholder-input" className="block text-gray-300 text-lg mb-3">
                No configurations available yet for this response type.
            </label>
        </div>
    );
};

export default Config;