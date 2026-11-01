var website = window.website = window.website || {};
website.dao = website.dao || {};

(function () {
  "use strict";

class DaoLopHocPhan {
  async danhSach(maDot = "") {
    const duLieu = await website.phien.goiRpcCoToken("danh_sach_lop", { p_ma_dot: maDot || null });
    return (duLieu || []).map((dong) => new website.dto.DtoLopHocPhan(dong));
  }

  async chiTiet(maLop) {
    return new website.dto.DtoLopHocPhan(await website.phien.goiRpcCoToken("chi_tiet_lop", { p_ma_lop: maLop }));
  }

  async luu(duLieu) {
    return website.phien.goiRpcCoToken("luu_lop", { p_du_lieu: duLieu });
  }

  async huy(maLop, lyDo) {
    return website.phien.goiRpcCoToken("huy_lop", { p_ma_lop: maLop, p_ly_do: lyDo });
  }

  async nhap(tenFile, dong) {
    return website.phien.goiRpcCoToken("nhap_lop", { p_ten_file: tenFile, p_dong: dong });
  }

  async danhSachNhatKyImport() {
    const duLieu = await website.phien.goiRpcCoToken("danh_sach_nhat_ky_import");
    return (duLieu || []).map((dong) => new website.dto.DtoNhatKyImport(dong));
  }
}

  website.dao.DaoLopHocPhan = DaoLopHocPhan;
})();
