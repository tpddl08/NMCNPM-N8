var website = window.website = window.website || {};
website.trang = website.trang || {};

(function () {
  "use strict";

var bus;
const layBus = () => bus || (bus = new website.bus.BusHocPhan());

const TEN_LOAI = {
  TienQuyet: "Tiên quyết",
  HocTruoc: "Học trước"
};

async function quanLyHocPhan() {
  const danhSach = await layBus().danhSach();
  let tienQuyet = [];

  const veTienQuyet = () => {
    website.gui.$("#dgvTienQuyet").innerHTML = tienQuyet.length
      ? tienQuyet.map((x, i) => `
        <tr>
          <td>${website.gui.esc(x.ma_hp_tien_quyet)}</td>
          <td>${website.gui.esc(TEN_LOAI[x.loai_rang_buoc])}</td>
          <td class="text-right"><button type="button" class="btn btn-sm btn-ghost" data-bo="${i}">Bỏ</button></td>
        </tr>
      `).join("")
      : '<tr><td colspan="3" class="trong">Chưa có ràng buộc</td></tr>';
    document.querySelectorAll("[data-bo]").forEach((nut) => {
      nut.addEventListener("click", () => {
        tienQuyet.splice(Number(nut.dataset.bo), 1);
        veTienQuyet();
      });
    });
  };

  const noiDung = `
    <section class="card">
      <div class="card-header">
        <h2 class="card-title">Danh sách học phần</h2>
        <button type="button" class="btn btn-sm btn-accent" id="btnThemHocPhan">Thêm học phần</button>
      </div>
      <div class="card-body tight">
        ${website.gui.bang([
          { ten: "Mã học phần" },
          { ten: "Tên học phần" },
          { ten: "Tín chỉ", lop: "num" },
          { ten: "Ràng buộc" },
          { ten: "Thao tác", lop: "text-right" }
        ], danhSach.map((x) => [
          website.gui.esc(x.maHp),
          website.gui.esc(x.tenHp),
          website.gui.esc(x.soTinChi),
          website.gui.esc((x.tienQuyet || []).map((t) => `${t.ma_hp_tien_quyet} (${TEN_LOAI[t.loai_rang_buoc]})`).join(", ") || "—"),
          `<button type="button" class="btn btn-sm btn-ghost" data-sua="${website.gui.esc(x.maHp)}">Sửa</button>
           <button type="button" class="btn btn-sm btn-ghost" data-xoa="${website.gui.esc(x.maHp)}">Xóa</button>`
        ]))}
      </div>
    </section>
    <section class="card">
      <div class="card-header"><h2 class="card-title">Thông tin học phần</h2></div>
      <div class="card-body">
        <form id="formHocPhan" class="form-grid" novalidate>
          <div class="field">
            <label class="label" for="txtMaHp">Mã học phần</label>
            <input class="input" id="txtMaHp" name="txtMaHp" type="text" maxlength="20" placeholder="COMP1001">
          </div>
          <div class="field">
            <label class="label" for="txtTenHp">Tên học phần</label>
            <input class="input" id="txtTenHp" name="txtTenHp" type="text" maxlength="150">
          </div>
          <div class="field">
            <label class="label" for="txtSoTinChi">Số tín chỉ</label>
            <input class="input" id="txtSoTinChi" name="txtSoTinChi" type="number" min="1" max="10">
          </div>
        </form>
        <h3 class="section-title">Học phần tiên quyết / học trước</h3>
        <div class="form-row">
          <div class="field">
            <label class="label" for="cboTienQuyet">Học phần</label>
            <select class="select" id="cboTienQuyet">${website.gui.tuyChon(danhSach, "maHp", "tenHp", "", "Chọn học phần")}</select>
          </div>
          <div class="field">
            <label class="label" for="cboLoaiRangBuoc">Loại ràng buộc</label>
            <select class="select" id="cboLoaiRangBuoc">
              <option value="TienQuyet">Tiên quyết</option>
              <option value="HocTruoc">Học trước</option>
            </select>
          </div>
          <div class="field field-inline">
            <button type="button" class="btn btn-sm btn-accent" id="btnThemRangBuoc">Thêm ràng buộc</button>
          </div>
        </div>
        <div class="table-scroll">
          <table class="data"><thead><tr><th>Học phần</th><th>Loại</th><th></th></tr></thead><tbody id="dgvTienQuyet"></tbody></table>
        </div>
        <div class="page-actions">
          <button type="button" class="btn btn-primary" id="btnLuuHocPhan">Lưu học phần</button>
          <button type="button" class="btn btn-ghost" id="btnMoiHocPhan">Làm mới</button>
        </div>
      </div>
    </section>
  `;

  return {
    tieuDe: "Quản lý học phần",
    noiDung,
    gan() {
      const lamMoi = () => {
        website.gui.$("#txtMaHp").value = "";
        website.gui.$("#txtMaHp").readOnly = false;
        website.gui.$("#txtTenHp").value = "";
        website.gui.$("#txtSoTinChi").value = "";
        tienQuyet = [];
        veTienQuyet();
      };
      veTienQuyet();
      website.gui.$("#btnThemHocPhan").addEventListener("click", lamMoi);
      website.gui.$("#btnMoiHocPhan").addEventListener("click", lamMoi);
      website.gui.$("#btnThemRangBuoc").addEventListener("click", () => {
        const ma = website.gui.$("#cboTienQuyet").value;
        if (!ma) {
          website.gui.thongBao("Vui lòng chọn học phần", "loi");
          return;
        }
        if (tienQuyet.some((x) => x.ma_hp_tien_quyet === ma)) {
          website.gui.thongBao("Ràng buộc đã tồn tại", "loi");
          return;
        }
        tienQuyet.push({ ma_hp_tien_quyet: ma, loai_rang_buoc: website.gui.$("#cboLoaiRangBuoc").value });
        veTienQuyet();
      });
      document.querySelectorAll("[data-sua]").forEach((nut) => {
        nut.addEventListener("click", () => {
          const x = danhSach.find((h) => h.maHp === nut.dataset.sua);
          website.gui.$("#txtMaHp").value = x.maHp;
          website.gui.$("#txtMaHp").readOnly = true;
          website.gui.$("#txtTenHp").value = x.tenHp;
          website.gui.$("#txtSoTinChi").value = x.soTinChi;
          tienQuyet = (x.tienQuyet || []).map((t) => ({
            ma_hp_tien_quyet: t.ma_hp_tien_quyet,
            loai_rang_buoc: t.loai_rang_buoc
          }));
          veTienQuyet();
        });
      });
      document.querySelectorAll("[data-xoa]").forEach((nut) => {
        nut.addEventListener("click", () => website.gui.chayNut(nut, async () => {
          if (!confirm(`Xóa học phần ${nut.dataset.xoa}?`)) return;
          await layBus().xoa(nut.dataset.xoa);
          website.gui.thongBao("Đã xóa học phần");
          location.reload();
        }));
      });
      website.gui.$("#btnLuuHocPhan").addEventListener("click", () => website.gui.chayNut(website.gui.$("#btnLuuHocPhan"), async () => {
        await layBus().luu({
          ma_hp: website.gui.$("#txtMaHp").value,
          ten_hp: website.gui.$("#txtTenHp").value,
          so_tin_chi: website.gui.$("#txtSoTinChi").value,
          tien_quyet: tienQuyet
        });
        website.gui.thongBao("Đã lưu học phần");
        location.reload();
      }));
    }
  };
}

async function chuongTrinhDaoTaoQuanTri() {
  const [danhSach, hocPhan] = await Promise.all([layBus().danhSachCtdt(), layBus().danhSach()]);
  const noiDung = `
    <section class="card">
      <div class="card-header">
        <h2 class="card-title">Chương trình đào tạo</h2>
        <button type="button" class="btn btn-sm btn-accent" id="btnThemCtdt">Thêm chương trình</button>
      </div>
      <div class="card-body tight">
        ${website.gui.bang([
          { ten: "Mã chương trình" },
          { ten: "Tên chương trình" },
          { ten: "Niên khóa" },
          { ten: "Số học phần", lop: "num" },
          { ten: "Thao tác", lop: "text-right" }
        ], danhSach.map((x) => [
          website.gui.esc(x.maCtdt),
          website.gui.esc(x.tenCtdt),
          website.gui.esc(x.nienKhoa),
          website.gui.esc((x.hocPhan || []).length),
          `<button type="button" class="btn btn-sm btn-ghost" data-sua="${website.gui.esc(x.maCtdt)}">Sửa</button>`
        ]))}
      </div>
    </section>
    <section class="card">
      <div class="card-header"><h2 class="card-title">Thông tin chương trình</h2></div>
      <div class="card-body">
        <div class="form-grid">
          <div class="field">
            <label class="label" for="txtMaCtdt">Mã chương trình</label>
            <input class="input" id="txtMaCtdt" type="text" maxlength="20">
          </div>
          <div class="field">
            <label class="label" for="txtTenCtdt">Tên chương trình</label>
            <input class="input" id="txtTenCtdt" type="text" maxlength="150">
          </div>
          <div class="field">
            <label class="label" for="txtNienKhoaCtdt">Niên khóa</label>
            <input class="input" id="txtNienKhoaCtdt" type="text" maxlength="20" placeholder="2024-2028">
          </div>
        </div>
        <h3 class="section-title">Học phần trong chương trình</h3>
        <div class="table-scroll">
          <table class="data">
            <thead><tr><th>Chọn</th><th>Mã</th><th>Học phần</th><th class="num">Học kỳ</th></tr></thead>
            <tbody id="dgvCtdtHocPhan">
              ${hocPhan.map((x) => `
                <tr>
                  <td><input type="checkbox" class="chk-ctdt" value="${website.gui.esc(x.maHp)}"></td>
                  <td>${website.gui.esc(x.maHp)}</td>
                  <td>${website.gui.esc(x.tenHp)}</td>
                  <td><input class="input input-sm" type="number" min="1" max="8" data-hoc-ky="${website.gui.esc(x.maHp)}" value="1"></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <div class="page-actions">
          <button type="button" class="btn btn-primary" id="btnLuuCtdt">Lưu chương trình</button>
          <button type="button" class="btn btn-ghost" id="btnMoiCtdt">Làm mới</button>
        </div>
      </div>
    </section>
  `;

  return {
    tieuDe: "Chương trình đào tạo (quản trị)",
    noiDung,
    gan() {
      const lamMoi = () => {
        website.gui.$("#txtMaCtdt").value = "";
        website.gui.$("#txtMaCtdt").readOnly = false;
        website.gui.$("#txtTenCtdt").value = "";
        website.gui.$("#txtNienKhoaCtdt").value = "";
        document.querySelectorAll(".chk-ctdt").forEach((o) => { o.checked = false; });
        document.querySelectorAll("[data-hoc-ky]").forEach((o) => { o.value = 1; });
      };
      website.gui.$("#btnThemCtdt").addEventListener("click", lamMoi);
      website.gui.$("#btnMoiCtdt").addEventListener("click", lamMoi);
      document.querySelectorAll("[data-sua]").forEach((nut) => {
        nut.addEventListener("click", () => {
          const x = danhSach.find((c) => c.maCtdt === nut.dataset.sua);
          website.gui.$("#txtMaCtdt").value = x.maCtdt;
          website.gui.$("#txtMaCtdt").readOnly = true;
          website.gui.$("#txtTenCtdt").value = x.tenCtdt;
          website.gui.$("#txtNienKhoaCtdt").value = x.nienKhoa;
          document.querySelectorAll(".chk-ctdt").forEach((o) => {
            const mon = (x.hocPhan || []).find((m) => m.ma_hp === o.value);
            o.checked = Boolean(mon);
            document.querySelector(`[data-hoc-ky="${o.value}"]`).value = mon?.hoc_ky_du_kien || 1;
          });
        });
      });
      website.gui.$("#btnLuuCtdt").addEventListener("click", () => website.gui.chayNut(website.gui.$("#btnLuuCtdt"), async () => {
        const mon = Array.from(document.querySelectorAll(".chk-ctdt:checked")).map((o) => ({
          ma_hp: o.value,
          hoc_ky_du_kien: document.querySelector(`[data-hoc-ky="${o.value}"]`).value
        }));
        await layBus().luuCtdt({
          ma_ctdt: website.gui.$("#txtMaCtdt").value,
          ten_ctdt: website.gui.$("#txtTenCtdt").value,
          nien_khoa: website.gui.$("#txtNienKhoaCtdt").value,
          hoc_phan: mon
        });
        website.gui.thongBao("Đã lưu chương trình");
        location.reload();
      }));
    }
  };
}

async function ketQuaHocTap(hoSo) {
  if (hoSo.vaiTro === "SV") {
    const danhSach = await layBus().ketQuaCuaSinhVien();
    return {
      tieuDe: "Kết quả học tập",
      noiDung: `
        <section class="card">
          <div class="card-header"><h2 class="card-title">Kết quả của bạn</h2></div>
          <div class="card-body tight">
            ${website.gui.bang([
              { ten: "Học kỳ" }, { ten: "Mã học phần" }, { ten: "Học phần" },
              { ten: "Điểm", lop: "num" }, { ten: "Kết quả" }
            ], danhSach.map((x) => [
              website.gui.esc(x.hocKy), website.gui.esc(x.maHp), website.gui.esc(x.tenHp), website.gui.esc(x.diem),
              Number(x.diem) >= 4 ? '<span class="tag tag-ok">Đạt</span>' : '<span class="tag tag-off">Chưa đạt</span>'
            ]))}
          </div>
        </section>
      `
    };
  }

  const [danhSach, sinhVien, hocPhan] = await Promise.all([
    layBus().danhSachKetQua(),
    new website.bus.BusSinhVien().danhSach(),
    layBus().danhSach()
  ]);
  const maSvOptions = sinhVien.map((x) => ({ ma: x.maSv, nhan: `${x.maSv} - ${x.hoTen}` }));

  return {
    tieuDe: "Kết quả học tập",
    noiDung: `
      <section class="card">
        <div class="card-header">
          <h2 class="card-title">Bảng điểm</h2>
          <span class="muted">${danhSach.length} dòng</span>
        </div>
        <div class="card-body tight">
          ${website.gui.bang([
            { ten: "Mã sinh viên" }, { ten: "Họ tên" }, { ten: "Học kỳ" },
            { ten: "Mã học phần" }, { ten: "Học phần" }, { ten: "Điểm", lop: "num" },
            { ten: "Thao tác", lop: "text-right" }
          ], danhSach.map((x) => [
            website.gui.esc(x.maSv), website.gui.esc(x.hoTen), website.gui.esc(x.hocKy), website.gui.esc(x.maHp), website.gui.esc(x.tenHp), website.gui.esc(x.diem),
            `<button type="button" class="btn btn-sm btn-ghost" data-sua="${x.maKq}">Sửa</button>`
          ]))}
        </div>
      </section>
      <section class="card">
        <div class="card-header"><h2 class="card-title">Ghi nhận kết quả</h2></div>
        <div class="card-body">
          <form id="formKetQua" class="form-grid" novalidate>
            <input type="hidden" id="txtMaKq">
            <div class="field">
              <label class="label" for="cboSinhVienKq">Sinh viên</label>
              <select class="select" id="cboSinhVienKq">${website.gui.tuyChon(maSvOptions, "ma", "nhan", "", "Chọn sinh viên")}</select>
            </div>
            <div class="field">
              <label class="label" for="cboHocPhanKq">Học phần</label>
              <select class="select" id="cboHocPhanKq">${website.gui.tuyChon(hocPhan, "maHp", "tenHp", "", "Chọn học phần")}</select>
            </div>
            <div class="field">
              <label class="label" for="txtHocKyKq">Học kỳ</label>
              <input class="input" id="txtHocKyKq" type="text" maxlength="20" placeholder="HK1 2026-2027">
            </div>
            <div class="field">
              <label class="label" for="txtDiemKq">Điểm</label>
              <input class="input" id="txtDiemKq" type="number" min="0" max="10" step="0.1">
            </div>
            <div class="page-actions field-full">
              <button type="submit" class="btn btn-primary" id="btnLuuKetQua">Lưu kết quả</button>
            </div>
          </form>
        </div>
      </section>
    `,
    gan() {
      document.querySelectorAll("[data-sua]").forEach((nut) => {
        nut.addEventListener("click", () => {
          const x = danhSach.find((k) => String(k.maKq) === nut.dataset.sua);
          website.gui.$("#txtMaKq").value = x.maKq;
          website.gui.$("#cboSinhVienKq").value = x.maSv;
          website.gui.$("#cboHocPhanKq").value = x.maHp;
          website.gui.$("#txtHocKyKq").value = x.hocKy;
          website.gui.$("#txtDiemKq").value = x.diem;
          website.gui.$("#txtDiemKq").focus();
        });
      });
      website.gui.$("#formKetQua").addEventListener("submit", (suKien) => {
        suKien.preventDefault();
        website.gui.chayNut(website.gui.$("#btnLuuKetQua"), async () => {
          await layBus().luuKetQua({
            ma_kq: website.gui.$("#txtMaKq").value || null,
            ma_sv: website.gui.$("#cboSinhVienKq").value,
            ma_hp: website.gui.$("#cboHocPhanKq").value,
            hoc_ky: website.gui.$("#txtHocKyKq").value,
            diem: website.gui.$("#txtDiemKq").value
          });
          website.gui.thongBao("Đã lưu kết quả");
          location.reload();
        });
      });
    }
  };
}

  website.trang.quanLyHocPhan = quanLyHocPhan;
  website.trang.chuongTrinhDaoTaoQuanTri = chuongTrinhDaoTaoQuanTri;
  website.trang.ketQuaHocTap = ketQuaHocTap;
})();
