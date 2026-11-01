var website = window.website = window.website || {};
website.dao = website.dao || {};

(function () {
  "use strict";

class DaoSinhVien {
  async danhSach(tuKhoa = "") {
    const duLieu = await website.phien.goiRpcCoToken("danh_sach_sinh_vien", { p_tu_khoa: tuKhoa });
    return (duLieu || []).map((dong) => new website.dto.DtoSinhVien(dong));
  }

  async luu(duLieu) {
    return website.phien.goiRpcCoToken("luu_sinh_vien", { p_du_lieu: duLieu });
  }

  async danhSachKhoa() {
    const duLieu = await website.phien.goiRpcCoToken("danh_sach_khoa");
    return (duLieu || []).map((dong) => new website.dto.DtoKhoa(dong));
  }

  async luuKhoa(duLieu) {
    return website.phien.goiRpcCoToken("luu_khoa", { p_du_lieu: duLieu });
  }

  async xoaKhoa(maKhoa) {
    return website.phien.goiRpcCoToken("xoa_khoa", { p_ma_khoa: maKhoa });
  }

  async danhSachNhom() {
    const duLieu = await website.phien.goiRpcCoToken("danh_sach_nhom");
    return (duLieu || []).map((dong) => new website.dto.DtoNhomSinhVien(dong));
  }

  async luuNhom(duLieu) {
    return website.phien.goiRpcCoToken("luu_nhom", { p_du_lieu: duLieu });
  }

  async xoaNhom(maNhom) {
    return website.phien.goiRpcCoToken("xoa_nhom", { p_ma_nhom: maNhom });
  }
}

  website.dao.DaoSinhVien = DaoSinhVien;
})();
