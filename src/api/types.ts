import type { FieldType } from '../store/formBuilderSlice';

export interface QuestionPayload {
  id: string;
  fieldType: FieldType;
  fieldLabel?: string;
  isRequired: boolean;
  options?: string[];
}

export interface FormPayload {
  id?: string;
  title: string;
  description?: string;
  questionFields: QuestionPayload[];
  order: string[];
}

export interface FormListItem {
  id: string;
  title: string;
}
