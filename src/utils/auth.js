import * as requests from "./requests"
export const login = async ({ username, password }) => {
  try {
    const { data } = await requests.login(username, password)
    localStorage.setItem("access_token", data?.token)
    return authenticate()
  } catch (e) {
    throw e
  }
}

export const logout = async () => {
  localStorage.removeItem("access_token")
  window.location.replace("/")
}

export const authenticate = () => {
  const accessToken = localStorage.getItem("access_token")
  return { isLogged: !!accessToken, accessToken }
}
