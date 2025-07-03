import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { addUser, clearSelectedUser, updateUser } from '../redux/actions';
import ConfirmModal from './ConfirmModal';
const UserForm = () => {
  const userSchema = yup.object().shape({
    id: yup.string().optional(),
    name: yup.string().min(2, 'Name is required').required('Name is required'),
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: yup
      .string()
      .matches(/^\d+$/, 'Phone number must contain only digits')
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must be at most 15 digits')
      .required('Phone number is required'),
    gender: yup
      .string()
      .oneOf(['Male', 'Female'], 'Gender is required')
      .required('Gender is required'),
    address: yup
      .string()
      .min(2, 'Address is required')
      .required('Address is required'),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(userSchema),
  });
  const [pendingData, setPendingData] = useState(null);
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.selectedUser);
  const users = useSelector((state) => state.users);
  const [modal, setModal] = useState({ show: false, type: '', user: null });
  const emailValue = watch('email');
  const isEmailDuplicate = (email) => {
    if (!email) return false;
    if (selectedUser && selectedUser.email === email) return false;
    return users.some((user) => user.email === email);
  };

  useEffect(() => {
    if (selectedUser) {
      Object.keys(selectedUser).forEach((key) => {
        setValue(key, selectedUser[key]);
      });
    } else {
      // console.log('Resetting form');
      reset();
    }
  }, [selectedUser, setValue, reset]);

  const onSubmit = (data) => {
    if (isEmailDuplicate(data.email)) {
      return;
    }
    if (selectedUser) {
      setPendingData(data);
      setModal({ show: true, type: 'edit', user: selectedUser });
    } else {
      const { id, ...rest } = data;
      dispatch(addUser(rest));
      reset();
    }
  };

  const handleModalConfirm = () => {
    if (modal.type === 'edit') {
      // console.log('Updating user:', modal.user);
      dispatch(updateUser({ ...pendingData, id: selectedUser.id }));
      dispatch(clearSelectedUser());
      reset();
      setPendingData(null);
    }
    setModal({ show: false, type: '', user: null });
  };

  const handleModalCancel = () => {
    setModal({ show: false, type: '', user: null });
    setPendingData(null);
  };
  // ...existing imports and code...

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='mb-4'>
        <div
          className='container p-3 p-md-4 border rounded'
          style={{ maxWidth: 600 }}
        >
          <div className='row g-3'>
            <input {...register('id')} type='hidden' />
            <div className='col-12 col-md-6 mb-3'>
              <label htmlFor='name' className='form-label'>
                Name
              </label>
              <input
                {...register('name')}
                id='name'
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder='Enter name'
              />
              {errors.name && (
                <div className='invalid-feedback'>{errors.name.message}</div>
              )}
            </div>
            <div className='col-12 col-md-6 mb-3'>
              <label htmlFor='email' className='form-label'>
                Email
              </label>
              <input
                {...register('email')}
                type='email'
                id='email'
                className={`form-control ${
                  errors.email || isEmailDuplicate(emailValue)
                    ? 'is-invalid'
                    : ''
                }`}
                placeholder='Enter email'
              />
              {(errors.email && (
                <div className='invalid-feedback'>{errors.email.message}</div>
              )) ||
                (isEmailDuplicate(emailValue) && (
                  <div className='invalid-feedback d-block'>
                    This email is already registered.
                  </div>
                ))}
            </div>
            <div className='col-12 col-md-6 mb-3'>
              <label htmlFor='phone' className='form-label'>
                Phone
              </label>
              <input
                {...register('phone')}
                type='tel'
                id='phone'
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                placeholder='Enter phone number'
                onInput={(e) =>
                  (e.target.value = e.target.value.replace(/\D/g, ''))
                }
              />
              {errors.phone && (
                <div className='invalid-feedback'>{errors.phone.message}</div>
              )}
            </div>
            <div className='col-12 col-md-6 mb-3'>
              <label htmlFor='gender' className='form-label'>
                Gender
              </label>
              <select
                {...register('gender')}
                id='gender'
                className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
              >
                <option value=''>Select Gender</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
              </select>
              {errors.gender && (
                <div className='invalid-feedback'>{errors.gender.message}</div>
              )}
            </div>
            <div className='col-12 mb-3'>
              <label htmlFor='address' className='form-label'>
                Address
              </label>
              <textarea
                {...register('address')}
                id='address'
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                placeholder='Enter address'
                rows='3'
              ></textarea>
              {errors.address && (
                <div className='invalid-feedback'>{errors.address.message}</div>
              )}
            </div>
            <div className='col-12 d-grid gap-2 d-md-flex justify-content-md-end mb-2'>
              <button type='submit' className='btn btn-primary w-100 w-md-auto'>
                {selectedUser ? 'Update User' : 'Add User'}
              </button>
              <button
                type='reset'
                className='btn btn-secondary w-100 w-md-auto ms-md-2'
                onClick={() => {
                  dispatch(clearSelectedUser());
                  reset();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
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

export default UserForm;
