var website = window.website = window.website || {};
website.trang = website.trang || {};

(function () {
  "use strict";

async function chuongTrinhDaoTao(hoSo) {
  const danhSach = await new website.bus.BusHocPhan().ctdtCuaSinhVien();
  return {
    tieuDe: "Chương trình đào tạo",
    noiDung: `
      <section class="card">
        <div class="card-header">
          <h2 class="card-title">Học phần theo chương trình</h2>
          <span class="muted">${website.gui.esc(hoSo.maCtdt)}</span>
        </div>
        <div class="card-body tight">
          ${website.gui.bang([
            { ten: "Học kỳ dự kiến", lop: "num" },
            { ten: "Mã học phần" },
            { ten: "Học phần" },
            { ten: "Tín chỉ", lop: "num" },
            { ten: "Kết quả" }
          ], danhSach.map((x) => [
            website.gui.esc(x.hoc_ky_du_kien || ""),
            website.gui.esc(x.ma_hp),
            website.gui.esc(x.ten_hp),
            website.gui.esc(x.so_tin_chi),
            x.da_dat ? '<span class="tag tag-ok">Đã đạt</span>' : ""
          ]))}
        </div>
      </section>
    `
  };
}

async function thoiKhoaBieu() {
  const lich = await new website.bus.BusTKB().thoiKhoaBieu();
  const bangLich = new website.bus.BusTKB().taoBang(lich);
  const cacThu = [2, 3, 4, 5, 6, 7, 8];

  return {
    tieuDe: "Thời khóa biểu",
    noiDung: `
      <section class="card">
        <div class="card-header"><h2 class="card-title">Lịch học theo tuần</h2></div>
        <div class="card-body">
          <div class="tuan">
            ${cacThu.map((thu) => `
              <div class="ngay">
                <div class="ngay-ten">${website.gui.tenThu(thu)}</div>
                ${bangLich[thu].length ? bangLich[thu].map((b) => `
                  <div class="buoi">
                    <strong>${website.gui.esc(b.tenHp)}</strong>
                    <span>${website.gui.esc(b.maLop)}</span>
                    <span>Tiết ${website.gui.esc(b.tiet_bat_dau)}-${website.gui.esc(b.tiet_ket_thuc)}</span>
                    <span>${website.gui.esc(b.phongHoc)}</span>
                    <span>${website.gui.esc(b.giangVien)}</span>
                  </div>
                `).join("") : '<p class="muted">Trống</p>'}
              </div>
            `).join("")}
          </div>
        </div>
      </section>
    `
  };
}

async function lichSuThaoTac(hoSo) {
  const danhSach = await new website.bus.BusLichSu().danhSach();
  return {
    tieuDe: "Lịch sử thao tác",
    noiDung: `
      <section class="card">
        <div class="card-header">
          <h2 class="card-title">${hoSo.vaiTro === "PDT" ? "Toàn bộ thao tác" : "Thao tác của bạn"}</h2>
          <span class="muted">${danhSach.length} dòng gần nhất</span>
        </div>
        <div class="card-body tight">
          ${website.gui.bang([
            { ten: "Thời gian" },
            { ten: "Thao tác" },
            { ten: "Kết quả" },
            { ten: "Người thực hiện" },
            { ten: "Sinh viên" },
            { ten: "Lớp" },
            { ten: "Lý do" }
          ], danhSach.map((x) => [
            website.gui.thoiGian(x.website.gui.thoiGian),
            website.gui.esc(x.loaiThaoTac),
            x.ketQua === "ThanhCong" ? '<span class="tag tag-ok">Thành công</span>' : '<span class="tag tag-off">Từ chối</span>',
            website.gui.esc(x.tenDangNhap),
            website.gui.esc(x.maSv),
            website.gui.esc(x.maLop),
            website.gui.esc(x.lyDo)
          ]))}
        </div>
      </section>
    `
  };
}

async function troGiup() {
  return {
    tieuDe: "Trợ giúp",
    noiDung: `
      <section class="card">
        <div class="card-header"><h2 class="card-title">Hướng dẫn sử dụng</h2></div>
        <div class="card-body help">
          <h3>Đăng nhập</h3>
          <p>Dùng tên đăng nhập và mật khẩu do Phòng đào tạo cấp. Phiên đăng nhập có hiệu lực 2 giờ.</p>
          <h3>Đổi mật khẩu</h3>
          <p>Mật khẩu mới phải có ít nhất 8 ký tự. Sau khi đổi, phiên hiện tại vẫn dùng được đến khi hết hạn.</p>
          <h3>Đăng ký học phần</h3>
          <p>Mở danh sách lớp đang mở, thêm lớp vào danh sách tạm, kiểm tra cảnh báo trùng lịch rồi xác nhận. Hệ thống kiểm tra lại toàn bộ điều kiện khi xác nhận.</p>
          <h3>Ghi danh học phần</h3>
          <p>Nhóm có yêu cầu ghi danh phải ghi danh học phần trước khi đăng ký lớp.</p>
          <h3>Danh sách chờ</h3>
          <p>Khi lớp đầy, sinh viên có thể vào danh sách chờ. Người đầu tiên được xác nhận khi lớp có chỗ và phải đáp ứng đủ điều kiện đăng ký.</p>
          <h3>Thời khóa biểu</h3>
          <p>Chỉ hiển thị các lớp đang có hiệu lực.</p>
          <h3>Liên hệ</h3>
          <p>Phòng đào tạo hỗ trợ tài khoản bị khóa và các vấn đề dữ liệu học vụ.</p>
        </div>
      </section>
    `
  };
}

  website.trang.chuongTrinhDaoTao = chuongTrinhDaoTao;
  website.trang.thoiKhoaBieu = thoiKhoaBieu;
  website.trang.lichSuThaoTac = lichSuThaoTac;
  website.trang.troGiup = troGiup;
})();
