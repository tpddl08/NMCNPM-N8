var website = window.website = window.website || {};
website.dto = website.dto || {};

(function () {
  "use strict";

class DtoGhiDanhHocPhan {
  constructor(d = {}) {
    this.maSv = d.ma_sv ?? d.maSv ?? "";
    this.maHp = d.ma_hp ?? d.maHp ?? "";
    this.maDot = d.ma_dot ?? d.maDot ?? "";
    this.thoiDiem = d.thoi_diem ?? d.thoiDiem ?? "";
    this.tenHp = d.ten_hp ?? d.tenHp ?? "";
    this.soTinChi = Number(d.so_tin_chi ?? d.soTinChi ?? 0);
    this.tenDot = d.ten_dot ?? d.tenDot ?? "";
    this.batBuoc = Number(d.bat_buoc ?? d.batBuoc ?? 0);
  }
}

  website.dto.DtoGhiDanhHocPhan = DtoGhiDanhHocPhan;
})();
