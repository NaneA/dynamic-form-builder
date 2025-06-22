import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import FormBuilderPage from './pages/FormBuilderPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/form/:id" element={<FormBuilderPage />} />
    </Routes>
  );
}

export default App;
