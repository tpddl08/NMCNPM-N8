var website = window.website = window.website || {};
website.bus = website.bus || {};

(function () {
  "use strict";

const MA_HOC_PHAN_HOP_LE = /^(COMP|MATH|EDU|PHYS)(1[0-9]{3}|2[0-9]{3}|3000)$/;
const LOAI_RANG_BUOC = { TIEN_QUYET: "TienQuyet", HOC_TRUOC: "HocTruoc" };
const DIEM_DAT = 4;

class BusHocPhan {
  constructor(dao = new website.dao.DaoHocPhan()) {
    this.dao = dao;
  }

  kiemTraMaHp(maHp) {
    if (!MA_HOC_PHAN_HOP_LE.test(String(maHp || ""))) {
      throw new website.phien.LoiNghiepVu("Mã học phần phải gồm COMP, MATH, EDU hoặc PHYS và 4 chữ số từ 1000 đến 3000");
    }
  }

  kiemTra(duLieu) {
    this.kiemTraMaHp(duLieu.ma_hp);
    if (!String(duLieu.ten_hp || "").trim()) {
      throw new website.phien.LoiNghiepVu("Vui lòng nhập tên học phần");
    }
    if (Number(duLieu.so_tin_chi) <= 0) {
      throw new website.phien.LoiNghiepVu("Số tín chỉ phải lớn hơn 0");
    }
    for (const mon of duLieu.tien_quyet || []) {
      this.kiemTraMaHp(mon.ma_hp_tien_quyet);
      if (mon.ma_hp_tien_quyet === duLieu.ma_hp) {
        throw new website.phien.LoiNghiepVu("Học phần không thể là tiên quyết của chính nó");
      }
      if (!Object.values(LOAI_RANG_BUOC).includes(mon.loai_rang_buoc)) {
        throw new website.phien.LoiNghiepVu("Loại ràng buộc không hợp lệ");
      }
    }
  }

  async danhSach() {
    return this.dao.danhSach();
  }

  async luu(duLieu) {
    this.kiemTra(duLieu);
    return this.dao.luu(duLieu);
  }

  async xoa(maHp) {
    return this.dao.xoa(maHp);
  }

  async danhSachCtdt() {
    return this.dao.danhSachCtdt();
  }

  kiemTraCtdt(duLieu) {
    if (!String(duLieu.ma_ctdt || "").trim() || !String(duLieu.ten_ctdt || "").trim()) {
      throw new website.phien.LoiNghiepVu("Vui lòng nhập mã và tên chương trình đào tạo");
    }
    for (const mon of duLieu.hoc_phan || []) {
      this.kiemTraMaHp(mon.ma_hp);
    }
  }

  async luuCtdt(duLieu) {
    this.kiemTraCtdt(duLieu);
    return this.dao.luuCtdt(duLieu);
  }

  async danhSachKetQua(maSv = "") {
    return this.dao.danhSachKetQua(maSv);
  }

  kiemTraKetQua(duLieu) {
    const diem = Number(duLieu.diem);
    if (Number.isNaN(diem) || diem < 0 || diem > 10) {
      throw new website.phien.LoiNghiepVu("Điểm phải nằm trong khoảng 0 đến 10");
    }
    this.kiemTraMaHp(duLieu.ma_hp);
    if (!duLieu.hoc_ky) {
      throw new website.phien.LoiNghiepVu("Vui lòng nhập học kỳ");
    }
  }

  async luuKetQua(duLieu) {
    this.kiemTraKetQua(duLieu);
    return this.dao.luuKetQua(duLieu);
  }

  async ctdtCuaSinhVien() {
    return this.dao.ctdtCuaSinhVien();
  }

  async ketQuaCuaSinhVien() {
    return this.dao.ketQuaCuaSinhVien();
  }
}

  website.bus.MA_HOC_PHAN_HOP_LE = MA_HOC_PHAN_HOP_LE;
  website.bus.LOAI_RANG_BUOC = LOAI_RANG_BUOC;
  website.bus.DIEM_DAT = DIEM_DAT;
  website.bus.BusHocPhan = BusHocPhan;
})();
