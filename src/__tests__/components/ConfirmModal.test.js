import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '../../components/ConfirmModal';

describe('ConfirmModal', () => {
  const user = { name: 'John Doe', email: 'john@example.com' };

  it('does not render when show is false', () => {
    render(<ConfirmModal show={false} type='delete' user={user} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders and displays correct content for edit type', () => {
    render(
      <ConfirmModal
        show={true}
        type='edit'
        user={user}
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText(/edit user/i)).toBeInTheDocument();
    expect(
      screen.getByText(/are you sure you want to edit this user/i)
    ).toBeInTheDocument();
  });

  it('renders and displays correct content for delete type', () => {
    render(
      <ConfirmModal
        show={true}
        type='delete'
        user={user}
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText(/delete user/i)).toBeInTheDocument();
    expect(
      screen.getByText(/are you sure you want to delete this user/i)
    ).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = jest.fn();
    render(
      <ConfirmModal
        show={true}
        type='delete'
        user={user}
        onCancel={onCancel}
        onConfirm={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText(/cancel/i));
    expect(onCancel).toHaveBeenCalled();
  });
  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = jest.fn();
    render(
      <ConfirmModal
        show={true}
        type='delete'
        user={user}
        onCancel={jest.fn()}
        onConfirm={onConfirm}
      />
    );
    fireEvent.click(screen.getByText(/confirm/i));
    expect(onConfirm).toHaveBeenCalled();
  });
});
