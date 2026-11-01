var website = window.website = window.website || {};
website.trang = website.trang || {};

(function () {
  "use strict";

async function trangChinhPdt(hoSo) {
  const [thongKe, lichSu] = await Promise.all([
    new website.bus.BusTaiKhoan().thongKe(),
    new website.bus.BusLichSu().danhSach()
  ]);
  const the = [
    ["Tài khoản", thongKe.sinh_vien, "tai-khoan"],
    ["Học phần", thongKe.hoc_phan, "quan-ly-hoc-phan"],
    ["Lớp học phần", thongKe.lop, "quan-ly-lop-hoc-phan"],
    ["Đăng ký hiệu lực", thongKe.dang_ky, "quan-ly-lop-hoc-phan"],
    ["Đợt đang mở", thongKe.dot_mo, "cau-hinh-dot-dang-ky"],
    ["Đang chờ", thongKe.cho, "quan-ly-lop-hoc-phan"]
  ].map(([nhan, so, duong]) => `
    <a class="stat" href="#/${duong}">
      <span class="stat-label">${website.gui.esc(nhan)}</span>
      <span class="stat-value">${website.gui.esc(so)}</span>
    </a>
  `).join("");

  const dongLog = (lichSu || []).slice(0, 8).map((x) => `
    <tr>
      <td>${website.gui.thoiGian(x.thoiGian)}</td>
      <td>${website.gui.esc(website.gui.tenLoaiThaoTac(x.loaiThaoTac))}</td>
      <td>${website.gui.esc(x.tenDangNhap)}</td>
      <td>${website.gui.esc(website.gui.tenKetQua(x.ketQua))}</td>
      <td>${website.gui.esc(x.lyDo)}</td>
    </tr>
  `);

  return {
    tieuDe: "Tổng quan Phòng đào tạo",
    noiDung: `
      <p class="page-sub">Xin chào ${website.gui.esc(hoSo.hoTen || hoSo.tenDangNhap)}.</p>
      <div class="stats">${the}</div>
      <section class="card">
        <div class="card-header">
          <h2 class="card-title">Thao tác gần đây</h2>
          <a class="link" href="#/lich-su-thao-tac">Xem tất cả</a>
        </div>
        <div class="card-body tight">
          <div class="table-scroll">
            <table class="data">
              <thead><tr><th>Thời gian</th><th>Thao tác</th><th>Người thực hiện</th><th>Kết quả</th><th>Lý do</th></tr></thead>
              <tbody>${dongLog.join("") || '<tr><td colspan="5" class="trong">Chưa có thao tác</td></tr>'}</tbody>
            </table>
          </div>
        </div>
      </section>
    `
  };
}

async function trangChinhSv(hoSo) {
  const [daDangKy, tkb, dots, cho] = await Promise.all([
    new website.bus.BusDangKy().hocPhanDaDangKy(),
    new website.bus.BusTKB().thoiKhoaBieu(),
    new website.bus.BusDotDangKy().dotCuaSinhVien(),
    new website.bus.BusDanhSachCho().danhSach()
  ]);
  const coThongBaoCho = (cho || []).filter((x) => x.conCho);
  const hieuLuc = (daDangKy || []).filter((x) => x.trangThai === "HieuLuc");
  const tinChi = hieuLuc.reduce((tong, x) => tong + Number(x.soTinChi || 0), 0);
  const homNay = new Date().getDay() === 0 ? 8 : new Date().getDay() + 1;
  const homNayLich = (tkb || []).filter((x) => Number(x.thu) === homNay);

  return {
    tieuDe: "Tổng quan Sinh viên",
    noiDung: `
      <p class="page-sub">${website.gui.esc(hoSo.hoTen)} · ${website.gui.esc(hoSo.maSv)} · ${website.gui.esc(hoSo.tenNhom || hoSo.maNhom)}</p>
      ${coThongBaoCho.length ? coThongBaoCho.map((x) => `
        <div class="alert alert-success">
          Lớp <strong>${website.gui.esc(x.maLop)} - ${website.gui.esc(x.tenHp)}</strong> bạn đang chờ đã có chỗ trống (bạn xếp vị trí ${website.gui.esc(x.thuTu)}).
          <div class="page-actions">
            <a class="btn btn-sm btn-primary" href="#/danh-sach-cho">Xác nhận đăng ký</a>
          </div>
        </div>
      `).join("") : ""}
      <div class="stats">
        <div class="stat"><span class="stat-label">Học phần hiệu lực</span><span class="stat-value">${hieuLuc.length}</span></div>
        <div class="stat"><span class="stat-label">Tín chỉ</span><span class="stat-value">${tinChi}</span></div>
        <div class="stat"><span class="stat-label">Đợt đang mở</span><span class="stat-value">${dots.length}</span></div>
      </div>
      <section class="card">
        <div class="card-header"><h2 class="card-title">Học phần đã đăng ký</h2></div>
        <div class="card-body">
          ${hieuLuc.length ? hieuLuc.map((x) => `
            <div class="dong-lich">
              <strong>${website.gui.esc(x.tenHp)} · ${website.gui.esc(x.maLop)}</strong>
              <span>${website.gui.esc(website.gui.lichTomTat(x.lich))}</span>
            </div>
          `).join("") : '<p class="muted">Bạn chưa đăng ký học phần nào.</p>'}
        </div>
      </section>
    `
  };
}

  website.trang.trangChinhPdt = trangChinhPdt;
  website.trang.trangChinhSv = trangChinhSv;
})();
