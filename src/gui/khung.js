var website = window.website = window.website || {};
website.gui = website.gui || {};

(function () {
  "use strict";

const MENU_PDT = [
  { nhom: "Tổng quan", muc: [["tong-quan-pdt", "Tổng quan"]] },
  { nhom: "Danh mục", muc: [
    ["quan-ly-sinh-vien", "Sinh viên"],
    ["nhom-sinh-vien", "Nhóm sinh viên"],
    ["quan-ly-hoc-phan", "Học phần"],
    ["chuong-trinh-dao-tao-quan-tri", "Chương trình đào tạo"]
  ] },
  { nhom: "Đào tạo", muc: [
    ["quan-ly-lop-hoc-phan", "Lớp học phần"],
    ["cau-hinh-dot-dang-ky", "Đợt đăng ký"],
    ["dang-ky-ho", "Đăng ký hộ"],
    ["thong-ke-ghi-danh", "Thống kê ghi danh"],
    ["tai-khoan", "Tài khoản"]
  ] },
  { nhom: "Khác", muc: [
    ["lich-su-thao-tac", "Lịch sử thao tác"],
    ["doi-mat-khau", "Đổi mật khẩu"]
  ] }
];

const MENU_SV = [
  { nhom: "Tổng quan", muc: [["tong-quan-sv", "Tổng quan"]] },
  { nhom: "Học tập", muc: [
    ["chuong-trinh-dao-tao", "Chương trình đào tạo"],
    ["ghi-danh-hoc-phan", "Ghi danh học phần"],
    ["lop-hoc-phan-mo", "Đăng ký học phần"],
    ["thoi-khoa-bieu", "Thời khóa biểu"],
    ["danh-sach-cho", "Danh sách chờ"]
  ] },
  { nhom: "Khác", muc: [
    ["lich-su-thao-tac", "Lịch sử thao tác"],
    ["doi-mat-khau", "Đổi mật khẩu"]
  ] }
];

function dungKhung(hoSo, tieuDe, noiDung, trang) {
  const menu = hoSo.vaiTro === "PDT" ? MENU_PDT : MENU_SV;
  const nhomMenu = menu.map((g) => `
    <div class="nav-group">
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
          <button type="button" class="btn btn-ghost btn-menu" id="btnMenu" aria-label="Mở menu">Menu</button>
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
