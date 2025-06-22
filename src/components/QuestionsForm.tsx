import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import {
  setTitle,
  setDescription,
  addQuestionField,
  reorderFields,
} from '../store/formBuilderSlice';
import QuestionBuilder from './QuestionBuilder';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { saveForm, loadForm } from '../api/formService';
import type { FormPayload, QuestionPayload } from '../api/types';

const QuestionForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id?: string }>();
  const { title, description, order, questionFields } = useAppSelector(
    (s) => s.formBuilder.formValue,
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const response = await loadForm(id);
        const data = response.data as {
          title: string;
          description?: string;
          questionFields: QuestionPayload[];
          order: string[];
        };

        dispatch(setTitle(data.title));
        dispatch(setDescription(data.description || ''));

        data.questionFields.forEach((q) =>
          dispatch(
            addQuestionField({
              id: q.id,
              field: {
                fieldType: q.fieldType,
                fieldLabel: q.fieldLabel,
                isRequired: q.isRequired ? q.isRequired : false,
                options: q.options
                  ? q.options.reduce(
                      (acc, opt, i) => ({ ...acc, [i + '']: opt }),
                      {},
                    )
                  : [],
              },
            }),
          ),
        );

        dispatch(reorderFields(data.order));
      } catch (err: any) {
        console.error('Failed to load form:', err);
        setErrorMessage('Could not load existing form');
      }
    })();
  }, [id, dispatch]);

  const handleAdd = () => {
    const qid = uuidv4();
    dispatch(
      addQuestionField({
        id: qid,
        field: {
          fieldType: 'text',
          fieldLabel: '',
          isRequired: false,
          options: {},
        },
      }),
    );
    setEditingId(qid);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newOrder = Array.from(order);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);
    dispatch(reorderFields(newOrder));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const payload: FormPayload & { id?: string } = {
      ...(id ? { id } : {}),
      title,
      description,
      questionFields: order.map(
        (qid): QuestionPayload => ({
          id: qid,
          fieldType: questionFields[qid].fieldType,
          fieldLabel: questionFields[qid].fieldLabel,
          isRequired: questionFields[qid].isRequired,
          options: Object.values(questionFields[qid].options),
        }),
      ),
      order,
    };

    try {
      await saveForm(payload);
      setSuccessMessage(`Form ${id ? 'updated' : 'saved'} successfully`);
      setEditingId(null);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card
        sx={{
          borderTop: '4px solid',
          borderColor: 'primary.main',
          mb: 2,
        }}
      >
        <Box sx={{ pt: 3, px: 2, pb: 2 }}>
          <TextField
            fullWidth
            variant="standard"
            value={title}
            placeholder="Untitled form"
            onChange={(e) => dispatch(setTitle(e.target.value))}
            InputProps={{
              disableUnderline: true,
              sx: { fontWeight: 'bold', fontSize: '1.5rem' },
            }}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            variant="standard"
            value={description}
            placeholder="Description (optional)"
            onChange={(e) => dispatch(setDescription(e.target.value))}
            InputProps={{ disableUnderline: true }}
          />
        </Box>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="outlined" onClick={handleAdd}>
          Add Question
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {order.map((qid, idx) => (
                <Draggable key={qid} draggableId={qid} index={idx}>
                  {(prov) => (
                    <Box
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      sx={{ mb: 1 }}
                    >
                      <QuestionBuilder
                        id={qid}
                        isEditing={editingId === qid}
                        onStartEdit={() => setEditingId(qid)}
                        onStopEdit={() => setEditingId(null)}
                        dragHandleProps={prov.dragHandleProps}
                      />
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      {/* Success & Error Snackbars */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
      >
        <Alert
          onClose={() => setErrorMessage(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading ? 'Saving…' : id ? 'Update Form' : 'Save Form'}
        </Button>
      </Box>
    </Box>
  );
};

export default QuestionForm;
