import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch } from 'antd';

const { Option } = Select;

const WEBHOOK_EVENTS = [
  'organization.created',
  'organization.updated',
  'organization.deleted',
  'organization.activated',
  'organization.deactivated',
];

const WebhookForm = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={initialValues ? 'Edit Webhook' : 'Add Webhook'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ is_active: true }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter webhook name' }]}
        >
          <Input placeholder="Enter webhook name" />
        </Form.Item>

        <Form.Item
          name="url"
          label="URL"
          rules={[
            { required: true, message: 'Please enter webhook URL' },
            { type: 'url', message: 'Please enter a valid URL' },
          ]}
        >
          <Input placeholder="https://example.com/webhook" />
        </Form.Item>

        <Form.Item
          name="secret_key"
          label="Secret Key"
          rules={[{ required: true, message: 'Please enter secret key' }]}
        >
          <Input.Password placeholder="Enter secret key" />
        </Form.Item>

        <Form.Item
          name="events"
          label="Events"
          rules={[{ required: true, message: 'Please select at least one event' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select events to subscribe"
            style={{ width: '100%' }}
          >
            {WEBHOOK_EVENTS.map((event) => (
              <Option key={event} value={event}>
                {event}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="is_active"
          label="Active"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WebhookForm; 