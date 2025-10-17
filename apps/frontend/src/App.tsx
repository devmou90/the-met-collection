import { Navigate, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { ExplorePage } from './pages/ExplorePage';
import { ArtworkDetailPage } from './pages/ArtworkDetailPage';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Header />
      <Routes>
        <Route path="/" element={<ExplorePage />} />
        <Route path="/artworks/:id" element={<ArtworkDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
