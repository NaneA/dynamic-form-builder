import React, { useRef, useEffect } from 'react';
import {
  Card,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Switch,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import {
  updateQuestionField,
  removeQuestionField,
} from '../store/formBuilderSlice';
import type { FieldType, QuestionField } from '../store/formBuilderSlice';
import type { SelectChangeEvent } from '@mui/material/Select';

const FIELD_TYPES: FieldType[] = ['text', 'number', 'select', 'radio'];

interface QuestionBuilderProps {
  id: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
}

const QuestionBuilder: React.FC<QuestionBuilderProps> = ({
  id,
  isEditing,
  onStartEdit,
  onStopEdit,
}) => {
  const dispatch = useAppDispatch();
  const field = useAppSelector(
    (s) => s.formBuilder.formValue.questionFields[id],
  );
  const cardRef = useRef<HTMLDivElement>(null);

  const onChange = (changes: Partial<QuestionField>) => {
    dispatch(updateQuestionField({ id, field: changes }));
  };

  const handleTypeChange = (e: SelectChangeEvent<FieldType>) => {
    const type = e.target.value as FieldType;
    if (type === 'text' || type === 'number') {
      onChange({ fieldType: type, options: {} });
    } else {
      onChange({ fieldType: type });
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        isEditing &&
        cardRef.current &&
        !cardRef.current.contains(e.target as Node)
      ) {
        onStopEdit();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isEditing, onStopEdit]);

  if (!field) return null;

  return (
    <Card
      ref={cardRef}
      onClick={onStartEdit}
      sx={{
        mb: 2,
        borderLeft: isEditing ? '4px solid' : undefined,
        borderColor: isEditing ? 'primary.main' : undefined,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TextField
            variant="standard"
            value={field.fieldLabel}
            onChange={(e) => onChange({ fieldLabel: e.target.value })}
            placeholder="Question title"
            fullWidth
            InputProps={{
              disableUnderline: true,
              sx: { fontWeight: 'bold', fontSize: '1.2rem' },
            }}
          />

          <FormControl
            variant="standard"
            size="small"
            sx={{ minWidth: 120, ml: 2 }}
          >
            <InputLabel>Type</InputLabel>
            <Select
              value={field.fieldType}
              onChange={handleTypeChange}
              label="Type"
            >
              {FIELD_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {field.fieldType === 'text' || field.fieldType === 'number' ? (
          <TextField
            variant="outlined"
            type={field.fieldType}
            placeholder={isEditing ? 'User input' : undefined}
            fullWidth
            disabled={!isEditing}
            sx={{ mb: 2 }}
          />
        ) : (
          <Box sx={{ mb: 2 }}>
            {Object.entries(field.options).map(([key, label]) => (
              <Box
                key={key}
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <input type={field.fieldType} disabled={!isEditing} />
                <Typography sx={{ ml: 1 }}>{label}</Typography>
                {isEditing && (
                  <IconButton
                    size="small"
                    onClick={() =>
                      onChange({
                        options: { ...field.options, [key]: undefined },
                      })
                    }
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))}
            {isEditing && (
              <Stack direction="row" spacing={1}>
                <Button
                  startIcon={<AddIcon />}
                  size="small"
                  onClick={() =>
                    onChange({
                      options: {
                        ...field.options,
                        [Date.now()]:
                          'Option ' + (Object.keys(field.options).length + 1),
                      },
                    })
                  }
                >
                  Add option
                </Button>
                <Button
                  startIcon={<AddIcon />}
                  size="small"
                  onClick={() =>
                    onChange({
                      options: { ...field.options, [Date.now()]: 'Other' },
                    })
                  }
                >
                  Other
                </Button>
              </Stack>
            )}
          </Box>
        )}

        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Switch
              checked={field.isRequired}
              onChange={(e) => onChange({ isRequired: e.target.checked })}
              inputProps={{ 'aria-label': 'required toggle' }}
            />
            <Typography>Required</Typography>
          </Box>
          <IconButton onClick={() => dispatch(removeQuestionField(id))}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default QuestionBuilder;
