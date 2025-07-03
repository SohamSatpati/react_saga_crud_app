import React from 'react';

const SkeletonRow = () => {
  return (
    <tr>
      <td colSpan={6}>
        <div className='d-flex gap-2'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='bg-secondary bg-opacity-25 rounded'
              style={{
                height: 24,
                flex: 1,
                animation: 'skeleton 1.2s infinite linear alternate',
              }}
            />
          ))}
        </div>
      </td>
    </tr>
  );
};

export default SkeletonRow;
