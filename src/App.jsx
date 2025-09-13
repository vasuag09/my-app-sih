import './App.css'
import { createBrowserRouter } from "react-router-dom"
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './store/http'
import Root from './pages/Root'
import HomePage from './pages/HomePage/HomePage'
import DashboardLayout from './pages/DashboardLayout'
import Dashboard from './components/Dashboard'
import RequireAuth from './components/AuthModals/RequireAuth'
import UserProfile from './components/UserProfile'
import ForumPage from './components/ForumPage'
import EventsPage from './components/EventsPage'
import AlumniMapPage from './components/AlumniMapPage'
import ChatRoom from './pages/ChatRoom'
import ConnectionsPage from './pages/ConnectionsPage'
import EventCalendarPage from './components/EventCalendarPage'
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        { index: true, element: <HomePage /> }
      ]
    },
    {
      path: ":userId/app",
      element: <RequireAuth><DashboardLayout /></RequireAuth>,
      children: [
        {index: true, element: <Dashboard />},
        {path: "profile", element: <UserProfile />},
        {path: "forum", element: <ForumPage />},
        {path: "events", element: <EventsPage />},
        {path: "alumni-map", element: <AlumniMapPage />},
        {path: "chatroom", element: <ChatRoom />},
        {path: "connections", element: <ConnectionsPage />},
        {path: "events-calender", element: <EventCalendarPage />}
      ]
    }
  ])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
