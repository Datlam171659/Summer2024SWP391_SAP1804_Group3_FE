import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPromotions, approvePromotion } from '../../Features/Promotion/promotionallSlice';
import { Button, message, Table, Modal } from "antd";

function Promotion() {
  const dispatch = useDispatch();
  const promotions = useSelector((state) => state.promotions.promotions);
  const promotionStatus = useSelector((state) => state.promotions.status);
  const error = useSelector((state) => state.promotions.error);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        message.success('Promotion approved successfully');
        setIsModalOpen(false);
        dispatch(fetchPromotions());
      } catch (err) {
        message.error('Failed to approve promotion');
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

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã discount",
      dataIndex: "code",
      key: "code",
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
          <button
            onClick={() => showPromotionModal(record)}
            className="text-red-500 hover:text-red-700 transition duration-200"
          >
            Duyệt
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 flex-col justify-center align-middle w-full mt-10">
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
            <p>Mã discount: {selectedPromotion.code}</p>
            <p>Phần trăm: {selectedPromotion.discountPct}%</p>
            <p>Trạng thái: {selectedPromotion.status}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Promotion;
