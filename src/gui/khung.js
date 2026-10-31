var website = window.website = window.website || {};
website.gui = website.gui || {};

(function () {
  "use strict";

const MENU_PDT = [
  { nhom: "Tổng quan", muc: [["trang-chinh-pdt", "Trang chính"]] },
  { nhom: "Danh mục", muc: [
    ["khoa", "Khoa"],
    ["nhom-sinh-vien", "Nhóm sinh viên"],
    ["quan-ly-hoc-phan", "Học phần"],
    ["chuong-trinh-dao-tao-quan-tri", "Chương trình đào tạo"]
  ] },
  { nhom: "Đào tạo", muc: [
    ["quan-ly-sinh-vien", "Sinh viên"],
    ["quan-ly-lop-hoc-phan", "Lớp học phần"],
    ["nhap-lop", "Nhập lớp từ file"],
    ["cau-hinh-dot-dang-ky", "Đợt đăng ký"],
    ["dang-ky-ho", "Đăng ký hộ"],
    ["xu-ly-sau-dot", "Xử lý sau đợt"],
    ["ket-qua-hoc-tap", "Kết quả học tập"],
    ["tai-khoan", "Tài khoản"]
  ] },
  { nhom: "Khác", muc: [
    ["lich-su-thao-tac", "Lịch sử thao tác"],
    ["tro-giup", "Trợ giúp"],
    ["doi-mat-khau", "Đổi mật khẩu"]
  ] }
];

const MENU_SV = [
  { nhom: "Tổng quan", muc: [["trang-chinh-sv", "Trang chính"]] },
  { nhom: "Học tập", muc: [
    ["chuong-trinh-dao-tao", "Chương trình đào tạo"],
    ["ghi-danh-hoc-phan", "Ghi danh học phần"],
    ["lop-hoc-phan-mo", "Lớp học phần mở"],
    ["dang-ky-hoc-phan", "Đăng ký học phần"],
    ["hoc-phan-da-dang-ky", "Học phần đã đăng ký"],
    ["thoi-khoa-bieu", "Thời khóa biểu"],
    ["danh-sach-cho", "Danh sách chờ"],
    ["ket-qua-hoc-tap", "Kết quả học tập"]
  ] },
  { nhom: "Khác", muc: [
    ["lich-su-thao-tac", "Lịch sử thao tác"],
    ["tro-giup", "Trợ giúp"],
    ["doi-mat-khau", "Đổi mật khẩu"]
  ] }
];

function dungKhung(hoSo, tieuDe, noiDung, trang) {
  const menu = hoSo.vaiTro === "PDT" ? MENU_PDT : MENU_SV;
  const nhomMenu = menu.map((g) => `
    <div class="nav-group">
      <div class="nav-title">${website.gui.esc(g.nhom)}</div>
      ${g.muc.map(([duong, nhan]) => `
        <a class="nav-link ${trang === duong ? "active" : ""}" href="#/${duong}">${website.gui.esc(nhan)}</a>
      `).join("")}
    </div>
  `).join("");

  return `
    <div class="shell">
      <aside class="sidebar" id="thanh-ben">
        <div class="brand">
          <span class="brand-mark">ĐK</span>
          <span class="brand-text">Đăng ký học phần</span>
        </div>
        <nav class="nav">${nhomMenu}</nav>
      </aside>
      <div class="khung-chinh">
        <header class="topbar">
          <button type="button" class="btn btn-ghost btn-menu" id="btnMenu" aria-label="Mở menu">☰</button>
          <div class="topbar-title">${website.gui.esc(tieuDe)}</div>
          <div class="topbar-user">
            <span class="user-name">${website.gui.esc(hoSo.hoTen || hoSo.tenDangNhap)}</span>
            <span class="badge">${hoSo.vaiTro === "PDT" ? "Phòng đào tạo" : "Sinh viên"}</span>
            <button type="button" class="btn btn-sm btn-ghost" id="btnDangXuat">Đăng xuất</button>
          </div>
        </header>
        <main class="content" id="noi-dung-chinh">
          <div class="page-head">
            <div>
              <h1 class="page-title">${website.gui.esc(tieuDe)}</h1>
            </div>
          </div>
          <div id="noi-dung-trang">${noiDung}</div>
        </main>
      </div>
      <div class="veil" id="veil"></div>
    </div>
    <div id="khu-thong-bao" class="toasts"></div>
  `;
}

  website.gui.dungKhung = dungKhung;
})();
