import { Link } from 'react-router-dom'
import { Search, Users, Store, PenLine, User, LogIn, Settings, UserPlus2 } from 'lucide-react'

type NavItem = {
  href: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { href: '/search', label: '검색', icon: <Search size={20} /> },
  { href: '/crews', label: '크루', icon: <Users size={20} /> },
  { href: '/brands', label: '브랜드', icon: <Store size={20} /> },
  { href: '/write', label: '작성', icon: <PenLine size={20} /> },
  { href: '/profile', label: '프로필', icon: <User size={20} /> },
  { href: '/login', label: '로그인', icon: <LogIn size={20} /> },
  { href: '/signup', label: '회원가입', icon: <UserPlus2 size={20} /> },
  { href: '/settings', label: '설정', icon: <Settings size={20} /> }
]

interface BottomNavProps {
  loggedIn: boolean
}

const makeNavItem = (items: NavItem[], loggedIn?: boolean) => {
  if(loggedIn) {
    return items.filter(item => item.href !== '/login' && item.href !== '/signup')
  }
  return items.filter(item => item.href !== '/login' && item.href !== '/settings')
}



export default function TopNav({ loggedIn }: BottomNavProps) {
  
  return (
    <div className='hidden sm:inline-block'>
      <ul className="flex justify-around gap-4">
        {makeNavItem(navItems, loggedIn).map(({ href, label, icon }) => (
          <li key={href}>
            <Link
              to={href}
              className="flex flex-col items-center text-xs text-gray-700 hover:text-black"
            >
              {icon}
              <span className="mt-1">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
