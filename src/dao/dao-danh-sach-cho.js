var website = window.website = window.website || {};
website.dao = website.dao || {};

(function () {
  "use strict";

class DaoDanhSachCho {
  async danhSach() {
    const duLieu = await website.phien.goiRpcCoToken("danh_sach_cho");
    return (duLieu || []).map((dong) => new website.dto.DtoDanhSachCho(dong));
  }

  async danhSachTheoLop(maLop) {
    const duLieu = await website.phien.goiRpcCoToken("danh_sach_cho_lop", { p_ma_lop: maLop });
    return (duLieu || []).map((dong) => new website.dto.DtoDanhSachCho(dong));
  }

  async vao(maLop) {
    return website.phien.goiRpcCoToken("vao_danh_sach_cho", { p_ma_lop: maLop });
  }

  async xacNhan(maLop) {
    return website.phien.goiRpcCoToken("xac_nhan_cho", { p_ma_lop: maLop });
  }

  async roi(maLop) {
    return website.phien.goiRpcCoToken("roi_danh_sach_cho", { p_ma_lop: maLop });
  }
}

  website.dao.DaoDanhSachCho = DaoDanhSachCho;
})();
