const Social = require("../models/social.model");

exports.getSocialLinks = async (req, res) => {
  try {
    const socialLinks = await Social.findOne();
    res.status(200).json(socialLinks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.updateSocialLinks = async (req, res) => {
  try {
    const { facebook, zalo, instagram } = req.body;
    const socialLinks = await Social.findOneAndUpdate(
      {},
      { facebook, zalo, instagram, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.status(200).json(socialLinks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
