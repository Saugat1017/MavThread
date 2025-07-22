import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header/Header'
import Footer from './Footer/Footer'

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className='fixed top-0 left-0 right-0 z-50'>
        <Header />
      </header>
      
      <main className="flex-1 pt-16">
        <Outlet />  
      </main>

      <footer>
        <Footer></Footer>
      </footer>
    </div>

  )
}

export default Layout

// ==============================================Alternate Layout==============================================
// // src/components/Layout.jsx
// import React from 'react'
// import { Outlet } from 'react-router-dom'
// import Header from './Header/Header'
// import BottomNav from './BottomNav'

// export default function Layout() {
//   return (
//     // 1) h-screen + overflow-hidden locks the browser window
//     // 2) bg-gray-900 makes sure root is dark
//     <div className="h-screen flex flex-col overflow-hidden bg-gray-900">
      
//       {/* Fixed Header (solid bg + high z-index) */}
//       <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800">
//         <Header />
//       </header>

//       {/* Scrollable Content */}
//       <main
//         className="
//           flex-1 
//           pt-16 pb-16      /* push below header & above footer */
//           overflow-y-auto  /* only this pane scrolls */
//           bg-gray-900      /* same dark bg */
//           overscroll-none  /* no bounce-through overscroll */
//         "
//       >
//         <Outlet />
//       </main>

//       {/* Fixed Bottom Navigation */}
//       <footer className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800">
//         <BottomNav />
//       </footer>
//     </div>
//   )
// }

