import Navbar from '@/components/Navbar';
import { AppBarTitleProvider } from '@/lib/appBarTitle';
import HomePage from '@/pages/HomePage';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ResetPasswordPage from '@/pages/ResetPassword';
import Post from '@/pages/Post';
import PostDetailPage from '@/pages/PostDetailPage';
import CrewDetailPage from '@/pages/CrewDetailPage';
import CrewSettingsPage from '@/pages/CrewSettingsPage';
import CrewDirectoryPage from '@/pages/CrewDirectoryPage';
import CreateCrewPage from '@/pages/CreateCrew';
import UserProfilePage from '@/pages/profile/[userId]';

import SettingsPage from '@/pages/Settings';
import CreatePostPage from '@/pages/CreatePostPage';
import RequireAuth from '@/components/RequireAuth';
import { Routes, Route } from 'react-router-dom';
import './styles/globals.css';
import Search from './pages/Search';



export default function App() {
  return (
    <AppBarTitleProvider>
      <Navbar />
      <main className="pt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/crews" element={<CrewDirectoryPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/crew/:id" element={<CrewDetailPage />} />
          <Route path="/crew/:crewId/settings" element={<CrewSettingsPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="/write" element={<CreatePostPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/crews/new" element={<CreateCrewPage />} />
          </Route>
          {/* <Route path="/brands" element={<Brands />} />
          <Route path="/brand/:id" element={<BrandDetailPage />} /> */}
      </Routes>
      </main>
    </AppBarTitleProvider>
  );
}
