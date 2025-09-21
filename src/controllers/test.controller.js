const test = require("../models/testApi");

exports.getAllTest = async (req, res) => {
  try {
    const allTests = await test.find(); // Lấy tất cả bản ghi từ collection "test"
    res.status(200).json({ allTests }); // Trả về dữ liệu với mã trạng thái 200
  } catch (error) {
    res.status(500).json({
      // Nếu có lỗi, trả về mã lỗi 500 và thông báo
      message: "Lỗi khi lấy dữ liệu",
      error: error.message,
    });
  }
};

exports.createTest = async (req, res) => {
  try {
    const newTest = new test(req.body);
    await newTest.save();
    res.status(201).json(newTest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTest = await test.findByIdAndDelete(id);

    if (!deletedTest) {
      return res.status(404).json({ message: "Không tìm thấy bản ghi để xóa" });
    }

    res.status(200).json({ message: "Xóa thành công", data: deletedTest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
