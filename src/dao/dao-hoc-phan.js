var website = window.website = window.website || {};
website.dao = website.dao || {};

(function () {
  "use strict";

class DaoHocPhan {
  async danhSach() {
    const duLieu = await website.phien.goiRpcCoToken("danh_sach_hoc_phan");
    return (duLieu || []).map((dong) => new website.dto.DtoHocPhan(dong));
  }

  async luu(duLieu) {
    return website.phien.goiRpcCoToken("luu_hoc_phan", { p_du_lieu: duLieu });
  }

  async xoa(maHp) {
    return website.phien.goiRpcCoToken("xoa_hoc_phan", { p_ma_hp: maHp });
  }

  async danhSachCtdt() {
    const duLieu = await website.phien.goiRpcCoToken("danh_sach_ctdt");
    return (duLieu || []).map((dong) => new website.dto.DtoChuongTrinhDaoTao(dong));
  }

  async luuCtdt(duLieu) {
    return website.phien.goiRpcCoToken("luu_ctdt", { p_du_lieu: duLieu });
  }

  async danhSachKetQua(maSv = "") {
    const duLieu = await website.phien.goiRpcCoToken("danh_sach_ket_qua", { p_ma_sv: maSv || null });
    return (duLieu || []).map((dong) => new website.dto.DtoKetQuaHocTap(dong));
  }

  async luuKetQua(duLieu) {
    return website.phien.goiRpcCoToken("luu_ket_qua", { p_du_lieu: duLieu });
  }

  async ctdtCuaSinhVien() {
    const duLieu = await website.phien.goiRpcCoToken("ctdt_cua_sinh_vien");
    return duLieu || [];
  }

  async ketQuaCuaSinhVien() {
    const duLieu = await website.phien.goiRpcCoToken("ket_qua_cua_sinh_vien");
    return (duLieu || []).map((dong) => new website.dto.DtoKetQuaHocTap(dong));
  }
}

  website.dao.DaoHocPhan = DaoHocPhan;
})();
