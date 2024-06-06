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

  return (
    <div>
        <h1 className='text-4xl uppercase font-bold'>Trang thông tin khách hàng</h1>
        <div>
            <h1> Tên khách hàng :{customer.customerName}</h1>
            <p>Địa chỉ:{customer.address}</p>
            <p>Số điện thoại:{customer.phoneNumber}</p>
            <p>Email: {customer.email}</p>
        </div>
    </div>
  )
}

export default CustomerSearchDetail