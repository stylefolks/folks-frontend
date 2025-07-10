import Navbar from "@/components/Navbar";
import { AppBarTitleProvider } from "@/lib/appBarTitle";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ResetPassword from "@/pages/ResetPassword";
import PostDetail from "@/pages/PostDetail";
import CrewDetail from "@/pages/CrewDetail";
import CrewSettings from "@/pages/CrewSettings";
import CrewDirectory from "@/pages/CrewDirectory";
import CreateCrew from "@/pages/CreateCrew";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import CreatePost from "@/pages/CreatePostPage";
import RequireAuth from "@/components/RequireAuth";
import { Routes, Route } from "react-router-dom";
import "./styles/globals.css";
import Search from "./pages/Search";

export default function App() {
  return (
    <AppBarTitleProvider>
      <Navbar />
      <main className="pt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/crews" element={<CrewDirectory />} />
          <Route path="/search" element={<Search />} />
          <Route path="/crew/:id" element={<CrewDetail />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route element={<RequireAuth />}>
            <Route path="/settings" element={<Settings />} />
            <Route path="/crews/new" element={<CreateCrew />} />
            <Route path="/crew/:crewId/settings" element={<CrewSettings />} />
            <Route path="/write" element={<CreatePost />} />
          </Route>
        </Routes>
      </main>
    </AppBarTitleProvider>
  );
}
