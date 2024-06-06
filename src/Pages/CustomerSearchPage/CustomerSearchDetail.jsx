import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerDetail } from '../../Features/Customer/CustomerdetailSlice'; 
function CustomerSearchDetail() {
    const dispatch = useDispatch();
  const { id } = useParams(); 
  const { customerDataDetail: customer, isError } = useSelector(state => state.customerDetail);
  useEffect(() => {
    if (id) {
      dispatch(fetchCustomerDetail(id));
    }
  }, [dispatch, id]);
console.log(customer)
  return (
    <div>
        <h1 className='text-4xl uppercase font-bold'>Trang thông tin khách hàng</h1>
        <div>
            <p className='text-2xl my-5'>Tên khách hàng:  {customer.customerName}</p>
        </div>
    </div>
  )
}

export default CustomerSearchDetail