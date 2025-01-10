import React from 'react';
import Dashboard from '../../pages/Dashboard';
import { render, screen, waitFor } from '../../utils/test-utils';

describe('Dashboard Component', () => {
    test('renders student dashboard when user is student', async () => {
        render(<Dashboard />, {
            authValue: {
                user: { id: 1, username: 'student', user_type: 'student' }
            }
        });

        await waitFor(() => {
            expect(screen.getByText('Student Dashboard')).toBeInTheDocument();
        });
    });

    test('renders teacher dashboard when user is teacher', async () => {
        render(<Dashboard />, {
            authValue: {
                user: { id: 1, username: 'teacher', user_type: 'teacher' }
            }
        });

        await waitFor(() => {
            expect(screen.getByText('Teacher Dashboard')).toBeInTheDocument();
        });
    });

    test('renders mentor dashboard when user is mentor', async () => {
        render(<Dashboard />, {
            authValue: {
                user: { id: 1, username: 'mentor', user_type: 'mentor' }
            }
        });

        await waitFor(() => {
            expect(screen.getByText('Mentor Dashboard')).toBeInTheDocument();
        });
    });

    test('renders admin dashboard when user is admin', async () => {
        render(<Dashboard />, {
            authValue: {
                user: { id: 1, username: 'admin', user_type: 'admin' }
            }
        });

        await waitFor(() => {
            expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
        });
    });
}); 