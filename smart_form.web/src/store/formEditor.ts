import { responseTypes, sortableItem } from '@/components/formEditor/protocol';
import { create } from 'zustand'

interface FormEditorState {
    title: string,
    sortableItems: sortableItem[],
    formCreatedBeforeLogin: boolean,
    setTitle: (title: string) => void,
    setSortableItems: (questions: sortableItem[]) => void,
    addSortableItem: (question?: sortableItem) => void, //if question is undefined, add a default question
    removeSortableItem: (id: number) => void,
    setQuestion: (id: number, newQuestion: string) => void,
    setResponseType: (id: number, newResponseType: responseTypes) => void,
    setResponse: (id: number, newResponse: string) => void,
    setPlaceholder: (id: number, newPlaceholder?: string) => void,
    resetForm: () => void,
    setFormCreatedBeforeLogin: (formCreatedBeforeLogin: boolean) => void,
    setConfig: (id: number, newConfig: string) => void,
}

const useFormEditorStore = create<FormEditorState>()((set) => ({
    title: '',
    sortableItems: [{ id: 1, question: '', responseType: 'text', response: '' }],
    formCreatedBeforeLogin: false,
    setTitle: (title: string) => set({ title: title }),
    setSortableItems: (sortableItems: sortableItem[]) => set({ sortableItems: sortableItems }),
    addSortableItem: (question?: sortableItem) => set((state) => {
        if (question) {
            return { sortableItems: [...state.sortableItems, question] };
        } else {
            const maxId = state.sortableItems.length > 0 ? Math.max(...state.sortableItems.map(q => q.id)) : 0;

            return {
                sortableItems: [
                    ...state.sortableItems, { id: maxId + 1, question: '', responseType: 'text', response: '' }
                ]
            };
        }
    }),
    removeSortableItem: (id: number) => {
        set((state) => ({
            sortableItems: state.sortableItems.filter((q) => q.id !== id)
        }))
    },
    setQuestion: (id: number, newQuestion: string) => {
        set((state) => ({
            sortableItems: state.sortableItems.map((q) => q.id === id ? { ...q, question: newQuestion } : q)
        }))
    },
    setResponseType: (id: number, newResponseType: responseTypes) => {
        set((state) => ({
            sortableItems: state.sortableItems.map((q) => q.id === id ? { ...q, responseType: newResponseType } : q)
        }))
    },
    setResponse: (id: number, newResponse: string) => {
        set((state) => ({
            sortableItems: state.sortableItems.map((q) => q.id === id ? { ...q, response: newResponse } : q)
        }))
    },
    setPlaceholder: (id: number, newPlaceholder?: string) => {
        set((state) => ({
            sortableItems: state.sortableItems.map((q) => q.id === id ? { ...q, placeholder: newPlaceholder } : q)
        }))
    },
    resetForm: () => {
        set({
            sortableItems: [{ id: 1, question: '', responseType: 'text', response: '' }],
            title: '',
        })
    },
    setFormCreatedBeforeLogin: (formCreatedBeforeLogin: boolean) => set({ formCreatedBeforeLogin: formCreatedBeforeLogin }),
    setConfig: (id: number, newConfig: string) => {
        set((state) => ({
            sortableItems: state.sortableItems.map((q) => q.id === id ? { ...q, config: newConfig } : q)
        }))
    }
}))

export default useFormEditorStore