var website = window.website = window.website || {};
website.trang = website.trang || {};

(function () {
  "use strict";

const KHOA_GIO = "gio-dang-ky";
const KHOA_KET_QUA = "ket-qua-dang-ky";

function docGio() {
  try {
    const duLieu = JSON.parse(localStorage.getItem(KHOA_GIO) || "[]");
    return Array.isArray(duLieu) ? duLieu : [];
  } catch {
    return [];
  }
}

function luuGio(gio) {
  localStorage.setItem(KHOA_GIO, JSON.stringify(gio));
}

function veNutLop(x, trongGio) {
  if (x.daDangKy) return '<span class="tag tag-ok">Đã đăng ký</span>';
  if (x.siSo >= x.sucChua) {
    return `<button type="button" class="btn btn-sm btn-ghost" data-cho="${website.gui.esc(x.maLop)}">Vào danh sách chờ</button>`;
  }
  if (trongGio) return '<span class="tag">Đã chọn</span>';
  return `<button type="button" class="btn btn-sm btn-primary" data-them="${website.gui.esc(x.maLop)}">Thêm</button>`;
}

async function lopHocPhanMo() {
  const danhSach = await new website.bus.BusDangKy().lopDangMo();
  const bus = new website.bus.BusDangKy();
  let gio = docGio();

  const veBang = (ds) => {
    website.gui.$("#dgvLopMo").innerHTML = ds.length ? ds.map((x) => `
      <tr>
        <td>${website.gui.esc(x.maLop)}</td>
        <td>${website.gui.esc(x.tenHp)}</td>
        <td class="num">${website.gui.esc(x.soTinChi)}</td>
        <td>${website.gui.esc(website.gui.lichTomTat(x.lich))}</td>
        <td class="num">${website.gui.esc(x.siSo)} / ${website.gui.esc(x.sucChua)}</td>
        <td>${x.thuocNhom ? '<span class="tag tag-ok">Trong nhóm</span>' : '<span class="tag tag-off">Ngoài nhóm</span>'}</td>
        <td class="text-right">
          <a class="btn btn-sm btn-ghost" href="#/chi-tiet-lop?ma_lop=${encodeURIComponent(x.maLop)}">Chi tiết</a>
          ${veNutLop(x, gio.some((g) => g.maLop === x.maLop))}
        </td>
      </tr>
    `).join("") : '<tr><td colspan="7" class="trong">Không có lớp phù hợp</td></tr>';
    ganNut(ds);
  };

  const ganNut = (ds) => {
    document.querySelectorAll("[data-them]").forEach((nut) => {
      nut.addEventListener("click", () => {
        const lop = ds.find((x) => x.maLop === nut.dataset.them);
        try {
          bus.kiemTraThemGio(gio, lop);
          gio.push(lop);
          luuGio(gio);
          website.gui.thongBao("Đã thêm lớp vào danh sách tạm");
          location.hash = "#/dang-ky-hoc-phan";
        } catch (loi) {
          website.gui.thongBao(loi.message, "loi");
        }
      });
    });
    document.querySelectorAll("[data-cho]").forEach((nut) => {
      nut.addEventListener("click", () => website.gui.chayNut(nut, async () => {
        await new website.bus.BusDanhSachCho().vao(nut.dataset.cho);
        website.gui.thongBao("Đã vào danh sách chờ");
      }));
    });
  };

  const noiDung = `
    <section class="card">
      <div class="card-header">
        <h2 class="card-title">Lớp học phần đang mở</h2>
        <a class="link" href="#/dang-ky-hoc-phan">Danh sách tạm (${gio.length})</a>
      </div>
      <div class="card-body">
        <div class="form-grid">
          <div class="field">
            <label class="label" for="txtTimLop">Tìm học phần</label>
            <input class="input" id="txtTimLop" type="search" placeholder="Mã hoặc tên học phần">
          </div>
          <div class="field field-inline">
            <label class="check"><input type="checkbox" id="chkChiConCho" checked> Chỉ hiện lớp còn chỗ</label>
          </div>
        </div>
      </div>
      <div class="card-body tight">
        <div class="table-scroll">
          <table class="data">
            <thead><tr>
              <th>Mã lớp</th><th>Học phần</th><th class="num">Tín chỉ</th><th>Lịch học</th>
              <th class="num">Sĩ số</th><th>Nhóm</th><th class="text-right">Thao tác</th>
            </tr></thead>
            <tbody id="dgvLopMo"></tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  return {
    tieuDe: "Lớp học phần mở",
    noiDung,
    gan() {
      const loc = () => {
        const tu = website.gui.$("#txtTimLop").value.trim().toLowerCase();
        const chiConCho = website.gui.$("#chkChiConCho").checked;
        const ds = danhSach.filter((x) =>
          (!tu || x.maLop.toLowerCase().includes(tu) || x.tenHp.toLowerCase().includes(tu))
          && (!chiConCho || x.siSo < x.sucChua)
        );
        veBang(ds);
      };
      website.gui.$("#txtTimLop").addEventListener("input", loc);
      website.gui.$("#chkChiConCho").addEventListener("change", loc);
      veBang(danhSach);
    }
  };
}

async function chiTietLop(hoSo, thamSo) {
  const maLop = thamSo.get("ma_lop") || "";
  const lop = await new website.bus.BusLopHocPhan().chiTiet(maLop);
  const gio = docGio();
  const trongGio = gio.some((x) => x.maLop === lop.maLop);
  const noiDung = `
    <section class="card">
      <div class="card-header">
        <h2 class="card-title">${website.gui.esc(lop.maLop)} · ${website.gui.esc(lop.tenHp)}</h2>
        <a class="link" href="#/lop-hoc-phan-mo">Quay lại</a>
      </div>
      <div class="card-body">
        <dl class="info-list">
          <dt>Học phần</dt><dd>${website.gui.esc(lop.maHp)} - ${website.gui.esc(lop.tenHp)}</dd>
          <dt>Số tín chỉ</dt><dd>${website.gui.esc(lop.soTinChi)}</dd>
          <dt>Đợt đăng ký</dt><dd>${website.gui.esc(lop.tenDot)}</dd>
          <dt>Sĩ số</dt><dd>${website.gui.esc(lop.siSo)} / ${website.gui.esc(lop.sucChua)}</dd>
          <dt>Trạng thái</dt><dd>${website.gui.esc(lop.trangThai)}</dd>
          <dt>Lịch học</dt><dd>${(lop.lich || []).map((b) => `${website.gui.tenThu(Number(b.thu))}, tiết ${b.tiet_bat_dau}-${b.tiet_ket_thuc}, ${website.gui.esc(b.phong_hoc ?? b.phongHoc)}, ${website.gui.esc(b.giang_vien ?? b.giangVien)}`).join("<br>") || "Chưa xếp lịch"}</dd>
        </dl>
        <div class="page-actions">
          ${veNutLop(lop, trongGio)}
        </div>
      </div>
    </section>
  `;

  return {
    tieuDe: "Chi tiết lớp",
    noiDung,
    gan() {
      document.querySelectorAll("[data-them]").forEach((nut) => {
        nut.addEventListener("click", () => {
          try {
            new website.bus.BusDangKy().kiemTraThemGio(gio, lop);
            gio.push(lop);
            luuGio(gio);
            website.gui.thongBao("Đã thêm lớp vào danh sách tạm");
            location.hash = "#/dang-ky-hoc-phan";
          } catch (loi) {
            website.gui.thongBao(loi.message, "loi");
          }
        });
      });
      document.querySelectorAll("[data-cho]").forEach((nut) => {
        nut.addEventListener("click", () => website.gui.chayNut(nut, async () => {
          await new website.bus.BusDanhSachCho().vao(lop.maLop);
          website.gui.thongBao("Đã vào danh sách chờ");
        }));
      });
    }
  };
}

async function dangKyHocPhan() {
  const bus = new website.bus.BusDangKy();
  const gio = docGio();
  const canhBao = gio.map((lop) => ({
    lop,
    xungDot: bus.timXungDot(lop, gio)
  }));
  const tinChi = bus.tongTinChi(gio);
  const coXungDot = canhBao.some((x) => x.xungDot);

  const noiDung = `
    <section class="card">
      <div class="card-header">
        <h2 class="card-title">Danh sách tạm</h2>
        <a class="link" href="#/lop-hoc-phan-mo">Thêm lớp</a>
      </div>
      <div class="card-body">
        ${coXungDot ? '<div class="alert alert-warning">Có lớp trùng lịch. Hệ thống vẫn kiểm tra lại khi xác nhận.</div>' : ""}
        ${website.gui.bang([
          { ten: "Mã lớp" }, { ten: "Học phần" }, { ten: "Tín chỉ", lop: "num" },
          { ten: "Lịch học" }, { ten: "Cảnh báo" }, { ten: "", lop: "text-right" }
        ], canhBao.map(({ lop, xungDot }) => [
          website.gui.esc(lop.maLop),
          website.gui.esc(lop.tenHp),
          website.gui.esc(lop.soTinChi),
          website.gui.esc(website.gui.lichTomTat(lop.lich)),
          xungDot ? `<span class="tag tag-off">Trùng ${website.gui.esc(xungDot.maLop)}</span>` : '<span class="tag tag-ok">Hợp lệ</span>',
          `<button type="button" class="btn btn-sm btn-ghost" data-bo="${website.gui.esc(lop.maLop)}">Bỏ</button>`
        ]))}
        <p class="muted">Tổng tín chỉ: <strong>${tinChi}</strong></p>
        <div class="page-actions">
          <button type="button" class="btn btn-primary" id="btnXacNhanDangKy" ${gio.length ? "" : "disabled"}>Xác nhận đăng ký</button>
        </div>
      </div>
    </section>
  `;

  return {
    tieuDe: "Đăng ký học phần",
    noiDung,
    gan() {
      document.querySelectorAll("[data-bo]").forEach((nut) => {
        nut.addEventListener("click", () => {
          luuGio(gio.filter((x) => x.maLop !== nut.dataset.bo));
          location.reload();
        });
      });
      website.gui.$("#btnXacNhanDangKy").addEventListener("click", () => website.gui.chayNut(website.gui.$("#btnXacNhanDangKy"), async () => {
        const ketQua = await bus.dangKyNhieu(gio);
        sessionStorage.setItem(KHOA_KET_QUA, JSON.stringify(ketQua));
        localStorage.removeItem(KHOA_GIO);
        location.hash = "#/ket-qua-dang-ky";
      }));
    }
  };
}

async function ketQuaDangKy() {
  let danhSach = [];
  try {
    danhSach = JSON.parse(sessionStorage.getItem(KHOA_KET_QUA) || "[]");
  } catch {
    danhSach = [];
  }

  return {
    tieuDe: "Kết quả đăng ký",
    noiDung: `
      <section class="card">
        <div class="card-header"><h2 class="card-title">Kết quả từng lớp</h2></div>
        <div class="card-body tight">
          ${website.gui.bang([
            { ten: "Mã lớp" }, { ten: "Học phần" }, { ten: "Kết quả" }, { ten: "Thông báo" }
          ], danhSach.map((x) => [
            website.gui.esc(x.ma_lop),
            website.gui.esc(x.ten_hp || ""),
            x.ok ? '<span class="tag tag-ok">Thành công</span>' : '<span class="tag tag-off">Từ chối</span>',
            website.gui.esc(x.message)
          ]))}
        </div>
        <div class="card-body page-actions">
          <a class="btn btn-primary" href="#/hoc-phan-da-dang-ky">Xem học phần đã đăng ký</a>
          <a class="btn btn-ghost" href="#/lop-hoc-phan-mo">Tiếp tục chọn lớp</a>
        </div>
      </section>
    `
  };
}

async function hocPhanDaDangKy() {
  const danhSach = await new website.bus.BusDangKy().hocPhanDaDangKy();
  const tenTrangThai = {
    HieuLuc: '<span class="tag tag-ok">Hiệu lực</span>',
    DaHuy: '<span class="tag tag-off">Đã hủy</span>',
    LopBiHuy: '<span class="tag tag-off">Lớp bị hủy</span>'
  };

  return {
    tieuDe: "Học phần đã đăng ký",
    noiDung: `
      <section class="card">
        <div class="card-header"><h2 class="card-title">Đăng ký của bạn</h2></div>
        <div class="card-body tight">
          ${website.gui.bang([
            { ten: "Học phần" }, { ten: "Lớp" }, { ten: "Đợt" },
            { ten: "Lịch học" }, { ten: "Trạng thái" }, { ten: "Thao tác", lop: "text-right" }
          ], danhSach.map((x) => [
            `${website.gui.esc(x.tenHp)} (${website.gui.esc(x.soTinChi)} TC)`,
            website.gui.esc(x.maLop),
            website.gui.esc(x.tenDot),
            website.gui.esc(website.gui.lichTomTat(x.lich)),
            tenTrangThai[x.trangThai] || website.gui.esc(x.trangThai),
            x.trangThai === "HieuLuc"
              ? `<button type="button" class="btn btn-sm btn-ghost" data-huy="${x.maDangKy}">Hủy</button>`
              : ""
          ]))}
        </div>
      </section>
    `,
    gan() {
      document.querySelectorAll("[data-huy]").forEach((nut) => {
        nut.addEventListener("click", () => website.gui.chayNut(nut, async () => {
          const lyDo = prompt("Lý do hủy đăng ký (không bắt buộc)", "");
          if (lyDo === null) return;
          await new website.bus.BusDangKy().huy(Number(nut.dataset.huy), lyDo);
          website.gui.thongBao("Đã hủy đăng ký");
          location.reload();
        }));
      });
    }
  };
}

async function ghiDanhHocPhan() {
  const bus = new website.bus.BusDangKy();
  const [ctdt, dots, daGhiDanh] = await Promise.all([
    new website.bus.BusHocPhan().ctdtCuaSinhVien(),
    new website.bus.BusDotDangKy().dotCuaSinhVien(),
    bus.danhSachGhiDanh()
  ]);
  const dot = dots[0];
  const daGhi = new Set((daGhiDanh || []).map((x) => `${x.maHp}|${x.maDot}`));

  return {
    tieuDe: "Ghi danh học phần",
    noiDung: `
      <section class="card">
        <div class="card-header"><h2 class="card-title">Ghi danh theo chương trình đào tạo</h2></div>
        <div class="card-body">
          ${dot ? `<p class="muted">Đợt đang mở: <strong>${website.gui.esc(dot.tenDot)}</strong></p>` : '<div class="alert alert-warning">Hiện không có đợt đăng ký dành cho nhóm của bạn.</div>'}
          <div class="table-scroll">
            <table class="data">
              <thead><tr><th>Mã học phần</th><th>Học phần</th><th class="num">Tín chỉ</th><th>Kết quả</th><th class="text-right">Thao tác</th></tr></thead>
              <tbody>
                ${ctdt.map((x) => `
                  <tr>
                    <td>${website.gui.esc(x.ma_hp)}</td>
                    <td>${website.gui.esc(x.ten_hp)}</td>
                    <td class="num">${website.gui.esc(x.so_tin_chi)}</td>
                    <td>${x.da_dat ? '<span class="tag tag-ok">Đã đạt</span>' : ""}</td>
                    <td class="text-right">
                      ${daGhi.has(`${x.ma_hp}|${dot?.maDot}`) ? '<span class="tag">Đã ghi danh</span>' : (dot ? `<button type="button" class="btn btn-sm btn-primary" data-ghi-danh="${website.gui.esc(x.ma_hp)}">Ghi danh</button>` : "")}
                    </td>
                  </tr>
                `).join("") || '<tr><td colspan="5" class="trong">Chương trình chưa có học phần</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `,
    gan() {
      document.querySelectorAll("[data-ghi-danh]").forEach((nut) => {
        nut.addEventListener("click", () => website.gui.chayNut(nut, async () => {
          await bus.ghiDanh(nut.dataset.ghiDanh, dot.maDot);
          website.gui.thongBao("Đã ghi danh học phần");
          location.reload();
        }));
      });
    }
  };
}

async function danhSachCho() {
  const danhSach = await new website.bus.BusDanhSachCho().danhSach();
  return {
    tieuDe: "Danh sách chờ",
    noiDung: `
      <section class="card">
        <div class="card-header"><h2 class="card-title">Thứ tự chờ của bạn</h2></div>
        <div class="card-body tight">
          ${website.gui.bang([
            { ten: "Học phần" }, { ten: "Lớp" }, { ten: "Vị trí", lop: "num" },
            { ten: "Thời điểm vào" }, { ten: "Có chỗ" }, { ten: "Thao tác", lop: "text-right" }
          ], danhSach.map((x) => [
            website.gui.esc(x.tenHp),
            website.gui.esc(x.maLop),
            website.gui.esc(x.thuTu),
            website.gui.thoiGian(x.thoiDiemVao),
            x.conCho ? '<span class="tag tag-ok">Đã có chỗ</span>' : '<span class="tag tag-off">Chưa có</span>',
            `<button type="button" class="btn btn-sm btn-ghost" data-roi="${website.gui.esc(x.maLop)}">Rời</button>
             ${x.conCho && x.laDau ? `<button type="button" class="btn btn-sm btn-primary" data-xac-nhan="${website.gui.esc(x.maLop)}">Xác nhận</button>` : ""}`
          ]))}
        </div>
      </section>
    `,
    gan() {
      document.querySelectorAll("[data-xac-nhan]").forEach((nut) => {
        nut.addEventListener("click", () => website.gui.chayNut(nut, async () => {
          const kq = await new website.bus.BusDanhSachCho().xacNhan(nut.dataset.xacNhan);
          website.gui.thongBao(kq.message);
          location.reload();
        }));
      });
      document.querySelectorAll("[data-roi]").forEach((nut) => {
        nut.addEventListener("click", () => website.gui.chayNut(nut, async () => {
          if (!confirm("Rời khỏi danh sách chờ?")) return;
          await new website.bus.BusDanhSachCho().roi(nut.dataset.roi);
          website.gui.thongBao("Đã rời danh sách chờ");
          location.reload();
        }));
      });
    }
  };
}

async function dangKyHo() {
  const [sinhVien, lop, dot] = await Promise.all([
    new website.bus.BusSinhVien().danhSach(),
    new website.bus.BusLopHocPhan().danhSach(),
    new website.bus.BusDotDangKy().danhSach()
  ]);

  const noiDung = `
    <section class="card">
      <div class="card-header"><h2 class="card-title">Đăng ký học phần hộ sinh viên</h2></div>
      <div class="card-body">
        <form id="formDangKyHo" class="form-grid" novalidate>
          <div class="field">
            <label class="label" for="cboSinhVienHo">Sinh viên</label>
            <select class="select" id="cboSinhVienHo">
              <option value="">Chọn sinh viên</option>
              ${sinhVien.map((x) => `<option value="${website.gui.esc(x.maSv)}">${website.gui.esc(x.maSv)} - ${website.gui.esc(x.hoTen)}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label class="label" for="cboLopHo">Lớp học phần</label>
            <select class="select" id="cboLopHo">
              <option value="">Chọn lớp</option>
              ${lop.map((x) => `<option value="${website.gui.esc(x.maLop)}">${website.gui.esc(x.maLop)} - ${website.gui.esc(x.tenHp)} (${website.gui.esc(x.siSo)}/${website.gui.esc(x.sucChua)})</option>`).join("")}
            </select>
          </div>
          <div class="field field-full">
            <label class="label" for="txtLyDoHo">Lý do đăng ký hộ</label>
            <textarea class="input" id="txtLyDoHo" rows="3" maxlength="500"></textarea>
          </div>
          <div class="page-actions field-full">
            <button type="submit" class="btn btn-primary" id="btnDangKyHo">Đăng ký hộ</button>
          </div>
        </form>
        <div id="ketQuaHo"></div>
      </div>
    </section>
    <section class="card">
      <div class="card-header"><h2 class="card-title">Lớp theo đợt</h2></div>
      <div class="card-body">
        ${dot.map((d) => `
          <p><strong>${website.gui.esc(d.maDot)}</strong> ${website.gui.esc(d.tenDot)}: ${lop.filter((l) => l.maDot === d.maDot).length} lớp</p>
        `).join("") || '<p class="muted">Chưa có đợt</p>'}
      </div>
    </section>
  `;

  return {
    tieuDe: "Đăng ký hộ",
    noiDung,
    gan() {
      website.gui.$("#formDangKyHo").addEventListener("submit", (suKien) => {
        suKien.preventDefault();
        website.gui.chayNut(website.gui.$("#btnDangKyHo"), async () => {
          const kq = await new website.bus.BusDangKy().dangKyHo(
            website.gui.$("#cboSinhVienHo").value,
            website.gui.$("#cboLopHo").value,
            website.gui.$("#txtLyDoHo").value
          );
          website.gui.$("#ketQuaHo").innerHTML = `<div class="alert ${kq.ok ? "alert-success" : "alert-danger"}">${website.gui.esc(kq.message)}</div>`;
          if (kq.ok) website.gui.thongBao("Đăng ký hộ thành công");
          else website.gui.thongBao(kq.message, "loi");
        });
      });
    }
  };
}

  website.trang.docGio = docGio;
  website.trang.lopHocPhanMo = lopHocPhanMo;
  website.trang.chiTietLop = chiTietLop;
  website.trang.dangKyHocPhan = dangKyHocPhan;
  website.trang.ketQuaDangKy = ketQuaDangKy;
  website.trang.hocPhanDaDangKy = hocPhanDaDangKy;
  website.trang.ghiDanhHocPhan = ghiDanhHocPhan;
  website.trang.danhSachCho = danhSachCho;
  website.trang.dangKyHo = dangKyHo;
})();
