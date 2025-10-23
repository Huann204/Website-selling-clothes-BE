const Contact = require("../models/contact.model");
exports.getContactInfo = async (req, res) => {
  try {
    const contactInfo = await Contact.findOne();
    res.status(200).json(contactInfo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.updateContactInfo = async (req, res) => {
  try {
    const { name, email, phone, address, description } = req.body;
    const updatedInfo = await Contact.findOneAndUpdate(
      {},
      { name, email, phone, address, description, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.status(200).json(updatedInfo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
