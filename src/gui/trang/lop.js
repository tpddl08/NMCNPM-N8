var website = window.website = window.website || {};
website.trang = website.trang || {};

(function () {
  "use strict";

var bus;
const layBus = () => bus || (bus = new website.bus.BusLopHocPhan());

const TEN_TRANG_THAI_LOP = {
  Mo: "Đang mở",
  Dong: "Đã đóng",
  BiHuy: "Đã hủy"
};

function dongBuoi(buoi, chiSo) {
  return `
    <tr>
      <td>
        <select class="select select-sm" data-thu="${chiSo}">
          ${[2, 3, 4, 5, 6, 7, 8].map((t) => `<option value="${t}" ${Number(buoi.thu) === t ? "selected" : ""}>${website.gui.tenThu(t)}</option>`).join("")}
        </select>
      </td>
      <td><input class="input input-sm" type="number" min="1" max="15" data-bat-dau="${chiSo}" value="${website.gui.esc(buoi.tiet_bat_dau || 1)}"></td>
      <td><input class="input input-sm" type="number" min="1" max="15" data-ket-thuc="${chiSo}" value="${website.gui.esc(buoi.tiet_ket_thuc || 3)}"></td>
      <td><input class="input input-sm" type="text" maxlength="30" data-phong="${chiSo}" value="${website.gui.esc(buoi.phong_hoc || "")}"></td>
      <td><input class="input input-sm" type="text" maxlength="100" data-giang-vien="${chiSo}" value="${website.gui.esc(buoi.giang_vien || "")}"></td>
      <td class="text-right"><button type="button" class="btn btn-sm btn-ghost" data-bo-buoi="${chiSo}">Bỏ</button></td>
    </tr>
  `;
}

async function quanLyLopHocPhan() {
  const [danhSach, hocPhan, dot] = await Promise.all([
    layBus().danhSach(),
    new website.bus.BusHocPhan().danhSach(),
    new website.bus.BusDotDangKy().danhSach()
  ]);
  let lich = [];

  const veLich = () => {
    website.gui.$("#dgvLichHoc").innerHTML = lich.length
      ? lich.map((b, i) => dongBuoi(b, i)).join("")
      : '<tr><td colspan="6" class="trong">Chưa có buổi học</td></tr>';
    document.querySelectorAll("[data-bo-buoi]").forEach((nut) => {
      nut.addEventListener("click", () => {
        lich.splice(Number(nut.dataset.boBuoi), 1);
        veLich();
      });
    });
  };

  const docLich = () => lich.map((_, i) => ({
    thu: website.gui.$(`[data-thu="${i}"]`).value,
    tiet_bat_dau: website.gui.$(`[data-bat-dau="${i}"]`).value,
    tiet_ket_thuc: website.gui.$(`[data-ket-thuc="${i}"]`).value,
    phong_hoc: website.gui.$(`[data-phong="${i}"]`).value,
    giang_vien: website.gui.$(`[data-giang-vien="${i}"]`).value
  }));

  const noiDung = `
    <section class="card">
      <div class="card-header">
        <h2 class="card-title">Danh sách lớp học phần</h2>
        <button type="button" class="btn btn-sm btn-accent" id="btnThemLop">Thêm lớp</button>
      </div>
      <div class="card-body tight">
        ${website.gui.bang([
          { ten: "Mã lớp" }, { ten: "Học phần" }, { ten: "Đợt" },
          { ten: "Sĩ số / sức chứa", lop: "num" }, { ten: "Lịch học" },
          { ten: "Trạng thái" }, { ten: "Thao tác", lop: "text-right" }
        ], danhSach.map((x) => [
          website.gui.esc(x.maLop),
          website.gui.esc(x.tenHp),
          website.gui.esc(x.tenDot),
          `${website.gui.esc(x.siSo)} / ${website.gui.esc(x.sucChua)}`,
          website.gui.esc(website.gui.lichTomTat(x.lich)),
          `<span class="tag ${x.trangThai === "Mo" ? "tag-ok" : "tag-off"}">${website.gui.esc(TEN_TRANG_THAI_LOP[x.trangThai] || x.trangThai)}</span>`,
          `<button type="button" class="btn btn-sm btn-ghost" data-sua="${website.gui.esc(x.maLop)}">Sửa</button>
           <button type="button" class="btn btn-sm btn-ghost" data-huy="${website.gui.esc(x.maLop)}">Hủy lớp</button>`
        ]))}
      </div>
    </section>
    <section class="card">
      <div class="card-header"><h2 class="card-title">Thông tin lớp học phần</h2></div>
      <div class="card-body">
        <div class="form-grid">
          <div class="field">
            <label class="label" for="txtMaLop">Mã lớp</label>
            <input class="input" id="txtMaLop" type="text" maxlength="30" placeholder="26COMP100101">
          </div>
          <div class="field">
            <label class="label" for="cboHocPhanLop">Học phần</label>
            <select class="select" id="cboHocPhanLop">${website.gui.tuyChon(hocPhan, "maHp", "tenHp", "", "Chọn học phần")}</select>
          </div>
          <div class="field">
            <label class="label" for="cboDotLop">Đợt đăng ký</label>
            <select class="select" id="cboDotLop">${website.gui.tuyChon(dot, "maDot", "tenDot", "", "Chọn đợt")}</select>
          </div>
          <div class="field">
            <label class="label" for="txtSucChua">Sức chứa</label>
            <input class="input" id="txtSucChua" type="number" min="1">
          </div>
          <div class="field">
            <label class="label" for="cboTrangThaiLop">Trạng thái</label>
            <select class="select" id="cboTrangThaiLop">
              <option value="Mo">Đang mở</option>
              <option value="Dong">Đã đóng</option>
              <option value="BiHuy">Đã hủy</option>
            </select>
          </div>
        </div>
        <h3 class="section-title">Buổi học</h3>
        <div class="table-scroll">
          <table class="data">
            <thead><tr><th>Thứ</th><th>Tiết bắt đầu</th><th>Tiết kết thúc</th><th>Phòng</th><th>Giảng viên</th><th></th></tr></thead>
            <tbody id="dgvLichHoc"></tbody>
          </table>
        </div>
        <div class="page-actions">
          <button type="button" class="btn btn-sm btn-accent" id="btnThemBuoi">Thêm buổi</button>
          <button type="button" class="btn btn-primary" id="btnLuuLop">Lưu lớp</button>
          <button type="button" class="btn btn-ghost" id="btnMoiLop">Làm mới</button>
        </div>
      </div>
    </section>
  `;

  return {
    tieuDe: "Quản lý lớp học phần",
    noiDung,
    gan() {
      const lamMoi = () => {
        website.gui.$("#txtMaLop").value = "";
        website.gui.$("#txtMaLop").readOnly = false;
        website.gui.$("#cboHocPhanLop").value = "";
        website.gui.$("#cboDotLop").value = "";
        website.gui.$("#txtSucChua").value = "";
        website.gui.$("#cboTrangThaiLop").value = "Mo";
        lich = [];
        veLich();
      };
      veLich();
      website.gui.$("#btnThemLop").addEventListener("click", lamMoi);
      website.gui.$("#btnMoiLop").addEventListener("click", lamMoi);
      website.gui.$("#btnThemBuoi").addEventListener("click", () => {
        lich = docLich();
        lich.push({ thu: 2, tiet_bat_dau: 1, tiet_ket_thuc: 3, phong_hoc: "", giang_vien: "" });
        veLich();
      });
      document.querySelectorAll("[data-sua]").forEach((nut) => {
        nut.addEventListener("click", () => {
          const x = danhSach.find((l) => l.maLop === nut.dataset.sua);
          website.gui.$("#txtMaLop").value = x.maLop;
          website.gui.$("#txtMaLop").readOnly = true;
          website.gui.$("#cboHocPhanLop").value = x.maHp;
          website.gui.$("#cboDotLop").value = x.maDot;
          website.gui.$("#txtSucChua").value = x.sucChua;
          website.gui.$("#cboTrangThaiLop").value = x.trangThai;
          lich = (x.lich || []).map((b) => ({ ...b }));
          veLich();
        });
      });
      document.querySelectorAll("[data-huy]").forEach((nut) => {
        nut.addEventListener("click", () => website.gui.chayNut(nut, async () => {
          const lyDo = prompt(`Lý do hủy lớp ${nut.dataset.huy}`);
          if (lyDo === null) return;
          await layBus().huy(nut.dataset.huy, lyDo);
          website.gui.thongBao("Đã hủy lớp");
          location.reload();
        }));
      });
      website.gui.$("#btnLuuLop").addEventListener("click", () => website.gui.chayNut(website.gui.$("#btnLuuLop"), async () => {
        await layBus().luu({
          ma_lop: website.gui.$("#txtMaLop").value,
          ma_hp: website.gui.$("#cboHocPhanLop").value,
          ma_dot: website.gui.$("#cboDotLop").value,
          suc_chua: website.gui.$("#txtSucChua").value,
          trang_thai: website.gui.$("#cboTrangThaiLop").value,
          lich: docLich()
        });
        website.gui.thongBao("Đã lưu lớp học phần");
        location.reload();
      }));
    }
  };
}

async function nhapLop() {
  const [dot, hocPhan, nhatKy] = await Promise.all([
    new website.bus.BusDotDangKy().danhSach(),
    new website.bus.BusHocPhan().danhSach(),
    layBus().danhSachNhatKyImport()
  ]);
  let noiDungFile = "";
  let tenFile = "";

  const noiDung = `
    <section class="card">
      <div class="card-header">
        <h2 class="card-title">Nhập lớp học phần từ CSV</h2>
        <a class="link" href="docs/mau-nhap-lop.csv" download>Tải file mẫu</a>
      </div>
      <div class="card-body">
        <div class="alert alert-info">
          File cần có các cột: ma_lop, ma_hp, ma_dot, suc_chua, thu, tiet_bat_dau, tiet_ket_thuc, phong_hoc, giang_vien.
        </div>
        <div class="form-grid">
          <div class="field field-full">
            <label class="label" for="txtFileLop">Chọn file CSV</label>
            <input class="input" id="txtFileLop" type="file" accept=".csv,text/csv">
          </div>
          <div class="field field-full">
            <label class="label" for="txtNoiDungFile">Hoặc dán nội dung CSV</label>
            <textarea class="input" id="txtNoiDungFile" rows="7" placeholder="ma_lop,ma_hp,..."></textarea>
          </div>
        </div>
        <div class="page-actions">
          <button type="button" class="btn btn-accent" id="btnXemTruoc">Xem trước</button>
          <button type="button" class="btn btn-primary" id="btnNhapLop">Nhập vào hệ thống</button>
        </div>
        <div id="ketQuaXemTruoc"></div>
      </div>
    </section>
    <section class="card">
      <div class="card-header"><h2 class="card-title">Đợt đăng ký và học phần hiện có</h2></div>
      <div class="card-body">
        <p class="muted">Đợt: ${dot.map((d) => website.gui.esc(d.maDot)).join(", ") || "Chưa có"}</p>
        <p class="muted">Học phần: ${hocPhan.map((h) => website.gui.esc(h.maHp)).join(", ") || "Chưa có"}</p>
      </div>
    </section>
    <section class="card">
      <div class="card-header"><h2 class="card-title">Lịch sử nhập file</h2></div>
      <div class="card-body tight">
        ${website.gui.bang([
          { ten: "Thời gian" }, { ten: "Tên file" }, { ten: "Dòng đúng", lop: "num" },
          { ten: "Dòng sai", lop: "num" }, { ten: "Người thực hiện" }
        ], nhatKy.map((x) => [
          website.gui.thoiGian(x.website.gui.thoiGian), website.gui.esc(x.tenFile), website.gui.esc(x.soDongDung), website.gui.esc(x.soDongSai), website.gui.esc(x.tenDangNhap)
        ]))}
      </div>
    </section>
  `;

  return {
    tieuDe: "Nhập lớp từ file",
    noiDung,
    gan() {
      website.gui.$("#txtFileLop").addEventListener("change", async (suKien) => {
        const file = suKien.target.files[0];
        if (!file) return;
        tenFile = file.name;
        noiDungFile = await file.text();
        website.gui.$("#txtNoiDungFile").value = noiDungFile;
      });
      website.gui.$("#btnXemTruoc").addEventListener("click", () => {
        noiDungFile = website.gui.$("#txtNoiDungFile").value;
        const ketQua = layBus().docFile(noiDungFile);
        website.gui.$("#ketQuaXemTruoc").innerHTML = `
          <div class="alert ${ketQua.loi.length ? "alert-warning" : "alert-success"}">
            Hợp lệ: ${ketQua.dong.length} dòng. Không hợp lệ: ${ketQua.loi.length} dòng.
          </div>
          ${ketQua.loi.length ? website.gui.bang(
            [{ ten: "Dòng" }, { ten: "Mã lớp" }, { ten: "Lý do" }],
            ketQua.loi.map((x) => [website.gui.esc(x.dong), website.gui.esc(x.ma_lop || ""), website.gui.esc(x.ly_do)])
          ) : ""}
        `;
      });
      website.gui.$("#btnNhapLop").addEventListener("click", () => website.gui.chayNut(website.gui.$("#btnNhapLop"), async () => {
        noiDungFile = website.gui.$("#txtNoiDungFile").value;
        if (!noiDungFile.trim()) {
          throw new Error("Vui lòng chọn hoặc dán nội dung file");
        }
        const ketQua = await layBus().nhap(tenFile || "nhap-lop.csv", noiDungFile);
        website.gui.$("#ketQuaXemTruoc").innerHTML = `
          <div class="alert ${ketQua.so_dong_sai ? "alert-warning" : "alert-success"}">
            Đã nhập ${ketQua.so_dong_dung} dòng, ${ketQua.so_dong_sai} dòng lỗi.
          </div>
          ${(ketQua.loi || []).length ? website.gui.bang(
            [{ ten: "Dòng" }, { ten: "Mã lớp" }, { ten: "Lý do" }],
            ketQua.loi.map((x) => [website.gui.esc(x.dong), website.gui.esc(x.ma_lop || ""), website.gui.esc(x.ly_do)])
          ) : ""}
        `;
        website.gui.thongBao("Đã xử lý file");
      }));
    }
  };
}

  website.trang.quanLyLopHocPhan = quanLyLopHocPhan;
  website.trang.nhapLop = nhapLop;
})();
