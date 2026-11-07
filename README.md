# Website Đăng ký Học phần - Nhóm 8
Nhập môn Công nghệ phần mềm - 2611COMP104405 - HK1 2026-2027  
Nhóm 8 - Thứ 2 ca 3  

## 1. Cấu trúc dự án
NMCNPM-N8/
- index.html : file chỉ mục
- README.md : file hướng dẫn sử dụng
- css/
    + main.css : file chứa thuộc tính CSS
- src/
    + gui/ : Giao diện, định tuyến, các trang nghiệp vụ
    + bus/ : Kiểm tra nghiệp vụ và điều phối
    + dao/ : Gọi RPC Supabase
    + dto/ : 18 DTO ánh xạ dữ liệu
    + common/ : Cấu hình kết nối, phiên đăng nhập, lỗi nghiệp vụ
- db/
    + schema.sql : 18 bảng nghiệp vụ và bảng cấu hình bảo mật
    + security.sql : RLS, quyền, nhật ký chỉ thêm, token HMAC-SHA256
    + functions.sql : Hàm đọc, đăng ký, hủy, chờ, ghi danh, quản trị, CSV
    + seed.sql : Dữ liệu mẫu


Luồng phụ thuộc:
GUI  ->  BUS  ->  DAO -> DTO -> Supabase(PostgreSQL)


- GUI không gọi DAO trực tiếp.
- DAO không chứa quy tắc nghiệp vụ.
- Mọi truy vấn dùng tham số và chỉ gọi hàm RPC đã được cấp quyền.
- DTO chuyển dữ liệu snake_case của cơ sở dữ liệu sang thuộc tính camelCase cho GUI.


## 2. Chạy giao diện

Mở trực tiếp tệp `index.html` bằng trình duyệt. Ứng dụng dùng script chạy theo một namespace toàn cục duy nhất `window.website`, cài extension Live Server. Sau khi cập nhật code nên tải lại trang để hiển thị bản mới nhất

Khi `src/common/cau-hinh.js` còn giá trị `__DIEN_...`, trang web hiển thị thông báo **“Chưa cấu hình kết nối cơ sở dữ liệu”**, khóa biểu mẫu đăng nhập và không gửi bất kỳ yêu cầu nào đến dịch vụ cơ sở dữ liệu.

---

## 3. Cấu hình cơ sở dữ liệu

### Bước 1 - Tạo bảng và bảo mật
Trong SQL Editor của Supabase, chạy lần lượt:

1. db/schema.sql
2. db/security.sql
3. db/functions.sql
4. db/seed.sql


### Bước 2 - Điền khóa ký token
Khóa ký token được đọc từ cấu hình app.bi_mat_token của cơ sở dữ liệu thông qua hàm public._khoa_ky() trong db/functions.sql. Hàm sẽ báo lỗi nếu chưa có khóa hoặc khóa ngắn hơn 32 ký tự. Đặt khóa bằng một chuỗi bí mật dài và ngẫu nhiên, chạy trong SQL Editor của Supabase:

```sql
alter database postgres set app.bi_mat_token = '<chuỗi-bí-mật-tối-thiểu-32-ký-tự>';
```

`alter database` chỉ có hiệu lực với kết nối mở sau lệnh này, nên sau khi chạy xong hãy tải lại trang đăng nhập.


### Bước 3 - Điền kết nối trong mã nguồn
Mở `src/common/cau-hinh.js` và thay đúng hai giá trị:

```js
SUPABASE_URL: "https://<ma-du-an>.supabase.co",
SUPABASE_ANON_KEY: "<anon-key>"
```

Sau khi hoàn tất ba bước, tải lại trang đăng nhập.


## 4. Tài khoản demo

| Vai trò | Tên đăng nhập | Mật khẩu |
|---|---|---|
| Phòng đào tạo | pdt.n8 | pdt12345 |
| Sinh viên | 50.01.001.001 | sv123456 |
| Sinh viên | 50.01.001.002 … 50.01.001.026 | Sv@12345 |

