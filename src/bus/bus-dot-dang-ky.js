var website = window.website = window.website || {};
website.bus = website.bus || {};

(function () {
  "use strict";

const NGUONG_HUY_MAC_DINH = 15;

function thoiDiem(value) {
  return new Date(value).getTime();
}

class BusDotDangKy {
  constructor(dao = new website.dao.DaoDotDangKy()) {
    this.dao = dao;
  }

  trangThai(dot, luc = Date.now()) {
    if (luc < thoiDiem(dot.thoiDiemMo)) {
      return "ChuaMo";
    }
    if (luc >= thoiDiem(dot.thoiDiemDong)) {
      return "DaDong";
    }
    return "DangMo";
  }

  kiemTra(dot) {
    if (!String(dot.ma_dot || "").trim() || !String(dot.ten_dot || "").trim()) {
      throw new website.phien.LoiNghiepVu("Vui lòng nhập mã và tên đợt đăng ký");
    }
    if (!dot.thoi_diem_mo || !dot.thoi_diem_dong) {
      throw new website.phien.LoiNghiepVu("Vui lòng nhập thời điểm mở và đóng");
    }
    if (thoiDiem(dot.thoi_diem_dong) <= thoiDiem(dot.thoi_diem_mo)) {
      throw new website.phien.LoiNghiepVu("Thời điểm đóng phải sau thời điểm mở");
    }
    if (Number(dot.nguong_huy_lop) < 0) {
      throw new website.phien.LoiNghiepVu("Ngưỡng hủy lớp không được âm");
    }
  }

  async danhSach() {
    return this.dao.danhSach();
  }

  async dotCuaSinhVien() {
    return this.dao.dotCuaSinhVien();
  }

  async luu(dot) {
    this.kiemTra(dot);
    return this.dao.luu(dot);
  }
}

  website.bus.NGUONG_HUY_MAC_DINH = NGUONG_HUY_MAC_DINH;
  website.bus.thoiDiem = thoiDiem;
  website.bus.BusDotDangKy = BusDotDangKy;
})();
