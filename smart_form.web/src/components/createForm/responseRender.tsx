import TextResponse from './formResponseActions/text';
import YesOrNoResponse from './formResponseActions/yesOrNo';

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

export interface responseItem {
    responseType: responseTypes,
    response: string,
    placeholder?: string,
    id: string
}

export const responseRenderComponent = ({ responseItem }: { 
    responseItem: responseItem
}) => {
    switch (responseItem.responseType) {
        case 'text':
            return (
                <TextResponse
                    responseItem={responseItem}
                />
            );
        case 'yesOrNo':
            return (
                <YesOrNoResponse
                    responseItem={responseItem}
                />
            );
        default:
            return null;
    }
};