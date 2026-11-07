var website = window.website = window.website || {};
website.dto = website.dto || {};

(function () {
  "use strict";

class DtoDangKy {
  constructor(d = {}) {
    this.maDangKy = Number(d.ma_dang_ky ?? d.maDangKy ?? 0);
    this.thoiDiemDangKy = d.thoi_diem_dang_ky ?? d.thoiDiemDangKy ?? "";
    this.trangThai = d.trang_thai ?? d.trangThai ?? "HieuLuc";
    this.maSv = d.ma_sv ?? d.maSv ?? "";
    this.maLop = d.ma_lop ?? d.maLop ?? "";
    this.maHp = d.ma_hp ?? d.maHp ?? "";
    this.tenHp = d.ten_hp ?? d.tenHp ?? "";
    this.soTinChi = Number(d.so_tin_chi ?? d.soTinChi ?? 0);
    this.tenDot = d.ten_dot ?? d.tenDot ?? "";
    this.lich = d.lich ?? d.lich ?? [];
  }
}

  website.dto.DtoDangKy = DtoDangKy;
})();
