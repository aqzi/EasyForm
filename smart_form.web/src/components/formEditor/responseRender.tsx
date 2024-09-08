import { sortableItem } from '@/store/formEditor';
import TextResponse from './formResponseActions/text';
import YesOrNoResponse from './formResponseActions/yesOrNo';
import { formActivity } from './formRender';

export type responseTypes = 'text' | 'multipleChoice' | 'checkbox' | 'image' | 'file' | 'date' | 'yesOrNo';

export const responseLabels = [
    { value: 'text', label: 'Text' },
    { value: 'yesOrNo', label: 'Yes or No' },
    { value: 'multipleChoice', label: 'Multiple Choice' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'image', label: 'Image' },
    { value: 'file', label: 'File' },
    { value: 'date', label: 'Date' },
];

export const responseRender = ({ responseItem, formActivity }: { 
    responseItem: sortableItem,
    formActivity: formActivity
}) => {
    switch (responseItem.responseType) {
        case 'text':
            return (
                <TextResponse
                    responseItem={responseItem}
                    formActivity={formActivity}
                />
            );
        case 'yesOrNo':
            return (
                <YesOrNoResponse
                    responseItem={responseItem}
                    formActivity={formActivity}
                />
            );
        default:
            return null;
    }
};