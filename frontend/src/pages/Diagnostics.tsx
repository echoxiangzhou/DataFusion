import React, { useState } from 'react';
import { 
  Card, 
  Tabs, 
  Typography, 
  Form, 
  Select, 
  Button, 
  Input, 
  InputNumber, 
  Row, 
  Col,
  Table,
  Tag,
  Space,
  Spin,
  message
} from 'antd';
import {
  LineChartOutlined,
  HistoryOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import { useGetDatasetsQuery, useGetDiagnosticJobsQuery } from '../services/api';
import { JobStatus } from '../store/slices/diagnosticsSlice';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const Diagnostics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('thermocline');
  const [isRunning, setIsRunning] = useState(false);
  
  // Form instances for each diagnostic type
  const [thermoclineForm] = Form.useForm();
  const [eddyForm] = Form.useForm();
  const [frontForm] = Form.useForm();
  const [waveForm] = Form.useForm();
  
  const { data: datasets, isLoading: isLoadingDatasets } = useGetDatasetsQuery();
  const { data: jobs, isLoading: isLoadingJobs } = useGetDiagnosticJobsQuery();
  
  const handleRunDiagnostic = async (values: any) => {
    setIsRunning(true);
    
    // In a real implementation, this would call the appropriate API endpoint
    setTimeout(() => {
      message.success('Diagnostic job submitted successfully');
      setIsRunning(false);
      
      // Reset form
      switch (activeTab) {
        case 'thermocline':
          thermoclineForm.resetFields();
          break;
        case 'eddy':
          eddyForm.resetFields();
          break;
        case 'front':
          frontForm.resetFields();
          break;
        case 'internal-wave':
          waveForm.resetFields();
          break;
      }
    }, 2000);
  };
  
  const jobColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'diagnosticType',
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: JobStatus) => (
        <Tag color={
          status === JobStatus.COMPLETED ? 'success' :
          status === JobStatus.RUNNING ? 'processing' :
          status === JobStatus.FAILED ? 'error' : 'warning'
        }>
          {status}
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
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" type="link">View</Button>
          <Button 
            size="small" 
            type="link" 
            disabled={record.status !== JobStatus.COMPLETED}
          >
            Visualize
          </Button>
        </Space>
      ),
    },
  ];
  
  return (
    <div>
      <Title level={2}>Environmental Diagnostics</Title>
      
      <Tabs 
        defaultActiveKey="thermocline" 
        onChange={setActiveTab}
        tabPosition="left"
        style={{ height: 'calc(100vh - 200px)' }}
      >
        <TabPane 
          tab={
            <span>
              <ExperimentOutlined />
              Thermocline Analysis
            </span>
          } 
          key="thermocline"
        >
          <Card title="Thermocline/Halocline/Pycnocline Analysis">
            <Form
              form={thermoclineForm}
              layout="vertical"
              onFinish={handleRunDiagnostic}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="datasetId"
                    label="Dataset"
                    rules={[{ required: true, message: 'Please select a dataset' }]}
                  >
                    <Select 
                      placeholder="Select a dataset" 
                      loading={isLoadingDatasets}
                    >
                      {datasets?.map((dataset: any) => (
                        <Option key={dataset.id} value={dataset.id}>{dataset.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="parameterType"
                    label="Parameter Type"
                    rules={[{ required: true, message: 'Please select a parameter type' }]}
                  >
                    <Select placeholder="Select parameter type">
                      <Option value="temperature">Temperature</Option>
                      <Option value="salinity">Salinity</Option>
                      <Option value="density">Density</Option>
                      <Option value="sound_speed">Sound Speed</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="minGradient"
                    label="Minimum Gradient"
                    rules={[{ required: true, message: 'Please enter a value' }]}
                  >
                    <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="smoothingWindow"
                    label="Smoothing Window"
                    rules={[{ required: true, message: 'Please enter a value' }]}
                  >
                    <InputNumber min={1} step={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="detectionMethod"
                    label="Detection Method"
                    rules={[{ required: true, message: 'Please select a method' }]}
                  >
                    <Select placeholder="Select method">
                      <Option value="gradient">Maximum Gradient</Option>
                      <Option value="threshold">Threshold</Option>
                      <Option value="wavelet">Wavelet</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={isRunning}
                  icon={<LineChartOutlined />}
                >
                  Run Analysis
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <ExperimentOutlined />
              Mesoscale Eddy Detection
            </span>
          } 
          key="eddy"
        >
          <Card title="Mesoscale Eddy Detection">
            <Form
              form={eddyForm}
              layout="vertical"
              onFinish={handleRunDiagnostic}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="datasetId"
                    label="Dataset"
                    rules={[{ required: true, message: 'Please select a dataset' }]}
                  >
                    <Select 
                      placeholder="Select a dataset" 
                      loading={isLoadingDatasets}
                    >
                      {datasets?.map((dataset: any) => (
                        <Option key={dataset.id} value={dataset.id}>{dataset.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="sshVariable"
                    label="SSH Variable"
                    rules={[{ required: true, message: 'Please enter variable name' }]}
                  >
                    <Input placeholder="e.g., sea_surface_height" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="minAmplitude"
                    label="Minimum Amplitude (m)"
                    rules={[{ required: true, message: 'Please enter a value' }]}
                  >
                    <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="minRadius"
                    label="Minimum Radius (km)"
                    rules={[{ required: true, message: 'Please enter a value' }]}
                  >
                    <InputNumber min={10} step={5} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="detectionMethod"
                    label="Detection Method"
                    rules={[{ required: true, message: 'Please select a method' }]}
                  >
                    <Select placeholder="Select method">
                      <Option value="okubo-weiss">Okubo-Weiss</Option>
                      <Option value="geometric">Geometric</Option>
                      <Option value="winding-angle">Winding Angle</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={isRunning}
                  icon={<LineChartOutlined />}
                >
                  Run Detection
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <ExperimentOutlined />
              Ocean Front Analysis
            </span>
          } 
          key="front"
        >
          <Card title="Ocean Front Analysis">
            <Form
              form={frontForm}
              layout="vertical"
              onFinish={handleRunDiagnostic}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="datasetId"
                    label="Dataset"
                    rules={[{ required: true, message: 'Please select a dataset' }]}
                  >
                    <Select 
                      placeholder="Select a dataset" 
                      loading={isLoadingDatasets}
                    >
                      {datasets?.map((dataset: any) => (
                        <Option key={dataset.id} value={dataset.id}>{dataset.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="variable"
                    label="Variable"
                    rules={[{ required: true, message: 'Please select a variable' }]}
                  >
                    <Select placeholder="Select variable">
                      <Option value="temperature">Temperature</Option>
                      <Option value="salinity">Salinity</Option>
                      <Option value="density">Density</Option>
                      <Option value="sound_speed">Sound Speed</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="threshold"
                    label="Gradient Threshold"
                    rules={[{ required: true, message: 'Please enter a value' }]}
                  >
                    <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="minLength"
                    label="Minimum Length (km)"
                    rules={[{ required: true, message: 'Please enter a value' }]}
                  >
                    <InputNumber min={10} step={5} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="method"
                    label="Detection Method"
                    rules={[{ required: true, message: 'Please select a method' }]}
                  >
                    <Select placeholder="Select method">
                      <Option value="gradient">Gradient</Option>
                      <Option value="histogram">Histogram</Option>
                      <Option value="belkin-oneill">Belkin-O'Neill</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={isRunning}
                  icon={<LineChartOutlined />}
                >
                  Run Analysis
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <ExperimentOutlined />
              Internal Wave Analysis
            </span>
          } 
          key="internal-wave"
        >
          <Card title="Internal Wave Statistical Analysis">
            <Form
              form={waveForm}
              layout="vertical"
              onFinish={handleRunDiagnostic}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="datasetId"
                    label="Dataset"
                    rules={[{ required: true, message: 'Please select a dataset' }]}
                  >
                    <Select 
                      placeholder="Select a dataset" 
                      loading={isLoadingDatasets}
                    >
                      {datasets?.map((dataset: any) => (
                        <Option key={dataset.id} value={dataset.id}>{dataset.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="regionType"
                    label="Region Selection"
                    rules={[{ required: true, message: 'Please select a method' }]}
                  >
                    <Select placeholder="Select method">
                      <Option value="bbox">Bounding Box</Option>
                      <Option value="polygon">Polygon</Option>
                      <Option value="predefined">Predefined Region</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="analysisMethod"
                    label="Analysis Method"
                    rules={[{ required: true, message: 'Please select a method' }]}
                  >
                    <Select placeholder="Select method">
                      <Option value="spectral">Spectral Analysis</Option>
                      <Option value="wavelet">Wavelet Analysis</Option>
                      <Option value="eof">EOF Analysis</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="outputType"
                    label="Output Type"
                    rules={[{ required: true, message: 'Please select output type' }]}
                  >
                    <Select placeholder="Select output type">
                      <Option value="statistics">Statistical Summary</Option>
                      <Option value="spectrum">Frequency Spectrum</Option>
                      <Option value="spatial">Spatial Distribution</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={isRunning}
                  icon={<LineChartOutlined />}
                >
                  Run Analysis
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <HistoryOutlined />
              Job History
            </span>
          } 
          key="history"
        >
          <Card title="Diagnostic Jobs">
            {isLoadingJobs ? (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <Spin />
                <div style={{ marginTop: 16 }}>Loading jobs...</div>
              </div>
            ) : (
              <Table
                columns={jobColumns}
                dataSource={jobs?.map((job: any) => ({ ...job, key: job.id })) || []}
              />
            )}
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Diagnostics;