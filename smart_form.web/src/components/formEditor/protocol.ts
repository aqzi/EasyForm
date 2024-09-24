export type responseTypes = 'text' | 'multipleChoice' | 'checkbox' | 'image' | 'file' | 'date' | 'yesOrNo' ;

export const responseLabels = [
    { value: 'text', label: 'Text' },
    { value: 'yesOrNo', label: 'Yes or No' },
    { value: 'multipleChoice', label: 'Multiple Choice' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'image', label: 'Image' },
    { value: 'file', label: 'File' },
    { value: 'date', label: 'Date' },
];

export interface sortableItem {
    id: number;
    question: string;
    responseType: responseTypes;
    response: string;
    placeholder?: string;
    config?: string;
}