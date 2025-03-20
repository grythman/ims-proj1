import React, { useState, useEffect } from 'react';
import { webhookService } from '../../services/webhookService';
import { Table, Button, Badge, Space, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import WebhookForm from './WebhookForm';

const WebhookList = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState(null);

  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      const data = await webhookService.getWebhooks();
      setWebhooks(data);
    } catch (error) {
      message.error('Failed to fetch webhooks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await webhookService.deleteWebhook(id);
      message.success('Webhook deleted successfully');
      fetchWebhooks();
    } catch (error) {
      message.error('Failed to delete webhook');
    }
  };

  const handleEdit = (webhook) => {
    setSelectedWebhook(webhook);
    setIsModalVisible(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (selectedWebhook) {
        await webhookService.updateWebhook(selectedWebhook.id, values);
        message.success('Webhook updated successfully');
      } else {
        await webhookService.createWebhook(values);
        message.success('Webhook created successfully');
      }
      setIsModalVisible(false);
      setSelectedWebhook(null);
      fetchWebhooks();
    } catch (error) {
      message.error('Failed to save webhook');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Events',
      dataIndex: 'events',
      key: 'events',
      render: (events) => (
        <Space>
          {events.map((event) => (
            <Badge key={event} status="processing" text={event} />
          ))}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive) => (
        <Badge
          status={isActive ? 'success' : 'error'}
          text={isActive ? 'Active' : 'Inactive'}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Add Webhook
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchWebhooks}>
            Refresh
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={webhooks}
        rowKey="id"
        loading={loading}
      />

      <WebhookForm
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedWebhook(null);
        }}
        onSubmit={handleFormSubmit}
        initialValues={selectedWebhook}
      />
    </div>
  );
};

export default WebhookList; 