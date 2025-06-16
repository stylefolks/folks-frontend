import Navbar from '@/components/Navbar';
import MswInit from '@/mocks/MswInit';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Posts from '@/pages/Posts';
import Post from '@/pages/Post';
import Crews from '@/pages/Crews';
import Crew from '@/pages/Crew';
import Brand from '@/pages/Brand';
import Profile from '@/pages/Profile';
import MyProfile from '@/pages/MyProfile';
import RequireAuth from '@/components/RequireAuth';
import { Routes, Route } from 'react-router-dom';
import './styles/globals.css';

export default function App() {
  return (
    <>
      <MswInit />
      <Navbar />
      <main className="pt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/crews" element={<Crews />} />
          <Route path="/crew/:crewId" element={<Crew />} />
          <Route path="/brand/:brandId" element={<Brand />} />
          <Route element={<RequireAuth />}> 
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/profile/:userId" element={<Profile />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}
