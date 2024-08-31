import { responseTypes } from '@/components/formEditor/responseRender';
import { create } from 'zustand'

export interface sortableItem {
    id: string;
    question: string;
    responseType: responseTypes;
    response: string;
    placeholder?: string;
    config?: string;
}

interface FormEditorState {
    creatorModeIsActive: boolean,
    title: string,
    sortableItems: sortableItem[],
    setCreatorModeIsActive: (isActive: boolean) => void,
    setTitle: (title: string) => void,
    setSortableItems: (questions: sortableItem[]) => void,
    addSortableItem: (question: sortableItem) => void,
    removeSortableItem: (id: string) => void,
    setQuestion: (id: string, newQuestion: string) => void,
    setResponseType: (id: string, newResponseType: responseTypes) => void,
    setResponse: (id: string, newResponse: string) => void,
    setPlaceholder: (id: string, newPlaceholder?: string) => void,
    resetForm: () => void,
}

const useFormEditorStore = create<FormEditorState>()((set) => ({
    creatorModeIsActive: true,
    title: '',
    sortableItems: [{ id: '1', question: '', responseType: 'text', response: '' }],
    setCreatorModeIsActive: (isActive: boolean) => set({ creatorModeIsActive: isActive }),
    setTitle: (title: string) => set({ title: title }),
    setSortableItems: (sortableItems: sortableItem[]) => set({ sortableItems: sortableItems }),
    addSortableItem: (question: sortableItem) => {
        set((state) => ({
            sortableItems: [...state.sortableItems, question]
        }))
    },
    removeSortableItem: (id: string) => {
        set((state) => ({
            sortableItems: state.sortableItems.filter((q) => q.id !== id)
        }))
    },
    setQuestion: (id: string, newQuestion: string) => {
        set((state) => ({
            sortableItems: state.sortableItems.map((q) => q.id === id ? { ...q, question: newQuestion } : q)
        }))
    },
    setResponseType: (id: string, newResponseType: responseTypes) => {
        set((state) => ({
            sortableItems: state.sortableItems.map((q) => q.id === id ? { ...q, responseType: newResponseType } : q)
        }))
    },
    setResponse: (id: string, newResponse: string) => {
        set((state) => ({
            sortableItems: state.sortableItems.map((q) => q.id === id ? { ...q, response: newResponse } : q)
        }))
    },
    setPlaceholder: (id: string, newPlaceholder?: string) => {
        set((state) => ({
            sortableItems: state.sortableItems.map((q) => q.id === id ? { ...q, placeholder: newPlaceholder } : q)
        }))
    },
    resetForm: () => {
        set({
            sortableItems: [{ id: '1', question: '', responseType: 'text', response: '' }],
            creatorModeIsActive: true,
        })
    }
}))

export default useFormEditorStore