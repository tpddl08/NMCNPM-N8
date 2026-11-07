var website = window.website = window.website || {};
website.dto = website.dto || {};

(function () {
  "use strict";

class DtoKetQuaHocTap {
  constructor(d = {}) {
    this.maKq = Number(d.ma_kq ?? d.maKq ?? 0);
    this.hocKy = d.hoc_ky ?? d.hocKy ?? "";
    this.diem = Number(d.diem ?? d.diem ?? 0);
    this.maSv = d.ma_sv ?? d.maSv ?? "";
    this.hoTen = d.ho_ten ?? d.hoTen ?? "";
    this.maHp = d.ma_hp ?? d.maHp ?? "";
    this.tenHp = d.ten_hp ?? d.tenHp ?? "";
  }
}

  website.dto.DtoKetQuaHocTap = DtoKetQuaHocTap;
})();
