import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormGroup,
  Checkbox,
  Button,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import { useAppSelector } from '../hooks/hooks';

interface FieldErrors {
  [id: string]: string;
}

const PreviewForm: React.FC = () => {
  const { title, description, questionFields, order } = useAppSelector(
    (state) => state.formBuilder.formValue,
  );

  const initialValues: Record<string, any> = {};
  const initialErrors: FieldErrors = {};
  order.forEach((id) => {
    const field = questionFields[id];
    initialValues[id] = field.fieldType === 'select' ? ([] as string[]) : '';
    initialErrors[id] = '';
  });

  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>(initialErrors);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleTextChange =
    (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [id]: e.target.value });
      if (errors[id]) {
        setErrors({ ...errors, [id]: '' });
      }
    };

  const handleTextBlur = (id: string) => () => {
    const field = questionFields[id];
    if (field.isRequired && !values[id]) {
      setErrors({ ...errors, [id]: 'This field is required' });
    }
  };

  const handleCheckboxChange =
    (id: string, key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      const prev = values[id] as string[];
      const next = checked ? [...prev, key] : prev.filter((k) => k !== key);
      setValues({ ...values, [id]: next });
      if (errors[id]) {
        setErrors({ ...errors, [id]: '' });
      }
    };

  const handleRadioChange =
    (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [id]: e.target.value });
      if (errors[id]) {
        setErrors({ ...errors, [id]: '' });
      }
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FieldErrors = {};
    order.forEach((id) => {
      const field = questionFields[id];
      const val = values[id];
      if (field.isRequired) {
        if (
          (field.fieldType === 'text' || field.fieldType === 'number') &&
          !val
        ) {
          newErrors[id] = 'This field is required';
        }
        if (
          field.fieldType === 'select' &&
          Array.isArray(val) &&
          val.length === 0
        ) {
          newErrors[id] = 'Please select at least one option';
        }
        if (field.fieldType === 'radio' && !val) {
          newErrors[id] = 'Please select an option';
        }
      }
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setSuccessMessage('No error while submitting the form');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
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
          <Typography variant="subtitle1" color="text.secondary">
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

              {(field.fieldType === 'text' || field.fieldType === 'number') && (
                <TextField
                  variant="outlined"
                  type={field.fieldType}
                  fullWidth
                  value={values[id]}
                  onChange={handleTextChange(id)}
                  onBlur={handleTextBlur(id)}
                  error={!!errors[id]}
                  helperText={errors[id]}
                />
              )}

              {field.fieldType === 'select' && (
                <FormControl
                  component="fieldset"
                  error={!!errors[id]}
                  sx={{ mb: 1 }}
                >
                  <FormGroup>
                    {Object.entries(field.options).map(([key, label]) => (
                      <FormControlLabel
                        key={key}
                        control={
                          <Checkbox
                            value={key}
                            checked={(values[id] as string[]).includes(key)}
                            onChange={handleCheckboxChange(id, key)}
                          />
                        }
                        label={label}
                      />
                    ))}
                  </FormGroup>
                  {!!errors[id] && (
                    <Typography color="error" variant="caption">
                      {errors[id]}
                    </Typography>
                  )}
                </FormControl>
              )}

              {field.fieldType === 'radio' && (
                <FormControl
                  component="fieldset"
                  error={!!errors[id]}
                  sx={{ mb: 1 }}
                >
                  <RadioGroup
                    value={values[id]}
                    onChange={handleRadioChange(id)}
                  >
                    {Object.entries(field.options).map(([key, label]) => (
                      <FormControlLabel
                        key={key}
                        value={key}
                        control={<Radio />}
                        label={label}
                      />
                    ))}
                  </RadioGroup>
                  {!!errors[id] && (
                    <Typography color="error" variant="caption">
                      {errors[id]}
                    </Typography>
                  )}
                </FormControl>
              )}
            </Card>
          );
        })}
      </Stack>

      <Box mt={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Box>

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
    </Box>
  );
};
export default PreviewForm;
