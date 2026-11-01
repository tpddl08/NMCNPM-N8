var website = window.website = window.website || {};
website.bus = website.bus || {};

(function () {
  "use strict";

const MA_SV_HOP_LE = /^(4[89]|[5-9][0-9])\.01\.[0-9]{3}\.[0-9]{3}$/;
const TRANG_THAI_SINH_VIEN = {
  DANG_HOC: "DangHoc",
  BAO_LUU: "BaoLuu",
  DA_TOT_NGHIEP: "DaTotNghiep"
};

class BusSinhVien {
  constructor(dao = new website.dao.DaoSinhVien()) {
    this.dao = dao;
  }

  kiemTraMaSv(maSv) {
    if (!MA_SV_HOP_LE.test(String(maSv || ""))) {
      throw new website.phien.LoiNghiepVu("Mã sinh viên phải có dạng xx.01.zzz.ttt với xx từ 48 trở lên");
    }
  }

  kiemTra(duLieu) {
    this.kiemTraMaSv(duLieu.ma_sv);
    if (!String(duLieu.ho_ten || "").trim()) {
      throw new website.phien.LoiNghiepVu("Vui lòng nhập họ tên sinh viên");
    }
    if (!duLieu.ngay_sinh) {
      throw new website.phien.LoiNghiepVu("Vui lòng chọn ngày sinh");
    }
    if (!duLieu.ma_khoa) {
      throw new website.phien.LoiNghiepVu("Vui lòng chọn khoa");
    }
    if (!duLieu.ma_ctdt) {
      throw new website.phien.LoiNghiepVu("Vui lòng chọn chương trình đào tạo");
    }
    if (!Object.values(TRANG_THAI_SINH_VIEN).includes(duLieu.trang_thai)) {
      throw new website.phien.LoiNghiepVu("Trạng thái sinh viên không hợp lệ");
    }
    if (duLieu.mat_khau && duLieu.mat_khau.length < 8) {
      throw new website.phien.LoiNghiepVu("Mật khẩu phải có ít nhất 8 ký tự");
    }
  }

  async danhSach(tuKhoa = "") {
    return this.dao.danhSach(tuKhoa);
  }

  async luu(duLieu) {
    this.kiemTra(duLieu);
    return this.dao.luu(duLieu);
  }

  async danhSachKhoa() {
    return this.dao.danhSachKhoa();
  }

  async danhSachNhom() {
    return this.dao.danhSachNhom();
  }

  kiemTraNhom(duLieu) {
    if (!String(duLieu.ma_nhom || "").trim() || !String(duLieu.ten_nhom || "").trim()) {
      throw new website.phien.LoiNghiepVu("Vui lòng nhập mã nhóm và tên nhóm");
    }
    if (!duLieu.ma_khoa) {
      throw new website.phien.LoiNghiepVu("Vui lòng chọn khoa");
    }
  }

  async luuNhom(duLieu) {
    this.kiemTraNhom(duLieu);
    return this.dao.luuNhom(duLieu);
  }

  async xoaNhom(maNhom) {
    return this.dao.xoaNhom(maNhom);
  }
}

  website.bus.MA_SV_HOP_LE = MA_SV_HOP_LE;
  website.bus.TRANG_THAI_SINH_VIEN = TRANG_THAI_SINH_VIEN;
  website.bus.BusSinhVien = BusSinhVien;
})();
