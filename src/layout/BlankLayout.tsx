import { Outlet } from "@tanstack/react-router"

const BlankLayout = () => {
  return (
    <div className="flex h-screen w-full flex-col overflow-auto">
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default BlankLayout
