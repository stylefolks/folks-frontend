import { Search, Users, Store, PenLine, User, LogIn, UserPlus2, Settings } from "lucide-react"

export type NavItem = {
  href: string
  label: string
  icon: React.ReactNode
}

export const navItems: NavItem[] = [
  { href: '/search', label: '검색', icon: <Search size={20} /> },
  { href: '/crews', label: '크루', icon: <Users size={20} /> },
  { href: '/brands', label: '브랜드', icon: <Store size={20} /> },
  { href: '/write', label: '작성', icon: <PenLine size={20} /> },
  { href: '/profile', label: '프로필', icon: <User size={20} /> },
  { href: '/login', label: '로그인', icon: <LogIn size={20} /> },
  { href: '/signup', label: '회원가입', icon: <UserPlus2 size={20} /> },
  { href: '/settings', label: '설정', icon: <Settings size={20} /> }
]