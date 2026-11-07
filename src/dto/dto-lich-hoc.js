var website = window.website = window.website || {};
website.dto = website.dto || {};

(function () {
  "use strict";

class DtoLichHoc {
  constructor(d = {}) {
    this.maBuoi = Number(d.ma_buoi ?? d.maBuoi ?? 0);
    this.thu = Number(d.thu ?? d.thu ?? 2);
    this.tietBatDau = Number(d.tiet_bat_dau ?? d.tietBatDau ?? 1);
    this.tietKetThuc = Number(d.tiet_ket_thuc ?? d.tietKetThuc ?? 1);
    this.tiet_bat_dau = this.tietBatDau;
    this.tiet_ket_thuc = this.tietKetThuc;
    this.phongHoc = d.phong_hoc ?? d.phongHoc ?? "";
    this.giangVien = d.giang_vien ?? d.giangVien ?? "";
    this.phong_hoc = this.phongHoc;
    this.giang_vien = this.giangVien;
    this.maLop = d.ma_lop ?? d.maLop ?? "";
    this.maHp = d.ma_hp ?? d.maHp ?? "";
    this.tenHp = d.ten_hp ?? d.tenHp ?? "";
    this.maDot = d.ma_dot ?? d.maDot ?? "";
    this.tenDot = d.ten_dot ?? d.tenDot ?? "";
    this.hocKy = d.hoc_ky ?? d.hocKy ?? "";
    this.namHoc = d.nam_hoc ?? d.namHoc ?? "";
    this.thoiDiemMo = d.thoi_diem_mo ?? d.thoiDiemMo ?? "";
    this.trangThaiLop = d.trang_thai ?? d.trangThaiLop ?? "";
  }
}

  website.dto.DtoLichHoc = DtoLichHoc;
})();
