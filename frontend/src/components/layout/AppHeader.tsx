import React from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

const { Header } = Layout;
const { Title } = Typography;

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/profile')}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => navigate('/settings')}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="logo" style={{ marginRight: 16 }}>
          <img src="/logo.svg" alt="Logo" style={{ height: 40 }} />
        </div>
        <Title level={4} style={{ margin: 0, color: '#0077be' }}>
          Marine Environmental Data Integration
        </Title>
      </div>
      
      {isAuthenticated && user ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 12, color: '#666' }}>
            {user.fullName || user.username}
          </span>
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Avatar 
              style={{ backgroundColor: '#0077be', cursor: 'pointer' }} 
              icon={<UserOutlined />} 
            />
          </Dropdown>
        </div>
      ) : (
        <Menu theme="light" mode="horizontal" selectable={false}>
          <Menu.Item key="login" onClick={() => navigate('/login')}>
            Login
          </Menu.Item>
        </Menu>
      )}
    </Header>
  );
};

export default AppHeader;