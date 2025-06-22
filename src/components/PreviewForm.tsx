import React from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  Button,
  Stack,
} from '@mui/material';
import { useAppSelector } from '../hooks/hooks';
import type { QuestionField } from '../store/formBuilderSlice';

const PreviewForm: React.FC = () => {
  const { title, description, questionFields, order } = useAppSelector(
    (state) => state.formBuilder.formValue,
  );

  const renderField = (field: QuestionField) => {
    switch (field.fieldType) {
      case 'text':
        return (
          <TextField
            variant="outlined"
            fullWidth
            placeholder=""
            required={field.isRequired}
          />
        );
      case 'number':
        return (
          <TextField
            variant="outlined"
            type="number"
            fullWidth
            placeholder=""
            required={field.isRequired}
          />
        );
      case 'select':
        return (
          <FormGroup>
            {Object.entries(field.options).map(([key, label]) => (
              <FormControlLabel
                key={key}
                control={<Checkbox />}
                label={label}
              />
            ))}
          </FormGroup>
        );
      case 'radio':
        return (
          <FormControl component="fieldset">
            <RadioGroup>
              {Object.entries(field.options).map(([key, label]) => (
                <FormControlLabel
                  key={key}
                  value={key}
                  control={<Radio />}
                  label={label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      default:
        return null;
    }
  };

  const handleSubmit = () => {};

  return (
    <Box>
      <Card
        sx={{
          borderTop: '4px solid',
          borderColor: 'primary.main',
          p: 3,
          mb: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          {title || 'Untitled form'}
        </Typography>
        {description && (
          <Typography variant="subtitle1" color="textSecondary">
            {description}
          </Typography>
        )}
      </Card>

      <Stack spacing={2}>
        {order.map((id) => {
          const field = questionFields[id];
          return (
            <Card key={id} sx={{ p: 2, backgroundColor: '#fff' }}>
              <Typography variant="subtitle1" gutterBottom>
                {field.fieldLabel || 'Untitled Question'}
                {field.isRequired && (
                  <Typography component="span" color="error">
                    *
                  </Typography>
                )}
              </Typography>
              {renderField(field)}
            </Card>
          );
        })}
      </Stack>

      <Box mt={4}>
        <Button variant="contained" disabled onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default PreviewForm;
