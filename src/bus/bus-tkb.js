var website = window.website = window.website || {};
website.bus = website.bus || {};

(function () {
  "use strict";

class BusTKB {
  constructor(dao = new website.dao.DaoTKB()) {
    this.dao = dao;
  }

  async thoiKhoaBieu() {
    return this.dao.thoiKhoaBieu();
  }

  async duKien() {
    return this.dao.duKien();
  }

  taoBang(lich) {
    const bang = {};
    for (let thu = 2; thu <= 8; thu += 1) {
      bang[thu] = [];
    }
    for (const buoi of lich || []) {
      if (bang[buoi.thu]) {
        bang[buoi.thu].push(buoi);
      }
    }
    for (const thu of Object.keys(bang)) {
      bang[thu].sort((a, b) => Number(a.tiet_bat_dau) - Number(b.tiet_bat_dau));
    }
    return bang;
  }

  tuyChonKy(lich) {
    const dong = new Map();
    for (const buoi of lich || []) {
      const khoa = `${buoi.hocKy}|${buoi.namHoc}`;
      if (!dong.has(khoa)) {
        dong.set(khoa, { hocKy: buoi.hocKy, namHoc: buoi.namHoc, thoiDiemMo: buoi.thoiDiemMo });
      }
    }
    return Array.from(dong.values()).sort((a, b) =>
      new Date(a.thoiDiemMo || 0).getTime() - new Date(b.thoiDiemMo || 0).getTime()
    );
  }

  kyGanNhat(lich) {
    const ki = this.tuyChonKy(lich);
    return ki[ki.length - 1] || null;
  }

  kyDangHienHanh(lich, taiLuc = Date.now()) {
    const ki = this.tuyChonKy(lich);
    let macDinh = ki[0] || null;
    for (const k of ki) {
      if (new Date(k.thoiDiemMo || 0).getTime() <= taiLuc) {
        macDinh = k;
      }
    }
    return macDinh;
  }

  locTheoKy(lich, hocKy, namHoc) {
    if (!hocKy || !namHoc) {
      return lich || [];
    }
    return (lich || []).filter((x) => x.hocKy === hocKy && x.namHoc === namHoc);
  }
}

  website.bus.BusTKB = BusTKB;
})();
