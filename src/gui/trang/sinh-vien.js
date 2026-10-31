var website = window.website = window.website || {};
website.trang = website.trang || {};

(function () {
  "use strict";

var bus;
const layBus = () => bus || (bus = new website.bus.BusSinhVien());

const TEN_TRANG_THAI = {
  DangHoc: "Đang học",
  BaoLuu: "Bảo lưu",
  DaTotNghiep: "Đã tốt nghiệp"
};

async function quanLySinhVien() {
  const [danhSach, khoa, nhom, ctdt] = await Promise.all([
    layBus().danhSach(),
    layBus().danhSachKhoa(),
    layBus().danhSachNhom(),
    new website.bus.BusHocPhan().danhSachCtdt()
  ]);
  const tenKhoa = Object.fromEntries(khoa.map((x) => [x.maKhoa, x.tenKhoa]));
  const tenNhom = Object.fromEntries(nhom.map((x) => [x.maNhom, x.tenNhom]));
  const tenCtdt = Object.fromEntries(ctdt.map((x) => [x.maCtdt, x.tenCtdt]));

  const veDong = (ds) => ds.map((x) => `
    <tr>
      <td>${website.gui.esc(x.maSv)}</td>
      <td>${website.gui.esc(x.hoTen)}</td>
      <td>${website.gui.esc(website.gui.ngay(x.ngaySinh))}</td>
      <td>${website.gui.esc(tenKhoa[x.maKhoa] || x.maKhoa)}</td>
      <td>${website.gui.esc(tenNhom[x.maNhom] || x.maNhom || "")}</td>
      <td>${website.gui.esc(tenCtdt[x.maCtdt] || x.maCtdt)}</td>
      <td>${website.gui.esc(TEN_TRANG_THAI[x.trangThai] || x.trangThai)}</td>
      <td class="text-right"><a class="btn btn-sm btn-ghost" href="#/form-sinh-vien?ma_sv=${encodeURIComponent(x.maSv)}">Sửa</a></td>
    </tr>
  `).join("");

  return {
    tieuDe: "Quản lý sinh viên",
    noiDung: `
      <section class="card">
        <div class="card-header">
          <h2 class="card-title">Danh sách sinh viên</h2>
          <a class="btn btn-sm btn-accent" href="#/form-sinh-vien">Thêm sinh viên</a>
        </div>
        <div class="card-body">
          <div class="field">
            <label class="label" for="txtTimSinhVien">Tìm theo mã hoặc họ tên</label>
            <input class="input" id="txtTimSinhVien" type="search" placeholder="Nhập mã sinh viên hoặc họ tên">
          </div>
        </div>
        <div class="card-body tight" id="khuDanhSachSinhVien">
          ${website.gui.bang([
            { ten: "Mã sinh viên" }, { ten: "Họ tên" }, { ten: "Ngày sinh" },
            { ten: "Khoa" }, { ten: "Nhóm" }, { ten: "Chương trình" },
            { ten: "Trạng thái" }, { ten: "Thao tác", lop: "text-right" }
          ], danhSach.map((x) => [
            website.gui.esc(x.maSv), website.gui.esc(x.hoTen), website.gui.esc(website.gui.ngay(x.ngaySinh)),
            website.gui.esc(tenKhoa[x.maKhoa] || x.maKhoa),
            website.gui.esc(tenNhom[x.maNhom] || x.maNhom || ""),
            website.gui.esc(tenCtdt[x.maCtdt] || x.maCtdt),
            website.gui.esc(TEN_TRANG_THAI[x.trangThai] || x.trangThai),
            `<a class="btn btn-sm btn-ghost" href="#/form-sinh-vien?ma_sv=${encodeURIComponent(x.maSv)}">Sửa</a>`
          ]))}
        </div>
      </section>
    `,
    gan() {
      website.gui.$("#txtTimSinhVien").addEventListener("input", (suKien) => {
        const tu = suKien.target.value.trim().toLowerCase();
        const loc = danhSach.filter((x) => x.maSv.toLowerCase().includes(tu) || x.hoTen.toLowerCase().includes(tu));
        website.gui.$("#khuDanhSachSinhVien").innerHTML = website.gui.bang([
          { ten: "Mã sinh viên" }, { ten: "Họ tên" }, { ten: "Ngày sinh" },
          { ten: "Khoa" }, { ten: "Nhóm" }, { ten: "Chương trình" },
          { ten: "Trạng thái" }, { ten: "Thao tác", lop: "text-right" }
        ], loc.map((x) => [
          website.gui.esc(x.maSv), website.gui.esc(x.hoTen), website.gui.esc(website.gui.ngay(x.ngaySinh)),
          website.gui.esc(tenKhoa[x.maKhoa] || x.maKhoa),
          website.gui.esc(tenNhom[x.maNhom] || x.maNhom || ""),
          website.gui.esc(tenCtdt[x.maCtdt] || x.maCtdt),
          website.gui.esc(TEN_TRANG_THAI[x.trangThai] || x.trangThai),
          `<a class="btn btn-sm btn-ghost" href="#/form-sinh-vien?ma_sv=${encodeURIComponent(x.maSv)}">Sửa</a>`
        ]));
      });
    }
  };
}

async function formSinhVien(hoSo, thamSo) {
  const maSv = thamSo.get("ma_sv") || "";
  const [danhSach, khoa, nhom, ctdt] = await Promise.all([
    layBus().danhSach(),
    layBus().danhSachKhoa(),
    layBus().danhSachNhom(),
    new website.bus.BusHocPhan().danhSachCtdt()
  ]);
  const sv = danhSach.find((x) => x.maSv === maSv) || null;

  return {
    tieuDe: sv ? "Sửa sinh viên" : "Thêm sinh viên",
    noiDung: `
      <section class="card">
        <div class="card-header">
          <h2 class="card-title">${sv ? website.gui.esc(sv.maSv) : "Sinh viên mới"}</h2>
          <a class="link" href="#/quan-ly-sinh-vien">Quay lại danh sách</a>
        </div>
        <div class="card-body">
          <form id="formSinhVien" class="form-grid" novalidate>
            <div class="field">
              <label class="label" for="txtMaSv">Mã sinh viên</label>
              <input class="input" id="txtMaSv" name="txtMaSv" type="text" maxlength="20" value="${website.gui.esc(sv?.maSv || "")}" ${sv ? "readonly" : ""} placeholder="48.01.001.001">
            </div>
            <div class="field">
              <label class="label" for="txtHoTen">Họ tên</label>
              <input class="input" id="txtHoTen" name="txtHoTen" type="text" maxlength="100" value="${website.gui.esc(sv?.hoTen || "")}">
            </div>
            <div class="field">
              <label class="label" for="dtpNgaySinh">Ngày sinh</label>
              <input class="input" id="dtpNgaySinh" name="dtpNgaySinh" type="date" value="${website.gui.esc(sv?.ngaySinh ? String(sv.ngaySinh).slice(0, 10) : "")}">
            </div>
            <div class="field">
              <label class="label" for="txtNienKhoa">Niên khóa</label>
              <input class="input" id="txtNienKhoa" name="txtNienKhoa" type="text" maxlength="20" value="${website.gui.esc(sv?.nienKhoa || "2024-2028")}">
            </div>
            <div class="field">
              <label class="label" for="cboKhoa">Khoa</label>
              <select class="select" id="cboKhoa" name="cboKhoa">${website.gui.tuyChon(khoa, "maKhoa", "tenKhoa", sv?.maKhoa, "Chọn khoa")}</select>
            </div>
            <div class="field">
              <label class="label" for="cboNhom">Nhóm sinh viên</label>
              <select class="select" id="cboNhom" name="cboNhom">${website.gui.tuyChon(nhom, "maNhom", "tenNhom", sv?.maNhom, "Chưa xếp nhóm")}</select>
            </div>
            <div class="field">
              <label class="label" for="cboCtdt">Chương trình đào tạo</label>
              <select class="select" id="cboCtdt" name="cboCtdt">${website.gui.tuyChon(ctdt, "maCtdt", "tenCtdt", sv?.maCtdt, "Chọn chương trình")}</select>
            </div>
            <div class="field">
              <label class="label" for="cboTrangThaiSv">Trạng thái</label>
              <select class="select" id="cboTrangThaiSv" name="cboTrangThaiSv">
                ${Object.entries(TEN_TRANG_THAI).map(([gt, nhan]) => `<option value="${gt}" ${sv?.trangThai === gt ? "selected" : ""}>${nhan}</option>`).join("")}
              </select>
            </div>
            <div class="field">
              <label class="label" for="txtTenDangNhapSv">Tên đăng nhập</label>
              <input class="input" id="txtTenDangNhapSv" name="txtTenDangNhapSv" type="text" maxlength="50" value="${website.gui.esc(sv?.tenDangNhap || "")}" placeholder="Mặc định bằng mã sinh viên">
            </div>
            <div class="field">
              <label class="label" for="txtMatKhauSv">Mật khẩu</label>
              <input class="input" id="txtMatKhauSv" name="txtMatKhauSv" type="password" autocomplete="new-password">
              <p class="hint">${sv ? "Để trống nếu không đổi" : "Tối thiểu 8 ký tự"}</p>
            </div>
            <div class="page-actions field-full">
              <button type="submit" class="btn btn-primary" id="btnLuuSinhVien">Lưu sinh viên</button>
            </div>
          </form>
        </div>
      </section>
    `,
    gan() {
      website.gui.$("#formSinhVien").addEventListener("submit", (suKien) => {
        suKien.preventDefault();
        website.gui.chayNut(website.gui.$("#btnLuuSinhVien"), async () => {
          await layBus().luu({
            ma_sv: website.gui.$("#txtMaSv").value,
            ho_ten: website.gui.$("#txtHoTen").value,
            ngay_sinh: website.gui.$("#dtpNgaySinh").value,
            nien_khoa: website.gui.$("#txtNienKhoa").value,
            ma_khoa: website.gui.$("#cboKhoa").value,
            ma_nhom: website.gui.$("#cboNhom").value,
            ma_ctdt: website.gui.$("#cboCtdt").value,
            trang_thai: website.gui.$("#cboTrangThaiSv").value,
            ten_dang_nhap: website.gui.$("#txtTenDangNhapSv").value,
            mat_khau: website.gui.$("#txtMatKhauSv").value
          });
          website.gui.thongBao("Đã lưu sinh viên");
          location.hash = "#/quan-ly-sinh-vien";
        });
      });
    }
  };
}

  website.trang.quanLySinhVien = quanLySinhVien;
  website.trang.formSinhVien = formSinhVien;
})();
