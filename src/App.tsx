import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Posts from '@/pages/Posts';
import Post from '@/pages/Post';
import Crews from '@/pages/Crews';
import CrewDetailPage from '@/pages/crew/[id]';
import BrandDetailPage from '@/pages/brand/[id]';
import SearchPage from '@/pages/Search';
import UserProfilePage from '@/pages/profile/[userId]';
import MyProfile from '@/pages/MyProfile';
import SettingsPage from '@/pages/Settings';
import Write from '@/pages/Write';
import RequireAuth from '@/components/RequireAuth';
import { Routes, Route } from 'react-router-dom';
import './styles/globals.css';
import Brands from './pages/Brands';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="pt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post/:postId" element={<Post />} />
          <Route path="/crews" element={<Crews />} />
          <Route path="/crew/:id" element={<CrewDetailPage />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/brand/:id" element={<BrandDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route element={<RequireAuth />}>
            {/* <Route path="/profile" element={<MyProfile />} /> */}
            <Route path="/profile/:userId" element={<UserProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="/write" element={<Write />} />
        </Routes>
      </main>
    </>
  );
}
