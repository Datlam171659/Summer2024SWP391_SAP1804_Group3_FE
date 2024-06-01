import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {LeftOutlined} from '@ant-design/icons';
import { Button, Form, Input, Typography, Radio, message, Modal } from 'antd'
import "./AddCustomerPage.scss"
import CustomerApi from "../../Services/api/CustomerApi";

const AddCustomerPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
      let newCustomer = {
        ...values,
        status: "active"
      }
      try { 
        let emailExists = null;
        let phoneNumberExists = null;
    
        try {
            emailExists = await CustomerApi.getCustomerByEmail(values.email);
        } catch (error) {
          console.log(error);
        }
        
        try {
            phoneNumberExists = await CustomerApi.getCustomerByPhoneNumber(values.phoneNumber);
        } catch (error) {
            console.log(error);
        }
          let errorMessage = [];
          if(emailExists && emailExists.email) errorMessage.push('Email');
          if(phoneNumberExists && phoneNumberExists.phoneNumber) errorMessage.push('Phone Number');
          if(errorMessage.length !== 0) {
          Modal.error({
              style: { top: '50%', transform: 'translateY(-50%)' },
              title: "Error",
              content: `${errorMessage.join(' and ')} already in use, please use a different one`,
              okText: "OK"
          });
          return;
          }

          await CustomerApi.addCustomer(newCustomer);
          message.success('Customer created successfully!');
          Modal.confirm({
            title: "Success",
            content: "Customer created successfully!",
            okText: "OK",
            style: { top: '50%', transform: 'translateY(-50%)' },
            onOk() {
              navigate(-1); 
            }
          })} catch (error) {
            message.error('Failed to add customer. Please try again.');
            Modal.warning({
              title: "Error",
              content: `Failed to add customer`,
              style: { top: '50%', transform: 'translateY(-50%)' },
              okText: "OK"
            });
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
      <Form form={form} 
            onFinish={onFinish} 
            layout="vertical"
            initialValues={{ status: "active" }} 
      >
        <Form.Item name="customerName" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="address" label="Address" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                <Radio.Group>
                  <Radio value="Male">Male</Radio>
                  <Radio value="Female">Female</Radio>
                </Radio.Group>
        </Form.Item>
        
        <Form.Item name="phoneNumber" label="Phone Number" rules={[
                { required: true, message: "Please input your Phone number!" },
                {
                  pattern: new RegExp(/^\d{9,11}$/),
                  message: "Phone number must be between 9 and 11 digits!",
                },
              ]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[
                  { required: true, message: "Please input your Email!" },
                  {
                    type: 'email',
                    message: "The input is not valid E-mail!",
                  },
                ]}>
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