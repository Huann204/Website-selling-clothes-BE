const Subcategory = require("../models/subcategory.model");
const slugify = require("slugify");
// GET danh mục con
exports.getAllSubcategories = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) {
      filter.category = category;
    }
    const subcategories = await Subcategory.find(filter).sort({
      createdAt: -1,
    });
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// CREATE danh mục con
exports.createSubcategory = async (req, res) => {
  try {
    const { name, category, status } = req.body;
    const slug = slugify(`${name}-${category}`, {
      lower: true,
      strict: true,
    });
    const existed = await Subcategory.findOne({ slug });
    if (existed) {
      return res.status(409).json({
        message: "Danh mục này đã tồn tại trong nhóm đã chọn",
      });
    }
    const subcategory = await Subcategory.create({
      name,
      category,
      status,
      slug,
    });
    res.status(201).json(subcategory);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// UPDATE danh mục con
exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, status } = req.body;

    const slug = slugify(`${name}-${category}`, {
      lower: true,
      strict: true,
    });

    // check trùng (trừ chính nó)
    const existed = await Subcategory.findOne({
      slug,
      _id: { $ne: id },
    });

    if (existed) {
      return res.status(409).json({
        message: "Danh mục này đã tồn tại trong nhóm đã chọn",
      });
    }

    const subcategory = await Subcategory.findByIdAndUpdate(
      id,
      { name, category, status, slug },
      { new: true },
    );

    if (!subcategory) {
      return res.status(404).json({ message: "Danh mục con không tồn tại" });
    }

    res.status(200).json(subcategory);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
