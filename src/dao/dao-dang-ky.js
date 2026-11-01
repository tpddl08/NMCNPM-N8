var website = window.website = window.website || {};
website.dao = website.dao || {};

(function () {
  "use strict";

class DaoDangKy {
  async lopDangMo() {
    const duLieu = await website.phien.goiRpcCoToken("lop_dang_mo");
    return (duLieu || []).map((dong) => new website.dto.DtoLopHocPhan(dong));
  }

  async dangKy(maLop) {
    return website.phien.goiRpcCoToken("dang_ky", { p_ma_lop: maLop });
  }

  async dangKyHo(maSv, maLop, lyDo) {
    return website.phien.goiRpcCoToken("dang_ky_ho", { p_ma_sv: maSv, p_ma_lop: maLop, p_ly_do: lyDo });
  }

  async huy(maDangKy, lyDo = "") {
    return website.phien.goiRpcCoToken("huy_dang_ky", { p_ma_dang_ky: maDangKy, p_ly_do: lyDo });
  }

  async hocPhanDaDangKy() {
    const duLieu = await website.phien.goiRpcCoToken("hoc_phan_da_dang_ky");
    return (duLieu || []).map((dong) => new website.dto.DtoDangKy(dong));
  }

  async danhSachGhiDanh() {
    const duLieu = await website.phien.goiRpcCoToken("danh_sach_ghi_danh");
    return (duLieu || []).map((dong) => new website.dto.DtoGhiDanhHocPhan(dong));
  }

  async ghiDanh(maHp, maDot) {
    return website.phien.goiRpcCoToken("ghi_danh_hoc_phan", { p_ma_hp: maHp, p_ma_dot: maDot });
  }

  async thongKeGhiDanh() {
    const duLieu = await website.phien.goiRpcCoToken("thong_ke_ghi_danh");
    return duLieu || [];
  }

  async huyGhiDanh(maHp, maDot) {
    return website.phien.goiRpcCoToken("huy_ghi_danh_hoc_phan", { p_ma_hp: maHp, p_ma_dot: maDot });
  }

  async xuLySauDot(maDot) {
    return website.phien.goiRpcCoToken("xu_ly_sau_dot", { p_ma_dot: maDot });
  }
}

  website.dao.DaoDangKy = DaoDangKy;
})();
