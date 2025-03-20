import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WebhookForm from '../WebhookForm';

describe('WebhookForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    visible: true,
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    initialValues: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders create form correctly', () => {
    render(<WebhookForm {...defaultProps} />);

    expect(screen.getByText('Add Webhook')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Secret Key')).toBeInTheDocument();
    expect(screen.getByLabelText('Events')).toBeInTheDocument();
    expect(screen.getByLabelText('Active')).toBeInTheDocument();
  });

  it('renders edit form with initial values', () => {
    const initialValues = {
      name: 'Test Webhook',
      url: 'https://test.com/webhook',
      secret_key: 'secret123',
      events: ['organization.created'],
      is_active: true,
    };

    render(<WebhookForm {...defaultProps} initialValues={initialValues} />);

    expect(screen.getByText('Edit Webhook')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Webhook')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://test.com/webhook')).toBeInTheDocument();
    expect(screen.getByDisplayValue('secret123')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<WebhookForm {...defaultProps} />);

    // Try to submit empty form
    fireEvent.click(screen.getByText('OK'));

    await waitFor(() => {
      expect(screen.getByText('Please enter webhook name')).toBeInTheDocument();
      expect(screen.getByText('Please enter webhook URL')).toBeInTheDocument();
      expect(screen.getByText('Please enter secret key')).toBeInTheDocument();
      expect(screen.getByText('Please select at least one event')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates URL format', async () => {
    render(<WebhookForm {...defaultProps} />);

    // Enter invalid URL
    fireEvent.change(screen.getByLabelText('URL'), {
      target: { value: 'invalid-url' },
    });

    fireEvent.click(screen.getByText('OK'));

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid URL')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<WebhookForm {...defaultProps} />);

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Test Webhook' },
    });
    fireEvent.change(screen.getByLabelText('URL'), {
      target: { value: 'https://test.com/webhook' },
    });
    fireEvent.change(screen.getByLabelText('Secret Key'), {
      target: { value: 'secret123' },
    });

    // Select events
    const eventsSelect = screen.getByLabelText('Events');
    fireEvent.mouseDown(eventsSelect);
    fireEvent.click(screen.getByText('organization.created'));

    fireEvent.click(screen.getByText('OK'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Webhook',
        url: 'https://test.com/webhook',
        secret_key: 'secret123',
        events: ['organization.created'],
        is_active: true,
      });
    });
  });

  it('handles form cancellation', () => {
    render(<WebhookForm {...defaultProps} />);

    fireEvent.click(screen.getByText('Cancel'));

    expect(mockOnCancel).toHaveBeenCalled();
  });
}); 