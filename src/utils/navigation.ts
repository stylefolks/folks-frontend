import { NavItem } from "@/constants/navigation"

export const makeNavItem = (items: NavItem[], loggedIn?: boolean) => {
  if (loggedIn) {
    const allowed = ['/search', '/crews', '/write']
    return items.filter((item) => allowed.includes(item.href))
  }
  const allowed = ['/search', '/signup', '/login']
  return items.filter((item) => allowed.includes(item.href))
}
