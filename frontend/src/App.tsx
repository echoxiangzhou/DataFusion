import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import AppHeader from './components/layout/AppHeader';
import AppSidebar from './components/layout/AppSidebar';
import Dashboard from './pages/Dashboard';
import DataBrowser from './pages/DataBrowser';
import ThreddsConfig from './pages/ThreddsConfig';
import Diagnostics from './pages/Diagnostics';
import Reports from './pages/Reports';
import './App.css';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Layout>
        <AppSidebar />
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280,
              borderRadius: 4,
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/data-browser" element={<DataBrowser />} />
              <Route path="/thredds-config" element={<ThreddsConfig />} />
              <Route path="/diagnostics" element={<Diagnostics />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;