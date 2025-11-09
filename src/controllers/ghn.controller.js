const { GHN_TOKEN, GHN_SHOP_ID, PHONE_SHOP } = require("../../config");

exports.calcGHNShippingFee = async (req, res) => {
  const { toDistrictId, toWardCode } = req.body;

  const payload = {
    service_type_id: 2,
    to_district_id: Number(toDistrictId),
    to_ward_code: String(toWardCode),
    height: 10,
    length: 20,
    width: 15,
    weight: 1000,
  };
  try {
    const response = await fetch(
      `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Token: GHN_TOKEN,
          ShopId: GHN_SHOP_ID,
        },
        body: JSON.stringify(payload),
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createGHNOrder = async (req, res) => {
  const {
    toName,
    toPhone,
    toAddress,
    toWardCode,
    toDistrictId,
    codAmount,
    items,
    weight,
    length,
    width,
    height,
    note,
    orderCode,
  } = req.body;
  const payload = {
    payment_type_id: codAmount > 0 ? 2 : 1, // 1: Người gửi trả, 2: Người nhận trả (COD)
    note: note || "",
    required_note: "KHONGCHOXEMHANG",
    return_phone: PHONE_SHOP,
    return_address: "Yên Nội, Vạn Yên, Mê Linh, Hà Nội",
    return_district_id: Number(GHN_SHOP_ID),
    return_ward_code: "",
    client_order_code: orderCode || "", // Mã đơn hàng riêng của khách hàng
    to_name: toName,
    to_phone: toPhone,
    to_address: toAddress,
    to_ward_code: String(toWardCode),
    to_district_id: Number(toDistrictId),
    cod_amount: Number(codAmount) || 0,
    content: "Quần áo", // Nội dung hàng hóa
    weight: Number(weight) || 1000, // gram
    length: Number(length) || 20, // cm
    width: Number(width) || 15, // cm
    height: Number(height) || 10, // cm
    pick_station_id: null,
    deliver_station_id: null,
    insurance_value: Math.min(codAmount, 5000000),
    service_type_id: 2,
    coupon: null,
    pick_shift: [2],
    items: items || [
      {
        name: "Quần áo",
        code: "ITEM01",
        quantity: 1,
        price: codAmount || 0,
        length: length || 20,
        width: width || 15,
        height: height || 10,
        weight: weight || 1000,
      },
    ],
  };
  try {
    const response = await fetch(
      `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Token: GHN_TOKEN,
          ShopId: GHN_SHOP_ID,
        },
        body: JSON.stringify(payload),
      }
    );
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
