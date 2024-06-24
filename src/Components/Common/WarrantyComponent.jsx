import React from 'react';
import 'tailwindcss/tailwind.css';

const WarrantyComponent = React.forwardRef(({ customerInfor }, ref) => {
    // Function to add 3 months to the current date
    const addMonths = (date, months) => {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + months);
        return newDate;
    };

    // Get the current date
    const currentDate = new Date();
    // Calculate the warranty end date by adding 3 months to the current date
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
                
            </div>
            <div className='w-full flex justify-end mt-6'>
                <div className='w-1/4'>
                    <p className="w-full flex justify-between text-md font-semibold"><span className='font-semibold mr-3'>Ngày mua:</span> <span>{currentDateString}</span></p>
                    <p className="w-full flex justify-between text-md font-semibold"><span className='font-semibold mr-4'>Ngày hết hạn bảo hành:</span> <span>{warrantyEndDateString}</span></p>
                </div>
            </div>
        </div>
    );
});

export default WarrantyComponent;