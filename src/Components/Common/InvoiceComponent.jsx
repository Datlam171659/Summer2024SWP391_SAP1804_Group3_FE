import { Table } from 'antd';
import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useSelector } from 'react-redux';

const InvoiceComponent = React.forwardRef(({ cartItems, customerInfor, cartTotalQuantity, cartTotalAmount }, ref) => {
    const buyGold24k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold24k);
    const buyGold18k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold18k);
    const buyGold14k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold14k);
    const buyGold10k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold10k);

    function getDate() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        return `${date}/${month}/${year}`;
      }
    const columns = [
        {
            title: "STT",
            dataIndex: "numericalOrder",
            key: "numericalOrder",
            width: 50,
            render: (_, __, index) => index + 1,
        },
        {
            title: "Mã Hàng",
            dataIndex: "serialNumber",
            key: "serialNumber",
            width: 120,
        },
        {
            title: "Tên Hàng",
            dataIndex: "itemName",
            key: "itemName",
            width: 150,
        },
        {
            title: "Loại Hàng",
            dataIndex: "accessoryType",
            key: "accessoryType",
            width: 100,
        },
        {
            title: "Loại Vàng",
            dataIndex: "goldType",
            key: "goldType",
            width: 100,
            render: (_, record) => {
                let goldType = "";
                if (record.itemName.toLowerCase().includes("10k")) {
                    goldType = "10K";
                } else if (record.itemName.toLowerCase().includes("14k")) {
                    goldType = "14K";
                } else if (record.itemName.toLowerCase().includes("18k")) {
                    goldType = "18K";
                } else if (record.itemName.toLowerCase().includes("24k")) {
                    goldType = "24K";
                }
                return goldType;
            },
        },
        {
            title: "Số Lượng",
            dataIndex: "itemQuantity",
            key: "itemQuantity",
            width: 100,
            render: (_, record) => (
                <div className="flex items-center">
                    <span className="mx-2">{record.itemQuantity}</span>
                </div>
            ),
        },
        {
            title: "Trọng Lượng",
            dataIndex: "weight",
            key: "weight",
            width: 100,
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            width: 120,
            render: (_, record) => {
                let goldType = "";
                if (record.itemName.toLowerCase().includes("10k")) {
                    goldType = "10K";
                } else if (record.itemName.toLowerCase().includes("14k")) {
                    goldType = "14K";
                } else if (record.itemName.toLowerCase().includes("18k")) {
                    goldType = "18K";
                } else if (record.itemName.toLowerCase().includes("24k")) {
                    goldType = "24K";
                }

                let kara;
                switch (goldType) {
                    case "10K":
                        kara = buyGold10k;
                        break;
                    case "14K":
                        kara = buyGold14k;
                        break;
                    case "18K":
                        kara = buyGold18k;
                        break;
                    case "24K":
                        kara = buyGold24k;
                        break;
                    default:
                        kara = 0;
                }

                const totalPrice = record.weight * record.itemQuantity * kara;
                return `${Number(totalPrice.toFixed(0)).toLocaleString()}đ`;
            },
        }
    ];

    return (
        <div ref={ref} className="p-8">
            <h2 className="text-2xl font-bold text-center mb-4">HÓA ĐƠN MUA HÀNG</h2>
            <ul className="text-base mb-2">
                <li className="text-sm font-semibold">Khách hàng: {customerInfor.customerName}</li>
                <li className="text-sm font-semibold">Email: {customerInfor.email}</li>
                <li className="text-sm font-semibold">Địa chỉ: {customerInfor.address}</li>
                <li className="text-sm font-semibold">Sđt: {customerInfor.phoneNumber}</li>
                <li className="text-sm font-semibold">Ngày: {getDate()}</li>
            </ul>
            <div className="cart-items flex flex-col items-center space-y-8 w-full ">
                <Table
                    dataSource={cartItems}
                    columns={columns}
                    rowKey="itemId"
                    pagination={false}
                    className="w-full rounded-[5px] font-medium"
                />
            </div>
            <div className='w-full flex justify-end  mt-6'>
                <div className='w-1/4'>
                    <p className="w-full flex justify-between text-md font-semibold"><span className='font-semibold mr-4'>Số lượng:</span> <span>{cartTotalQuantity}</span></p>
                    <p className="w-full flex justify-between text-md font-semibold"><span className='font-semibold mr-4'>Tổng tiền:</span> <span> {cartTotalAmount.toLocaleString()}đ</span></p>
                </div>
            </div>


        </div>
    );
});

export default InvoiceComponent;