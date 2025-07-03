import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  clearSelectedUser,
  deleteUser,
  fetchUsers,
  selectUser,
} from '../redux/actions';
import ConfirmModal from './ConfirmModal';
import { useNavigate, useMatch } from '@tanstack/react-router';
import { indexRoute } from '../router';
import SkeletonRow from './SkeletonRow';
const PAGE_SIZE = 5; // Number of users per page

const UserTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search: routeSearch } = useMatch({ from: indexRoute.id });
  // const getSafeSearchParams = () => {
  //   try {
  //     // eslint-disable-next-line react-hooks/rules-of-hooks
  //     return typeof useSearch === 'function' ? useSearch() || {} : {};
  //   } catch {
  //     return {};
  //   }
  // };
  // const searchParams = getSafeSearchParams();
  // const reduxState = useSelector((state) => state);
  // console.log('Redux State:', reduxState);
  const users = useSelector((state) => state?.users);
  const loading = useSelector((state) => state.loading);

  const selectedUser = useSelector((state) => state.selectedUser);
  const [searchInput, setSearchInput] = useState('');
  const [modal, setModal] = useState({ show: false, type: '', user: null });
  // const [currentPage, setCurrentPage] = useState(
  //   Number(searchParams.page) || 1
  // );
  const currentPage = Number(routeSearch.page) || 1;

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  console.log({ currentPage });

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
        // console.log('delete modal', { selectedUser }, { modal });
        dispatch(clearSelectedUser());
      }
    }
    setModal({ show: false, type: '', user: null });
  };

  const handleModalCancel = () => {
    setModal({ show: false, type: '', user: null });
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // Toggle direction
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const filteredUsers =
    users &&
    users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        user.email.toLowerCase().includes(searchInput.toLowerCase())
    );
  const totalPages = Math.ceil(
    (filteredUsers ? filteredUsers.length : 0) / PAGE_SIZE
  );
  const clampedPage = Math.min(currentPage, totalPages || 1);

  let sortedUsers = filteredUsers ? [...filteredUsers] : [];
  if (sortConfig.key) {
    sortedUsers.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination logic
  // const totalUsers = filteredUsers ? filteredUsers.length : 0;
  // const totalPages = Math.ceil(totalUsers / PAGE_SIZE);
  // const paginatedUsers =
  //   filteredUsers &&
  //   filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const paginatedUsers =
    sortedUsers &&
    sortedUsers.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE);

  const handlePageChange = (page) => {
    // setCurrentPage(page);
    navigate({ search: { ...routeSearch, page: page.toString() } });
  };

  // Reset to page 1 when search changes
  // useEffect(() => {
  //   setCurrentPage(Number(searchParams.page) || 1);
  // }, [searchParams.page]);

  // ...existing imports and code...

  return (
    <>
      {users && (
        <div className='mt-4'>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type='text'
              placeholder='Search by name or email'
              className='form-control mb-3'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ paddingRight: searchInput ? 32 : undefined }}
            />
            {searchInput && (
              <button
                type='button'
                onClick={() => setSearchInput('')}
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
          {/* Responsive table wrapper */}
          <div className='table-responsive'>
            <table className='table table-bordered align-middle'>
              <thead className='table-light'>
                <tr>
                  {['name', 'email', 'phone', 'gender', 'address'].map(
                    (col) => (
                      <th key={col} style={{ whiteSpace: 'nowrap' }}>
                        {col.charAt(0).toUpperCase() + col.slice(1)}
                        <button
                          type='button'
                          onClick={() => handleSort(col)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            marginLeft: 4,
                            color:
                              sortConfig.key === col &&
                              sortConfig.direction === 'asc'
                                ? 'blue'
                                : '#888',
                          }}
                          aria-label={`Sort ${col} ascending`}
                        >
                          ▲
                        </button>
                        <button
                          type='button'
                          onClick={() => handleSort(col)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            marginLeft: 2,
                            color:
                              sortConfig.key === col &&
                              sortConfig.direction === 'desc'
                                ? 'blue'
                                : '#888',
                          }}
                          aria-label={`Sort ${col} descending`}
                        >
                          ▼
                        </button>
                      </th>
                    )
                  )}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </>
                ) : paginatedUsers && paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        navigate({
                          to: '/user/$id',
                          params: { id: user.id.toString() },
                          search: { page: clampedPage },
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
                          className='btn btn-sm btn-info me-2 mb-1 mb-md-0'
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
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <nav>
              <ul className='pagination justify-content-center flex-wrap'>
                <li
                  className={`page-item${clampedPage === 1 ? ' disabled' : ''}`}
                >
                  <button
                    className='page-link'
                    onClick={() => handlePageChange(clampedPage - 1)}
                    disabled={clampedPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item${
                      clampedPage === i + 1 ? ' active' : ''
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
                    clampedPage === totalPages ? ' disabled' : ''
                  }`}
                >
                  <button
                    className='page-link'
                    onClick={() => handlePageChange(clampedPage + 1)}
                    disabled={clampedPage === totalPages}
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
