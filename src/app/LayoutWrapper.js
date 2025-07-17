"use client"

import { usePathname } from "next/navigation"
import UserNavbar from "../components/usercomponent/navbar/UserNavbar"
import Footer from "../components/usercomponent/footer/UserFooter"

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()

  const isAdmin = pathname.startsWith("/admin")
  const isAuthLogin = pathname === "/auth/login"
  const isAuthSignup = pathname === "/auth/signup"

  const shouldShowLayout = !isAdmin && !isAuthLogin && !isAuthSignup

  return (
    <>
      {shouldShowLayout && <UserNavbar />}
      
      {children}
      
      {shouldShowLayout && <Footer />}
    </>
  )
}
