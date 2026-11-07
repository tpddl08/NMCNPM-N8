var website = window.website = window.website || {};
website.dto = website.dto || {};

(function () {
  "use strict";

class DtoDotDangKy {
  constructor(d = {}) {
    this.maDot = d.ma_dot ?? d.maDot ?? "";
    this.tenDot = d.ten_dot ?? d.tenDot ?? "";
    this.hocKy = d.hoc_ky ?? d.hocKy ?? "";
    this.namHoc = d.nam_hoc ?? d.namHoc ?? "";
    this.thoiDiemMo = d.thoi_diem_mo ?? d.thoiDiemMo ?? "";
    this.thoiDiemDong = d.thoi_diem_dong ?? d.thoiDiemDong ?? "";
    this.nguongHuyLop = Number(d.nguong_huy_lop ?? d.nguongHuyLop ?? 15);
    this.dangMo = Number(d.dang_mo ?? d.dangMo ?? 0);
    this.coGhiDanh = Number(d.co_ghi_danh ?? d.coGhiDanh ?? 0);
    this.nhom = d.nhom ?? d.nhom ?? [];
  }
}

  website.dto.DtoDotDangKy = DtoDotDangKy;
})();
