import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import Register from '../../pages/auth/Register';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

describe('Register Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders registration form', () => {
        render(<Register />);
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    test('handles successful registration', async () => {
        global.mockAxios.post.mockResolvedValueOnce({ data: { message: 'Success' } });
        render(<Register />);

        fireEvent.change(screen.getByPlaceholderText('Username'), {
            target: { value: 'testuser' }
        });
        fireEvent.change(screen.getByPlaceholderText('Email address'), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password123' }
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
            target: { value: 'password123' }
        });

        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    test('displays error message on registration failure', async () => {
        global.mockAxios.post.mockRejectedValueOnce({
            response: { data: { message: 'Registration failed' } }
        });
        render(<Register />);

        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => {
            expect(screen.getByText('Registration failed')).toBeInTheDocument();
        });
    });
}); 