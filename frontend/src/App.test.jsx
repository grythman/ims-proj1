import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Create mock AuthContext
const AuthContext = React.createContext({
    user: null,
    loading: false,
    login: () => {},
    logout: () => {}
});

// Mock components
jest.mock('./pages/Home', () => () => <div>Home Page</div>);
jest.mock('./pages/Dashboard', () => () => <div>Dashboard Page</div>);
jest.mock('./pages/auth/Login', () => () => <div>Login Page</div>);
jest.mock('./pages/auth/Register', () => () => <div>Register Page</div>);
jest.mock('./pages/Profile', () => () => <div>Profile Page</div>);

const renderWithRouter = (ui, { route = '/', authValue = {} } = {}) => {
    const mockAuthContext = {
        user: null,
        loading: false,
        login: jest.fn(),
        logout: jest.fn(),
        ...authValue
    };

    return render(
        <MemoryRouter initialEntries={[route]}>
            <AuthContext.Provider value={mockAuthContext}>
                {ui}
            </AuthContext.Provider>
        </MemoryRouter>
    );
};

describe('App Component', () => {
    test('renders loading spinner when auth is loading', () => {
        renderWithRouter(<App />, {
            authValue: { loading: true }
        });
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    test('renders home page for unauthenticated users', async () => {
        renderWithRouter(<App />);
        await waitFor(() => {
            expect(screen.getByText('Home Page')).toBeInTheDocument();
        });
    });

    test('renders dashboard for authenticated users', async () => {
        renderWithRouter(<App />, {
            route: '/dashboard',
            authValue: {
                user: { id: 1, username: 'testuser', user_type: 'student' }
            }
        });
        
        await waitFor(() => {
            expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
        });
    });

    test('redirects to login for protected routes when not authenticated', async () => {
        renderWithRouter(<App />, { route: '/profile' });
        
        await waitFor(() => {
            expect(screen.getByText('Login Page')).toBeInTheDocument();
        });
    });

    test('allows access to protected routes when authenticated', async () => {
        renderWithRouter(<App />, {
            route: '/profile',
            authValue: {
                user: { id: 1, username: 'testuser', user_type: 'student' }
            }
        });
        
        await waitFor(() => {
            expect(screen.getByText('Profile Page')).toBeInTheDocument();
        });
    });
}); 