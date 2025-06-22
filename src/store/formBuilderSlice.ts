import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type FieldType = 'text' | 'number' | 'select' | 'radio';

export interface QuestionField {
  fieldType: FieldType;
  fieldLabel?: string;
  isRequired: boolean;
  options: Record<string, any>;
}

export interface FormValue {
  title: string;
  description: string;
  questionFields: Record<string, QuestionField>;
  order: string[];
}

export interface FormBuilderState {
  formValue: FormValue;
}

const initialState: FormBuilderState = {
  formValue: {
    title: 'Untitled form',
    description: '',
    questionFields: {},
    order: [],
  },
};

export const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setTitle(state, action: PayloadAction<string>) {
      state.formValue.title = action.payload;
    },
    setDescription(state, action: PayloadAction<string>) {
      state.formValue.description = action.payload;
    },
    addQuestionField(
      state,
      action: PayloadAction<{ id: string; field: QuestionField }>,
    ) {
      const { id, field } = action.payload;
      state.formValue.questionFields[id] = field;
      state.formValue.order.push(id);
    },
    removeQuestionField(state, action: PayloadAction<string>) {
      delete state.formValue.questionFields[action.payload];
      state.formValue.order = state.formValue.order.filter(
        (qid) => qid !== action.payload,
      );
    },
    updateQuestionField(
      state,
      action: PayloadAction<{ id: string; field: Partial<QuestionField> }>,
    ) {
      const { id, field } = action.payload;
      state.formValue.questionFields[id] = {
        ...state.formValue.questionFields[id],
        ...field,
      };
    },
    reorderFields(state, action: PayloadAction<string[]>) {
      state.formValue.order = action.payload;
    },
  },
});

export const {
  setTitle,
  setDescription,
  addQuestionField,
  removeQuestionField,
  updateQuestionField,
  reorderFields,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;
