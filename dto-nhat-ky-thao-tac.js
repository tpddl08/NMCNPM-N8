var website = window.website = window.website || {};
website.dto = website.dto || {};

(function () {
  "use strict";

class DtoNhatKyThaoTac {
  constructor(d = {}) {
    this.maLog = Number(d.ma_log ?? d.maLog ?? 0);
    this.thoiGian = d.thoi_gian ?? d.thoiGian ?? "";
    this.loaiThaoTac = d.loai_thao_tac ?? d.loaiThaoTac ?? "";
    this.ketQua = d.ket_qua ?? d.ketQua ?? "";
    this.lyDo = d.ly_do ?? d.lyDo ?? "";
    this.maTk = Number(d.ma_tk ?? d.maTk ?? 0);
    this.maSv = d.ma_sv ?? d.maSv ?? "";
    this.maLop = d.ma_lop ?? d.maLop ?? "";
    this.tenDangNhap = d.ten_dang_nhap ?? d.tenDangNhap ?? "";
  }
}

  website.dto.DtoNhatKyThaoTac = DtoNhatKyThaoTac;
})();
