const Product = require("../models/product.model");
const config = require("../../config");
exports.chatBot = async (req, res) => {
  try {
    const { messages } = req.body;

    const products = await Product.find().lean();
    const productsWithLink = products.map((p) => ({
      ...p,
      link: `http://localhost:5173/Detail/${p._id}`,
    }));
    const productList = JSON.stringify(productsWithLink, null, 2);

    if (!messages || messages.length === 0) {
      return res.status(400).json({ reply: "Không có tin nhắn nào gửi lên." });
    }

    // convert messages từ FE sang format Gemini
    const contents = messages.map((msg) => ({
      role: msg.from === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // thêm system prompt ở đầu
    contents.unshift({
      role: "model",
      parts: [
        {
          text: `Bạn là chatbot hỗ trợ khách hàng của Huan Store – cửa hàng thời trang trực tuyến.  
                Nhiệm vụ của bạn là tư vấn sản phẩm, hướng dẫn mua hàng, và giải đáp thắc mắc của khách.  
                Dưới đây là dữ liệu sản phẩm ở dạng JSON. Hãy sử dụng đúng dữ liệu này để trả lời khách:  
                ${productList}  
                Yêu cầu khi trả lời:  
                1. Luôn nhắc đến **tên sản phẩm** và **giá bán**.  
                2. Khi gợi ý sản phẩm, trả lời theo format rõ ràng, thân thiện, dễ click:  
                - Tên sản phẩm (giá)  
                👉 [Xem chi tiết](link)  
                3. Luôn cung cấp link đúng để khách hàng bấm vào xem chi tiết sản phẩm trên website.  
                4. Không bao giờ trả về link thô.  
                5. Trả lời ngắn gọn, tự nhiên, giống hội thoại chat nhưng vẫn đảm bảo có từ khóa liên quan đến sản phẩm và Huan Store.  
                6. Không được tự ý thêm link ngoài luồng.   
`,
        },
      ],
    });

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
        config.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      return res.status(500).json({
        reply: "Gemini không trả lời, hãy kiểm tra lại API key hoặc quota.",
      });
    }

    res.json({ reply });
  } catch (err) {
    console.error("Lỗi Gemini:", err);
  }
};
