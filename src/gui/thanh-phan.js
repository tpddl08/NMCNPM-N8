var website = window.website = window.website || {};
website.gui = website.gui || {};

(function () {
  "use strict";

const $ = (chon, goc = document) => goc.querySelector(chon);
const $$ = (chon, goc = document) => Array.from(goc.querySelectorAll(chon));

function esc(giaTri) {
  return String(giaTri ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function ngay(giaTri) {
  if (!giaTri) return "";
  const d = new Date(giaTri);
  if (Number.isNaN(d.getTime())) return esc(giaTri);
  return d.toLocaleDateString("vi-VN");
}

function thoiGian(giaTri) {
  if (!giaTri) return "";
  const d = new Date(giaTri);
  if (Number.isNaN(d.getTime())) return esc(giaTri);
  return d.toLocaleString("vi-VN", { hour12: false });
}

function ngayGioChoInput(giaTri) {
  if (!giaTri) return "";
  const d = new Date(giaTri);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function tuyChon(danhSach, giaTriKhoa, nhanKhoa, dangChon = "", trongRong = "") {
  const dong = trongRong ? `<option value="">${esc(trongRong)}</option>` : "";
  return dong + (danhSach || []).map((x) =>
    `<option value="${esc(x[giaTriKhoa])}" ${String(x[giaTriKhoa]) === String(dangChon) ? "selected" : ""}>${esc(x[nhanKhoa])}</option>`
  ).join("");
}

function bang(cot, dong, tuyChonBang = {}) {
  const dau = cot.map((c) => `<th class="${c.lop || ""}">${esc(c.ten)}</th>`).join("");
  const than = dong.length
    ? dong.map((r) => `<tr>${r.map((o, i) => `<td class="${cot[i]?.lop || ""}">${o ?? ""}</td>`).join("")}</tr>`).join("")
    : `<tr><td colspan="${cot.length}" class="trong">${esc(tuyChonBang.trong || "Không có dữ liệu")}</td></tr>`;
  return `<div class="table-scroll"><table class="data"><thead><tr>${dau}</tr></thead><tbody>${than}</tbody></table></div>`;
}

function thongBao(noiDung, loai = "thanh-cong") {
  const khu = $("#khu-thong-bao");
  if (!khu) return;
  const o = document.createElement("div");
  o.className = `toast toast-${loai}`;
  o.textContent = noiDung;
  khu.appendChild(o);
  setTimeout(() => o.remove(), 5000);
}

function thongBaoLoi(loi) {
  if (loi?.name === "LoiPhien") {
    window.dispatchEvent(new CustomEvent("phien-het-han"));
    return;
  }
  const noiDung = loi?.message || "Có lỗi xảy ra, vui lòng thử lại sau";
  thongBao(noiDung, "loi");
}

async function chayNut(btn, viec) {
  khoaNut(btn, true);
  try {
    await viec();
  } catch (loi) {
    thongBaoLoi(loi);
  } finally {
    khoaNut(btn, false);
  }
}

function khoaNut(btn, dangChay) {
  if (!btn) return;
  btn.disabled = dangChay;
  btn.dataset.nhanGoc = btn.dataset.nhanGoc || btn.textContent;
  btn.textContent = dangChay ? "Đang xử lý..." : btn.dataset.nhanGoc;
}

function ngayHomNay() {
  return new Date().toISOString().slice(0, 10);
}

function tenThu(thu) {
  return thu === 8 ? "Chủ nhật" : `Thứ ${thu}`;
}

function tenLoaiThaoTac(loai) {
  const map = {
    TatCa: "Tất cả",
    DoiMatKhau: "Đổi mật khẩu",
    DangKy: "Đăng ký",
    HuyDangKy: "Hủy đăng ký",
    GhiDanh: "Ghi danh",
    HuyGhiDanh: "Hủy ghi danh",
    VaoDanhSachCho: "Vào danh sách chờ",
    RoiDanhSachCho: "Rời danh sách chờ",
    XulySauDot: "Xử lý sau đợt",
    XuLySauDot: "Xử lý sau đợt",
    LuuDot: "Lưu đợt",
    LuuLop: "Lưu lớp",
    HuyLop: "Hủy lớp",
    LuuSinhVien: "Lưu sinh viên",
    LuuTaiKhoan: "Lưu tài khoản",
    LuuHocPhan: "Lưu học phần",
    LuuKetQua: "Lưu kết quả",
    NhapLop: "Nhập lớp",
    LuuNhom: "Lưu nhóm",
    LuuKhoa: "Lưu khoa",
    KhoiTaoDuLieu: "Khởi tạo dữ liệu"
  };
  return map[loai] || loai;
}

function tiet(buoi) {
  return `${buoi.tiet_bat_dau}-${buoi.tiet_ket_thuc}`;
}

function lichTomTat(lich) {
  if (!lich || !lich.length) return "Chưa xếp lịch";
  return lich.map((b) => `${tenThu(Number(b.thu))} tiết ${tiet(b)} (${b.phong_hoc})`).join("; ");
}

function hopThoai(thongDiep, macDinh = "") {
  return window.prompt(thongDiep, macDinh);
}

  website.gui.$ = $;
  website.gui.$$ = $$;
  website.gui.esc = esc;
  website.gui.ngay = ngay;
  website.gui.thoiGian = thoiGian;
  website.gui.ngayGioChoInput = ngayGioChoInput;
  website.gui.tuyChon = tuyChon;
  website.gui.bang = bang;
  website.gui.thongBao = thongBao;
  website.gui.thongBaoLoi = thongBaoLoi;
  website.gui.chayNut = chayNut;
  website.gui.khoaNut = khoaNut;
  website.gui.ngayHomNay = ngayHomNay;
  function tenKetQua(ketQua) {
  const map = {
    ThanhCong: "Thành công",
    TuChoi: "Từ chối"
  };
  return map[ketQua] || ketQua;
}

function tenTrangThaiLop(trangThai) {
  const map = {
    Mo: "Đang mở",
    Dong: "Đã đóng",
    BiHuy: "Đã hủy",
    "Đang mở": "Đang mở",
    "Đã đóng": "Đã đóng",
    "Đã hủy": "Đã hủy"
  };
  return map[trangThai] || trangThai;
}

website.gui.tenThu = tenThu;
  website.gui.tenTrangThaiLop = tenTrangThaiLop;
  website.gui.tenKetQua = tenKetQua;
  website.gui.tenLoaiThaoTac = tenLoaiThaoTac;
  website.gui.tiet = tiet;
  website.gui.lichTomTat = lichTomTat;
  website.gui.hopThoai = hopThoai;
})();
