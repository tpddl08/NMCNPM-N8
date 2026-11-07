var website = window.website = window.website || {};
website.dto = website.dto || {};

(function () {
  "use strict";

class DtoLopHocPhan {
  constructor(d = {}) {
    this.maLop = d.ma_lop ?? d.maLop ?? "";
    this.maHp = d.ma_hp ?? d.maHp ?? "";
    this.tenHp = d.ten_hp ?? d.tenHp ?? "";
    this.soTinChi = Number(d.so_tin_chi ?? d.soTinChi ?? 0);
    this.maDot = d.ma_dot ?? d.maDot ?? "";
    this.tenDot = d.ten_dot ?? d.tenDot ?? "";
    this.sucChua = Number(d.suc_chua ?? d.sucChua ?? 0);
    this.siSo = Number(d.si_so ?? d.siSo ?? 0);
    this.trangThai = d.trang_thai ?? d.trangThai ?? "Mo";
    this.thoiDiemMo = d.thoi_diem_mo ?? d.thoiDiemMo ?? "";
    this.thoiDiemDong = d.thoi_diem_dong ?? d.thoiDiemDong ?? "";
    this.nguongHuyLop = Number(d.nguong_huy_lop ?? d.nguongHuyLop ?? 15);
    this.lich = d.lich ?? d.lich ?? [];
    this.thuocNhom = Number(d.thuoc_nhom ?? d.thuocNhom ?? 0);
    this.daDangKy = Number(d.da_dang_ky ?? d.daDangKy ?? 0);
  }
}

  website.dto.DtoLopHocPhan = DtoLopHocPhan;
})();
