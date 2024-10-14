export interface form
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

export interface formField {
    id: number;
    question: string;
    responseType: responseTypes;
    response: string;
    config?: string;
}

export type formActivity = 'createOrEdit' | 'view' | 'reply'

export type responseTypes = 'text' | 'multipleChoice' | 'checkbox' | 'image' | 'file' | 'date' | 'yesOrNo' ;

//TODO: Improve this such that the value doesn't have to be specified both in responseTypes and responseLabels
export const responseLabels = [
    { value: 'text', label: 'Text' },
    { value: 'yesOrNo', label: 'Yes or No' },
    { value: 'multipleChoice', label: 'Multiple Choice' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'image', label: 'Image' },
    { value: 'file', label: 'File' },
    { value: 'date', label: 'Date' },
];