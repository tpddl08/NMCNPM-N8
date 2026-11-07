var website = window.website = window.website || {};
website.dto = website.dto || {};

(function () {
  "use strict";

class DtoCtdtHocPhan {
  constructor(d = {}) {
    this.maCtdt = d.ma_ctdt ?? d.maCtdt ?? "";
    this.maHp = d.ma_hp ?? d.maHp ?? "";
    this.hocKyDuKien = Number(d.hoc_ky_du_kien ?? d.hocKyDuKien ?? 0);
    this.tenHp = d.ten_hp ?? d.tenHp ?? "";
    this.soTinChi = Number(d.so_tin_chi ?? d.soTinChi ?? 0);
  }
}

  website.dto.DtoCtdtHocPhan = DtoCtdtHocPhan;
})();
