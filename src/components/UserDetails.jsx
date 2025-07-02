import React, { useEffect, useState } from 'react';
import { useMatch } from '@tanstack/react-router';
import { getUserById } from '../api/userApi'; // Renamed for clarity
import { useNavigate } from '@tanstack/react-router';
import { detailRoute } from '../router';
const UserDetails = () => {
  const { params } = useMatch({ from: detailRoute.id });
  const navigate = useNavigate();
  console.log(params.id);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUserById(params.id)
      .then((response) => {
        console.log('User details:', response);
        setUser(response);
      })
      .catch((error) => {
        setError('Error fetching user details');
        console.error('Error fetching user details:', error);
      });
  }, [params.id]);

  if (error) {
    return <div>{error}</div>;
  }
  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className='container mt-4 p-4 border rounded'>
        <button
          className='btn btn-secondary mb-3'
          onClick={() =>
            navigate({
              to: '/',
            })
          }
        >
          &larr; Back
        </button>
        <h4>{user.name}</h4>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>Gender: {user.gender}</p>
        <p>Address: {user.address}</p>
      </div>
    </>
  );
};

export default UserDetails;
