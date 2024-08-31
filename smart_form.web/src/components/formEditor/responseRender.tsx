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

export const responseRender = ({ responseItem, creatorModeIsActive }: { 
    responseItem: responseItem,
    creatorModeIsActive: boolean
}) => {
    switch (responseItem.responseType) {
        case 'text':
            return (
                <TextResponse
                    responseItem={responseItem}
                    creatorModeIsActive={creatorModeIsActive}
                />
            );
        case 'yesOrNo':
            return (
                <YesOrNoResponse
                    responseItem={responseItem}
                    creatorModeIsActive={creatorModeIsActive}
                />
            );
        default:
            return null;
    }
};