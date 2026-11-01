var website = window.website = window.website || {};
website.dao = website.dao || {};

(function () {
  "use strict";

class DaoLichSu {
  async danhSach() {
    const duLieu = await website.phien.goiRpcCoToken("lich_su_thao_tac");
    return (duLieu || []).map((dong) => new website.dto.DtoNhatKyThaoTac(dong));
  }
}

  website.dao.DaoLichSu = DaoLichSu;
})();
