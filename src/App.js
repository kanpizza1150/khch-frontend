import React from "react"
import Login from "./container/Login"
import thTH from "antd/locale/th_TH"
import { ConfigProvider } from "antd"
import "dayjs/locale/th"
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom"
import PrivateRoutes from "./utils/PrivateRoutes"
import "./index.css"
import Main from "./container/Main"

const App = () => {
  return (
    <ConfigProvider locale={thTH}>
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Main />} path="/" />
          </Route>
          <Route element={<Login />} path="/login" />
          <Route element={<Navigate to="/" />} path="*" />
        </Routes>
      </Router>
    </ConfigProvider>
  )
}

export default App
