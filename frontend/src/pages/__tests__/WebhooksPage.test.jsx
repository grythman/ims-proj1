import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { webhookService } from '../../services/webhookService';
import WebhooksPage from '../WebhooksPage';

// Mock the webhook service
jest.mock('../../services/webhookService');

describe('WebhooksPage', () => {
  const mockStats = {
    total_webhooks: 5,
    active_webhooks: 3,
    total_deliveries: 100,
    successful_deliveries: 90,
    failed_deliveries: 10,
  };

  beforeEach(() => {
    webhookService.getWebhookStats.mockResolvedValue(mockStats);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders page title', () => {
    render(<WebhooksPage />);
    expect(screen.getByText('Webhook Management')).toBeInTheDocument();
  });

  it('displays webhook statistics', async () => {
    render(<WebhooksPage />);

    await waitFor(() => {
      expect(screen.getByText('Total Webhooks')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Successful Deliveries')).toBeInTheDocument();
      expect(screen.getByText('90')).toBeInTheDocument();
      expect(screen.getByText('Failed Deliveries')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });

  it('handles statistics loading error', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    webhookService.getWebhookStats.mockRejectedValue(new Error('Failed to fetch stats'));

    render(<WebhooksPage />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        'Failed to fetch webhook statistics:',
        expect.any(Error)
      );
    });

    consoleError.mockRestore();
  });

  it('renders webhook list component', () => {
    render(<WebhooksPage />);
    // WebhookList is rendered within a Card component
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
}); 