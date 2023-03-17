import { Button, Col, Form, Image, Input, Row, message } from "antd"
import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { UserOutlined, LockOutlined, ArrowRightOutlined } from "@ant-design/icons"
import { login } from "../utils/auth"
import img from "../asset/login-img.svg"
const Login = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (values) {
      setLoading(true)
      try {
        const res = await login(values)
        if (res?.isLogged) {
          if (location?.state?.from) {
            navigate(location?.state?.from)
          } else {
            navigate("/")
          }
        }
        message.success("ลงชื่อเข้าใช้สำเร็จ")
      } catch (e) {
        message.error("ลงชื่อเข้าใช้ไม่สำเร็จ")
      }
      setLoading(false)
    }
  }
  return (
    <Row
      className="w-[100vw] h-[100vh] bg-loginBg xl:px-36 lg:px-36 md:px-28 sm:px-10 px-10"
      justify="space-between"
      align="middle">
      <Col className="xl:w-1/2 lg:w-1/2  md:w-1/2 ">
        <Image src={img} preview={false} />
      </Col>
      <Col className="xl:w-1/4 lg:w-1/3 md:w-1/2 ">
        <h2 className="text-2xl font-bold mb-8 text-center lg:text-right lg:text-4xl break-words">
          การระบุตำแหน่งจุดขัดข้องของสายจำหน่าย 22 เควี ผ่านระบบ IoT
        </h2>
        <Form form={form} layout="vertical" className="w-full">
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "กรุณากรอก Username!",
              },
            ]}>
            <Input placeholder="Username" size="large" prefix={<UserOutlined />} disabled={loading} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "กรุณากรอก Password!",
              },
            ]}>
            <Input.Password placeholder="Password" size="large" prefix={<LockOutlined />} disabled={loading} />
          </Form.Item>
        </Form>
        <Button onClick={handleSubmit} className="w-full mt-3" type="primary" loading={loading}>
          Login
          <ArrowRightOutlined />
        </Button>
      </Col>
    </Row>
  )
}

export default Login
