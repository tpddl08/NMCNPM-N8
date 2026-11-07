var website = window.website = window.website || {};
website.dto = website.dto || {};

(function () {
  "use strict";

class DtoKhoa {
  constructor(d = {}) {
    this.maKhoa = d.ma_khoa ?? d.maKhoa ?? "";
    this.tenKhoa = d.ten_khoa ?? d.tenKhoa ?? "";
  }
}

  website.dto.DtoKhoa = DtoKhoa;
})();
