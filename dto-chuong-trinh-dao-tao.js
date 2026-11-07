var website = window.website = window.website || {};
website.dto = website.dto || {};

(function () {
  "use strict";

class DtoChuongTrinhDaoTao {
  constructor(d = {}) {
    this.maCtdt = d.ma_ctdt ?? d.maCtdt ?? "";
    this.tenCtdt = d.ten_ctdt ?? d.tenCtdt ?? "";
    this.nienKhoa = d.nien_khoa ?? d.nienKhoa ?? "";
    this.hocPhan = d.hoc_phan ?? d.hocPhan ?? [];
  }
}

  website.dto.DtoChuongTrinhDaoTao = DtoChuongTrinhDaoTao;
})();
