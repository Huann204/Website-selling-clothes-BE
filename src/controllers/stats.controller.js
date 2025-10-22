const Order = require("../models/order.model");
const Product = require("../models/product.model");

// Thống kê sản phẩm đã bán
exports.getSoldProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0; // nếu không truyền thì lấy tất cả

    const orders = await Order.find({ status: "delivered" }).populate(
      "items.productId"
    );

    const sold = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const id = item.productId._id;
        if (!sold[id]) {
          sold[id] = {
            productId: id,
            title: item.productId.title,
            image: item.productId.thumbnail,
            price: item.productId.price,
            totalSold: 0,
            revenue: 0,
          };
        }
        sold[id].totalSold += item.qty;
        sold[id].revenue += item.productId.price * item.qty;
      });
    });

    // Sắp xếp theo số lượng bán giảm dần
    let result = Object.values(sold).sort((a, b) => b.totalSold - a.totalSold);

    // Giới hạn số lượng kết quả nếu có limit
    if (limit > 0) {
      result = result.slice(0, limit);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sold products" });
  }
};

// top thể loại bán chạy nhất
exports.getTopCategories = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const orders = await Order.find({ status: "delivered" }).populate(
      "items.productId"
    );

    const sold = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const subcategory = item.productId.subcategory;

        if (!sold[subcategory]) {
          sold[subcategory] = {
            subcategory,
            totalSold: 0,
            revenue: 0,
          };
        }
        sold[subcategory].totalSold += item.qty;
        sold[subcategory].revenue += item.productId.price * item.qty;
      });
    });

    // Sắp xếp theo số lượng bán giảm dần
    let result = Object.values(sold).sort((a, b) => b.totalSold - a.totalSold);

    // Giới hạn số lượng kết quả nếu có limit
    if (limit > 0) {
      result = result.slice(0, limit);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching top categories" });
  }
};

// exports.getTopSoldProducts = async (req, res) => {
//   try {
//     const topProducts = await Order.aggregate([
//       { $match: { status: "delivered" } }, // chỉ tính đơn giao thành công
//       { $unwind: "$items" }, // tách từng sản phẩm trong mảng items
//       {
//         $group: {
//           _id: "$items.productId",
//           totalSold: { $sum: "$items.qty" },
//         },
//       },
//       { $sort: { totalSold: -1 } },
//       { $limit: 5 },
//       {
//         $lookup: {
//           from: "products", // tên collection sản phẩm
//           localField: "_id",
//           foreignField: "_id",
//           as: "product",
//         },
//       },
//       { $unwind: "$product" },
//       {
//         $project: {
//           _id: 0,
//           productId: "$product._id",
//           title: "$product.title",
//           image: "$product.thumbnail",
//           price: "$product.price",
//           revenue: { $multiply: ["$product.price", "$totalSold"] },
//           totalSold: 1,
//         },
//       },
//     ]);

//     res.json(topProducts);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error fetching top sold products" });
//   }
// };

exports.getTopSoldProducts = async (req, res) => {
  try {
    const orders = await Order.find({ status: "delivered" }).populate(
      "items.productId"
    );

    const sold = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const id = item.productId._id;
        if (!sold[id]) {
          sold[id] = {
            product: item.productId,
            totalSold: 0,
          };
        }
        sold[id].totalSold += item.qty;
        sold[id].revenue = item.productId.price * sold[id].totalSold;
        sold[id].image = item.productId.thumbnail;
        sold[id].title = item.productId.title;
        sold[id].price = item.productId.price;
      });
    });

    // chuyển object thành mảng
    const result = Object.values(sold);

    // sắp xếp giảm dần theo số lượng bán
    result.sort((a, b) => b.totalSold - a.totalSold);

    // chỉ lấy top 5
    const top5 = result.slice(0, 5);

    res.json(top5);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching top sold products" });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const total = await Order.countDocuments();
    const delivered = await Order.countDocuments({ status: "delivered" });
    const pending = await Order.countDocuments({ status: "pending" });
    const confirmed = await Order.countDocuments({ status: "confirmed" });
    const shipped = await Order.countDocuments({ status: "shipped" });
    const cancelled = await Order.countDocuments({ status: "cancelled" });

    res.json({
      total,
      delivered,
      pending,
      confirmed,
      shipped,
      cancelled,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

//Thống kê doanh thu số lượng đơn hàng 10 tháng gần nhất chi tiết từng tháng
exports.getMonthlyStats = async (req, res) => {
  try {
    const now = new Date();
    const tenMonthsAgo = new Date();
    tenMonthsAgo.setMonth(now.getMonth() - 9); // lấy 10 tháng gần nhất (tính cả tháng hiện tại)

    // Lấy toàn bộ đơn hàng trong 10 tháng qua
    const orders = await Order.find({
      status: "delivered",
      createdAt: { $gte: tenMonthsAgo },
    });

    const stats = {};

    // Gom theo tháng bằng vòng lặp JS thuần
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getMonth() + 1} `;
      if (!stats[monthKey]) {
        stats[monthKey] = {
          month: monthKey,
          totalOrders: 0,
          totalRevenue: 0,
        };
      }

      stats[monthKey].totalOrders += 1;
      stats[monthKey].totalRevenue += order.grandTotal || 0;
    });

    const result = Object.values(stats).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    res.json(result);
  } catch (err) {
    console.error("Lỗi thống kê:", err);
    res.status(500).json({ message: "Lỗi khi thống kê đơn hàng" });
  }
};

//Thống kê tổng doanh thu, đơn hàng, sản phẩm hiện có
exports.getStatsAll = async (req, res) => {
  try {
    // Lấy toàn bộ đơn hàng giao thành công
    const orders = await Order.find({ status: "delivered" }).populate(
      "items.productId"
    );

    // Lấy tổng số sản phẩm đang có
    const products = await Product.find();

    let totalOrders = 0;
    let totalRevenue = 0;

    // Duyệt từng đơn để cộng dồn
    orders.forEach((order) => {
      totalOrders += 1;
      totalRevenue += order.grandTotal || 0;
    });

    // Tổng số sản phẩm (hoặc có thể lọc chỉ sản phẩm đang bán)
    const totalProducts = products.length;

    // Gộp tất cả vào object kết quả
    const stats = {
      totalOrders,
      totalRevenue,
      totalProducts,
    };

    res.json(stats);
  } catch (err) {
    console.error("Lỗi khi thống kê tổng quan:", err);
    res.status(500).json({ message: "Lỗi khi thống kê tổng quan" });
  }
};
exports.getOverviewStats = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentYear = now.getFullYear();
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Mốc thời gian đầu-cuối tháng
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const endOfCurrentMonth = new Date(
      currentYear,
      currentMonth + 1,
      0,
      23,
      59,
      59
    );
    const startOfPreviousMonth = new Date(previousYear, previousMonth, 1);
    const endOfPreviousMonth = new Date(
      currentYear,
      currentMonth,
      0,
      23,
      59,
      59
    );

    // Lấy đơn hàng tháng hiện tại và tháng trước
    const currentOrders = await Order.find({
      status: "delivered",
      createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
    });

    const previousOrders = await Order.find({
      status: "delivered",
      createdAt: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
    });

    // Doanh thu
    const totalRevenue = currentOrders.reduce(
      (sum, o) => sum + (o.grandTotal || 0),
      0
    );
    const previousRevenue = previousOrders.reduce(
      (sum, o) => sum + (o.grandTotal || 0),
      0
    );

    //Đơn hàng
    const totalOrders = currentOrders.length;
    const previousOrdersCount = previousOrders.length;

    //Sản phẩm
    const totalProducts = await Product.countDocuments();
    const previousProducts = totalProducts - Math.floor(totalProducts * 0.05); // ví dụ giả định tăng 5%

    //Hàm tính tăng trưởng (%)
    const calcGrowth = (current, previous) => {
      if (previous === 0) return 100;
      return (((current - previous) / previous) * 100).toFixed(1);
    };

    const stats = {
      totalRevenue,
      revenueGrowth: calcGrowth(totalRevenue, previousRevenue),
      totalOrders,
      ordersGrowth: calcGrowth(totalOrders, previousOrdersCount),
      totalProducts,
      productsGrowth: calcGrowth(totalProducts, previousProducts),
    };

    res.json(stats);
  } catch (err) {
    console.error("Lỗi khi thống kê tổng quan:", err);
    res.status(500).json({ message: "Lỗi khi thống kê tổng quan" });
  }
};
