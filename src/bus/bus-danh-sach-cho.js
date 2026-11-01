var website = window.website = window.website || {};
website.bus = website.bus || {};

(function () {
  "use strict";

class BusDanhSachCho {
  constructor(dao = new website.dao.DaoDanhSachCho()) {
    this.dao = dao;
  }

  async danhSach() {
    return this.dao.danhSach();
  }

  async danhSachTheoLop(maLop) {
    return this.dao.danhSachTheoLop(maLop);
  }

  async vao(maLop) {
    return this.dao.vao(maLop);
  }

  async xacNhan(maLop) {
    if (!maLop) {
      throw new website.phien.LoiNghiepVu("Vui lòng chọn lớp học phần");
    }
    return this.dao.xacNhan(maLop);
  }

  async roi(maLop) {
    return this.dao.roi(maLop);
  }
}

  website.bus.BusDanhSachCho = BusDanhSachCho;
})();
