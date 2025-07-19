import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header/Header'

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Header />
      </header>
      
      <main className="flex-1">
        <Outlet />  
      </main>
    </div>
  )
}

export default Layout
