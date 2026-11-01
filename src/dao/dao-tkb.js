var website = window.website = window.website || {};
website.dao = website.dao || {};

(function () {
  "use strict";

class DaoTKB {
  async thoiKhoaBieu() {
    const duLieu = await website.phien.goiRpcCoToken("thoi_khoa_bieu");
    return (duLieu || []).map((dong) => new website.dto.DtoLichHoc(dong));
  }

  async duKien() {
    const duLieu = await website.phien.goiRpcCoToken("thoi_khoa_bieu_du_kien");
    return (duLieu || []).map((dong) => new website.dto.DtoLichHoc(dong));
  }
}

  website.dao.DaoTKB = DaoTKB;
})();
