import React from 'react';
import 'tailwindcss/tailwind.css';
import { Table } from 'antd';
const WarrantyComponent = React.forwardRef(({cartItems, customerInfor }, ref) => {
    // Function to add 3 months to the current date
    const addMonths = (date, months) => {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + months);
        return newDate;
    };
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
            title: "Thời gian bảo hành",
            dataIndex: "Thời gian bảo hành",
            key: "Thời gian bảo hành",
            width: 100,
            render: (_, record) => {
                const itemName = record.itemName ? record.itemName : '';
                let warrantyMessage = 'Không bảo hành';
         
                if (itemName.includes('Vàng')) {
                    warrantyMessage = 'Bảo hành 10 tháng';
                } else if (itemName.includes('kim cương')) {
                    warrantyMessage = 'Bảo hành 1 năm';
                }
        
                return (
                    <div className="flex items-center">
                        {warrantyMessage}
                    </div>
                );
            },
        },
    ];

    // Get the current date
    const currentDate = new Date();
    const warrantyEndDate = addMonths(currentDate, 3);
    // Format the dates
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDateString = currentDate.toLocaleDateString('vi-VN', options);
    const warrantyEndDateString = warrantyEndDate.toLocaleDateString('vi-VN', options);

    return (
        <div ref={ref} className="p-8">
            <h2 className="text-2xl font-bold text-center mb-4">GIẤY BẢO HÀNH</h2>
            <ul className="text-base mb-2">
                <li className="text-sm font-semibold">Khách hàng: {customerInfor.customerName}</li>
                <li className="text-sm font-semibold">Địa chỉ: {customerInfor.address}</li>
                <li className="text-sm font-semibold">Sđt: {customerInfor.phoneNumber}</li>
            </ul>
            <div>
            <Table
                    dataSource={cartItems}
                    columns={columns}
                    rowKey="itemId"
                    pagination={false}
                    className="w-full rounded-[5px] font-medium"
                />
            </div>
            <div className='w-full flex justify-end mt-6'>
                <div className='w-1/4'>
                    <p className="w-full flex justify-between text-md font-semibold"><span className='font-semibold mr-3'>Ngày mua:</span> <span>{currentDateString}</span></p>
                </div>
            </div>
        </div>
    );
});

export default WarrantyComponent;