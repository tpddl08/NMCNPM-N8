var website = window.website = window.website || {};
website.bus = website.bus || {};

(function () {
  "use strict";

const TRANG_THAI_DANG_KY = { HIEU_LUC: "HieuLuc", DA_HUY: "DaHuy", LOP_BI_HUY: "LopBiHuy" };

function maLopCua(lop) {
  return lop.maLop ?? lop.ma_lop ?? "";
}

function maHpCua(lop) {
  return lop.maHp ?? lop.ma_hp ?? "";
}

function tietBatDau(buoi) {
  return Number(buoi.tietBatDau ?? buoi.tiet_bat_dau ?? 0);
}

function tietKetThuc(buoi) {
  return Number(buoi.tietKetThuc ?? buoi.tiet_ket_thuc ?? 0);
}

function giaoLich(a, b) {
  return a.some((x) =>
    b.some((y) =>
      Number(x.thu) === Number(y.thu)
      && tietBatDau(x) <= tietKetThuc(y)
      && tietBatDau(y) <= tietKetThuc(x)
    )
  );
}

class BusDangKy {
  constructor(dao = new website.dao.DaoDangKy()) {
    this.dao = dao;
  }

  trungLich(lopA, lopB) {
    return giaoLich(lopA.lich || [], lopB.lich || []);
  }

  timXungDot(lop, danhSach) {
    return (danhSach || []).find((khac) =>
      maLopCua(khac) !== maLopCua(lop) && this.trungLich(lop, khac)
    ) || null;
  }

  kiemTraThemGio(gio, lop) {
    if ((gio || []).some((x) => maLopCua(x) === maLopCua(lop))) {
      throw new website.phien.LoiNghiepVu("Lớp này đã có trong danh sách tạm");
    }
    if ((gio || []).some((x) => maHpCua(x) === maHpCua(lop))) {
      throw new website.phien.LoiNghiepVu("Bạn đã chọn một lớp khác của cùng học phần");
    }
    const xungDot = this.timXungDot(lop, gio);
    if (xungDot) {
      throw new website.phien.LoiNghiepVu(`Trùng lịch với lớp ${maLopCua(xungDot)}`);
    }
  }

  tongTinChi(danhSach) {
    return (danhSach || []).reduce((tong, lop) => tong + Number(lop.soTinChi ?? lop.so_tin_chi ?? 0), 0);
  }

  async lopDangMo() {
    return this.dao.lopDangMo();
  }

  locKehHoach(danhSach, cheDo, danhSachKeHoach) {
    const keHoach = new Set((danhSachKeHoach || []).map((x) => x.ma_hp ?? x.maHp));
    if (cheDo === "KeHoach") {
      return (danhSach || []).filter((x) => keHoach.has(maHpCua(x)));
    }
    if (cheDo === "NgoaiKeHoach") {
      return (danhSach || []).filter((x) => !keHoach.has(maHpCua(x)));
    }
    return danhSach || [];
  }

  async dangKy(maLop) {
    return this.dao.dangKy(maLop);
  }

  async dangKyNhieu(danhSachLop) {
    const ketQua = [];
    for (const lop of danhSachLop) {
      const kq = await this.dangKy(maLopCua(lop));
      ketQua.push({
        ma_lop: maLopCua(lop),
        ten_hp: lop.tenHp ?? lop.ten_hp ?? "",
        ...kq
      });
    }
    return ketQua;
  }

  async dangKyHo(maSv, maLop, lyDo) {
    if (!String(lyDo || "").trim()) {
      throw new website.phien.LoiNghiepVu("Vui lòng nhập lý do đăng ký hộ");
    }
    return this.dao.dangKyHo(maSv, maLop, lyDo);
  }

  async huy(maDangKy, lyDo = "") {
    return this.dao.huy(maDangKy, lyDo);
  }

  async hocPhanDaDangKy() {
    return this.dao.hocPhanDaDangKy();
  }

  async danhSachGhiDanh() {
    return this.dao.danhSachGhiDanh();
  }

  async ghiDanh(maHp, maDot) {
    return this.dao.ghiDanh(maHp, maDot);
  }

  async thongKeGhiDanh() {
    return this.dao.thongKeGhiDanh();
  }

  async huyGhiDanh(maHp, maDot) {
    return this.dao.huyGhiDanh(maHp, maDot);
  }

  async xuLySauDot(maDot) {
    if (!maDot) {
      throw new website.phien.LoiNghiepVu("Vui lòng chọn đợt đăng ký");
    }
    return this.dao.xuLySauDot(maDot);
  }
}

  website.bus.TRANG_THAI_DANG_KY = TRANG_THAI_DANG_KY;
  website.bus.giaoLich = giaoLich;
  website.bus.BusDangKy = BusDangKy;
})();
