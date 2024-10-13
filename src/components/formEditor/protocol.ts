export interface Form
{
    formId: string;
    title: string;
    createdAt: string;
    responses: {
        responseId: string;
        submittedAt: string;
        responder: string;
    }[];
}

export type formActivity = 'createOrEdit' | 'view' | 'reply'

export interface formField {
    id: number;
    question: string;
    responseType: responseTypes;
    response: string;
    config?: string;
}

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