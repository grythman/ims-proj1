import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Create mock auth context
const mockAuthContext = {
    user: null,
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
};

const AllTheProviders = ({ children, authValue = mockAuthContext, initialEntries = ['/'] }) => {
    return (
        <MemoryRouter initialEntries={initialEntries}>
            <AuthContext.Provider value={authValue}>
                {children}
            </AuthContext.Provider>
        </MemoryRouter>
    );
};

const customRender = (ui, { authValue, initialEntries, ...options } = {}) => {
    return render(ui, { 
        wrapper: (props) => (
            <AllTheProviders 
                {...props} 
                authValue={authValue} 
                initialEntries={initialEntries}
            />
        ),
        ...options 
    });
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render, mockAuthContext }; 