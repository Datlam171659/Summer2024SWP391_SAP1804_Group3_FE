import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLatestInvoice } from "../../Features/Invoice/allinvoiceSlice";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { clearCart, getTotals } from "../../Features/product/cartSlice";
import { fetchCustomerDetail } from "../../Features/Customer/CustomerdetailSlice";
import { fetchLatestWarranty } from "../../Features/Warranty/warrantyallSlice";

const PrintReceiptPage = () => {
  const dispatch = useDispatch();
  const { latestInvoice, status, error } = useSelector(
    (state) => state.invoice
  );
  const { customerDataDetail, isLoadingCustomerDetail, isError } = useSelector(
    (state) => state.customerDetail
  );
  const { latestWarranty , status: warrantyStatus, error: warrantyError } = useSelector(
    (state) => state.warrantyall
  );
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchLatestInvoice());
    dispatch(fetchLatestWarranty());
  }, [dispatch]);

  useEffect(() => {
    if (latestInvoice && latestInvoice.customerId) {
      dispatch(fetchCustomerDetail(latestInvoice.customerId));
    }
  }, [latestInvoice, dispatch]);

  console.log("invoice", latestInvoice);
  console.log("latestWarranty", latestWarranty); // Log the latestWarranty to debug

  const handleClearCart = () => {
    dispatch(clearCart());
    dispatch(getTotals());
  };

  console.log(customerDataDetail);

  const handlePrint = () => {
    if (!latestInvoice) return;

    const tableRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph("Product")],
            width: { size: 20, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph("Brand")],
            width: { size: 20, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph("Type")],
            width: { size: 20, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph("Price")],
            width: { size: 20, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph("Quantity")],
            width: { size: 20, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      ...cart.cartItems.map(
        (item) =>
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph(item.itemId)],
                width: { size: 20, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph(item.brandId)],
                width: { size: 20, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph(item.accessoryType)],
                width: { size: 20, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph(item.price.toString())],
                width: { size: 20, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph(item.cartQuantity.toString())],
                width: { size: 20, type: WidthType.PERCENTAGE },
              }),
            ],
          })
      ),
    ];

    const invoiceDoc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Hóa đơn bán hàng",
                  bold: true,
                  size: 32,
                }),
              ],
            }),
            new Paragraph({ children: [] }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Invoice ID: ${latestInvoice.id}`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({ children: [] }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Tên Công Ty: SWJ`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({ children: [] }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Tên khách hàng: ${customerDataDetail.customerName}`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({ children: [] }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Số điện thoại: ${customerDataDetail.phoneNumber}`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({ children: [] }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Địa chỉ: ${customerDataDetail.address}`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({ children: [] }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Phương thức thanh toán: ${latestInvoice.paymentType}`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({ children: [] }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Giảm giá: ${cart.discount} %`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({ children: [] }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Tổng: ${latestInvoice.subTotal} $`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({ children: [] }),
            new Table({
              rows: tableRows,
            }),
          ],
        },
      ],
    });

    const warrantyDoc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Phiếu bảo hành",
                  bold: true,
                  size: 32,
                }),
              ],
            }),
            new Paragraph({ children: [] }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Tên Công Ty: SWJ`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({ children: [] }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Địa chỉ công ty: Võ văn ngân, thành phố thủ đức`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({ children: [] }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Khách hàng: ${customerDataDetail.customerName}`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({ children: [] }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Ngày hết bảo hành: ${latestWarranty.expiryDateValue}`,
                  size: 24,
                }),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(invoiceDoc).then((blob) => {
      saveAs(blob, "invoice.docx");
    });

    Packer.toBlob(warrantyDoc).then((blob) => {
      saveAs(blob, "warranty.docx");
    });
  };

  if (status === "loading" || isLoadingCustomerDetail || warrantyStatus === "loading") {
    return <div>Chờ một chút...</div>;
  }

  if (error || isError || warrantyError) {
    return <div>Lỗi: {error || isError || warrantyError}</div>;
  }

  return (
    <div className=" justify-center align-middle text-center w-full">
      {latestInvoice ? (
        <div className="flex flex-col items-center justify-center w-full text-center">
          <div className="mt-60 ">
            <CheckCircleOutlined className="text-9xl my-8 text-green-400" />
            <p>Thanh toán thành công</p>
            <div className="flex flex-row mt-9">
              <Button
                className="w-80 h-14 bg-black text-white uppercase font-bold"
                onClick={handlePrint}
              >
                In hóa đơn
              </Button>
              <Link to="/sales-page">
                <Button
                  className="w-80 h-14 bg-white text-black uppercase font-bold ml-4"
                  onClick={handleClearCart}
                >
                  Tạo đơn mới
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div>Không có hóa đơn nào</div>
      )}
    </div>
  );
};

export default PrintReceiptPage;
