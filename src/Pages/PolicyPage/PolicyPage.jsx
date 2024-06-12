import React, { useState } from 'react';
import { Card, Form, Input, Button, Modal, Collapse, Table, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import './PolicyPage.scss';

const { Panel } = Collapse;
const { Text } = Typography;

const PolicyPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tableData, setTableData] = useState([]);  
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        setTableData(values.table);  
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const columns = [
    {
      title: 'Header 1',
      dataIndex: 'header1',
      key: 'header1',
    },
    {
      title: 'Header 2',
      dataIndex: 'header2',
      key: 'header2',
    },

  ];

  const isAdmin = true;  

  return (
    <div className="policy-page">
      <Card title="Return Policy" extra={isAdmin && <Button icon={<EditOutlined />} onClick={showModal}/>}>
        <Collapse>
          <Panel header="See Policy Details" key="1">
            <p>Return policy details...</p>
            <Table dataSource={tableData} columns={columns} />
          </Panel>
        </Collapse>
        <Modal title="Modify Policy" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <Form form={form} name="modifyPolicy">
            <Form.Item name="policy" rules={[{ required: true }]}>
              <Input.TextArea />
            </Form.Item>
            {columns.map((col) => (
              <Form.Item key={col.key} name={['table', 0, col.dataIndex]} rules={[{ required: true, message: `Missing ${col.title}`}]} >
                <Input prefix={<Text>{`${col.title}: `}</Text>} />
              </Form.Item>
            ))}
          </Form>
        </Modal>
      </Card>

    </div>
  );
};

export default PolicyPage;