import React from 'react';

const ConfirmModal = ({ show, type, user, onCancel, onConfirm }) => {
  if (!show) return null;

  return (
    <div
      className='modal fade show'
      style={{
        display: 'block',
        background: 'rgba(0,0,0,0.4)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1050,
      }}
    >
      <div
        data-testid='modal'
        className='modal-dialog'
        style={{ marginTop: '10vh' }}
      >
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>
              {type === 'edit' ? 'Edit User' : 'Delete User'}
            </h5>
            <button
              type='button'
              className='btn-close'
              onClick={onCancel}
              aria-label='Close'
            ></button>
          </div>
          <div className='modal-body'>
            <p>
              {type === 'edit'
                ? 'Are you sure you want to edit this user?'
                : 'Are you sure you want to delete this user?'}
            </p>
            {/* <div>
              <strong>{user?.name}</strong> <br />
              <small>{user?.email}</small>
            </div> */}
          </div>
          <div className='modal-footer'>
            <button className='btn btn-secondary' onClick={onCancel}>
              Cancel
            </button>
            <button
              className={`btn ${type === 'edit' ? 'btn-info' : 'btn-danger'}`}
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
