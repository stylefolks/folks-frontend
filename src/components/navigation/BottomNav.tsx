import { Link } from 'react-router-dom'
import { Search, Users, Store, PenLine, User } from 'lucide-react'

const navItems = [
  { href: '/search', label: '검색', icon: <Search size={20} /> },
  { href: '/crews', label: '크루', icon: <Users size={20} /> },
  { href: '/brands', label: '브랜드', icon: <Store size={20} /> },
  { href: '/write', label: '작성', icon: <PenLine size={20} /> },
  { href: '/me', label: '프로필', icon: <User size={20} /> },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white shadow-md z-50">
      <ul className="flex justify-around py-2">
        {navItems.map(({ href, label, icon }) => (
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
    </nav>
  )
}
