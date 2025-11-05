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
import { ModeToggle } from './ModeToggle'

function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/budgets', label: 'Budgets' },
    { href: '/transactions', label: 'Transactions' },
  ]

  return (
    <div className="p-4 shadow bg-card text-card-foreground fixed top-0 w-full  z-50">
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
                      : 'hover:popover'
                  }`}
                >
                  {link.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem >
              <ModeToggle/>
            </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default Navbar
