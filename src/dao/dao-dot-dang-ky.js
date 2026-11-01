var website = window.website = window.website || {};
website.dao = website.dao || {};

(function () {
  "use strict";

class DaoDotDangKy {
  async danhSach() {
    const duLieu = await website.phien.goiRpcCoToken("danh_sach_dot");
    return (duLieu || []).map((dong) => new website.dto.DtoDotDangKy(dong));
  }

  async dotCuaSinhVien() {
    const duLieu = await website.phien.goiRpcCoToken("dot_cua_sinh_vien");
    return (duLieu || []).map((dong) => new website.dto.DtoDotDangKy(dong));
  }

  async luu(duLieu) {
    return website.phien.goiRpcCoToken("luu_dot", { p_du_lieu: duLieu });
  }
}

  website.dao.DaoDotDangKy = DaoDotDangKy;
})();
