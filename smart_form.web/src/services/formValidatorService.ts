import axios from 'axios'

export const validateForm = (data: any): Promise<boolean> => axios.post(`http://localhost:4300/formValidator/isFormValid`, data).then((response) => response.data)