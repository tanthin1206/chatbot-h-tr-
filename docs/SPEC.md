# Kế hoạch UX/UI hoàn chỉnh — Web App “Khoảng Thở”

## 1. Định hướng sản phẩm

### Mục tiêu
Tạo một không gian riêng tư giúp học sinh:
- Ghi nhận mức độ cảm xúc hiện tại.
- Viết ra những suy nghĩ đang dồn nén.
- Nhận diện cách diễn đạt tuyệt đối hoặc gán nhãn.
- Nhìn sự việc từ nhiều góc độ mà không bị phủ nhận cảm xúc.
- Chuyển lời buộc tội thành lời nói có thể đối thoại.
- Biết tìm sự hỗ trợ khi tình huống không an toàn.

### Tuyên bố trải nghiệm
> “Viết điều bạn đang cảm thấy. Cùng nhìn lại trước khi bạn nói hoặc hành động.”

### Nguyên tắc thiết kế
- Riêng tư trước tiên.
- Không phán xét đúng–sai.
- Không chẩn đoán tâm lý.
- Không mặc định bênh cha mẹ.
- Không biến trải nghiệm thành bài kiểm tra.
- Mobile-first.
- Một phiên sử dụng kéo dài khoảng 3–7 phút.

---

## 2. Luồng người dùng tổng thể
```text
Mở ứng dụng
     ↓
Màn hình 0: Chờ khởi động (Hít thở & Ẩn danh)
     ↓
Màn hình 1: Giới thiệu và quyền riêng tư
     ↓
Màn hình 2: Đo cảm xúc đầu vào (Thang 1-10 & Thẻ cảm xúc)
     ↓
Màn hình 3: Không gian xả khí (Ghi chép tự do, đếm từ, gợi ý gợi mở)
     ↓
Kiểm tra an toàn:
     ├── Bình thường → Màn hình 4 (Xác nhận phân tích) → Màn hình 5 (Đang phân tích)
     ├── Cần hỗ trợ → Phân tích giới hạn + gợi ý tìm người tin tưởng
     └── Khẩn cấp → Màn hình đặc biệt: Hỗ trợ an toàn (111)
     ↓
Màn hình 6: Kết quả phản tư (7 thẻ phân tích có thể phản hồi)
     ↓
Màn hình 7: Trình soạn câu đối thoại (Mô hình NVC: Khi... Con thấy... Vì con cần... Con mong...)
     ↓
Màn hình 8: Chọn hành động tiếp theo (Thở 60s, Lưu câu, Chuẩn bị trò chuyện, Tìm người lớn tin cậy)
     ↓
Màn hình 9: Đo cảm xúc đầu ra (So sánh trước/sau)
     ↓
Màn hình 10: Kết thúc và xóa/lưu bản nháp
```

---

## 3. Hệ thống thiết kế (Design System)
- **Màu sắc:**
  - Xanh lam dịu (`#3B82F6` / `#E0F2FE`): Bình tĩnh, thấu hiểu.
  - Tím lavender (`#8B5CF6` / `#F3E8FF`): Riêng tư, chữa lành.
  - Nền kem sáng (`#FAF8F5`): Dịu mắt, không chói lóa.
  - Xanh ngọc an toàn (`#10B981` / `#D1FAE5`).
  - Đỏ khẩn cấp (`#EF4444`): Chỉ dùng cho nguy hiểm / an toàn trẻ em.
- **Typography:** Be Vietnam Pro / Inter.
- **Tone of voice:** Đồng cảm, trung lập, tôn trọng, không hạ thấp cảm xúc, không bênh vực mù quáng.
