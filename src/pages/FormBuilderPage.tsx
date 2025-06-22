import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Box, Tabs, Tab, TextField, Paper } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { setTitle } from '../store/formBuilderSlice';
import Logo from '../assets/Logo';
import QuestionForm from '../components/QuestionsForm';
import PreviewForm from '../components/PreviewForm';

const FormBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const title = useAppSelector((state) => state.formBuilder.formValue.title);
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <Logo style={{ cursor: 'pointer', marginRight: 8 }} />
          </Link>
          <TextField
            variant="standard"
            value={title}
            onChange={(e) => dispatch(setTitle(e.target.value))}
            InputProps={{ disableUnderline: true }}
          />
        </Box>

        <Paper elevation={0} sx={{ mb: 2 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Questions" />
            <Tab label="Preview" />
          </Tabs>
        </Paper>

        <Box sx={{ backgroundColor: '#E3F2FD', p: 2, borderRadius: 1 }}>
          {tab === 0 ? <QuestionForm /> : <PreviewForm />}
        </Box>
      </Container>
    </Box>
  );
};

export default FormBuilderPage;
