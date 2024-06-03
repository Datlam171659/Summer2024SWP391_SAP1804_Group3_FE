import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { addBuyPrice, addSellPrice, resetBuyPrice, resetSellPrice } from '../Features/goldTransaction/goldTransactionSlice';
import getVNDExchangeRate from '../Services/api/exchangeRateApi';
import getGoldExchangeRate from '../Services/api/goldApi';

function Authentication({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [dataFetched, setDataFetched] = useState(false);

    const authenticate = async () => {
        const token = localStorage.getItem("token");

        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (currentTime > decodedToken.exp) {
                localStorage.clear();
                navigate("/login");
            } else {
                // Lưu role vào localStorage dựa trên giá trị của decodedToken.role
                switch (decodedToken.role) {
                    case "0":
                        localStorage.setItem("role", "admin");
                        break;
                    case "1":
                        localStorage.setItem("role", "manager");
                        break;
                    case "2":
                        localStorage.setItem("role", "staff");
                        break;
                    default:
                        console.log("Role not recognized");
                }

                localStorage.setItem("nameid", decodedToken.nameid);
                localStorage.setItem("email", decodedToken.email);
                localStorage.setItem("UserName", decodedToken.UserName);

                if (!dataFetched) {
                    try {
                        dispatch(resetBuyPrice());
                        dispatch(resetSellPrice());

                        const vndRate = await getVNDExchangeRate();
                        const goldPrice = await getGoldExchangeRate();
                        const goldPriceInVND = (goldPrice * vndRate) / 8.29;
                        const buyPrice = goldPriceInVND * 1.02;

                        const buyGold24k = parseFloat(buyPrice);
                        const buyGold18k = buyGold24k * 0.75;
                        const buyGold14k = buyGold24k * 0.583;
                        const buyGold10k = buyGold24k * 0.417;

                        const buyPriceObject = {
                            buyGold24k: buyGold24k.toFixed(0),
                            buyGold18k: buyGold18k.toFixed(0),
                            buyGold14k: buyGold14k.toFixed(0),
                            buyGold10k: buyGold10k.toFixed(0),
                        };

                        const sellPrice = goldPriceInVND * 1.05;

                        const sellGold24k = parseFloat(sellPrice);
                        const sellGold18k = buyGold24k * 0.75;
                        const sellGold14k = buyGold24k * 0.583;
                        const sellGold10k = buyGold24k * 0.417;

                        const sellPriceObject = {
                            sellGold24k: sellGold24k.toFixed(0),
                            sellGold18k: sellGold18k.toFixed(0),
                            sellGold14k: sellGold14k.toFixed(0),
                            sellGold10k: sellGold10k.toFixed(0),
                        };

                        dispatch(addBuyPrice(buyPriceObject));
                        dispatch(addSellPrice(sellPriceObject));
                        setDataFetched(true); // Mark data as fetched

                    } catch (error) {
                        console.error("Error fetching exchange rates or calculating prices:", error);
                    }
                }

                if (location.pathname !== "" || location.pathname !== "/") {
                    navigate(location.pathname);
                } else {
                    navigate("/");
                }
            }
        } else {
            navigate("/login");
        }
    };

    const shouldRender = useRef(true);
    useEffect(() => {
        if (shouldRender.current) {
            shouldRender.current = false;
            authenticate();
        }
    }, []);

    return (
        children
    );
}

export default Authentication;