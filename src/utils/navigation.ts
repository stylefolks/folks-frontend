import { NavItem } from "@/constants/navigation"

export const makeNavItem = (items: NavItem[], loggedIn?: boolean) => {
  if(loggedIn) {
    return items.filter(item => item.href !== '/login' && item.href !== '/signup')
  }
  return items.filter(item => item.href !== '/login' && item.href !== '/settings')
}
