const {
  TMN_CODE,
  HASH_SECRET,
  API_URL,
  API_URL_CLIENT,
} = require("../../config");
const { VNPay, ignoreLogger } = require("vnpay");
const Order = require("../models/order.model");
exports.createPaymentUrl = async (req, res) => {
  try {
    const query = req.body;
    const vnpay = new VNPay({
      //Cấu hình bắt buộc
      tmnCode: TMN_CODE,
      secureSecret: HASH_SECRET,
      vnpayHost: "https://sandbox.vnpayment.vn",

      // Cấu hình tùy chọn
      testMode: true, // Chế độ test
      hashAlgorithm: "SHA512", // Thuật toán mã hóa
      enableLog: true, // Bật/tắt log
      loggerFn: ignoreLogger, // Custom logger

      // 🔧 Custom endpoints
      endpoints: {
        paymentEndpoint: "paymentv2/vpcpay.html",
        queryDrRefundEndpoint: "merchant_webapi/api/transaction",
        getBankListEndpoint: "qrpayauth/api/merchant/get_bank_list",
      },
    });
    const paymentUrl = await vnpay.buildPaymentUrl({
      vnp_Amount: query.amount,
      vnp_IpAddr: "192.168.1.1",
      vnp_ReturnUrl: `${API_URL}/api/pay/return`,
      vnp_TxnRef: query.orderId,
      vnp_OrderInfo: query.orderInfo,
    });
    res.json({ paymentUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.handleReturn = async (req, res) => {
  const query = req.query;
  const vnp_ResponseCode = query.vnp_ResponseCode;
  const orderId = query.vnp_TxnRef;
  if (vnp_ResponseCode === "00") {
    await Order.findByIdAndUpdate(orderId, { "payment.status": "paid" });
    return res.redirect(`${API_URL_CLIENT}/order-success/${orderId}`);
  } else {
    await Order.findByIdAndUpdate(orderId, { "payment.status": "failed" });
    return res.redirect(`${API_URL_CLIENT}/order-failed/${orderId}`);
  }
};
