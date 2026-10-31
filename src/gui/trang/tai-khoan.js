var website = window.website = window.website || {};
website.trang = website.trang || {};

(function () {
  "use strict";

var bus;
const layBus = () => bus || (bus = new website.bus.BusTaiKhoan());

async function doiMatKhau() {
  const noiDung = `
    <section class="card">
      <div class="card-header"><h2 class="card-title">Đổi mật khẩu</h2></div>
      <div class="card-body">
        <form id="formDoiMatKhau" class="form-grid" novalidate>
          <div class="field field-full">
            <label class="label" for="txtMatKhauCu">Mật khẩu cũ</label>
            <input class="input" id="txtMatKhauCu" name="txtMatKhauCu" type="password" autocomplete="current-password">
          </div>
          <div class="field">
            <label class="label" for="txtMatKhauMoi">Mật khẩu mới</label>
            <input class="input" id="txtMatKhauMoi" name="txtMatKhauMoi" type="password" autocomplete="new-password">
            <p class="hint">Tối thiểu ${website.bus.MAT_KHAU_TOI_THIEU} ký tự</p>
          </div>
          <div class="field">
            <label class="label" for="txtXacNhanMatKhau">Nhập lại mật khẩu mới</label>
            <input class="input" id="txtXacNhanMatKhau" name="txtXacNhanMatKhau" type="password" autocomplete="new-password">
          </div>
          <div class="field-full page-actions">
            <button type="submit" class="btn btn-primary" id="btnLuuMatKhau">Lưu mật khẩu</button>
          </div>
        </form>
      </div>
    </section>
  `;

  return {
    tieuDe: "Đổi mật khẩu",
    noiDung,
    gan() {
      website.gui.$("#formDoiMatKhau").addEventListener("submit", (suKien) => {
        suKien.preventDefault();
        website.gui.chayNut(website.gui.$("#btnLuuMatKhau"), async () => {
          await layBus().doiMatKhau(
            website.gui.$("#txtMatKhauCu").value,
            website.gui.$("#txtMatKhauMoi").value,
            website.gui.$("#txtXacNhanMatKhau").value
          );
          website.gui.$("#formDoiMatKhau").reset();
          website.gui.thongBao("Đã đổi mật khẩu");
        });
      });
    }
  };
}

async function taiKhoan() {
  const danhSach = await layBus().danhSach();
  const dong = danhSach.map((x) => [
    website.gui.esc(x.tenDangNhap),
    website.gui.esc(x.hoTen || x.maSv || ""),
    x.vaiTro === "PDT" ? "Phòng đào tạo" : "Sinh viên",
    x.trangThai === "HoatDong" ? '<span class="tag tag-ok">Hoạt động</span>' : '<span class="tag tag-off">Bị khóa</span>',
    `<button type="button" class="btn btn-sm btn-ghost" data-sua="${x.maTk}">Sửa</button>`
  ]);

  const noiDung = `
    <section class="card">
      <div class="card-header">
        <h2 class="card-title">Danh sách tài khoản</h2>
        <button type="button" class="btn btn-sm btn-accent" id="btnThemTaiKhoan">Thêm tài khoản</button>
      </div>
      <div class="card-body tight">
        ${website.gui.bang([
          { ten: "Tên đăng nhập" },
          { ten: "Người dùng" },
          { ten: "Vai trò" },
          { ten: "Trạng thái" },
          { ten: "Thao tác", lop: "text-right" }
        ], dong)}
      </div>
    </section>
    <section class="card" id="khuTaiKhoan">
      <div class="card-header"><h2 class="card-title">Thông tin tài khoản</h2></div>
      <div class="card-body">
        <form id="formTaiKhoan" class="form-grid" novalidate>
          <input type="hidden" id="txtMaTk" name="txtMaTk">
          <div class="field">
            <label class="label" for="txtTenDangNhapTk">Tên đăng nhập</label>
            <input class="input" id="txtTenDangNhapTk" name="txtTenDangNhapTk" type="text" maxlength="50">
          </div>
          <div class="field">
            <label class="label" for="cboVaiTro">Vai trò</label>
            <select class="select" id="cboVaiTro" name="cboVaiTro">
              <option value="SV">Sinh viên</option>
              <option value="PDT">Phòng đào tạo</option>
            </select>
          </div>
          <div class="field">
            <label class="label" for="cboTrangThaiTk">Trạng thái</label>
            <select class="select" id="cboTrangThaiTk" name="cboTrangThaiTk">
              <option value="HoatDong">Hoạt động</option>
              <option value="BiKhoa">Bị khóa</option>
            </select>
          </div>
          <div class="field">
            <label class="label" for="txtMatKhauTk">Mật khẩu</label>
            <input class="input" id="txtMatKhauTk" name="txtMatKhauTk" type="password" autocomplete="new-password">
            <p class="hint">Để trống khi không đổi mật khẩu</p>
          </div>
          <div class="page-actions field-full">
            <button type="submit" class="btn btn-primary" id="btnLuuTaiKhoan">Lưu tài khoản</button>
          </div>
        </form>
      </div>
    </section>
  `;

  return {
    tieuDe: "Tài khoản",
    noiDung,
    gan() {
      const form = website.gui.$("#formTaiKhoan");
      const lamMoi = () => {
        form.reset();
        website.gui.$("#txtMaTk").value = "";
        website.gui.$("#txtTenDangNhapTk").disabled = false;
      };
      website.gui.$("#btnThemTaiKhoan").addEventListener("click", lamMoi);
      document.querySelectorAll("[data-sua]").forEach((nut) => {
        nut.addEventListener("click", () => {
          const x = danhSach.find((t) => String(t.maTk) === nut.dataset.sua);
          website.gui.$("#txtMaTk").value = x.maTk;
          website.gui.$("#txtTenDangNhapTk").value = x.tenDangNhap;
          website.gui.$("#cboVaiTro").value = x.vaiTro;
          website.gui.$("#cboTrangThaiTk").value = x.trangThai;
          website.gui.$("#txtMatKhauTk").value = "";
          website.gui.$("#txtTenDangNhapTk").disabled = false;
          website.gui.$("#khuTaiKhoan").scrollIntoView({ behavior: "smooth" });
        });
      });
      form.addEventListener("submit", (suKien) => {
        suKien.preventDefault();
        website.gui.chayNut(website.gui.$("#btnLuuTaiKhoan"), async () => {
          await layBus().luu({
            ma_tk: website.gui.$("#txtMaTk").value || null,
            ten_dang_nhap: website.gui.$("#txtTenDangNhapTk").value,
            vai_tro: website.gui.$("#cboVaiTro").value,
            trang_thai: website.gui.$("#cboTrangThaiTk").value,
            mat_khau: website.gui.$("#txtMatKhauTk").value
          });
          website.gui.thongBao("Đã lưu tài khoản");
          location.reload();
        });
      });
    }
  };
}

  website.trang.doiMatKhau = doiMatKhau;
  website.trang.taiKhoan = taiKhoan;
})();
