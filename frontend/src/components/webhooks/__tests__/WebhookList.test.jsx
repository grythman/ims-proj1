import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { webhookService } from '../../../services/webhookService';
import WebhookList from '../WebhookList';

// Mock the webhook service
jest.mock('../../../services/webhookService');

describe('WebhookList', () => {
  const mockWebhooks = [
    {
      id: 1,
      name: 'Test Webhook',
      url: 'https://test.com/webhook',
      events: ['organization.created', 'organization.updated'],
      is_active: true,
    },
  ];

  beforeEach(() => {
    webhookService.getWebhooks.mockResolvedValue(mockWebhooks);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders webhook list with data', async () => {
    render(<WebhookList />);

    // Check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Webhook')).toBeInTheDocument();
    });

    // Check webhook details
    expect(screen.getByText('https://test.com/webhook')).toBeInTheDocument();
    expect(screen.getByText('organization.created')).toBeInTheDocument();
    expect(screen.getByText('organization.updated')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('opens create webhook modal', async () => {
    render(<WebhookList />);

    // Click add webhook button
    fireEvent.click(screen.getByText('Add Webhook'));

    // Check if modal is visible
    expect(screen.getByText('Add Webhook')).toBeInTheDocument();
  });

  it('handles webhook deletion', async () => {
    webhookService.deleteWebhook.mockResolvedValue();

    render(<WebhookList />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Webhook')).toBeInTheDocument();
    });

    // Click delete button
    fireEvent.click(screen.getByText('Delete'));

    // Check if webhook service was called
    expect(webhookService.deleteWebhook).toHaveBeenCalledWith(1);

    // Check if list was refreshed
    expect(webhookService.getWebhooks).toHaveBeenCalledTimes(2);
  });

  it('handles webhook update', async () => {
    webhookService.updateWebhook.mockResolvedValue();

    render(<WebhookList />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Webhook')).toBeInTheDocument();
    });

    // Click edit button
    fireEvent.click(screen.getByText('Edit'));

    // Check if modal is visible with correct title
    expect(screen.getByText('Edit Webhook')).toBeInTheDocument();
  });

  it('handles errors gracefully', async () => {
    // Mock error response
    webhookService.getWebhooks.mockRejectedValue(new Error('Failed to fetch'));

    render(<WebhookList />);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch webhooks')).toBeInTheDocument();
    });
  });
}); 