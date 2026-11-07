var website = window.website = window.website || {};
website.dto = website.dto || {};

(function () {
  "use strict";

class DtoNhatKyImport {
  constructor(d = {}) {
    this.maImport = Number(d.ma_import ?? d.maImport ?? 0);
    this.thoiGian = d.thoi_gian ?? d.thoiGian ?? "";
    this.tenFile = d.ten_file ?? d.tenFile ?? "";
    this.soDongDung = Number(d.so_dong_dung ?? d.soDongDung ?? 0);
    this.soDongSai = Number(d.so_dong_sai ?? d.soDongSai ?? 0);
    this.maTk = Number(d.ma_tk ?? d.maTk ?? 0);
    this.tenDangNhap = d.ten_dang_nhap ?? d.tenDangNhap ?? "";
  }
}

  website.dto.DtoNhatKyImport = DtoNhatKyImport;
})();
