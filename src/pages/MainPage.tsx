import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Container,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Button,
  Grid,
} from '@mui/material';
import { loadAllForms } from '../api/formService';
import type { FormListItem } from '../api/types';
import Logo from '../assets/Logo';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await loadAllForms();
        setForms(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      }
    })();
  }, []);

  const handleCreate = () => {
    const id = uuidv4();
    navigate(`/form/${id}`);
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 4,
            backgroundColor: 'Menu',
            p: 2,
          }}
        >
          <Box component="span" sx={{ mr: 1 }}>
            <Logo />
          </Box>
          <Typography variant="h5">Forms</Typography>
        </Box>

        <Box mb={4}>
          <Card>
            <CardActionArea onClick={handleCreate}>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h1" component="div" gutterBottom>
                  +
                </Typography>
                <Typography>Create new form</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>

        <Typography variant="h6" gutterBottom>
          Recent forms
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={2}>
          {forms.map((form) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={form.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6">
                      {form.title || 'Untitled form'}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/form/${form.id}`)}
                    >
                      Modify
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MainPage;
