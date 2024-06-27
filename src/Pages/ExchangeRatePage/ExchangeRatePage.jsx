import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import './ExchangeRatePage.scss';

const ExchangeRatePage = () => {
    const { buyPrice, sellPrice } = useSelector((state) => state.goldPrice);
    const tableRef = useRef(null);

    const goldPrice = buyPrice.map((buyItem, index) => ({
        ...buyItem,
        ...sellPrice[index],
    }));

    const handleFullScreen = () => {
        const element = tableRef.current;
        if (element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) { /* Firefox */
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) { /* IE/Edge */
                element.msRequestFullscreen();
            }
        } else {
            console.error('Element is null');
        }
    };

    return (
        <div className="w-11/12 mt-10 block justify-center mx-auto">
            <h2 className="w-full text-center text-2xl font-semibold">Giá Vàng Hôm Nay</h2>
            <div className="button-container w-full flex justify-center mt-9">
                <button className="full-screen-button" onClick={handleFullScreen}>Toàn màn hình</button>
            </div>
            <div ref={tableRef} className="table-container w-full flex justify-center mt-9">
                <table className="gold-price-table w-4/5 text-center border-collapse border border-black">
                    <thead>
                        <tr>
                            <th className="py-3 text-lg bg-[#1e1e28] text-white">Loại vàng</th>
                            <th className="py-3 text-lg bg-[#1e1e28] text-white">Giá Mua (đ)</th>
                            <th className="py-3 text-lg bg-[#1e1e28] text-white">Giá Bán (đ)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {goldPrice.map((item, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td className="py-4 text-base font-medium">Vàng 24K</td>
                                    <td className="py-4 text-base font-medium">{Number(item.buyGold24k).toLocaleString()}</td>
                                    <td className="py-4 text-base font-medium">{Number(item.sellGold24k).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td className="py-4 text-base font-medium">Vàng 18K</td>
                                    <td className="py-4 text-base font-medium">{Number(item.buyGold18k).toLocaleString()}</td>
                                    <td className="py-4 text-base font-medium">{Number(item.sellGold18k).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td className="py-4 text-base font-medium">Vàng 14K</td>
                                    <td className="py-4 text-base font-medium">{Number(item.buyGold14k).toLocaleString()}</td>
                                    <td className="py-4 text-base font-medium">{Number(item.sellGold14k).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td className="py-4 text-base font-medium">Vàng 10K</td>
                                    <td className="py-4 text-base font-medium">{Number(item.buyGold10k).toLocaleString()}</td>
                                    <td className="py-4 text-base font-medium">{Number(item.sellGold10k).toLocaleString()}</td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExchangeRatePage;
