import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PlayersPage from "./pages/PlayersPage.jsx"
import TeamsPage from './pages/TeamsPage.jsx';
import BetPage from './pages/BetPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import StandingsPage from './pages/StandingsPage.jsx';
import SearchTipsPage from './pages/SearchTipsPage.jsx';
import TipsTest from './tipstest.jsx';

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<PlayersPage />} />
          <Route path="/tips" element={<SearchTipsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/bet" element={<BetPage />} />
          <Route path="/standings" element={<StandingsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/tipstest" element={<TipsTest />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
