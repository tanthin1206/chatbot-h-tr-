# Khoảng Thở — Web App Hỗ Trợ Phản Tư & Giảm Căng Thẳng Học Đường

> **Tuyên ngôn trải nghiệm:**  
> *“Ghi nhận điều bạn đang cảm thấy. Cùng nhìn lại trước khi bạn nói hoặc hành động.”*

Ứng dụng web chat-first giúp học sinh kể chuyện, được lắng nghe và chủ động chọn cách nhận hỗ trợ:
- **Nguyên tắc an toàn tâm lý (Trauma-Informed & NVC):** Không phán xét đúng-sai, không chẩn đoán y khoa, không mặc định bênh vực phụ huynh, không phủ nhận cảm xúc của thanh thiếu niên.
- **Phân luồng an toàn trẻ em (Safety First):** Tự động phát hiện nguy cơ bạo lực hoặc tự hại để dẫn trực tiếp đến **Tổng đài Quốc gia Bảo vệ Trẻ em 111**.
- **Riêng tư tuyệt đối (Privacy First & Local First):** Không cần đăng nhập, không lưu trữ từ xa, dữ liệu chỉ nằm trong bộ nhớ trình duyệt của máy người dùng và có nút **"Xóa phiên ngay"** tức thì.
- **Hệ thống chuyển đổi đa chế độ (Dual-Mode):** Gọi Gemini an toàn qua backend và tự chuyển sang bộ phản tư ngoại tuyến khi dịch vụ không khả dụng.
- **Hội thoại nhiều lượt với Mây:** Chọn giữa lắng nghe, hiểu tình huống, nhận lời khuyên, chuẩn bị đối thoại hoặc bình tĩnh trước.
- **Lời khuyên có thể hành động:** Mỗi gợi ý có lý do, bước đầu tiên và lưu ý an toàn; phản hồi thông thường chỉ đặt một câu hỏi.

---

## 📱 Toàn bộ luồng màn hình đã triển khai

| Màn hình | Tên màn hình | Chức năng chính |
| :--- | :--- | :--- |
| **0** | Chờ khởi động | Vòng tròn thở êm dịu, thông điệp nhịp thở chậm, nút *Vào ngay*, cam kết không cần tên thật. |
| **1** | Giới thiệu & Cam kết | 3 cam kết bảo mật (không danh tính, không gửi cho ai, toàn quyền xóa), giới hạn phạm vi. |
| **2** | Đo cảm xúc đầu vào | Thang trượt 1-10, chọn tối đa 3 thẻ cảm xúc, cảnh báo tế nhị khi điểm 9-10. |
| **3** | Không gian xả khí | Soạn thảo tự do, đếm ký tự, chế độ tập trung toàn màn hình, gợi ý câu hỏi khi bí từ. |
| **4** | Xác nhận phân tích | Minh bạch vai trò của AI, cam kết không dán nhãn, tùy chọn chỉ lưu trên máy. |
| **5** | Đang phân tích | Trải nghiệm chờ nhẹ nhàng với vòng tròn thở, 4 giai đoạn tiến trình, nút hủy. |
| **6** | Kết quả phản tư | **7 Thẻ cấu trúc:** Điều mình nghe được (có phản hồi), Sự việc vs Diễn giải, Từ ngữ cần xem lại, Câu hỏi gợi mở, Góc nhìn khác, Nhu cầu cốt lõi, Câu nói NVC đề xuất. |
| **7** | Trình soạn câu đối thoại | Khung giao tiếp NVC (*Khi... Con thấy... Vì con cần... Con mong...*), 4 chế độ (SMS, Nói trực tiếp, Thư tay, Nhờ người lớn). |
| **8** | Chọn hành động tiếp theo | 6 lựa chọn, tích hợp **đồng hồ hít thở 60 giây**, hướng dẫn tìm người lớn đáng tin cậy. |
| **9** | Đo cảm xúc đầu ra | Thang 1-10 so sánh trước/sau, phản hồi thấu cảm (không dùng điểm thưởng gamification). |
| **10** | Kết thúc phiên | Tùy chọn: Xóa toàn bộ ngay, Chỉ lưu câu đối thoại, Lưu bản nháp, Bắt đầu phiên mới. |
| **Đặc biệt** | Hỗ trợ an toàn | Ưu tiên kích hoạt khi có nguy cơ bạo lực/tự hại: Nút gọi **Tổng đài 111**, 113, 115, chỉ dẫn an toàn. |

---

## 🚀 Hướng dẫn khởi chạy

### 1. Cài đặt thư viện
```bash
npm install
```

### 2. Cấu hình Gemini ở máy chủ

Sao chép `.env.example` thành `.env`, sau đó đặt khóa API:

```env
GEMINI_API_KEY=your_server_side_api_key
GEMINI_MODEL=gemini-3.5-flash
PORT=8787
```

Không đặt khóa trong mã frontend hoặc biến môi trường có tiền tố `VITE_`.

Để chạy thử nhanh, bạn cũng có thể mở **Cài đặt & Quyền riêng tư** trong ứng dụng và dán API key trực tiếp. Khóa này chỉ được giữ trong `sessionStorage` của tab hiện tại. Đây là chế độ dành cho máy cá nhân; khóa vẫn có thể nhìn thấy bằng DevTools nên không phù hợp với website công khai.

### 3. Chạy môi trường phát triển (Development)
```bash
npm run dev
```

Lệnh này khởi động đồng thời Vite và API tại cổng `8787`. Nếu chưa cấu hình Gemini, ứng dụng vẫn hoạt động bằng bộ phân tích ngoại tuyến.

### 4. Đóng gói và chạy bản phát hành
```bash
npm run build
npm start
```

### 5. Chạy kiểm thử lõi

```bash
npm test
```

## Cấu trúc lõi

- `server/index.js`: API backend, rate limit, gọi Gemini và phục vụ bản production.
- `server/core.js`: kiểm tra nguy cơ, che dữ liệu cá nhân và kiểm tra schema đầu ra.
- `server/prompt.js`: rào chắn prompt dành cho nội dung học sinh.
- `src/services/analyzer.ts`: API client và fallback ngoại tuyến.

Nội dung khẩn cấp được chặn trước khi gọi Gemini. Email, số điện thoại và tài khoản mạng xã hội phổ biến được che trước khi gửi sang mô hình. Đầu ra Gemini phải vượt qua schema phía máy chủ trước khi được trả về giao diện.
