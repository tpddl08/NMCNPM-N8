var website = window.website = window.website || {};
website.bus = website.bus || {};

(function () {
  "use strict";

class BusLichSu {
  constructor(dao = new website.dao.DaoLichSu()) {
    this.dao = dao;
  }

  async danhSach() {
    return this.dao.danhSach();
  }
}

  website.bus.BusLichSu = BusLichSu;
})();
