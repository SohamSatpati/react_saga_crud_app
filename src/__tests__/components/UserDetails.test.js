/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/prefer-find-by */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UserDetails from '../../components/UserDetails';
import * as userApi from '../../api/userApi';
import * as tanstackRouter from '@tanstack/react-router';

// Mock useMatch from @tanstack/react-router
// jest.mock('@tanstack/react-router', () => ({
//   useMatch: () => ({
//     params: { id: '123' },
//   }),
//   useNavigate: () => jest.fn(),
// }));

// jest.spyOn(tanstackRouter, 'useMatch').mockReturnValue({
//   params: { id: '123' },
// });

// jest.spyOn(tanstackRouter, 'useNavigate').mockReturnValue(jest.fn());
jest.mock('@tanstack/react-router', () => {
  const actual = jest.requireActual('@tanstack/react-router');
  return {
    ...actual,
    useMatch: () => ({
      params: { id: '123' },
    }),
    useNavigate: () => jest.fn(),
  };
});

// Mock getUserById
jest.mock('../../api/userApi', () => ({
  getUserById: jest.fn(),
}));

describe('UserDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading initially', () => {
    userApi.getUserById.mockReturnValue(new Promise(() => {})); // never resolves
    render(<UserDetails />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error message on API error', async () => {
    userApi.getUserById.mockRejectedValue(new Error('fail'));
    render(<UserDetails />);
    await waitFor(() =>
      expect(
        screen.getByText(/error fetching user details/i)
      ).toBeInTheDocument()
    );
  });

  it('shows user details on success', async () => {
    userApi.getUserById.mockResolvedValue({
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '1234567890',
      gender: 'Female',
      address: '123 Main St',
    });
    render(<UserDetails />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText(/jane@example.com/i)).toBeInTheDocument();
      expect(screen.getByText(/1234567890/)).toBeInTheDocument();
      expect(screen.getByText(/female/i)).toBeInTheDocument();
      expect(screen.getByText(/123 main st/i)).toBeInTheDocument();
    });
  });

  it('calls navigate when back button is clicked', async () => {
    const mockNavigate = jest.fn();
    jest
      .spyOn(require('@tanstack/react-router'), 'useNavigate')
      .mockReturnValue(mockNavigate);

    userApi.getUserById.mockResolvedValue({
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '1234567890',
      gender: 'Female',
      address: '123 Main St',
    });

    render(<UserDetails />);
    await waitFor(() => screen.getByText('Jane Doe'));
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' });
  });
});
