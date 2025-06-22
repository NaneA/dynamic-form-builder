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
  Stack,
  Button,
  Checkbox,
  Radio,
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
import DragHandle from '../assets/DragHandle';

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Short Answer' },
  { value: 'number', label: 'Number Field' },
  { value: 'select', label: 'Multiple Choice' },
  { value: 'radio', label: 'Checkbox' },
];

interface QuestionBuilderProps {
  id: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
  dragHandleProps?: any;
}

const QuestionBuilder: React.FC<QuestionBuilderProps> = ({
  id,
  isEditing,
  onStartEdit,
  onStopEdit,
  dragHandleProps,
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
        position: 'relative',
        borderLeft: isEditing ? '4px solid' : 'none',
        borderColor: isEditing ? 'primary.main' : undefined,
      }}
    >
      <Box
        {...dragHandleProps}
        sx={{
          position: 'absolute',
          top: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: isEditing ? 1 : 0,
          transition: 'opacity 0.2s',
          zIndex: 1,
          pointerEvents: 'auto',
        }}
      >
        <DragHandle />
      </Box>

      <Box sx={{ pt: 4, p: 2 }}>
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
            sx={{ minWidth: 180, ml: 2 }}
          >
            <InputLabel>Type</InputLabel>
            <Select
              value={field.fieldType}
              onChange={handleTypeChange}
              label="Type"
            >
              {FIELD_TYPES.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Field input or options editor */}
        {['text', 'number'].includes(field.fieldType) ? (
          <TextField
            variant="outlined"
            type={field.fieldType}
            fullWidth
            disabled={!isEditing}
            sx={{ mb: 2 }}
          />
        ) : (
          <Box sx={{ mb: 2 }}>
            {Object.entries(field.options).map(([key, label], idx, arr) => (
              <Box
                key={key}
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                {field.fieldType === 'select' ? (
                  <Checkbox disabled={true} />
                ) : (
                  <Radio disabled={true} />
                )}
                <TextField
                  variant="standard"
                  value={label}
                  onChange={(e) =>
                    onChange({
                      options: { ...field.options, [key]: e.target.value },
                    })
                  }
                  placeholder="Type option…"
                  InputProps={{ disableUnderline: true }}
                  autoFocus={isEditing && idx === arr.length - 1}
                  sx={{ flexGrow: 1, ml: 1 }}
                  disabled={!isEditing}
                />
                {isEditing && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      const updated = { ...field.options };
                      delete updated[key];
                      onChange({ options: updated });
                    }}
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
                      options: { ...field.options, [Date.now()]: '' },
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
                      options: { ...field.options, [Date.now()]: '' },
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
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Switch
              checked={field.isRequired}
              onChange={(e) => onChange({ isRequired: e.target.checked })}
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
