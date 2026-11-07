var website = window.website = window.website || {};
website.dto = website.dto || {};

(function () {
  "use strict";

class DtoNguoiDung {
  constructor(d = {}) {
    this.maTk = Number(d.ma_tk ?? d.maTk ?? 0);
    this.tenDangNhap = d.ten_dang_nhap ?? d.tenDangNhap ?? "";
    this.matKhauBam = d.mat_khau_bam ?? d.matKhauBam ?? "";
    this.vaiTro = d.vai_tro ?? d.vaiTro ?? "SV";
    this.trangThai = d.trang_thai ?? d.trangThai ?? "HoatDong";
    this.hoTen = d.ho_ten ?? d.hoTen ?? "";
    this.maSv = d.ma_sv ?? d.maSv ?? "";
    this.ngaySinh = d.ngay_sinh ?? d.ngaySinh ?? "";
    this.nienKhoa = d.nien_khoa ?? d.nienKhoa ?? "";
    this.maKhoa = d.ma_khoa ?? d.maKhoa ?? "";
    this.tenKhoa = d.ten_khoa ?? d.tenKhoa ?? "";
    this.maNhom = d.ma_nhom ?? d.maNhom ?? "";
    this.tenNhom = d.ten_nhom ?? d.tenNhom ?? "";
    this.maCtdt = d.ma_ctdt ?? d.maCtdt ?? "";
    this.tenCtdt = d.ten_ctdt ?? d.tenCtdt ?? "";
  }
}

  website.dto.DtoNguoiDung = DtoNguoiDung;
})();
