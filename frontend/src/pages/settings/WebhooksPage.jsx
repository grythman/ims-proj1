import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ApiOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import WebhookList from '../components/webhooks/WebhookList';
import { webhookService } from '../services/webhookService';

const WebhooksPage = () => {
  const [stats, setStats] = useState({
    total_webhooks: 0,
    active_webhooks: 0,
    total_deliveries: 0,
    successful_deliveries: 0,
    failed_deliveries: 0,
  });

  const fetchStats = async () => {
    try {
      const data = await webhookService.getWebhookStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch webhook statistics:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <h1>Webhook Management</h1>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Webhooks"
              value={stats.total_webhooks}
              prefix={<ApiOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Successful Deliveries"
              value={stats.successful_deliveries}
              valueStyle={{ color: '#3f8600' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Failed Deliveries"
              value={stats.failed_deliveries}
              valueStyle={{ color: '#cf1322' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <WebhookList />
      </Card>
    </div>
  );
};

export default WebhooksPage; 