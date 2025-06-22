import axios from 'axios';
import type { FormListItem, FormPayload } from './types';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

export function saveForm(form: FormPayload) {
  return api.post('/forms', form);
}

export function loadForm(id: string) {
  return api.get(`/forms/${id}`);
}
export function loadAllForms() {
  return api.get<FormListItem[]>('/forms');
}
