import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Auth from '../../Auth/Auth';

// Mock Firebase auth
const mockSignInWithEmailAndPassword = jest.fn();
const mockAuth = { currentUser: null };

jest.mock('firebase/auth', () => ({
  getAuth: () => mockAuth,
  signInWithEmailAndPassword: (...args) => mockSignInWithEmailAndPassword(...args),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Auth Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockSignInWithEmailAndPassword.mockReset();
  });

  const renderAuth = () => {
    return render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );
  };

  test('renders login form', async () => {
    renderAuth();

    // Wait for and verify form elements
    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  test('handles successful login', async () => {
    mockSignInWithEmailAndPassword.mockResolvedValueOnce({ user: { email: 'test@example.com' } });
    renderAuth();

    // Get form elements
    const emailInput = await screen.findByLabelText(/email/i);
    const passwordInput = await screen.findByLabelText(/password/i);
    const submitButton = await screen.findByRole('button', { name: /sign in/i });

    // Fill form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit form
    fireEvent.click(submitButton);

    // Verify Firebase auth was called
    await waitFor(() => {
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        'test@example.com',
        'password123'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('handles login errors', async () => {
    const errorMessage = 'Invalid credentials';
    mockSignInWithEmailAndPassword.mockRejectedValueOnce(new Error(errorMessage));
    renderAuth();

    // Get form elements
    const emailInput = await screen.findByLabelText(/email/i);
    const passwordInput = await screen.findByLabelText(/password/i);
    const submitButton = await screen.findByRole('button', { name: /sign in/i });

    // Fill and submit form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    // Verify error is displayed
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    });
  });
});
