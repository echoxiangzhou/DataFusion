import React, { useState } from 'react';
import { Row, Col, Card, Tree, Table, Tabs, Typography, Select, Button, Space } from 'antd';
import { FolderOutlined, FileOutlined, ReloadOutlined } from '@ant-design/icons';
import { useGetThreddsServersQuery, useGetThreddsServerCatalogQuery } from '../services/api';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const DataBrowser: React.FC = () => {
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const [currentPath, setCurrentPath] = useState<string>('');
  const [selectedDataset, setSelectedDataset] = useState<any | null>(null);
  
  const { data: servers, isLoading: isLoadingServers } = useGetThreddsServersQuery();
  const { data: catalog, isLoading: isLoadingCatalog } = useGetThreddsServerCatalogQuery(
    { serverId: selectedServerId, path: currentPath },
    { skip: !selectedServerId }
  );
  
  // Mock data for demonstration
  const treeData = catalog?.map((item: any) => ({
    title: item.name,
    key: item.path,
    icon: item.isDirectory ? <FolderOutlined /> : <FileOutlined />,
    isLeaf: !item.isDirectory,
    children: item.children || [],
  })) || [];
  
  // Mock data for dataset variables
  const variables = selectedDataset?.variables?.map((variable: string, index: number) => ({
    key: index,
    name: variable,
    type: 'float32',
    dimensions: 'lat, lon, time',
    units: index % 2 === 0 ? '°C' : 'kg/m³',
  })) || [];
  
  // Mock metadata for demonstration
  const metadata = [
    { key: 'title', label: 'Title', value: selectedDataset?.name || '-' },
    { key: 'format', label: 'Format', value: selectedDataset?.fileFormat || '-' },
    { key: 'variables', label: 'Variables', value: selectedDataset?.variables?.length.toString() || '0' },
    { key: 'timeStart', label: 'Time Start', value: '2023-01-01T00:00:00Z' },
    { key: 'timeEnd', label: 'Time End', value: '2023-12-31T23:59:59Z' },
    { key: 'spatialCoverage', label: 'Spatial Coverage', value: 'Lat: 20°N-60°N, Lon: 120°E-160°E' },
  ];
  
  const handleServerChange = (serverId: string) => {
    setSelectedServerId(serverId);
    setCurrentPath('');
  };
  
  const handleTreeSelect = (selectedKeys: React.Key[], info: any) => {
    if (info.node.isLeaf) {
      setSelectedDataset({
        id: info.node.key,
        name: info.node.title,
        fileFormat: 'NetCDF',
        variables: ['temperature', 'salinity', 'density', 'u', 'v', 'w', 'depth', 'latitude', 'longitude', 'time'],
      });
    } else {
      setCurrentPath(info.node.key as string);
    }
  };
  
  return (
    <div>
      <Title level={2}>Data Browser</Title>
      
      <Row gutter={16}>
        <Col span={24} style={{ marginBottom: 16 }}>
          <Card>
            <Space>
              <span>Thredds Server:</span>
              <Select
                style={{ width: 300 }}
                placeholder="Select Thredds Server"
                loading={isLoadingServers}
                value={selectedServerId || undefined}
                onChange={handleServerChange}
              >
                {servers?.map((server: any) => (
                  <Option key={server.id} value={server.id}>{server.name}</Option>
                ))}
              </Select>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={() => {
                  // Refresh catalog logic would go here
                }}
              >
                Refresh
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Dataset Catalog" style={{ height: 600, overflowY: 'auto' }}>
            {selectedServerId ? (
              <Tree
                showIcon
                defaultExpandAll
                onSelect={handleTreeSelect}
                treeData={treeData}
                loading={isLoadingCatalog}
              />
            ) : (
              <div style={{ textAlign: 'center', color: '#999', marginTop: 100 }}>
                Please select a Thredds server
              </div>
            )}
          </Card>
        </Col>
        
        <Col span={16}>
          <Card 
            title={selectedDataset?.name || 'Dataset Details'} 
            style={{ height: 600, overflowY: 'auto' }}
          >
            {selectedDataset ? (
              <Tabs defaultActiveKey="metadata">
                <TabPane tab="Metadata" key="metadata">
                  <Table
                    columns={[
                      { title: 'Property', dataIndex: 'label', key: 'label' },
                      { title: 'Value', dataIndex: 'value', key: 'value' },
                    ]}
                    dataSource={metadata}
                    pagination={false}
                    size="small"
                  />
                </TabPane>
                <TabPane tab="Variables" key="variables">
                  <Table
                    columns={[
                      { title: 'Name', dataIndex: 'name', key: 'name' },
                      { title: 'Type', dataIndex: 'type', key: 'type' },
                      { title: 'Dimensions', dataIndex: 'dimensions', key: 'dimensions' },
                      { title: 'Units', dataIndex: 'units', key: 'units' },
                    ]}
                    dataSource={variables}
                    pagination={false}
                    size="small"
                  />
                </TabPane>
                <TabPane tab="Preview" key="preview">
                  <div style={{ textAlign: 'center', marginTop: 50 }}>
                    Data preview would be shown here
                  </div>
                </TabPane>
              </Tabs>
            ) : (
              <div style={{ textAlign: 'center', color: '#999', marginTop: 100 }}>
                Select a dataset to view details
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DataBrowser;