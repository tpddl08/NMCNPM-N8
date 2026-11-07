var website = window.website = window.website || {};
website.dto = website.dto || {};

(function () {
  "use strict";

class DtoDotNhom {
  constructor(d = {}) {
    this.maDot = d.ma_dot ?? d.maDot ?? "";
    this.maNhom = d.ma_nhom ?? d.maNhom ?? "";
    this.tenNhom = d.ten_nhom ?? d.tenNhom ?? "";
  }
}

  website.dto.DtoDotNhom = DtoDotNhom;
})();
