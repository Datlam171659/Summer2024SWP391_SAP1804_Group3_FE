import { useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerDetail } from '../../Features/Customer/CustomerdetailSlice';
import { fetchAllInvoice } from '../../Features/Invoice/fullinvoiceSlice';

function CustomerSearchDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { customerDataDetail: customer, isError } = useSelector(state => state.customerDetail);
  const { allInvoice, loading: invoicesLoading } = useSelector(state => state.invoicefull);

  useEffect(() => {
    if (id) {
      dispatch(fetchCustomerDetail(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchAllInvoice());
  }, [dispatch]);

  const customerInvoices = allInvoice ? allInvoice.filter(invoice => invoice.customerId === id) : [];
  const totalInvoices = customerInvoices.length;

  return (
    <div className='m-6'>
      <h1 className='text-4xl uppercase font-bold'>Trang thông tin khách hàng</h1>
      <div className='mt-5 flex'>
        <div className='bg-white p-6 pt-2 rounded-lg shadow-md w-[49%] ml-7 flex justify-center'>
          <div>
            {customer ? (
              <>
                <h1>{customer.customerName}</h1>
                <p>{customer.phoneNumber}</p>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        <div className='bg-white p-6 pt-2 rounded-lg shadow-md w-[49%] ml-7 flex justify-center'>
          <div>
            <h2 className='text-2xl font-bold'>Invoices</h2>
            {invoicesLoading ? (
              <p>Loading invoices...</p>
            ) : (
              <p>Total number of invoices: {totalInvoices}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerSearchDetail;
