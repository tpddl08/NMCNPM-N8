var website = window.website = window.website || {};
website.dto = website.dto || {};

(function () {
  "use strict";

class DtoHocPhan {
  constructor(d = {}) {
    this.maHp = d.ma_hp ?? d.maHp ?? "";
    this.tenHp = d.ten_hp ?? d.tenHp ?? "";
    this.soTinChi = Number(d.so_tin_chi ?? d.soTinChi ?? 0);
    this.tienQuyet = d.tien_quyet ?? d.tienQuyet ?? [];
  }
}

  website.dto.DtoHocPhan = DtoHocPhan;
})();
