const Product = require("../models/product.model");

// 1. Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      tag,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    // xử lý category → gender
    if (category) {
      if (category === "for-her") {
        filter.gender = { $in: ["her", "unisex"] };
      } else if (category === "for-him") {
        filter.gender = { $in: ["him", "unisex"] };
      }
    }
    if (tag) {
      filter.tags = tag;
    }
    if (subcategory) {
      filter.subcategory = subcategory;
    }
    let query = Product.find(filter);
    if (sort === "newest") {
      query = query.sort({ createdAt: -1 }); // mới nhất trước
    }
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    return res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
      products,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 2. Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 4. Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 5. Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    res.json({ message: "Đã xóa sản phẩm" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);

    const products = await Product.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { origin: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
        { "variants.color.name": { $regex: q, $options: "i" } },
      ],
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
