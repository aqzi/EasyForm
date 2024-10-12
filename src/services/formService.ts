import { Form } from '@/components/formEditor/protocol'
import axios from 'axios'

export const getForms = (): Promise<Form[]> => axios.get('/api/forms').then((response) => response.data)
export const getForm = (formId: string): Promise<any> => axios.get(`/api/forms?id=${formId}`).then((response) => response.data)
export const addForm = (data: any): Promise<void> => axios.post('/api/forms', data).then((response) => response.data)
export const editForm = (data: any): Promise<void> => axios.put('/api/forms', data).then((response) => response.data)
export const deleteForm = (formId: string): Promise<void> => axios.delete(`/api/forms?id=${formId}`).then((response) => response.data)
export const getFormResponse = (formId: string): Promise<any> => axios.get(`/api/formResponses?id=${formId}`).then((response) => response.data)
export const respondForm = (data: any): Promise<void> => axios.post('/api/formResponses', data).then((response) => response.data)