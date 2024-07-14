import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPromotions, approvePromotion, removePromotion, rejectPromotion } from '../../Features/Promotion/promotionallSlice';
import { Button, message, Table, Modal } from "antd";
import { DeleteOutlined } from '@ant-design/icons';

function Promotion() {
  const dispatch = useDispatch();
  const promotions = useSelector((state) => state.promotions.promotions);
  const promotionStatus = useSelector((state) => state.promotions.status);
  const error = useSelector((state) => state.promotions.error);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromotionForDelete, setSelectedPromotionForDelete] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const isLoadingPromotion = useSelector(
    (state) => state.promotions.isLoadingPromotion
  );
  useEffect(() => {
    if (promotionStatus === 'idle' ) {
      dispatch(fetchPromotions());
    }
  }, [promotionStatus, dispatch]);

  const handleApprove = async () => {
    if (selectedPromotion) {
      try {
        await dispatch(approvePromotion(selectedPromotion.id)).unwrap();
        setTimeout(() => {
          message.success('Promotion approved successfully');
        }, 500);
        setIsModalOpen(false);
        dispatch(fetchPromotions()); 
      } catch (err) {
        message.error('Failed to approve promotion');
      }
    }
  };

  const handleReject = async () => {
    if (selectedPromotion) {
      try {
        await dispatch(rejectPromotion(selectedPromotion)).unwrap();
        setTimeout(() => {
          message.success('Promotion rejected successfully');
        }, 500);
        setIsRejectModalOpen(false);
        dispatch(fetchPromotions());
      } catch (err) {
        message.error('Failed to reject promotion');
      }
    }
  };

  const showPromotionModal = (promotion) => {
    setSelectedPromotion(promotion);
    setIsModalOpen(true);
  };

  const handleApproveCancel = () => {
    setIsModalOpen(false);
    setSelectedPromotion(null);
  };

  const showDeleteModal = (id) => {
    setSelectedPromotionForDelete(id);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedPromotionForDelete(null);
  };

  const showRejectModal = (id) => {
    setSelectedPromotion(id);
    setIsRejectModalOpen(true);
  };
  
  const handleRejectCancel = () => {
    setIsRejectModalOpen(false);
    setSelectedPromotion(null);
  };

  const showDeleteAllModal = () => {
    setIsDeleteAllModalOpen(true);
  };

  const handleDeleteAllCancel = () => {
    setIsDeleteAllModalOpen(false);
  };

  const handleDeleteAll = async () => {
    try {
      for (const promotion of promotions) {
        await dispatch(removePromotion(promotion.id));
      }
      setTimeout(() => {
        message.success('Đã xóa tất cả khuyến mãi thành công');
      }, 500);
      setIsDeleteModalOpen(false);
      setIsDeleteAllModalOpen(false); 
    } catch (err) {
      message.error('Failed to delete promotions');
    }
  };

  const handleDelete = async (id) => {
    if (selectedPromotionForDelete) {
    await dispatch(removePromotion(selectedPromotionForDelete));
    message.success('Đã xóa khuyến mãi thành công');
    setIsDeleteModalOpen(false); 
  }
  };
  console.log(selectedPromotionForDelete)
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã discount",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Phần trăm",
      dataIndex: "discountPct",
      key: "discountPct",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = 'red';
        if(status === 'Duyệt') {
            color = 'green';
        } else if (status === 'Chờ duyệt') {
            color = 'red';
        }
        return <span style={{color}}>{status}</span>;
      },
    },
    {
      title: "Nội dung",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => showPromotionModal(record)}
            className="text-blue-500 hover:text-red-700 transition duration-200"
            disabled={record.status === 'Duyệt' || record.status === 'Từ Chối'}
          >
            Duyệt
          </Button>
          <Button
          onClick={() => showRejectModal(record.id)}
          className="text-blue-500 hover:text-red-700 transition duration-200"
          disabled={record.status === 'Duyệt' || record.status === 'Từ Chối'}
        >
          Không Duyệt
        </Button>
          <DeleteOutlined
          onClick={() => showDeleteModal(record.id)}
          style={{ color: 'red', fontSize: '17px', cursor: 'pointer', marginLeft: '15px' }}
        />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 flex-col justify-center align-middle w-full mt-10">
      <Button
        onClick={showDeleteAllModal} 
        type="primary"
        className="mb-4"
      >
        Xóa tất cả khuyến mãi
      </Button>
      <Table
        dataSource={promotions}
        columns={columns}
        rowKey="id"
        pagination={{ position: ["bottomCenter"] }}
        loading={isLoadingPromotion}
        className="w-full"
      />
      <Modal
        title="Xác nhận duyệt khuyến mãi"
        visible={isModalOpen}
        onOk={handleApprove}
        onCancel={handleApproveCancel}
        footer={
          <div className="text-right">
            <Button onClick={handleApproveCancel} className="mr-3">
              Hủy
            </Button>
            <Button onClick={handleApprove} type="primary">
              Xác nhận
            </Button>
          </div>
        }
      >
        <p>Bạn có chắc muốn duyệt khuyến mãi này không?</p>
        {selectedPromotion && (
          <div>
            <p>Mã discount: {selectedPromotion.id}</p>
            <p>Phần trăm: {selectedPromotion.discountPct}%</p>
            <p>Trạng thái: {selectedPromotion.status}</p>
          </div>
        )}
      </Modal>

        <Modal
        title="Xác nhận không duyệt khuyến mãi"
        visible={isRejectModalOpen}
        onOk={handleReject}
        onCancel={handleRejectCancel}
        style= {{ top: '50%', transform: 'translateY(-50%)' }}
        footer={
          <div className="text-right">
            <Button onClick={handleRejectCancel} className="mr-3">
              Hủy
            </Button>
            <Button onClick={handleReject} type="primary">
              Xác nhận
            </Button>
          </div>
        }
      >
        <p>Bạn có chắc muốn không duyệt khuyến mãi này không?</p>
      </Modal>

      <Modal
          title="Xác nhận xóa khuyến mãi"
          visible={isDeleteModalOpen}
          onOk={handleDelete}
          onCancel={handleDeleteCancel}
          style= {{ top: '50%', transform: 'translateY(-50%)' }}
          footer={[
            <Button key="back" onClick={handleDeleteCancel}>
              Hủy
            </Button>,
            <Button key="submit" type="primary" onClick={handleDelete}>
              Xác nhận
            </Button>,
          ]}
        >
          <p>Bạn có xác nhận xóa khuyến mãi này không?</p>
      </Modal>
      <Modal
        title="Xác nhận xóa tất cả khuyến mãi"
        visible={isDeleteAllModalOpen}
        onOk={handleDeleteAll} 
        onCancel={handleDeleteAllCancel}
        style={{ top: '50%', transform: 'translateY(-50%)' }}
        footer={[
          <Button key="back" onClick={handleDeleteAllCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleDeleteAll}>
            Xác nhận
          </Button>,
        ]}
      >
        <p>Bạn có chắc muốn xóa tất cả khuyến mãi không?</p>
      </Modal>
    </div>
  );
}

export default Promotion;
