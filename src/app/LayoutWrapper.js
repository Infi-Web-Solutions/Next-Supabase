"use client"

import { usePathname } from "next/navigation"
import UserNavbar from "../components/usercomponent/navbar/UserNavbar"

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  return (
    <>
      {!isAdmin && <UserNavbar />}
      {children}
    </>
  )
}
