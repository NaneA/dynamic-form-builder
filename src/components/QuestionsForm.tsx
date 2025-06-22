import React, { useState } from 'react';
import { Card, Box, TextField, Button } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import {
  setTitle,
  setDescription,
  addQuestionField,
} from '../store/formBuilderSlice';
import QuestionBuilder from './QuestionBuilder';

const QuestionForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { title, description, order } = useAppSelector(
    (state) => state.formBuilder.formValue,
  );

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    const id = uuidv4();
    dispatch(
      addQuestionField({
        id,
        field: {
          fieldType: 'text',
          fieldLabel: '',
          isRequired: false,
          options: {},
        },
      }),
    );
    setEditingId(id);
  };

  return (
    <>
      <Card sx={{ mb: 2, position: 'relative' }}>
        <Box sx={{ pt: 3, px: 2, pb: 2 }}>
          <TextField
            fullWidth
            variant="standard"
            value={title}
            onChange={(e) => dispatch(setTitle(e.target.value))}
            placeholder="Untitled form"
            InputProps={{ disableUnderline: true }}
            sx={{ fontSize: '1.5rem', fontWeight: 'bold', mb: 1 }}
          />
          <TextField
            fullWidth
            variant="standard"
            value={description}
            onChange={(e) => dispatch(setDescription(e.target.value))}
            placeholder="Description (optional)"
            InputProps={{ disableUnderline: true }}
          />
        </Box>
      </Card>

      <Button variant="contained" onClick={handleAdd} sx={{ mb: 2 }}>
        Add Question
      </Button>

      {order.map((qid) => (
        <QuestionBuilder
          key={qid}
          id={qid}
          isEditing={editingId === qid}
          onStartEdit={() => setEditingId(qid)}
          onStopEdit={() => setEditingId(null)}
        />
      ))}
    </>
  );
};

export default QuestionForm;
