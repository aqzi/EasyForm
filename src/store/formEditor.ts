import { responseTypes, formField } from '@/components/formEditor/protocol';
import { create } from 'zustand'

//This store is used to manage the state of the form editor.
interface FormEditorState {
    title: string,
    formFields: formField[],
    errorMessage?: string,
    formCreatedBeforeLogin: boolean, //When user creates a form before logging in, this is set to true and the user will be redirected to the login page when saving the form
    setTitle: (title: string) => void,
    setFormFields: (questions: formField[]) => void,
    addFormField: (question?: formField) => void, //if question is undefined, add a default question
    removeFormField: (id: number) => void,
    setFormFieldQuestion: (id: number, newQuestion: string) => void,
    setFormFieldResponseType: (id: number, newResponseType: responseTypes) => void,
    setFormFieldResponse: (id: number, newResponse: string) => void,
    setFormFieldConfig: (id: number, newConfig?: string) => void,
    resetForm: () => void,
    setFormCreatedBeforeLogin: (formCreatedBeforeLogin: boolean) => void,
    setErrorMessage: (errorMessage?: string) => void,
}

const useFormEditorStore = create<FormEditorState>()((set) => ({
    title: '',
    formFields: [{ id: 1, question: '', responseType: 'text', response: '', config: undefined }], //Start with 1 empty form field
    formCreatedBeforeLogin: false,
    setTitle: (title: string) => set({ title: title }),
    setFormFields: (formFields: formField[]) => set({ formFields: formFields }),
    addFormField: (question?: formField) => set((state) => {
        if (question) {
            return { formFields: [...state.formFields, question] };
        } else {
            const maxId = state.formFields.length > 0 ? Math.max(...state.formFields.map(q => q.id)) : 0;

            return {
                formFields: [
                    ...state.formFields, { id: maxId + 1, question: '', responseType: 'text', response: '' }
                ]
            };
        }
    }),
    removeFormField: (id: number) => {
        set((state) => ({
            formFields: state.formFields.filter((q) => q.id !== id)
        }))
    },
    setFormFieldQuestion: (id: number, newQuestion: string) => {
        set((state) => ({
            formFields: state.formFields.map((q) => q.id === id ? { ...q, question: newQuestion } : q)
        }))
    },
    setFormFieldResponseType: (id: number, newResponseType: responseTypes) => {
        set((state) => ({
            formFields: state.formFields.map((q) => q.id === id ? { ...q, responseType: newResponseType } : q)
        }))
    },
    setFormFieldResponse: (id: number, newResponse: string) => {
        set((state) => ({
            formFields: state.formFields.map((q) => q.id === id ? { ...q, response: newResponse } : q)
        }))
    },
    setFormFieldConfig: (id: number, newConfig?: string) => {
        set((state) => ({
            formFields: state.formFields.map((q) => q.id === id ? { ...q, config: newConfig } : q)
        }))
    },
    resetForm: () => {
        set({
            formFields: [{ id: 1, question: '', responseType: 'text', response: '' }],
            title: ''
        })
    },
    setFormCreatedBeforeLogin: (formCreatedBeforeLogin: boolean) => set({ formCreatedBeforeLogin: formCreatedBeforeLogin }),
    setErrorMessage: (errorMessage?: string) => set({ errorMessage: errorMessage })
}))

export default useFormEditorStore