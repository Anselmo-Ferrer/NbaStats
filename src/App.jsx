import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PlayersPage from "./pages/PlayersPage.jsx"
import TeamsPage from './pages/TeamsPage.jsx';

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<PlayersPage />} />
          <Route path="/teams" element={<TeamsPage />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
