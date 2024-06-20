import { useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerDetail } from '../../Features/Customer/CustomerdetailSlice';
import { fetchAllInvoice } from '../../Features/Invoice/fullinvoiceSlice';
import { fetchRewardAll } from '../../Features/Customer/rewardallSlice';
import { Tabs, Table } from 'antd';

function CustomerSearchDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { customerDataDetail: customer, isError, loading: customerLoading } = useSelector(state => state.customerDetail);
  const { allInvoice, loading: invoicesLoading } = useSelector(state => state.invoicefull);
  const { rewardsallData, loading: rewardsLoading } = useSelector(state => state.rewardsAll);

  const onChange = (key) => {
    console.log(key);
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchCustomerDetail(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchAllInvoice());
    dispatch(fetchRewardAll());
  }, [dispatch]);

  const customerInvoices = allInvoice ? allInvoice.filter(invoice => invoice.customerId === id) : [];
  const totalInvoices = customerInvoices.length;

  const columns = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên công ty',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'buyerAddress',
      key: 'buyerAddress',
    },
    {
      title: 'Hình thức thanh toán',
      dataIndex: 'paymentType',
      key: 'paymentType',
    },
  ];

  const calculateRewardLevel = (points) => {
    if (points >= 1000) return 'Vũ Trụ';
    if (points >= 100) return 'Kim Cương';
    if (points >= 50) return 'Vàng';
    if (points >= 10) return 'Bạc';
    return 'Chưa xếp hạng';
  };

  const customerRewards = rewardsallData ? rewardsallData.filter(reward => reward.customerId === id) : [];
  const hasRewards = customerRewards.length > 0;
console.log(customerRewards)
  const items = [
    {
      key: '1',
      label: 'Hóa đơn',
      children: (
        <Table 
          columns={columns} 
          dataSource={customerInvoices} 
          loading={invoicesLoading}
          rowKey="id"
        />
      ),
    },
    {
      key: '2',
      label: 'Điểm',
      children: (
        <div>
          {rewardsLoading ? (
            <p>Đợi chút.....</p>
          ) : hasRewards ? (
            <div>
              <h2 className='text-2xl font-bold'>Điểm của khách hàng</h2>
              <ul>
                {customerRewards.map((reward) => (
                  <li key={reward.id} className='text-xl mt-5'>

{console.log(reward.pointsTotal)}
                    {customer && customer.customerName}: {reward.pointsTotal} điểm ({calculateRewardLevel(reward.pointsTotal)})
                  </li>
                
                ))}
              </ul>
            </div>
          ) : (
            <p>Bạn chưa có điểm. Hãy mua hàng để tích điểm!</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className='m-6 flex-col justify-center align-middle mx-8'>
      <h1 className='text-4xl uppercase font-bold'>Trang thông tin khách hàng</h1>
      <div className='mt-8 flex'>
        <div className='bg-white px-32 pt-2 rounded-lg shadow-md w-full ml-7 flex justify-center'>
          <div>
            {customerLoading ? (
              <p>Đợi chút.....</p>
            ) : customer ? (
              <>
                <div className='flex w-[500%] mt-5 mr-'>
                  <h1 className='mr-6 text-xl font-bold uppercase'>Tên:</h1>
                  <p className='text-lg'>{customer.customerName}</p>
                </div>
                <div className='flex w-[500%] mt-3'>
                  <h1 className='mr-6 text-xl font-bold uppercase'>Số điện thoại:</h1>
                  <p className='text-lg'>{customer.phoneNumber}</p>
                </div>
              </>
            ) : (
              <p>Không tìm thấy thông tin khách hàng.</p>
            )}
          </div>
        </div>
        <div className='bg-white px-32 py-10 pt-2 rounded-lg shadow-md w-[500%] ml-7 flex justify-center'>
          <div className='flex-col w-full'>
            <h2 className='text-2xl font-bold uppercase'>Hóa đơn</h2>
            {invoicesLoading ? (
              <p>Đợi chút.....</p>
            ) : (
              <div className='flex w-[200%] mt-7'>
                <p className='mr-5 text-lg'>Tổng đơn hàng: </p>
                <p className='text-lg'>{totalInvoices}</p>
              </div>
            )}
          </div>
        </div>
        <div className='bg-white px-32 pt-2 rounded-lg shadow-md w-[500%] ml-7 flex justify-center'>
          <div className='flex-col'>
            <p className='text-2xl font-bold uppercase'>Địa chỉ</p>
            {customerLoading ? (
              <p>Đợi chút.....</p>
            ) : customer ? (
              <p className='mt-8 text-lg'>{customer.address}</p>
            ) : (
              <p>Không tìm thấy địa chỉ.</p>
            )}
          </div>
        </div>
      </div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}

export default CustomerSearchDetail;
