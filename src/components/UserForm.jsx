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
    firstname: yup
      .string()
      .matches(/^[A-Za-z]+$/, 'First name must contain only alphabets')
      .min(2, 'First name is required')
      .required('First name is required'),
    lastname: yup
      .string()
      .matches(/^[A-Za-z]+$/, 'Last name must contain only alphabets')
      .min(2, 'Last name is required')
      .required('Last name is required'),
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
  console.log({ selectedUser });

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
      // Split name into firstname and lastname if needed
      const [firstname = '', lastname = ''] = selectedUser?.name?.split(' ');
      setValue('firstname', firstname);
      setValue('lastname', lastname);
      Object.keys(selectedUser).forEach((key) => {
        if (key !== 'name') setValue(key, selectedUser[key]);
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
    const userData = {
      ...data,
      name: `${data.firstname} ${data.lastname}`,
    };
    if (selectedUser) {
      setPendingData(userData);
      setModal({ show: true, type: 'edit', user: selectedUser });
    } else {
      const { id, ...rest } = userData;
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
              <label htmlFor='firstname' className='form-label'>
                First Name
              </label>
              <input
                {...register('firstname')}
                id='firstname'
                className={`form-control ${
                  errors.firstname ? 'is-invalid' : ''
                }`}
                placeholder='Enter first name'
              />
              {errors.firstname && (
                <div className='invalid-feedback'>
                  {errors.firstname.message}
                </div>
              )}
            </div>
            <div className='col-12 col-md-6 mb-3'>
              <label htmlFor='lastname' className='form-label'>
                Last Name
              </label>
              <input
                {...register('lastname')}
                id='lastname'
                className={`form-control ${
                  errors.lastname ? 'is-invalid' : ''
                }`}
                placeholder='Enter last name'
              />
              {errors.lastname && (
                <div className='invalid-feedback'>
                  {errors.lastname.message}
                </div>
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
              <label className='form-label d-block'>Gender</label>
              <div>
                <div className='form-check form-check-inline'>
                  <input
                    {...register('gender')}
                    className={`form-check-input${
                      errors.gender ? ' is-invalid' : ''
                    }`}
                    type='radio'
                    id='gender-male'
                    value='Male'
                  />
                  <label className='form-check-label' htmlFor='gender-male'>
                    Male
                  </label>
                </div>
                <div className='form-check form-check-inline'>
                  <input
                    {...register('gender')}
                    className={`form-check-input${
                      errors.gender ? ' is-invalid' : ''
                    }`}
                    type='radio'
                    id='gender-female'
                    value='Female'
                  />
                  <label className='form-check-label' htmlFor='gender-female'>
                    Female
                  </label>
                </div>
                {errors.gender && (
                  <div className='invalid-feedback d-block'>
                    {errors.gender.message}
                  </div>
                )}
              </div>
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
