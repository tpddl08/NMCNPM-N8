var website = window.website = window.website || {};
website.trang = website.trang || {};

(function () {
  "use strict";

var bus;
const layBus = () => bus || (bus = new website.bus.BusTaiKhoan());

function veDangNhap(thongBao = "") {
  const coCauHinh = website.phien.daCauHinh();
  document.body.className = "login-page";
  document.body.innerHTML = `
    <main class="login-wrap">
      <section class="login-panel">
        <div class="login-brand">
          <span class="brand-mark">ĐK</span>
          <div>
            <h1>Website Đăng ký học phần</h1>
            <p>Phòng đào tạo và sinh viên</p>
          </div>
        </div>
        ${coCauHinh ? "" : `<div class="alert alert-warning">Chưa cấu hình kết nối cơ sở dữ liệu</div>`}
        <div class="alert alert-danger" id="txtThongBao" ${thongBao ? "" : "hidden"}>${website.gui.esc(thongBao)}</div>
        <form id="formDangNhap" novalidate>
          <div class="field">
            <label class="label" for="txtTenDangNhap">Tên đăng nhập</label>
            <input class="input" id="txtTenDangNhap" name="txtTenDangNhap" type="text" autocomplete="username" maxlength="50" ${coCauHinh ? "" : "disabled"}>
          </div>
          <div class="field">
            <label class="label" for="txtMatKhau">Mật khẩu</label>
            <input class="input" id="txtMatKhau" name="txtMatKhau" type="password" autocomplete="current-password" maxlength="100" ${coCauHinh ? "" : "disabled"}>
          </div>
          <button type="submit" class="btn btn-primary btn-block" id="btnDangNhap" ${coCauHinh ? "" : "disabled"}>Đăng nhập</button>
        </form>
        <p class="login-note">Tài khoản bị khóa, vui lòng liên hệ Phòng đào tạo.</p>
      </section>
    </main>
    <div id="khu-thong-bao" class="toasts"></div>
  `;

  website.gui.$("#formDangNhap").addEventListener("submit", async (suKien) => {
    suKien.preventDefault();
    const nut = website.gui.$("#btnDangNhap");
    const hopLe = website.gui.$("#txtThongBao");
    hopLe.hidden = true;
    website.gui.khoaNut(nut, true);
    try {
      const token = await layBus().dangNhap(website.gui.$("#txtTenDangNhap").value, website.gui.$("#txtMatKhau").value);
      website.phien.luuToken(token);
      window.dispatchEvent(new CustomEvent("dang-nhap-thanh-cong"));
    } catch (loi) {
      website.gui.thongBaoLoi(loi);
      const o = website.gui.$("#txtThongBao");
      o.textContent = loi.message;
      o.hidden = false;
    } finally {
      website.gui.khoaNut(nut, false);
    }
  });
}

  website.trang.veDangNhap = veDangNhap;
})();
