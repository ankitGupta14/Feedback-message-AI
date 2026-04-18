'use client'
import React from 'react'
import Link from 'next/link' // ✅ Capital L
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'


function Navbar() {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <nav className="border-b bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            Feedback Mystery
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            
          

            {session ? (
              <>
                {/* User ka naam dikhao */}
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Welcome, {user?.username || user?.email}
                </span>

                {/* Logout Button */}
                <Button
                  variant="outline"
                  onClick={() => signOut({ callbackUrl: '/sign-in' })}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                {/* Login & Register Buttons */}
                <Link href="/sign-in">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;