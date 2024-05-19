import React, { useEffect, useState } from "react";
import { Button, ConfigProvider, Form, Input, Spin, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { encrypt } from "../../Utils/crypto";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // const onFinish = async (values) => {
  //   try {
  //     setLoading(true);
  //     const { user } = await loginUser(values.email, values.password);
  //     if (user) {
  //       if (user.status === "Active") {
  //         // Mã hóa roleName trc khi set vào session
  //         const encryptedRoleName = encrypt(user.role.roleName);
  //         const encryptedSyllabus = encrypt(user.role.syllabus);
  //         const encryptedTrainingProgram = encrypt(user.role.trainingProgram);
  //         const encryptedClass = encrypt(user.role.class);
  //         const encryptedLearningMaterial = encrypt(user.role.learningMaterial);
  //         sessionStorage.setItem("fullName", user.fullName);
  //         sessionStorage.setItem("roleName", encryptedRoleName);
  //         sessionStorage.setItem("RoleSyllabus", encryptedSyllabus);
  //         sessionStorage.setItem("RoleTrainingProgram", encryptedTrainingProgram);
  //         sessionStorage.setItem("RoleClass", encryptedClass);
  //         sessionStorage.setItem("RoleLearningMaterial", encryptedLearningMaterial);
  //         navigate("/home");
  //       } else {
  //         message.error("Your account has been locked");
  //       }
  //     }
  //     else {
  //       message.error("Incorrect email or password. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error during login:", error);
  //     message.error("An error occurred during login. Please try again later.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   const token = sessionStorage.getItem("token");
  //   if (token) {
  //     navigate(-1);
  //   }
  // }, []);

  return (
    <Spin spinning={loading} size="large">
      <div className="login-container">
        <div className="login-bg">
          <img
            src="/login-bg(4).jpg"
            alt="Login theme"
          />
        </div>
        <div className="login-content">
          <div className="login-title">
            <h3>LOG IN</h3>
          </div>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "var(--primary-color)",
                colorPrimaryHover: "var(--primary-color-hover)"
              },
            }}
          >
            <Form
              className="login-form"
              name="normal_login"
              initialValues={{
                remember: true,
              }}
            // onFinish={onFinish}
            >
              <Form.Item
                className="login-label"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input
                  className="login-input"
                  prefix={<UserOutlined />}
                  placeholder="Email"
                  type="email"
                  autoFocus
                  maxLength={40}
                />
              </Form.Item>
              <Form.Item
                className="login-label"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password
                  className="login-input"
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                  maxLength={12}
                />
              </Form.Item>
              <Form.Item className="login-label">
                <Button
                  style={{ marginTop: "28px", height: "48px" }}
                  className="login-input"
                  type="primary"
                  block
                  htmlType="submit"
                >
                  LOG IN
                </Button>
              </Form.Item>
            </Form>
          </ConfigProvider>

        </div>
      </div>
    </Spin>
  );
};

export default Login;
