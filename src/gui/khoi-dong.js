var website = window.website = window.website || {};
website.gui = website.gui || {};

(function () {
  "use strict";

const ROUTES = {
  "doi-mat-khau": { vaiTro: ["PDT", "SV"], tai: "doiMatKhau" },
  "trang-chinh-pdt": { vaiTro: ["PDT"], tai: "trangChinhPdt" },
  "trang-chinh-sv": { vaiTro: ["SV"], tai: "trangChinhSv" },
  "quan-ly-sinh-vien": { vaiTro: ["PDT"], tai: "quanLySinhVien" },
  "form-sinh-vien": { vaiTro: ["PDT"], tai: "formSinhVien" },
  "quan-ly-hoc-phan": { vaiTro: ["PDT"], tai: "quanLyHocPhan" },
  "quan-ly-lop-hoc-phan": { vaiTro: ["PDT"], tai: "quanLyLopHocPhan" },
  "nhap-lop": { vaiTro: ["PDT"], tai: "nhapLop" },
  "cau-hinh-dot-dang-ky": { vaiTro: ["PDT"], tai: "cauHinhDotDangKy" },
  "dang-ky-ho": { vaiTro: ["PDT"], tai: "dangKyHo" },
  "xu-ly-sau-dot": { vaiTro: ["PDT"], tai: "xuLySauDot" },
  "chuong-trinh-dao-tao": { vaiTro: ["SV"], tai: "chuongTrinhDaoTao" },
  "lop-hoc-phan-mo": { vaiTro: ["SV"], tai: "lopHocPhanMo" },
  "chi-tiet-lop": { vaiTro: ["SV"], tai: "chiTietLop" },
  "ghi-danh-hoc-phan": { vaiTro: ["SV"], tai: "ghiDanhHocPhan" },
  "dang-ky-hoc-phan": { vaiTro: ["SV"], tai: "dangKyHocPhan" },
  "ket-qua-dang-ky": { vaiTro: ["SV"], tai: "ketQuaDangKy" },
  "hoc-phan-da-dang-ky": { vaiTro: ["SV"], tai: "hocPhanDaDangKy" },
  "thoi-khoa-bieu": { vaiTro: ["SV"], tai: "thoiKhoaBieu" },
  "lich-su-thao-tac": { vaiTro: ["PDT", "SV"], tai: "lichSuThaoTac" },
  "danh-sach-cho": { vaiTro: ["SV"], tai: "danhSachCho" },
  khoa: { vaiTro: ["PDT"], tai: "khoa" },
  "nhom-sinh-vien": { vaiTro: ["PDT"], tai: "nhomSinhVien" },
  "chuong-trinh-dao-tao-quan-tri": { vaiTro: ["PDT"], tai: "chuongTrinhDaoTaoQuanTri" },
  "tai-khoan": { vaiTro: ["PDT"], tai: "taiKhoan" },
  "ket-qua-hoc-tap": { vaiTro: ["PDT", "SV"], tai: "ketQuaHocTap" },
  "tro-giup": { vaiTro: ["PDT", "SV"], tai: "troGiup" }
};

let hoSo = null;
let dangChay = false;

function tachHash() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [duong, chuoiThamSo] = raw.split("?");
  return { duong: duong || "", thamSo: new URLSearchParams(chuoiThamSo || "") };
}

function trangMacDinh(vaiTro) {
  return vaiTro === "PDT" ? "trang-chinh-pdt" : "trang-chinh-sv";
}

function ganKhung() {
  document.body.className = "app";
  website.gui.$("#btnDangXuat")?.addEventListener("click", () => {
    website.phien.xoaToken();
    hoSo = null;
    location.hash = "#/dang-nhap";
  });
  website.gui.$("#btnMenu")?.addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
  });
  website.gui.$("#veil")?.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
  });
}

async function veTrang() {
  if (dangChay) return;
  const { duong, thamSo } = tachHash();

  if (!website.phien.daCauHinh()) {
    website.trang.veDangNhap();
    return;
  }

  if (!website.phien.layToken()) {
    website.trang.veDangNhap();
    return;
  }

  if (!hoSo) {
    dangChay = true;
    try {
      hoSo = await new website.bus.BusTaiKhoan().layHoSo();
    } catch {
      website.phien.xoaToken();
      website.trang.veDangNhap("Phiên đăng nhập đã hết hạn");
      dangChay = false;
      return;
    } finally {
      dangChay = false;
    }
  }

  if (!duong || duong === "dang-nhap") {
    location.hash = `#/${trangMacDinh(hoSo.vaiTro)}`;
    return;
  }

  const route = ROUTES[duong];
  if (!route) {
    location.hash = `#/${trangMacDinh(hoSo.vaiTro)}`;
    return;
  }
  if (!route.vaiTro.includes(hoSo.vaiTro)) {
    website.gui.thongBao("Bạn không có quyền truy cập chức năng này", "loi");
    location.hash = `#/${trangMacDinh(hoSo.vaiTro)}`;
    return;
  }

  if (!document.querySelector(".shell")) {
    document.body.innerHTML = `<div class="dang-tai">Đang tải...</div>`;
  }
  try {
    const trang = await website.trang[route.tai](hoSo, thamSo);
    document.body.className = "app";
    document.body.innerHTML = website.gui.dungKhung(hoSo, trang.tieuDe, trang.noiDung, duong);
    ganKhung();
    trang.gan?.();
    window.scrollTo(0, 0);
  } catch (loi) {
    if (loi.name === "LoiPhien") {
      website.phien.xoaToken();
      hoSo = null;
      website.trang.veDangNhap("Phiên đăng nhập đã hết hạn");
      return;
    }
    document.body.innerHTML = website.gui.dungKhung(hoSo, "Không tải được trang", `
      <section class="card"><div class="card-body">
        <div class="alert alert-danger">${loi.message || "Có lỗi xảy ra"}</div>
        <a class="btn btn-primary" href="#/${trangMacDinh(hoSo.vaiTro)}">Về trang chính</a>
      </div></section>
    `, duong);
    ganKhung();
  }
}

function khoiDong() {
  if (!website.phien.daCauHinh()) {
    website.trang.veDangNhap();
    return;
  }
  window.addEventListener("hashchange", veTrang);
  window.addEventListener("dang-nhap-thanh-cong", () => {
    hoSo = null;
    veTrang();
  });
  window.addEventListener("phien-het-han", () => {
    website.phien.xoaToken();
    hoSo = null;
    website.trang.veDangNhap("Phiên đăng nhập đã hết hạn");
  });
  veTrang();
}

  website.gui.khoiDong = khoiDong;
})();
