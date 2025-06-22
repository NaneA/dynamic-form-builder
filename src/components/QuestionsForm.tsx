import React, { useState } from 'react';
import { Card, Box, TextField, Button } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
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

const QuestionForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { title, description, order } = useAppSelector(
    (s) => s.formBuilder.formValue,
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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newOrder = Array.from(order);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);
    dispatch(reorderFields(newOrder));
  };

  return (
    <>
      <Card sx={{ mb: 2 }}>
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
    </>
  );
};
export default QuestionForm;
