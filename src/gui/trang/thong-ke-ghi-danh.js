var website = window.website = window.website || {};
website.trang = website.trang || {};

(function () {
  "use strict";

async function thongKeGhiDanh() {
  const duLieu = await new website.bus.BusDangKy().thongKeGhiDanh();

  const namHocSet = new Set();
  const hocKySet = new Set();
  for (const x of duLieu || []) {
    if (x.nam_hoc) {
      namHocSet.add(x.nam_hoc);
    }
    if (x.hoc_ky) {
      hocKySet.add(x.hoc_ky);
    }
  }
  const danhSachNamHoc = Array.from(namHocSet).sort();
  const danhSachHocKy = Array.from(hocKySet).sort();

  const banHtml = (locNamHoc, locHocKy) => {
    const loc = (duLieu || []).filter((x) => {
      if (locNamHoc && x.nam_hoc !== locNamHoc) {
        return false;
      }
      if (locHocKy && x.hoc_ky !== locHocKy) {
        return false;
      }
      return true;
    });
    if (loc.length === 0) {
      return website.gui.bang(
        [
          { ten: "Năm học" },
          { ten: "Học kỳ" },
          { ten: "Khóa" },
          { ten: "Mã học phần" },
          { ten: "Học phần" },
          { ten: "Số sinh viên", lop: "num" }
        ],
        [],
        { trong: "Chưa có sinh viên ghi danh" }
      );
    }
    return website.gui.bang(
      [
        { ten: "Năm học" },
        { ten: "Học kỳ" },
        { ten: "Khóa" },
        { ten: "Mã học phần" },
        { ten: "Học phần" },
        { ten: "Số sinh viên", lop: "num" }
      ],
      loc.map((x) => [
        website.gui.esc(x.nam_hoc),
        website.gui.esc(x.hoc_ky),
        website.gui.esc(x.nien_khoa),
        website.gui.esc(x.ma_hp),
        website.gui.esc(x.ten_hp),
        website.gui.esc(x.so_sinh_vien)
      ])
    );
  };

  const noiDung = `
    <section class="card">
      <div class="card-header"><h2 class="card-title">Thống kê ghi danh</h2></div>
      <div class="card-body">
        <div class="form-grid">
          <div class="field">
            <label class="label" for="locNamHoc">Năm học</label>
            <select class="select" id="locNamHoc">
              ${website.gui.tuyChon(danhSachNamHoc.map((v) => ({ gia: v, nhan: v })), "gia", "nhan", "", "Tất cả năm học")}
            </select>
          </div>
          <div class="field">
            <label class="label" for="locHocKy">Học kỳ</label>
            <select class="select" id="locHocKy">
              ${website.gui.tuyChon(danhSachHocKy.map((v) => ({ gia: v, nhan: v })), "gia", "nhan", "", "Tất cả học kỳ")}
            </select>
          </div>
        </div>
      </div>
      <div class="card-body tight" id="bangThongKe">
        ${banHtml("", "")}
      </div>
    </section>
  `;

  return {
    tieuDe: "Thống kê ghi danh",
    noiDung,
    gan() {
      website.gui.$("#locNamHoc").addEventListener("change", () => {
        website.gui.$("#bangThongKe").innerHTML = banHtml(website.gui.$("#locNamHoc").value, website.gui.$("#locHocKy").value);
      });
      website.gui.$("#locHocKy").addEventListener("change", () => {
        website.gui.$("#bangThongKe").innerHTML = banHtml(website.gui.$("#locNamHoc").value, website.gui.$("#locHocKy").value);
      });
    }
  };
}

  website.trang.thongKeGhiDanh = thongKeGhiDanh;
})();
