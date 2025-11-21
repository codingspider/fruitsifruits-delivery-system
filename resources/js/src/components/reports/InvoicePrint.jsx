import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import api from "../../axios";
import { useCurrencyFormatter } from "../../useCurrencyFormatter"; 

export default function InvoicePrint({ id, mode = "A4", onClose }) {
    const [invoice, setInvoice] = useState(null);
    const componentRef = useRef();
    const { formatAmount, currency } = useCurrencyFormatter(); 

    const getSellDetails = async () => {
        try {
            const res = await api.get(`superadmin/get/sell/details/${id}`);
            setInvoice(res.data.data || []);
            console.log(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getSellDetails();
    }, [id]);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: "Report",
    });

    if (!invoice) return <p>Loading Invoice…</p>;

    const containerStyles = {
        A4: {
            width: "210mm",
            minHeight: "297mm",
            padding: "20mm",
            background: "#fff",
            fontSize: "14px",
        },
        THERMAL: {
            width: "80mm",
            padding: "5mm",
            background: "#fff",
            fontSize: "12px",
        }
    };

    return (
        <div>
            {/* Trigger Print */}
            <button
                onClick={handlePrint}
                style={{
                    padding: "8px 16px",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    marginBottom: "10px",
                    cursor: "pointer"
                }}
            >
                Print Invoice
            </button>

            {/* Printable Area */}
            <div ref={componentRef} style={containerStyles[mode]}>

                {/* Business Header */}
                <h2 style={{ margin: 0, textAlign: "center", fontSize: "14px", fontWeight: "bold" }}>
                    {invoice.setting?.name}
                </h2>
                <p style={{ textAlign: "center", margin: 0 }}>
                    Address: {invoice.setting?.address}
                </p>
                <p style={{ textAlign: "center", marginBottom: "10px" }}>
                    Phone: {invoice.setting?.phone}
                </p>

                <hr />
                

                {/* Invoice Info */}
                <p><strong>Invoice No:</strong> {invoice.reference_no}</p>
                <p><strong>Date:</strong> {moment(invoice.date).format("DD MMM YYYY")}</p>
                <p><strong>Customer:</strong> {invoice.location?.name}</p>

                <hr />

                {/* Table: Sell Lines */}
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left" }}>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        {invoice.sell_lines.map((line, index) => (
                            <tr key={index}>
                                <td>{line.flavor.name}</td>
                                <td style={{ textAlign: "center" }}>{line.to_be_filled}</td>
                                <td style={{ textAlign: "center" }}>{formatAmount(line.price)}</td>
                                <td style={{ textAlign: "center" }}>{formatAmount(line.sub_total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <hr />

                {/* Totals */}
                <div style={{ textAlign: "center" }}>
                    <p><strong>Subtotal:</strong> {formatAmount(invoice.sell.subtotal)}</p>
                    <p><strong>Tax:</strong> {formatAmount(invoice.sell.tax)}</p>
                    <p><strong>Final Total:</strong> {formatAmount(invoice.sell.subtotal + invoice.sell.tax)}</p>
                </div>

                {/* {mode === "A4" && (
                    <div style={{ marginTop: "40px" }}>
                        <p>Customer Signature: _____________________</p>
                    </div>
                )} */}

                <p style={{ textAlign: "center", marginTop: "15px" }}>
                    Thank you for your purchase!
                </p>
            </div>
        </div>
    );
}
