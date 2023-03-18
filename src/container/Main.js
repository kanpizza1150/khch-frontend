import { Button, Col, Form, InputNumber, Result, Row, Typography, Upload, message } from "antd"
import React, { useState } from "react"
import { UploadOutlined, FileAddOutlined, FileExcelTwoTone, DeleteOutlined } from "@ant-design/icons"
import { logout } from "../utils/auth"
import img from "../asset/main-img.svg"
import ggMap from "../asset/gg-map.png"
import * as api from "../utils/requests"

const MainTab = ({ setActiveMenu }) => {
  const [error, setError] = useState({ type: "", msg: "" })
  const [response, setResponse] = useState({})
  const [disabled, setDisabled] = useState(true)
  const [formRef] = Form.useForm()
  const items = [
    {
      name: "ia",
      label: "IA",
    },
    {
      name: "ib",
      label: "IB",
    },
    {
      name: "ic",
      label: "IC",
    },
    {
      name: "ig",
      label: "IG",
    },
  ]
  const onSubmit = async () => {
    setError({ type: "", msg: "" })
    try {
      const values = await formRef.validateFields()
      !values?.ia && delete values?.ia
      !values?.ib && delete values?.ib
      !values?.ic && delete values?.ic
      !values?.ig && delete values?.ig
      const res = await api.calculate(values)
      setResponse({ success: true, ...res?.data })
    } catch (e) {
      const code = e?.response?.status
      if (code === 404) {
        setError({ type: "warning", msg: "กรุณานำเข้าข้อมูลก่อน" })
      } else if (code < 500) {
        setError({ type: "error", msg: "ระบบไม่สามารถคำนวณได้" })
      } else {
        setError({ type: "error", msg: "เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง" })
      }
    }
  }
  const handleOnChange = async () => {
    const values = await formRef.validateFields()
    const count = Object.values(values).filter((i) => i).length
    setDisabled(count < 2 || count > 3)
  }
  const handleReset = () => {
    formRef.resetFields()
    setError({ type: "", msg: "" })
    setResponse({})
  }
  return (
    <div className="w-full flex  h-full items-center md:justify-evenly justify-start flex-wrap ">
      <Col className="h-fit w-full md:w-1/3">
        <Form form={formRef}>
          {items.map((i) => (
            <Form.Item key={i.name} label={i.label} name={i.name}>
              <InputNumber size="large" onChange={handleOnChange} className="w-full" />
            </Form.Item>
          ))}
          <Row gutter={8}>
            <Col span={4}>
              <Button type="dashed" onClick={handleReset} className="w-full">
                Clear
              </Button>
            </Col>
            <Col span={20}>
              <Button type="primary" onClick={onSubmit} className="w-full" disabled={disabled}>
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
      <Col className="h-fit w-full md:w-1/4 flex flex-col justify-center align-middle">
        {error?.msg && (
          <Result
            status={error.type}
            title={error.msg}
            extra={
              error.type === "warning" && (
                <Button onClick={() => setActiveMenu("manage")} type="dashed">
                  จัดการข้อมูล
                </Button>
              )
            }
          />
        )}
        {response?.success && (
          <>
            <div className="my-4">
              <h4 className="text-lg text-center">
                จุดที่คาดว่า: <span className="font-normal">{response?.location || ""}</span>
              </h4>
              <h4 className="text-lg text-center">
                ระยะห่่างจากสถานี:{" "}
                <span className="font-normal">{(response?.distance / 1000).toLocaleString() || "0"} km</span>
              </h4>
            </div>
            <Row className="mt-3 w-full">
              <Button
                type="dashed"
                className="w-full flex justify-center align-middle"
                onClick={() => window.open(response?.google_map_url)}>
                <img src={ggMap} alt="ggmap" className="h-4 mr-2" />
                เปิดด้วย Google maps
              </Button>
            </Row>
          </>
        )}
      </Col>
    </div>
  )
}
const Management = () => {
  const { Dragger } = Upload
  const [file, setFile] = useState([])
  const props = {
    name: "file",
    multiple: false,
    action: () => false,
    beforeUpload: () => false,
    maxCount: 1,
    accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    onChange(info) {
      setFile(info.fileList)
    },
    showUploadList: false,
    onDrop(e) {},
  }
  const handleUpload = async () => {
    try {
      await api.uploadExcel(file[0])
      message.success("อัพโหลดสำเร็จ")
      setFile([])
    } catch (e) {
      message.error("อัพโหลดไม่สำเร็จ")
    }
  }
  return (
    <Row className="mt-10" justify="center">
      <Col>
        <Row justify="center">
          <Typography.Title level={3}>อัพโหลด Excel file (.xlsx)</Typography.Title>
        </Row>
        <Row justify="center">
          <Typography.Title level={4}>สำหรับคำนวณหาจุดที่คาดว่าจะเกิด Fault ของระบบ</Typography.Title>
        </Row>
        <Row justify="center" className="my-10">
          {!file.length ? (
            <Dragger {...props} className="w-full bg-white rounded-md">
              <p className="ant-upload-drag-icon">
                <FileAddOutlined />
              </p>
              <p className="ant-upload-text">Drop or Drag</p>
              <p className="ant-upload-hint">allow file (.xlsx) to be upload</p>
              <Typography.Link>Browse a file</Typography.Link>
            </Dragger>
          ) : (
            <Row
              className="border-dashed border-1 border-gray-300 rounded-md p-3 bg-white min-w-full"
              justify="space-between"
              align="middle">
              <Row align="middle" gutter={[8, 0]}>
                <Col>
                  <FileExcelTwoTone />
                </Col>
                <Col>{file[0]?.name}</Col>
              </Row>
              <Col>
                <Button type="ghost" icon={<DeleteOutlined className="text-red-500" />} onClick={() => setFile([])} />
              </Col>
            </Row>
          )}
        </Row>
        <Row justify="center">
          <Button type="primary" disabled={!file.length} onClick={handleUpload}>
            Upload
            <UploadOutlined />
          </Button>
        </Row>
      </Col>
    </Row>
  )
}
const MainPage = () => {
  const [activeMenu, setActiveMenu] = useState("main")
  const renderMenu = (name, label) => {
    return (
      <Col>
        <Typography.Link type={activeMenu !== name ? "secondary" : undefined} onClick={() => setActiveMenu(name)}>
          {label}
        </Typography.Link>
      </Col>
    )
  }
  return (
    <div className="p-10 bg-mainBg h-[100vh] relative w-full">
      <img src={img} alt="" className="absolute top-0 right-0 z-[-1] opacity-30 md:opacity-100" />
      <Row justify="space-between">
        <Col className="h-min">
          <Row gutter={[16, 0]}>
            {renderMenu("main", "หน้าหลัก")}
            <Col>|</Col>
            {renderMenu("manage", "จัดการข้อมูล")}
          </Row>
        </Col>
        <Col className="h-min">
          <Typography.Link type="secondary" onClick={logout}>
            ออกจากระบบ
          </Typography.Link>
        </Col>
      </Row>
      {activeMenu === "main" ? <MainTab setActiveMenu={setActiveMenu} /> : <Management />}
    </div>
  )
}

export default MainPage
