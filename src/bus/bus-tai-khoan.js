var website = window.website = window.website || {};
website.bus = website.bus || {};

(function () {
  "use strict";

const MAT_KHAU_TOI_THIEU = 8;
const VAI_TRO_PDT = "PDT";
const VAI_TRO_SV = "SV";
const TRANG_THAI_HOAT_DONG = "HoatDong";
const TRANG_THAI_BI_KHOA = "BiKhoa";

class BusTaiKhoan {
  constructor(dao = new website.dao.DaoTaiKhoan()) {
    this.dao = dao;
  }

  kiemTraDangNhap(tenDangNhap, matKhau) {
    if (!String(tenDangNhap || "").trim()) {
      throw new website.phien.LoiNghiepVu("Vui lòng nhập tên đăng nhập");
    }
    if (!matKhau) {
      throw new website.phien.LoiNghiepVu("Vui lòng nhập mật khẩu");
    }
  }

  async dangNhap(tenDangNhap, matKhau) {
    this.kiemTraDangNhap(tenDangNhap, matKhau);
    return this.dao.dangNhap(String(tenDangNhap).trim(), matKhau);
  }

  async layHoSo() {
    return this.dao.layHoSo();
  }

  kiemTraMatKhauMoi(matKhauMoi, xacNhan) {
    if ((matKhauMoi || "").length < MAT_KHAU_TOI_THIEU) {
      throw new website.phien.LoiNghiepVu(`Mật khẩu mới phải có ít nhất ${MAT_KHAU_TOI_THIEU} ký tự`);
    }
    if (matKhauMoi !== xacNhan) {
      throw new website.phien.LoiNghiepVu("Mật khẩu xác nhận không khớp");
    }
  }

  async doiMatKhau(matKhauCu, matKhauMoi, xacNhan) {
    if (!matKhauCu) {
      throw new website.phien.LoiNghiepVu("Vui lòng nhập mật khẩu cũ");
    }
    this.kiemTraMatKhauMoi(matKhauMoi, xacNhan);
    return this.dao.doiMatKhau(matKhauCu, matKhauMoi);
  }

  async thongKe() {
    return this.dao.thongKe();
  }

  async danhSach() {
    return this.dao.danhSach();
  }

  kiemTraTaiKhoan(duLieu) {
    if (!String(duLieu.ten_dang_nhap || "").trim()) {
      throw new website.phien.LoiNghiepVu("Vui lòng nhập tên đăng nhập");
    }
    if (![VAI_TRO_PDT, VAI_TRO_SV].includes(duLieu.vai_tro)) {
      throw new website.phien.LoiNghiepVu("Vai trò không hợp lệ");
    }
    if (duLieu.mat_khau && duLieu.mat_khau.length < MAT_KHAU_TOI_THIEU) {
      throw new website.phien.LoiNghiepVu(`Mật khẩu phải có ít nhất ${MAT_KHAU_TOI_THIEU} ký tự`);
    }
    if (!duLieu.ma_tk && !duLieu.mat_khau) {
      throw new website.phien.LoiNghiepVu("Vui lòng nhập mật khẩu cho tài khoản mới");
    }
  }

  async luu(duLieu) {
    this.kiemTraTaiKhoan(duLieu);
    return this.dao.luu(duLieu);
  }
}

  website.bus.MAT_KHAU_TOI_THIEU = MAT_KHAU_TOI_THIEU;
  website.bus.VAI_TRO_PDT = VAI_TRO_PDT;
  website.bus.VAI_TRO_SV = VAI_TRO_SV;
  website.bus.TRANG_THAI_HOAT_DONG = TRANG_THAI_HOAT_DONG;
  website.bus.TRANG_THAI_BI_KHOA = TRANG_THAI_BI_KHOA;
  website.bus.BusTaiKhoan = BusTaiKhoan;
})();
