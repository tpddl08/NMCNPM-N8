var website = window.website = window.website || {};
website.dto = website.dto || {};

(function () {
  "use strict";

class DtoDanhSachCho {
  constructor(d = {}) {
    this.maDs = Number(d.ma_ds ?? d.maDs ?? 0);
    this.thoiDiemVao = d.thoi_diem_vao ?? d.thoiDiemVao ?? "";
    this.thuTu = Number(d.thu_tu ?? d.thuTu ?? 0);
    this.maSv = d.ma_sv ?? d.maSv ?? "";
    this.maLop = d.ma_lop ?? d.maLop ?? "";
    this.maDot = d.ma_dot ?? d.maDot ?? "";
    this.maHp = d.ma_hp ?? d.maHp ?? "";
    this.tenHp = d.ten_hp ?? d.tenHp ?? "";
    this.conCho = Number(d.con_cho ?? d.conCho ?? 0);
    this.laDau = Number(d.la_dau ?? d.laDau ?? 0);
    this.hoTen = d.ho_ten ?? d.hoTen ?? "";
  }
}

  website.dto.DtoDanhSachCho = DtoDanhSachCho;
})();
