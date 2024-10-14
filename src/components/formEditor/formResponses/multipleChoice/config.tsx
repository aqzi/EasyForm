import React from 'react';
import { formField, formActivity } from '../../protocol';
import useFormEditorStore from '@/store/formEditor';
import { objectToJson } from '../../utils';

const Config = ({ field, formActivity }: { field: formField, formActivity: formActivity }) => {
    const { setFormFieldConfig } = useFormEditorStore((state) => ({
        setFormFieldConfig: state.setFormFieldConfig
    }));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormFieldConfig(field.id, objectToJson({ options: e.target.value })); // Update the config dynamically
    };

    return (
        <div className="text-response relative w-full bg-[#232323] p-4 rounded-lg shadow-lg">
            <label htmlFor="placeholder-input" className="block text-gray-300 text-lg mb-3">
                No configurations available yet for this response type.
            </label>
        </div>
    );
};

export default Config;