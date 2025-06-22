import axios from 'axios';
import type { FormPayload } from './types';

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
