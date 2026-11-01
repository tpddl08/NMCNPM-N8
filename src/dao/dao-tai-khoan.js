var website = window.website = window.website || {};
website.dao = website.dao || {};

(function () {
  "use strict";

class DaoTaiKhoan {
  async dangNhap(tenDangNhap, matKhau) {
    return website.phien.goiRpc("dang_nhap", { p_ten_dang_nhap: tenDangNhap, p_mat_khau: matKhau });
  }

  async layHoSo() {
    return new website.dto.DtoNguoiDung(await website.phien.goiRpcCoToken("lay_ho_so"));
  }

  async doiMatKhau(matKhauCu, matKhauMoi) {
    return website.phien.goiRpcCoToken("doi_mat_khau", {
      p_mat_khau_cu: matKhauCu,
      p_mat_khau_moi: matKhauMoi
    });
  }

  async thongKe() {
    return website.phien.goiRpcCoToken("thong_ke");
  }

  async danhSach() {
    const duLieu = await website.phien.goiRpcCoToken("danh_sach_tai_khoan");
    return (duLieu || []).map((dong) => new website.dto.DtoNguoiDung(dong));
  }

  async luu(duLieu) {
    return website.phien.goiRpcCoToken("luu_tai_khoan", { p_du_lieu: duLieu });
  }
}

  website.dao.DaoTaiKhoan = DaoTaiKhoan;
})();
