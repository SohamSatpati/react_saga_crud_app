import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  clearSelectedUser,
  deleteUser,
  fetchUsers,
  selectUser,
} from '../redux/actions';
import ConfirmModal from './ConfirmModal';
import { useNavigate } from '@tanstack/react-router';
const PAGE_SIZE = 5; // Number of users per page

const UserTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const reduxState = useSelector((state) => state);
  // console.log('Redux State:', reduxState);
  const users = useSelector((state) => state?.users);
  const selectedUser = useSelector((state) => state.selectedUser);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ show: false, type: '', user: null });
  const [currentPage, setCurrentPage] = useState(1);
  console.log('modal:', modal);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // const handleEdit = (user) => {
  //   if (window.confirm('Are you sure you want to edit this user?')) {
  //     dispatch(selectUser(user));
  //   }
  // };

  // const handleDelete = (id) => {
  //   if (window.confirm('Are you sure you want to delete this user?')) {
  //     dispatch(deleteUser(id));
  //     if (selectedUser && selectedUser.id === id) {
  //       dispatch(clearSelectedUser());
  //     }
  //   }
  // };
  const handleEdit = (user) => {
    dispatch(selectUser(user));
  };

  const handleDelete = (user) => {
    setModal({ show: true, type: 'delete', user });
  };

  const handleModalConfirm = () => {
    if (modal.type === 'delete') {
      dispatch(deleteUser(modal.user.id));
      if (selectedUser && selectedUser.id === modal.user.id) {
        console.log('delete modal', { selectedUser }, { modal });
        dispatch(clearSelectedUser());
      }
    }
    setModal({ show: false, type: '', user: null });
  };

  const handleModalCancel = () => {
    setModal({ show: false, type: '', user: null });
  };

  const filteredUsers =
    users &&
    users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

  // Pagination logic
  const totalUsers = filteredUsers ? filteredUsers.length : 0;
  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);
  const paginatedUsers =
    filteredUsers &&
    filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <>
      {users && (
        <div className='mt-4'>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type='text'
              placeholder='Search by name or email'
              className='form-control mb-3'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingRight: search ? 32 : undefined }}
            />
            {search && (
              <button
                type='button'
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'transparent',
                  fontSize: 18,
                  color: '#888',
                  cursor: 'pointer',
                  padding: 0,
                  lineHeight: 1,
                }}
                aria-label='Clear search'
              >
                &times;
              </button>
            )}
          </div>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers && paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      navigate({
                        to: '/user/$id', // or '/user/:id' if you're using colon-style paths
                        params: { id: user.id.toString() },
                      })
                    }
                  >
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.gender}</td>
                    <td>{user.address}</td>
                    <td>
                      <button
                        className='btn btn-sm btn-info me-2'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(user);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className='btn btn-sm btn-danger'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(user);
                        }}
                        disabled={selectedUser && selectedUser.id === user.id}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className='text-center'>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav>
              <ul className='pagination justify-content-center'>
                <li
                  className={`page-item${currentPage === 1 ? ' disabled' : ''}`}
                >
                  <button
                    className='page-link'
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item${
                      currentPage === i + 1 ? ' active' : ''
                    }`}
                  >
                    <button
                      className='page-link'
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item${
                    currentPage === totalPages ? ' disabled' : ''
                  }`}
                >
                  <button
                    className='page-link'
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      )}
      {/* Custom Modal */}
      <ConfirmModal
        show={modal.show}
        type={modal.type}
        user={modal.user}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
      />
    </>
  );
};

export default UserTable;
