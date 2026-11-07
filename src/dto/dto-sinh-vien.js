var website = window.website = window.website || {};
website.dto = website.dto || {};

(function () {
  "use strict";

class DtoSinhVien {
  constructor(d = {}) {
    this.maSv = d.ma_sv ?? d.maSv ?? "";
    this.hoTen = d.ho_ten ?? d.hoTen ?? "";
    this.ngaySinh = d.ngay_sinh ?? d.ngaySinh ?? "";
    this.nienKhoa = d.nien_khoa ?? d.nienKhoa ?? "";
    this.trangThai = d.trang_thai ?? d.trangThai ?? "DangHoc";
    this.maTk = Number(d.ma_tk ?? d.maTk ?? 0);
    this.tenDangNhap = d.ten_dang_nhap ?? d.tenDangNhap ?? "";
    this.maKhoa = d.ma_khoa ?? d.maKhoa ?? "";
    this.tenKhoa = d.ten_khoa ?? d.tenKhoa ?? "";
    this.maNhom = d.ma_nhom ?? d.maNhom ?? "";
    this.tenNhom = d.ten_nhom ?? d.tenNhom ?? "";
    this.maCtdt = d.ma_ctdt ?? d.maCtdt ?? "";
    this.tenCtdt = d.ten_ctdt ?? d.tenCtdt ?? "";
    this.matKhau = d.mat_khau ?? d.matKhau ?? "";
  }
}

  website.dto.DtoSinhVien = DtoSinhVien;
})();
