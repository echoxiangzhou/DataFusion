import React, { useState } from 'react';
import {
  Card,
  Button,
  Table,
  Typography,
  Tabs,
  Form,
  Select,
  Input,
  DatePicker,
  Row,
  Col,
  Space,
  Modal,
  Tag,
  Spin,
  Empty
} from 'antd';
import {
  PlusOutlined,
  FileTextOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useGetDiagnosticJobsQuery } from '../services/api';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [modalVisible, setModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [form] = Form.useForm();
  
  const { data: jobs } = useGetDiagnosticJobsQuery();
  
  // Mock reports data
  const reports = [
    {
      id: '1',
      name: 'Monthly Thermocline Analysis',
      type: 'thermocline',
      createdAt: '2023-06-15T10:30:00Z',
      status: 'completed',
    },
    {
      id: '2',
      name: 'Eddy Tracking Report',
      type: 'mesoscale_eddy',
      createdAt: '2023-06-10T14:20:00Z',
      status: 'completed',
    },
    {
      id: '3',
      name: 'Frontal Analysis - South China Sea',
      type: 'ocean_front',
      createdAt: '2023-06-05T09:15:00Z',
      status: 'completed',
    }
  ];
  
  // Mock templates data
  const templates = [
    {
      id: '1',
      name: 'Standard Thermocline Report',
      description: 'Thermocline analysis with depth profiles and statistical summary',
      type: 'thermocline'
    },
    {
      id: '2',
      name: 'Eddy Tracking Report',
      description: 'Mesoscale eddy detection with tracking information',
      type: 'mesoscale_eddy'
    },
    {
      id: '3',
      name: 'Frontal Analysis Report',
      description: 'Ocean front analysis with spatial distribution',
      type: 'ocean_front'
    },
    {
      id: '4',
      name: 'Internal Wave Statistics',
      description: 'Statistical analysis of internal waves',
      type: 'internal_wave'
    },
    {
      id: '5',
      name: 'Combined Oceanographic Report',
      description: 'Comprehensive report including multiple diagnostics',
      type: 'combined'
    }
  ];
  
  const reportColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={
          type === 'thermocline' ? 'blue' :
          type === 'mesoscale_eddy' ? 'green' :
          type === 'ocean_front' ? 'purple' :
          type === 'internal_wave' ? 'orange' : 'default'
        }>
          {type.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'completed' ? 'success' :
          status === 'generating' ? 'processing' :
          status === 'failed' ? 'error' : 'warning'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => setPreviewVisible(true)}
            disabled={record.status !== 'completed'}
          >
            View
          </Button>
          <Button
            icon={<DownloadOutlined />}
            size="small"
            disabled={record.status !== 'completed'}
          >
            Download
          </Button>
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  
  const templateColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={
          type === 'thermocline' ? 'blue' :
          type === 'mesoscale_eddy' ? 'green' :
          type === 'ocean_front' ? 'purple' :
          type === 'internal_wave' ? 'orange' :
          type === 'combined' ? 'cyan' : 'default'
        }>
          {type.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          type="primary"
          size="small"
          onClick={() => {
            form.setFieldsValue({ templateId: record.id });
            setModalVisible(true);
          }}
        >
          Use Template
        </Button>
      ),
    },
  ];
  
  const handleGenerateReport = async (values: any) => {
    setGeneratingReport(true);
    
    // In a real implementation, this would call the API to generate a report
    setTimeout(() => {
      setGeneratingReport(false);
      setModalVisible(false);
      form.resetFields();
      
      // Success message would be shown here
    }, 2000);
  };
  
  return (
    <div>
      <Title level={2}>Report Management</Title>
      
      <Tabs defaultActiveKey="reports" onChange={setActiveTab}>
        <TabPane 
          tab={
            <span>
              <FileTextOutlined />
              Reports
            </span>
          } 
          key="reports"
        >
          <Card 
            title="Generated Reports" 
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
              >
                New Report
              </Button>
            }
          >
            <Table
              columns={reportColumns}
              dataSource={reports.map(report => ({ ...report, key: report.id }))}
            />
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <FileTextOutlined />
              Templates
            </span>
          } 
          key="templates"
        >
          <Card title="Report Templates">
            <Table
              columns={templateColumns}
              dataSource={templates.map(template => ({ ...template, key: template.id }))}
            />
          </Card>
        </TabPane>
      </Tabs>
      
      {/* New Report Modal */}
      <Modal
        title="Generate New Report"
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setModalVisible(false);
            form.resetFields();
          }}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={generatingReport}
            onClick={() => form.submit()}
          >
            Generate
          </Button>,
        ]}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleGenerateReport}
        >
          <Form.Item
            name="name"
            label="Report Name"
            rules={[{ required: true, message: 'Please enter a report name' }]}
          >
            <Input placeholder="Enter report name" />
          </Form.Item>
          
          <Form.Item
            name="templateId"
            label="Report Template"
            rules={[{ required: true, message: 'Please select a template' }]}
          >
            <Select placeholder="Select a template">
              {templates.map(template => (
                <Option key={template.id} value={template.id}>
                  {template.name} - {template.description}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="diagnosticJobs"
            label="Include Diagnostic Results"
            rules={[{ required: true, message: 'Please select at least one diagnostic job' }]}
          >
            <Select 
              mode="multiple" 
              placeholder="Select diagnostic jobs to include"
            >
              {jobs?.filter(job => job.status === 'completed').map((job: any) => (
                <Option key={job.id} value={job.id}>
                  {job.name} ({job.diagnosticType})
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="dateRange"
            label="Date Range"
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Additional Notes"
          >
            <TextArea rows={4} placeholder="Enter any additional notes to include in the report" />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Report Preview Modal */}
      <Modal
        title="Report Preview"
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            Close
          </Button>,
          <Button key="download" type="primary" icon={<DownloadOutlined />}>
            Download
          </Button>,
        ]}
        width={800}
      >
        <div style={{ maxHeight: 600, overflowY: 'auto', padding: 16, border: '1px solid #f0f0f0' }}>
          <h1 style={{ textAlign: 'center' }}>Monthly Thermocline Analysis</h1>
          <p style={{ textAlign: 'center' }}><small>Generated: June 15, 2023</small></p>
          
          <h2>Executive Summary</h2>
          <p>
            This report presents the thermocline analysis for the South China Sea region based on data
            collected between May 1, 2023 and May 31, 2023. The analysis shows significant thermocline
            features with an average depth of 45m and temperature gradient of 0.25°C/m.
          </p>
          
          <h2>Data Sources</h2>
          <ul>
            <li>CMEMS Global Ocean Physics Reanalysis</li>
            <li>HYCOM Global Ocean Forecast System</li>
          </ul>
          
          <h2>Methodology</h2>
          <p>
            Thermocline detection was performed using the maximum gradient method with a threshold
            of 0.1°C/m and a 3-point smoothing window. The analysis was performed on a 0.25° x 0.25°
            grid covering the region from 5°N to 25°N and 105°E to 125°E.
          </p>
          
          <h2>Results</h2>
          <p>
            The thermocline depth varied between 30m and 75m across the study region, with deeper
            thermoclines observed in the central basin and shallower thermoclines near the coast.
            The mean thermocline intensity was 0.25°C/m with a standard deviation of 0.08°C/m.
          </p>
          
          <div style={{ textAlign: 'center', margin: '20px 0', color: '#999' }}>
            [Visualization would appear here]
          </div>
          
          <h2>Statistical Summary</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Parameter</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Minimum</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Maximum</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Mean</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Std Dev</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>Depth (m)</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>30</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>75</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>45</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>12</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>Intensity (°C/m)</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>0.12</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>0.42</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>0.25</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>0.08</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>Thickness (m)</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>15</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>35</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>22</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>6</td>
              </tr>
            </tbody>
          </table>
          
          <h2>Conclusions</h2>
          <p>
            The thermocline structure in the South China Sea during May 2023 shows typical seasonal
            patterns, with a relatively shallow and strong thermocline. The spatial distribution
            indicates influence from regional circulation patterns, particularly the monsoon-driven
            currents in the region.
          </p>
          
          <div style={{ marginTop: 40, borderTop: '1px solid #ddd', paddingTop: 10, fontSize: 12, color: '#999' }}>
            Generated by Marine Environmental Data Integration and Diagnostic Product Software
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Reports;