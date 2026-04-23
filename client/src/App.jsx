import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import BandList from './pages/BandList';
import BandPage from './pages/BandPage';
import AlbumPage from './pages/AlbumPage';
import NowPlaying from './pages/NowPlaying';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBands from './pages/admin/AdminBands';
import AdminAlbums from './pages/admin/AdminAlbums';
import AdminTracks from './pages/admin/AdminTracks';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/bands" element={<BandList />} />
          <Route path="/bands/:bandId" element={<BandPage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
          <Route path="/now-playing" element={<NowPlaying />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="bands" element={<AdminBands />} />
          <Route path="albums" element={<AdminAlbums />} />
          <Route path="tracks" element={<AdminTracks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
