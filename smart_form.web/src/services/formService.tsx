import axios from 'axios'

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

export const fetchForms = (): Promise<Form[]> => axios.get('/api/formOverview').then((response) => response.data)
export const getFormWithResponse = (formId: string): Promise<any> => axios.get(`/api/viewForm?id=${formId}`).then((response) => response.data)
export const addForm = (data: any): Promise<void> => axios.post('/api/createForm', data).then((response) => response.data)
export const getFormWithoutResponse = (formId: string): Promise<any> => axios.get(`/api/editForm?id=${formId}`).then((response) => response.data)
export const editForm = (data: any): Promise<void> => axios.put('/api/editForm', data).then((response) => response.data)
export const deleteForm = (formId: string): Promise<void> => axios.delete(`/api/formOverview?id=${formId}`).then((response) => response.data)
export const replyForm = (data: any): Promise<void> => axios.post('/api/replyForm', data).then((response) => response.data)
export const getFormToReply = (formId: string): Promise<any> => axios.get(`/api/replyForm?id=${formId}`).then((response) => response.data)