export interface FormResponseActionProps {
    question: string;
    response: string;
    onResponseChange: (newResponse: string) => void;
}