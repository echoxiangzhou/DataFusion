import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  DatabaseOutlined,
  ClusterOutlined,
  LineChartOutlined,
  FileTextOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { UserRole } from '../../store/slices/authSlice';

const { Sider } = Layout;

const AppSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  // Calculate selected keys based on current path
  const selectedKeys = [location.pathname.split('/')[1] || 'dashboard'];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className="app-sidebar"
      width={200}
    >
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={selectedKeys}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="dashboard" icon={<DashboardOutlined />} onClick={() => navigate('/')}>
          Dashboard
        </Menu.Item>
        
        <Menu.Item key="data-browser" icon={<DatabaseOutlined />} onClick={() => navigate('/data-browser')}>
          Data Browser
        </Menu.Item>
        
        {user && [UserRole.ADMIN, UserRole.DATA_MANAGER].includes(user.role) && (
          <Menu.Item key="thredds-config" icon={<SettingOutlined />} onClick={() => navigate('/thredds-config')}>
            Thredds Config
          </Menu.Item>
        )}
        
        <Menu.Item key="diagnostics" icon={<ClusterOutlined />} onClick={() => navigate('/diagnostics')}>
          Diagnostics
        </Menu.Item>
        
        <Menu.Item key="visualizations" icon={<LineChartOutlined />} onClick={() => navigate('/visualizations')}>
          Visualizations
        </Menu.Item>
        
        <Menu.Item key="reports" icon={<FileTextOutlined />} onClick={() => navigate('/reports')}>
          Reports
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default AppSidebar;