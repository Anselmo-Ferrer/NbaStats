import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PlayersPage from "./pages/PlayersPage.jsx"

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<PlayersPage />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
