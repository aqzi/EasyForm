import { create } from 'zustand'

export interface Form {
    formId: string;
    title: string;
    createdAt: string;
    responses: {
        responseId: string;
        submittedAt: string;
    }[];
}

interface FormCollectionState {
    forms: Form[],
    formCollectionIsLoaded: boolean,
    formCollectionError?: string,
    getForms: () => void,
}

const useFormCollectionStore = create<FormCollectionState>()((set) => ({
    forms: [],
    formCollectionIsLoaded: false,
    getForms: async () => {
        try {
            const response = await fetch(`/api/formOverview`);

            if (!response.ok) {
                throw new Error('Failed to fetch forms');
            }

            const data = await response.json();

            set({ forms: data });
        } catch (error) {
            console.error('Error fetching forms:', error);
            set({ formCollectionError: 'Error fetching forms. Please try again later.' });
        } finally {
            set({ formCollectionIsLoaded: true });
        }
    }
}))

export default useFormCollectionStore