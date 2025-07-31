import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './components/Authentication/Login'
import Signup from './components/Authentication/Signup'
import { MainDashboard } from './components/Dashboard/MainDashboard'
import UsersList from './components/Dashboard/Admin/UsersList'
import StoreList from './components/Dashboard/Admin/StoreList'
import ProtectedRoute from './components/Authentication/ProtectedRoute'
import { rolesLables } from './components/Common/Common'
import ErrorBoundary from './components/Common/ErrorBoundary'
import PageNotFound from './components/Authentication/PageNotFound'
import Navbar from './components/Navbar/Navbar'
import Profile from './components/Authentication/Profile'
import { AuthContext } from './components/Authentication/AuthContext'
function App() {
  const { loggedInUser } = useContext(AuthContext)
  return (
    <>
      <Router>
        <ErrorBoundary>
          {loggedInUser && <Navbar />}
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path='/signup' element={<Signup />} />

            <Route path='/dashboard' element={
              <ProtectedRoute allowedRoles={[rolesLables.systemAdmin, rolesLables.storeOwner, rolesLables.normalUser]}>
                <MainDashboard />
              </ProtectedRoute>
            } />
            <Route path='/profile' element={
              <ProtectedRoute allowedRoles={[rolesLables.systemAdmin, rolesLables.storeOwner, rolesLables.normalUser]}>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path='/users' element={
              <ProtectedRoute allowedRoles={[rolesLables.systemAdmin]}>
                <UsersList />
              </ProtectedRoute>
            }
            />
            <Route path='/stores' element={
              <ProtectedRoute allowedRoles={[rolesLables.systemAdmin]}>
                <StoreList />
              </ProtectedRoute>
            } />
            <Route path='*' element={<PageNotFound />} />
          </Routes>

        </ErrorBoundary>
      </Router >
    </>
  )
}

export default App
