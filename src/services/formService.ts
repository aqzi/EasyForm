import { form } from '@/components/formEditor/protocol'
import axios from 'axios'

const formEndpoint = '/api/forms'
const formResponseEndpoint = '/api/formResponses'

//TODO: clean up the types
export const getForms = (): Promise<form[]> => axios.get(formEndpoint).then((response) => response.data)
export const getForm = (formId: string): Promise<any> => axios.get(`${formEndpoint}?id=${formId}`).then((response) => response.data)
export const addForm = (data: any): Promise<void> => axios.post(formEndpoint, data).then((response) => response.data)
export const editForm = (data: any): Promise<void> => axios.put(formEndpoint, data).then((response) => response.data)
export const deleteForm = (formId: string): Promise<void> => axios.delete(`${formEndpoint}?id=${formId}`).then((response) => response.data)
export const getFormResponse = (formId: string): Promise<any> => axios.get(`${formResponseEndpoint}?id=${formId}`).then((response) => response.data)
export const respondForm = (data: any): Promise<void> => axios.post(formResponseEndpoint, data).then((response) => response.data)