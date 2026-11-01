var website = window.website = window.website || {};
website.trang = website.trang || {};

(function () {
  "use strict";

async function chuongTrinhDaoTao(hoSo) {
  const danhSach = await new website.bus.BusHocPhan().ctdtCuaSinhVien();
  return {
    tieuDe: "Chương trình đào tạo",
    noiDung: `
      <section class="card">
        <div class="card-header">
          <h2 class="card-title">Học phần theo chương trình</h2>
          <span class="muted">${website.gui.esc(hoSo.maCtdt)}</span>
        </div>
        <div class="card-body tight">
          ${website.gui.bang([
            { ten: "Học kỳ dự kiến", lop: "num" },
            { ten: "Mã học phần" },
            { ten: "Học phần" },
            { ten: "Tín chỉ", lop: "num" },
            { ten: "Kết quả" }
          ], danhSach.map((x) => [
            website.gui.esc(x.hoc_ky_du_kien || ""),
            website.gui.esc(x.ma_hp),
            website.gui.esc(x.ten_hp),
            website.gui.esc(x.so_tin_chi),
            x.da_dat ? '<span class="tag tag-ok">Đã đạt</span>' : ""
          ]))}
        </div>
      </section>
    `
  };
}

async function thoiKhoaBieu(hoSo) {
  const bus = new website.bus.BusTKB();
  const [sauDangKy, duKien] = await Promise.all([bus.thoiKhoaBieu(), bus.duKien()]);
  const cacThu = [2, 3, 4, 5, 6, 7, 8];
  let cheDo = "SauDangKy";
  let ky = { hocKy: "", namHoc: "" };

  const anhXaKy = (cheDoChon) => {
    const lich = cheDoChon === "DuKien" ? duKien : sauDangKy;
    return {
      lich,
      ki: bus.tuyChonKy(lich),
      macDinh: cheDoChon === "DuKien" ? bus.kyDangHienHanh(lich) : bus.kyGanNhat(lich)
    };
  };

  const veTuan = (lich) => {
    const bangLich = bus.taoBang(bus.locTheoKy(lich, ky.hocKy, ky.namHoc));
    website.gui.$("#khuTkb").innerHTML = `
      <div class="tuan">
        ${cacThu.map((thu) => `
          <div class="ngay">
            <div class="ngay-ten">${website.gui.tenThu(thu)}</div>
            ${bangLich[thu].length ? bangLich[thu].map((b) => `
              <div class="buoi">
                <strong>${website.gui.esc(b.tenHp)}</strong>
                <span>${website.gui.esc(b.maLop)}</span>
                <span>Tiết ${website.gui.esc(b.tietBatDau)}-${website.gui.esc(b.tietKetThuc)}</span>
                <span>${website.gui.esc(b.phongHoc)}</span>
                <span>${website.gui.esc(b.giangVien)}</span>
              </div>
            `).join("") : '<p class="muted">Trống</p>'}
          </div>
        `).join("")}
      </div>
    `;
  };

  const veCheDo = () => {
    document.querySelectorAll("[data-che-do-tkb]").forEach((nut) => {
      const chon = nut.dataset.cheDoTkb === cheDo;
      nut.classList.toggle("btn-primary", chon);
      nut.classList.toggle("btn-ghost", !chon);
    });
    const { ki, macDinh } = anhXaKy(cheDo);
    if (!ki.some((x) => x.hocKy === ky.hocKy && x.namHoc === ky.namHoc)) {
      ky = { hocKy: macDinh?.hocKy || "", namHoc: macDinh?.namHoc || "" };
    }
    const namHoc = Array.from(new Set(ki.map((x) => x.namHoc)));
    website.gui.$("#cboNamHocTkb").innerHTML = namHoc.map((n) =>
      `<option value="${website.gui.esc(n)}" ${n === ky.namHoc ? "selected" : ""}>${website.gui.esc(n)}</option>`
    ).join("");
    website.gui.$("#cboHocKyTkb").innerHTML = ki.filter((x) => x.namHoc === ky.namHoc).map((x) =>
      `<option value="${website.gui.esc(x.hocKy)}" ${x.hocKy === ky.hocKy ? "selected" : ""}>${website.gui.esc(x.hocKy)}</option>`
    ).join("");
    const lich = cheDo === "DuKien" ? duKien : sauDangKy;
    const coLich = ki.length > 0;
    veTuan(lich);
    if (!coLich) {
      const thongBao = cheDo === "DuKien"
        ? "Chưa có đợt sắp mở hoặc đang mở để dự liệu lịch học."
        : "Bạn chưa đăng ký học phần nào.";
      website.gui.$("#khuTkb").innerHTML = `<div class="alert alert-warning">${thongBao}</div>`;
    }
  };

  const noiDung = `
    <section class="card">
      <div class="card-header">
        <h2 class="card-title">Thời khóa biểu</h2>
        <div class="page-actions">
          <button type="button" class="btn btn-sm btn-ghost" data-che-do-tkb="DuKien">Dự kiến</button>
          <button type="button" class="btn btn-sm btn-ghost" data-che-do-tkb="SauDangKy">Sau đăng ký</button>
        </div>
      </div>
      <div class="card-body">
        <div class="form-grid">
          <div class="field">
            <label class="label" for="cboNamHocTkb">Năm học</label>
            <select class="select" id="cboNamHocTkb"></select>
          </div>
          <div class="field">
            <label class="label" for="cboHocKyTkb">Học kỳ</label>
            <select class="select" id="cboHocKyTkb"></select>
          </div>
        </div>
      </div>
      <div class="card-body" id="khuTkb"></div>
    </section>
  `;

  return {
    tieuDe: "Thời khóa biểu",
    noiDung,
    gan() {
      ky = { hocKy: "", namHoc: "" };
      cheDo = "SauDangKy";
      website.gui.$("#cboNamHocTkb").addEventListener("change", (suKien) => {
        ky.namHoc = suKien.target.value;
        const { ki } = anhXaKy(cheDo);
        const kiNam = ki.filter((x) => x.namHoc === ky.namHoc);
        ky.hocKy = kiNam.length ? kiNam[0].hocKy : "";
        veCheDo();
      });
      website.gui.$("#cboHocKyTkb").addEventListener("change", (suKien) => {
        ky.hocKy = suKien.target.value;
        veCheDo();
      });
      document.querySelectorAll("[data-che-do-tkb]").forEach((nut) => {
        nut.addEventListener("click", () => {
          cheDo = nut.dataset.cheDoTkb;
          ky = { hocKy: "", namHoc: "" };
          veCheDo();
        });
      });
      veCheDo();
    }
  };
}

async function lichSuThaoTac(hoSo) {
  const danhSach = await new website.bus.BusLichSu().danhSach();
  const loaiThaoTac = Array.from(new Set(danhSach.map((x) => x.loaiThaoTac)));

  const veBang = () => {
    const chon = website.gui.$("#cboLocLoaiThaoTac").value;
    const loc = danhSach.filter((x) => !chon || x.loaiThaoTac === chon);
    website.gui.$("#khuBangLichSu").innerHTML = website.gui.bang([
      { ten: "Thời gian" },
      { ten: "Thao tác" },
      { ten: "Kết quả" },
      { ten: "Người thực hiện" },
      { ten: "Sinh viên" },
      { ten: "Lớp" },
      { ten: "Lý do" }
    ], loc.map((x) => [
      website.gui.thoiGian(x.thoiGian),
      website.gui.esc(website.gui.tenLoaiThaoTac(x.loaiThaoTac)),
      website.gui.esc(website.gui.tenKetQua(x.ketQua)),
      website.gui.esc(x.tenDangNhap),
      website.gui.esc(x.maSv),
      website.gui.esc(x.maLop),
      website.gui.esc(x.lyDo)
    ]));
  };

  return {
    tieuDe: "Lịch sử thao tác",
    noiDung: `
      <section class="card">
        <div class="card-header">
          <h2 class="card-title">${hoSo.vaiTro === "PDT" ? "Toàn bộ thao tác" : "Thao tác của bạn"}</h2>
          <span class="muted">${danhSach.length} dòng gần nhất</span>
        </div>
        <div class="card-body">
          <div class="field">
            <label class="label" for="cboLocLoaiThaoTac">Lọc theo loại thao tác</label>
            <select class="select" id="cboLocLoaiThaoTac">
              <option value="">Tất cả</option>
              ${loaiThaoTac.map((l) => `<option value="${website.gui.esc(l)}">${website.gui.esc(website.gui.tenLoaiThaoTac(l))}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="card-body tight" id="khuBangLichSu"></div>
      </section>
    `,
    gan() {
      website.gui.$("#cboLocLoaiThaoTac").addEventListener("change", veBang);
      veBang();
    }
  };
}


  website.trang.chuongTrinhDaoTao = chuongTrinhDaoTao;
  website.trang.thoiKhoaBieu = thoiKhoaBieu;
  website.trang.lichSuThaoTac = lichSuThaoTac;
})();
