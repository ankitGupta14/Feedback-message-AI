'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { MessageCircle, LogOut, LayoutDashboard } from 'lucide-react'

function Navbar() {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-gray-900/80 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Feedback{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Mystery
              </span>
            </span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {session ? (
              <>
                {/* User Badge */}
                <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                    {(user?.username || user?.email || "U")[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-300">
                    {user?.username || user?.email}
                  </span>
                </div>

                {/* Dashboard Button */}
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 gap-2 hidden sm:flex"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>

                {/* Sign Out Button */}
                <Button
                  onClick={() => signOut({ callbackUrl: '/sign-in' })}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 gap-2"
                  variant="outline"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    className="border-white/20 text-gray-700 hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/30">
                    Sign Up
                  </Button>
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