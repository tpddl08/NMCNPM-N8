var website = window.website = window.website || {};
website.dto = website.dto || {};

(function () {
  "use strict";

class DtoTienQuyet {
  constructor(d = {}) {
    this.maHp = d.ma_hp ?? d.maHp ?? "";
    this.maHpTienQuyet = d.ma_hp_tien_quyet ?? d.maHpTienQuyet ?? "";
    this.loaiRangBuoc = d.loai_rang_buoc ?? d.loaiRangBuoc ?? "TienQuyet";
  }
}

  website.dto.DtoTienQuyet = DtoTienQuyet;
})();
