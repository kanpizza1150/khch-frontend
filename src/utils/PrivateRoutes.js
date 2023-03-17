import { Spin } from "antd"
import React, { useEffect, useState } from "react"
import { Outlet, Navigate, useLocation } from "react-router-dom"

import { authenticate } from "./auth"

const PrivateRoutes = () => {
  const location = useLocation()
  const [auth, setAuth] = useState({ isLogged: false })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const auth = await authenticate()
      setAuth(auth)
      setLoading(false)
    }
    init()
  }, [location.pathname])
  return loading ? (
    <div className="w-[100vw] h-[100vh] flex justify-center align-middle">
      <Spin size="large" />
    </div>
  ) : !auth?.isLogged ? (
    <Navigate to="/login" state={{ from: location.pathname }} />
  ) : (
    <Outlet />
  )
}

export default PrivateRoutes
