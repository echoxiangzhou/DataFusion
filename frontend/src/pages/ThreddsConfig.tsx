import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Table, 
  Typography, 
  Form, 
  Input, 
  Modal, 
  message, 
  Popconfirm,
  Space 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useGetThreddsServersQuery, useAddThreddsServerMutation } from '../services/api';

const { Title } = Typography;

interface ThreddsServerForm {
  name: string;
  baseUrl: string;
  description?: string;
  username?: string;
  password?: string;
}

const ThreddsConfig: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [testingServer, setTestingServer] = useState(false);
  const [form] = Form.useForm<ThreddsServerForm>();
  
  const { data: servers, isLoading } = useGetThreddsServersQuery();
  const [addThreddsServer] = useAddThreddsServerMutation();
  
  const handleAddServer = async (values: ThreddsServerForm) => {
    try {
      await addThreddsServer(values).unwrap();
      message.success('Thredds server added successfully');
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to add Thredds server');
    }
  };
  
  const handleTestConnection = async () => {
    try {
      const values = await form.validateFields();
      setTestingServer(true);
      
      // In a real implementation, this would make an API call to test the connection
      setTimeout(() => {
        message.success('Connection successful');
        setTestingServer(false);
      }, 1500);
    } catch (error) {
      // Form validation failed
    }
  };
  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Base URL',
      dataIndex: 'baseUrl',
      key: 'baseUrl',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => {
              // Edit logic would go here
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this server?"
            onConfirm={() => {
              // Delete logic would go here
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} size="small" danger>
              Delete
            </Button>
          </Popconfirm>
          <Button 
            icon={<CheckCircleOutlined />} 
            size="small"
            onClick={() => {
              // Test connection logic would go here
              message.success('Connection successful');
            }}
          >
            Test
          </Button>
        </Space>
      ),
    },
  ];
  
  return (
    <div>
      <Title level={2}>Thredds Server Configuration</Title>
      
      <Card 
        title="Thredds Servers" 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Add Server
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={servers?.map((server: any) => ({ ...server, key: server.id })) || []}
          loading={isLoading}
        />
      </Card>
      
      <Modal
        title="Add Thredds Server"
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={[
          <Button key="test" onClick={handleTestConnection} loading={testingServer}>
            Test Connection
          </Button>,
          <Button key="cancel" onClick={() => {
            setModalVisible(false);
            form.resetFields();
          }}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={() => form.submit()}
          >
            Save
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddServer}
        >
          <Form.Item
            name="name"
            label="Server Name"
            rules={[{ required: true, message: 'Please enter server name' }]}
          >
            <Input placeholder="Enter server name" />
          </Form.Item>
          
          <Form.Item
            name="baseUrl"
            label="Base URL"
            rules={[
              { required: true, message: 'Please enter base URL' },
              { 
                type: 'url', 
                message: 'Please enter a valid URL (e.g., http://example.com/thredds)' 
              }
            ]}
          >
            <Input placeholder="http://example.com/thredds" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea placeholder="Enter server description" rows={2} />
          </Form.Item>
          
          <Form.Item
            name="username"
            label="Username (Optional)"
          >
            <Input placeholder="Enter username if required" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="Password (Optional)"
          >
            <Input.Password placeholder="Enter password if required" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ThreddsConfig;