import { describe, it, expect } from 'vitest'
import { makeNavItem } from '../src/utils/navigation'

const items = [
  { href: '/search', label: '검색', icon: null },
  { href: '/crews', label: '크루', icon: null },
  { href: '/write', label: '작성', icon: null },
  { href: '/profile', label: '프로필', icon: null },
  { href: '/login', label: '로그인', icon: null },
  { href: '/signup', label: '회원가입', icon: null },
  { href: '/settings', label: '설정', icon: null },
]

describe('navigation utils', () => {
  it('returns search, signup and login when logged out', () => {
    const result = makeNavItem(items, false)
    expect(result.map(i => i.href)).toEqual(['/search', '/login', '/signup'])
  })

  it('returns search, crews and write when logged in', () => {
    const result = makeNavItem(items, true)
    expect(result.map(i => i.href)).toEqual(['/search', '/crews', '/write'])
  })
})
