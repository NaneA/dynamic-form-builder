import { Container, Box, Typography } from '@mui/material';

function App() {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dynamic Form Builder
        </Typography>
        {/* TODO: Add your FormBuilder component here */}
      </Box>
    </Container>
  );
}

export default App;
