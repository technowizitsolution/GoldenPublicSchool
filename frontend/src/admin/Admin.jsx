import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'

const Admin = () => {
  return (
    <>  
        <div className='flex h-screen w-screen overflow-hidden'>
            <aside className="w-72 shrink-0 overflow-hidden">
               <Sidebar />
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden bg-gray-100">
                <section className="flex-1 overflow-y-auto">
                    <Outlet />
                </section>
            </main>

            
        </div>  
    </>
  )
}

export default Admin