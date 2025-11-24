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
import AuthButtons from './AuthButtons'

function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/budgets', label: 'Budgets' },
    { href: '/transactions', label: 'Transactions' },
  ]

  return (
    <div className="md:px-4 py-4 shadow bg-card text-card-foreground fixed top-0 w-full  z-50">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList>
          {links.map(link => (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuLink asChild>
                <Link
                  href={link.href}
                  className={`md:px-3 py-1 rounded-md transition ${
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
               <div className="flex items-center md:gap-4">
          <AuthButtons />
          <ModeToggle />
        </div>
              
            </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default Navbar
