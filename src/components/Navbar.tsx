'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/budgets', label: 'Budgets' },
    { href: '/transactions', label: 'Transactions' },
  ]

  return (
    <div className="p-4 shadow bg-white text-gray-500">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList>
          {links.map(link => (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuLink asChild>
                <Link
                  href={link.href}
                  className={`px-3 py-1 rounded-md transition ${
                    pathname === link.href
                      ? 'text-blue-600 font-semibold '
                      : 'hover:text-black'
                  }`}
                >
                  {link.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default Navbar
