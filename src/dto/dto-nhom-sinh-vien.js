var website = window.website = window.website || {};
website.dto = website.dto || {};

(function () {
  "use strict";

class DtoNhomSinhVien {
  constructor(d = {}) {
    this.maNhom = d.ma_nhom ?? d.maNhom ?? "";
    this.tenNhom = d.ten_nhom ?? d.tenNhom ?? "";
    this.coGhiDanh = Number(d.co_ghi_danh ?? d.coGhiDanh ?? 0);
    this.maKhoa = d.ma_khoa ?? d.maKhoa ?? "";
    this.tenKhoa = d.ten_khoa ?? d.tenKhoa ?? "";
  }
}

  website.dto.DtoNhomSinhVien = DtoNhomSinhVien;
})();
