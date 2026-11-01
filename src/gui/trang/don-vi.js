var website = window.website = window.website || {};
website.trang = website.trang || {};

(function () {
  "use strict";

var bus;
const layBus = () => bus || (bus = new website.bus.BusSinhVien());

async function khoa() {
  const danhSach = await layBus().danhSachKhoa();
}

async function nhomSinhVien() {
  const [danhSach, khoa] = await Promise.all([layBus().danhSachNhom(), layBus().danhSachKhoa()]);
  const noiDung = `
    <section class="card">
      <div class="card-header">
        <h2 class="card-title">Danh sách nhóm sinh viên</h2>
      </div>
      <div class="card-body tight">
        ${website.gui.bang([
          { ten: "Mã nhóm" },
          { ten: "Tên nhóm" },
          { ten: "Khoa" },
          { ten: "Thao tác", lop: "text-right" }
        ], danhSach.map((x) => [
          website.gui.esc(x.maNhom),
          website.gui.esc(x.tenNhom),
          website.gui.esc(x.tenKhoa),
          `<button type="button" class="btn btn-sm btn-ghost" data-sua="${website.gui.esc(x.maNhom)}">Sửa</button>
           <button type="button" class="btn btn-sm btn-ghost" data-xoa="${website.gui.esc(x.maNhom)}">Xóa</button>`
        ]))}
      </div>
    </section>
    <section class="card">
      <div class="card-header"><h2 class="card-title">Thông tin nhóm</h2></div>
      <div class="card-body">
        <form id="formNhom" class="form-grid" novalidate>
          <div class="field">
            <label class="label required" for="txtMaNhom">Mã nhóm</label>
            <input class="input" id="txtMaNhom" name="txtMaNhom" type="text" maxlength="20">
          </div>
          <div class="field">
            <label class="label required" for="txtTenNhom">Tên nhóm</label>
            <input class="input" id="txtTenNhom" name="txtTenNhom" type="text" maxlength="100">
          </div>
          <div class="field">
            <label class="label required" for="cboKhoaNhom">Khoa</label>
            <select class="select" id="cboKhoaNhom" name="cboKhoaNhom">${website.gui.tuyChon(khoa, "maKhoa", "tenKhoa", "", "Chọn khoa")}</select>
          </div>
          <div class="page-actions field-full">
            <button type="submit" class="btn btn-primary" id="btnLuuNhom">Lưu nhóm</button>
          </div>
        </form>
      </div>
    </section>
  `;

  return {
    tieuDe: "Nhóm sinh viên",
    noiDung,
    gan() {
      const form = website.gui.$("#formNhom");
      const lamMoi = () => {
        form.reset();
        website.gui.$("#txtMaNhom").readOnly = false;
      };
      document.querySelectorAll("[data-sua]").forEach((nut) => {
        nut.addEventListener("click", () => {
          const x = danhSach.find((n) => n.maNhom === nut.dataset.sua);
          website.gui.$("#txtMaNhom").value = x.maNhom;
          website.gui.$("#txtMaNhom").readOnly = true;
          website.gui.$("#txtTenNhom").value = x.tenNhom;
          website.gui.$("#cboKhoaNhom").value = x.maKhoa;
        });
      });
      document.querySelectorAll("[data-xoa]").forEach((nut) => {
        nut.addEventListener("click", () => website.gui.chayNut(nut, async () => {
          if (!confirm(`Xóa nhóm ${nut.dataset.xoa}?`)) return;
          await layBus().xoaNhom(nut.dataset.xoa);
          website.gui.thongBao("Đã xóa nhóm");
          location.reload();
        }));
      });
      form.addEventListener("submit", (suKien) => {
        suKien.preventDefault();
        website.gui.chayNut(website.gui.$("#btnLuuNhom"), async () => {
          await layBus().luuNhom({
            ma_nhom: website.gui.$("#txtMaNhom").value,
            ten_nhom: website.gui.$("#txtTenNhom").value,
            ma_khoa: website.gui.$("#cboKhoaNhom").value
          });
          website.gui.thongBao("Đã lưu nhóm");
          location.reload();
        });
      });
    }
  };
}

  website.trang.khoa = khoa;
  website.trang.nhomSinhVien = nhomSinhVien;
})();
