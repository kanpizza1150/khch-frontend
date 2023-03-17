import axios from "axios"
import { authenticate } from "./auth"

axios.defaults.baseURL = "http://localhost:3000/api"
const request = ({ path, method = "get", body = {}, headers = {} }) => {
  const auth = authenticate()
  const config = {
    url: path,
    method,
    headers: {
      Authorization: auth?.accessToken && `Bearer ${auth?.accessToken}`,
      ...headers,
    },
    data: body,
  }

  return axios(config)
}
export const login = async (username, password) => {
  return request({ method: "post", path: "/login", body: { username, password } })
}

export const calculate = async (body) => {
  return request({ method: "post", path: "/calculate", body })
}
export const uploadExcel = async (file) => {
  const formData = new FormData()
  formData.append("file", file.originFileObj)
  return request({
    method: "post",
    path: "/excel",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}
