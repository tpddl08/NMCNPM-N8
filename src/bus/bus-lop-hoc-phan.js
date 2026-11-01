var website = window.website = window.website || {};
website.bus = website.bus || {};

(function () {
  "use strict";

const MA_LOP_HOP_LE = /^[0-9]{2}(COMP|MATH|EDU|PHYS)(1[0-9]{3}|2[0-9]{3}|3000)[0-9]{2}$/;
const TRANG_THAI_LOP = { MO: "Mo", DONG: "Dong", BI_HUY: "BiHuy" };
const COT_CSV = [
  "ma_lop", "ma_hp", "ma_dot", "suc_chua", "thu",
  "tiet_bat_dau", "tiet_ket_thuc", "phong_hoc", "giang_vien"
];

function tachDongCsv(vanBan) {
  const dong = [];
  let o = "";
  let trongNgoac = false;
  const kyTu = String(vanBan || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < kyTu.length; i += 1) {
    const c = kyTu[i];
    if (c === '"') {
      if (trongNgoac && kyTu[i + 1] === '"') {
        o += '"';
        i += 1;
      } else {
        trongNgoac = !trongNgoac;
      }
    } else if (c === "," && !trongNgoac) {
      dong.push(o);
      o = "";
    } else if (c === "\n" && !trongNgoac) {
      dong.push(o);
      o = "";
      if (dong.some((x) => x !== "")) {
        dong.push(null);
      }
    } else {
      o += c;
    }
  }
  dong.push(o);
  return dong;
}

function docCsv(vanBan) {
  const oTatCa = tachDongCsv(vanBan);
  const hang = [];
  let dongHienTai = [];
  for (const o of oTatCa) {
    if (o === null) {
      hang.push(dongHienTai);
      dongHienTai = [];
    } else {
      dongHienTai.push(o);
    }
  }
  if (dongHienTai.length) {
    hang.push(dongHienTai);
  }
  return hang.filter((h) => h.some((o) => String(o).trim() !== ""));
}

class BusLopHocPhan {
  constructor(dao = new website.dao.DaoLopHocPhan()) {
    this.dao = dao;
  }

  kiemTraMaLop(maLop) {
    if (!MA_LOP_HOP_LE.test(String(maLop || ""))) {
      throw new website.phien.LoiNghiepVu("Mã lớp phải gồm 2 số năm, mã học phần, 4 chữ số và 2 số thứ tự");
    }
  }

  kiemTraLop(duLieu) {
    this.kiemTraMaLop(duLieu.ma_lop);
    if (!duLieu.ma_hp) {
      throw new website.phien.LoiNghiepVu("Vui lòng chọn học phần");
    }
    if (!duLieu.ma_dot) {
      throw new website.phien.LoiNghiepVu("Vui lòng chọn đợt đăng ký");
    }
    if (Number(duLieu.suc_chua) <= 0) {
      throw new website.phien.LoiNghiepVu("Sức chứa phải lớn hơn 0");
    }
    for (const buoi of duLieu.lich || []) {
      const thu = Number(buoi.thu);
      const batDau = Number(buoi.tiet_bat_dau);
      const ketThuc = Number(buoi.tiet_ket_thuc);
      if (thu < 2 || thu > 8) {
        throw new website.phien.LoiNghiepVu("Thứ phải nằm trong khoảng 2 đến 8");
      }
      if (batDau <= 0 || ketThuc < batDau) {
        throw new website.phien.LoiNghiepVu("Khoảng tiết học không hợp lệ");
      }
    }
  }

  async danhSach(maDot = "") {
    return this.dao.danhSach(maDot);
  }

  async chiTiet(maLop) {
    return this.dao.chiTiet(maLop);
  }

  async luu(duLieu) {
    this.kiemTraLop(duLieu);
    return this.dao.luu(duLieu);
  }

  async huy(maLop, lyDo) {
    if (!String(lyDo || "").trim()) {
      throw new website.phien.LoiNghiepVu("Vui lòng nhập lý do hủy lớp");
    }
    return this.dao.huy(maLop, lyDo);
  }

  docFile(vanBan) {
    const hang = docCsv(vanBan);
    if (hang.length < 2) {
      return { dong: [], loi: [{ dong: 0, ly_do: "File không có dữ liệu" }] };
    }
    const tieuDe = hang[0].map((x) => String(x).trim().toLowerCase());
    const thieu = COT_CSV.filter((cot) => !tieuDe.includes(cot));
    if (thieu.length) {
      return { dong: [], loi: [{ dong: 1, ly_do: `Thiếu cột: ${thieu.join(", ")}` }] };
    }
    const dong = [];
    const loi = [];
    for (let i = 1; i < hang.length; i += 1) {
      const banGhi = {};
      tieuDe.forEach((cot, j) => {
        banGhi[cot] = String(hang[i][j] ?? "").trim();
      });
      try {
        this.kiemTraLop({
          ma_lop: banGhi.ma_lop,
          ma_hp: banGhi.ma_hp,
          ma_dot: banGhi.ma_dot,
          suc_chua: banGhi.suc_chua,
          lich: [{
            thu: banGhi.thu,
            tiet_bat_dau: banGhi.tiet_bat_dau,
            tiet_ket_thuc: banGhi.tiet_ket_thuc
          }]
        });
        if (!banGhi.phong_hoc || !banGhi.giang_vien) {
          throw new website.phien.LoiNghiepVu("Thiếu phòng học hoặc giảng viên");
        }
        dong.push(banGhi);
      } catch (loiDong) {
        loi.push({ dong: i + 1, ma_lop: banGhi.ma_lop, ly_do: loiDong.message });
      }
    }
    return { dong, loi };
  }

  async nhap(tenFile, vanBan) {
    const ketQua = this.docFile(vanBan);
    if (!ketQua.dong.length && ketQua.loi.length) {
      return { so_dong_dung: 0, so_dong_sai: ketQua.loi.length, loi: ketQua.loi };
    }
    return this.dao.nhap(tenFile, ketQua.dong);
  }

  async danhSachNhatKyImport() {
    return this.dao.danhSachNhatKyImport();
  }
}

  website.bus.MA_LOP_HOP_LE = MA_LOP_HOP_LE;
  website.bus.TRANG_THAI_LOP = TRANG_THAI_LOP;
  website.bus.COT_CSV = COT_CSV;
  website.bus.docCsv = docCsv;
  website.bus.BusLopHocPhan = BusLopHocPhan;
})();
