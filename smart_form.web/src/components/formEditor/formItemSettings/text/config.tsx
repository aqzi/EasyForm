import React, { useRef, useEffect, useState } from 'react';
import useFormEditorStore from '@/store/formEditor';
import { sortableItem } from '../../protocol';
import { formActivity } from '../../formRender';

const Config = ({ responseItem, formActivity }: { responseItem: sortableItem, formActivity: formActivity }) => {
    const [placeholder, setPlaceholder] = useState('');
    
    const { setConfig } = useFormEditorStore((state) => ({
        setConfig: state.setConfig
    }));

    const objectToString = (obj: any): string => {
        return JSON.stringify(obj, null, 2);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPlaceholder(value);
        setConfig(responseItem.id, objectToString({ placeholder: value })); // Update the config dynamically
    };

    return (
        <div className="text-response relative w-full text-white text-sm mt-2">
            <p className='mb-3'>Give a placeholder: </p>
            <input 
                type="text" 
                value={placeholder} 
                onChange={handleInputChange} 
                className='outline-none bg-transparent border border-[#989898] px-2 py-1' 
            />
        </div>
    );
};

export default Config;