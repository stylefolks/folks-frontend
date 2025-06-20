import { Link } from 'react-router-dom'
import { navItems } from '@/constants/navigation'
import { makeNavItem } from '@/utils/navigation'


interface BottomNavProps {
  loggedIn: boolean
}

export default function BottomNav({ loggedIn }: BottomNavProps) {
  
  return (
      <ul className="flex justify-around py-2">
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
    
  )
}
