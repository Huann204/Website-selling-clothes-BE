const Order = require("../models/order.model");

// 1. Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0; // nếu không truyền thì lấy tất cả
    let orders = await Order.find().populate("items.productId");
    //đơn hàng mới nhất lên đầu
    orders.sort((a, b) => b.createdAt - a.createdAt);
    if (limit > 0) {
      orders = orders.slice(0, limit);
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 2. Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 3. Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    order.status = status;
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 4. Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 5. Lấy đơn hàng theo ID
const mongoose = require("mongoose");

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const order = await Order.findById(id).populate("items.productId");

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Lỗi getOrderById:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 6. Lấy đơn hàng theo userId
exports.getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ "customer.id": userId }).populate(
      "items.productId"
    );
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 7. Thống kê doanh thu theo ngày
exports.getRevenueStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const orders = await Order.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
    const revenue = orders.reduce((acc, order) => acc + order.total, 0);
    res.status(200).json({ revenue });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 8. Thống kê số lượng đơn hàng theo trạng thái
exports.getOrderStatusStats = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 9. Thống kê sản phẩm bán chạy nhất
exports.getTopSellingProducts = async (req, res) => {
  try {
    const products = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// sửa đơn hàng
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const order = await Order.findByIdAndUpdate(id, updatedData, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
//Lấy đơn hàng theo phone
exports.getOrderByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const order = await Order.findOne({ "customer.phone": phone }).populate(
      "items.productId"
    );
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
