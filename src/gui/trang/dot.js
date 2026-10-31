var website = window.website = window.website || {};
website.trang = website.trang || {};

(function () {
  "use strict";

async function cauHinhDotDangKy() {
  const [danhSach, nhom] = await Promise.all([
    new website.bus.BusDotDangKy().danhSach(),
    new website.bus.BusSinhVien().danhSachNhom()
  ]);

  const noiDung = `
    <section class="card">
      <div class="card-header">
        <h2 class="card-title">Danh sách đợt đăng ký</h2>
        <button type="button" class="btn btn-sm btn-accent" id="btnThemDot">Thêm đợt</button>
      </div>
      <div class="card-body tight">
        ${website.gui.bang([
          { ten: "Mã đợt" }, { ten: "Tên đợt" }, { ten: "Học kỳ" },
          { ten: "Mở" }, { ten: "Đóng" }, { ten: "Ngưỡng", lop: "num" },
          { ten: "Nhóm" }, { ten: "Trạng thái" }, { ten: "Thao tác", lop: "text-right" }
        ], danhSach.map((x) => [
          website.gui.esc(x.maDot),
          website.gui.esc(x.tenDot),
          website.gui.esc(`${x.hocKy} ${x.namHoc}`),
          website.gui.thoiGian(x.thoiDiemMo),
          website.gui.thoiGian(x.thoiDiemDong),
          website.gui.esc(x.nguongHuyLop),
          website.gui.esc((x.nhom || []).map((n) => n.ma_nhom).join(", ")),
          `<span class="tag ${x.dangMo ? "tag-ok" : "tag-off"}">${x.dangMo ? "Đang mở" : "Ngoài thời gian"}</span>`,
          `<button type="button" class="btn btn-sm btn-ghost" data-sua="${website.gui.esc(x.maDot)}">Sửa</button>`
        ]))}
      </div>
    </section>
    <section class="card">
      <div class="card-header"><h2 class="card-title">Thông tin đợt đăng ký</h2></div>
      <div class="card-body">
        <form id="formDot" class="form-grid" novalidate>
          <div class="field">
            <label class="label" for="txtMaDot">Mã đợt</label>
            <input class="input" id="txtMaDot" type="text" maxlength="20">
          </div>
          <div class="field">
            <label class="label" for="txtTenDot">Tên đợt</label>
            <input class="input" id="txtTenDot" type="text" maxlength="150">
          </div>
          <div class="field">
            <label class="label" for="txtHocKy">Học kỳ</label>
            <input class="input" id="txtHocKy" type="text" maxlength="20" placeholder="HK1">
          </div>
          <div class="field">
            <label class="label" for="txtNamHoc">Năm học</label>
            <input class="input" id="txtNamHoc" type="text" maxlength="20" placeholder="2026-2027">
          </div>
          <div class="field">
            <label class="label" for="dtpThoiDiemMo">Thời điểm mở</label>
            <input class="input" id="dtpThoiDiemMo" type="datetime-local">
          </div>
          <div class="field">
            <label class="label" for="dtpThoiDiemDong">Thời điểm đóng</label>
            <input class="input" id="dtpThoiDiemDong" type="datetime-local">
          </div>
          <div class="field">
            <label class="label" for="txtNguongHuy">Ngưỡng hủy lớp</label>
            <input class="input" id="txtNguongHuy" type="number" min="0" value="${website.bus.NGUONG_HUY_MAC_DINH}">
          </div>
          <div class="field field-full">
            <span class="label">Nhóm được phép đăng ký</span>
            <div class="check-list">
              ${nhom.map((n) => `<label class="check"><input type="checkbox" class="chk-nhom-dot" value="${website.gui.esc(n.maNhom)}"> ${website.gui.esc(n.maNhom)} - ${website.gui.esc(n.tenNhom)}</label>`).join("")}
            </div>
          </div>
          <div class="page-actions field-full">
            <button type="submit" class="btn btn-primary" id="btnLuuDot">Lưu đợt</button>
            <button type="button" class="btn btn-ghost" id="btnMoiDot">Làm mới</button>
          </div>
        </form>
      </div>
    </section>
  `;

  return {
    tieuDe: "Cấu hình đợt đăng ký",
    noiDung,
    gan() {
      const lamMoi = () => {
        website.gui.$("#formDot").reset();
        website.gui.$("#txtMaDot").readOnly = false;
        website.gui.$("#txtNguongHuy").value = website.bus.NGUONG_HUY_MAC_DINH;
        document.querySelectorAll(".chk-nhom-dot").forEach((o) => { o.checked = false; });
      };
      website.gui.$("#btnThemDot").addEventListener("click", lamMoi);
      website.gui.$("#btnMoiDot").addEventListener("click", lamMoi);
      document.querySelectorAll("[data-sua]").forEach((nut) => {
        nut.addEventListener("click", () => {
          const x = danhSach.find((d) => d.maDot === nut.dataset.sua);
          website.gui.$("#txtMaDot").value = x.maDot;
          website.gui.$("#txtMaDot").readOnly = true;
          website.gui.$("#txtTenDot").value = x.tenDot;
          website.gui.$("#txtHocKy").value = x.hocKy;
          website.gui.$("#txtNamHoc").value = x.namHoc;
          website.gui.$("#dtpThoiDiemMo").value = website.gui.ngayGioChoInput(x.thoiDiemMo);
          website.gui.$("#dtpThoiDiemDong").value = website.gui.ngayGioChoInput(x.thoiDiemDong);
          website.gui.$("#txtNguongHuy").value = x.nguongHuyLop;
          const ds = new Set((x.nhom || []).map((n) => n.ma_nhom));
          document.querySelectorAll(".chk-nhom-dot").forEach((o) => { o.checked = ds.has(o.value); });
        });
      });
      website.gui.$("#formDot").addEventListener("submit", (suKien) => {
        suKien.preventDefault();
        website.gui.chayNut(website.gui.$("#btnLuuDot"), async () => {
          await new website.bus.BusDotDangKy().luu({
            ma_dot: website.gui.$("#txtMaDot").value,
            ten_dot: website.gui.$("#txtTenDot").value,
            hoc_ky: website.gui.$("#txtHocKy").value,
            nam_hoc: website.gui.$("#txtNamHoc").value,
            thoi_diem_mo: website.gui.$("#dtpThoiDiemMo").value,
            thoi_diem_dong: website.gui.$("#dtpThoiDiemDong").value,
            nguong_huy_lop: website.gui.$("#txtNguongHuy").value,
            nhom: Array.from(document.querySelectorAll(".chk-nhom-dot:checked")).map((o) => ({ ma_nhom: o.value }))
          });
          website.gui.thongBao("Đã lưu đợt đăng ký");
          location.reload();
        });
      });
    }
  };
}

async function xuLySauDot() {
  const danhSach = await new website.bus.BusDotDangKy().danhSach();
  const daDong = danhSach.filter((x) => !x.dangMo && new Date(x.thoiDiemDong).getTime() <= Date.now());

  const noiDung = `
    <section class="card">
      <div class="card-header"><h2 class="card-title">Xử lý lớp dưới ngưỡng</h2></div>
      <div class="card-body">
        <div class="alert alert-warning">
          Sau khi đợt kết thúc, lớp có số đăng ký hiệu lực nhỏ hơn ngưỡng sẽ bị hủy và đăng ký chuyển sang trạng thái lớp bị hủy. Chạy lại không tạo thêm thay đổi.
        </div>
        <div class="field">
          <label class="label" for="cboDotXuLy">Đợt đã kết thúc</label>
          <select class="select" id="cboDotXuLy">
            <option value="">Chọn đợt</option>
            ${daDong.map((x) => `<option value="${website.gui.esc(x.maDot)}">${website.gui.esc(x.maDot)} - ${website.gui.esc(x.tenDot)} (ngưỡng ${website.gui.esc(x.nguongHuyLop)})</option>`).join("")}
          </select>
        </div>
        <div class="page-actions">
          <button type="button" class="btn btn-primary" id="btnXuLy">Xử lý đợt</button>
        </div>
        <div id="ketQuaXuLy"></div>
      </div>
    </section>
  `;

  return {
    tieuDe: "Xử lý sau đợt",
    noiDung,
    gan() {
      website.gui.$("#btnXuLy").addEventListener("click", () => website.gui.chayNut(website.gui.$("#btnXuLy"), async () => {
        const maDot = website.gui.$("#cboDotXuLy").value;
        const ketQua = await new website.bus.BusDangKy().xuLySauDot(maDot);
        website.gui.$("#ketQuaXuLy").innerHTML = `
          <div class="alert alert-success">
            Đã hủy ${ketQua.so_lop_huy} lớp và ${ketQua.so_dang_ky_huy} đăng ký.
          </div>
        `;
        website.gui.thongBao("Đã xử lý sau đợt");
      }));
    }
  };
}

  website.trang.cauHinhDotDangKy = cauHinhDotDangKy;
  website.trang.xuLySauDot = xuLySauDot;
})();
