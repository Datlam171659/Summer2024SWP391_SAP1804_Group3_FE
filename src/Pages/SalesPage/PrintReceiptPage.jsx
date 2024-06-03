import React from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import {Link} from "react-router-dom"
function PrintReceiptPage() {
  return (
    <div className=" flex-col w-full text-center justify-center">
      <div className="mt-60">
        <CheckCircleOutlined  className="text-9xl my-8 text-green-400"/>
        <p>Thanh toán thành công</p>
        <div className="flex-col mt-9">
        <Button className="w-80 h-14 bg-black text-white uppercase font-bold">
          In hóa đơn
        </Button>
        <Link to="/sales-page">
        <Button className="w-80 h-14 bg-white text-black uppercase font-bold ml-4">
          Tạo đơn mới
        </Button>
        </Link>
        </div>
      </div>
    </div>
  );
}

export default PrintReceiptPage;
