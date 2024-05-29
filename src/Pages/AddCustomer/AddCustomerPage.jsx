import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {LeftOutlined} from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd'
import "./AddCustomerPage.scss"
import CustomerApi from "../../Services/api/CustomerApi";

const AddCustomerPage = () => {
    const navigate = useNavigate();

    const [form] = Form.useForm();

    const onFinish = async (values) => {
      try {
        await CustomerApi.addCustomer(values);
        navigate(-1);
      } catch (error) {
        console.log('Failed to add customer:', error);
      }
    };

  return (
    <div className='add-customer-page'>
      <Button className="go-back-btn" type="primary" onClick={() => navigate(-1)} >
        Go Back
        <LeftOutlined />
      </Button>

      <div className="add-customer-form-container">
      <Typography.Title className="add-customer-title" level={3}>Create Profile</Typography.Title>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="address" label="Address" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        
        <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Customer
          </Button>
        </Form.Item>
      </Form>
      </div>
    </div>
  )
}

export default AddCustomerPage;