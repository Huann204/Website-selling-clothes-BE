const { GHN_TOKEN } = require("../../config");

exports.getGHNProvinces = async (req, res) => {
  try {
    const response = await fetch(
      `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`,
      {
        headers: {
          "Content-Type": "application/json",
          Token: GHN_TOKEN,
        },
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getGHNDistricts = async (req, res) => {
  try {
    const { provinceId } = req.body;
    const response = await fetch(
      "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district",

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Token: GHN_TOKEN,
        },
        body: JSON.stringify({ province_id: provinceId }),
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getGHNWards = async (req, res) => {
  try {
    const { districtId } = req.body;
    const response = await fetch(
      "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Token: GHN_TOKEN,
        },
        body: JSON.stringify({ district_id: districtId }),
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
