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

function thongDiepLoi(loi) {
  const thongDiep = String(loi?.message || loi || "").trim();
  if (!thongDiep) return "Đã có sự cố khi xử lý yêu cầu. Vui lòng thử lại; nếu vẫn gặp lỗi, hãy tải lại trang.";

  const huongDan = {
    "Tên đăng nhập hoặc mật khẩu không đúng": "Tên đăng nhập hoặc mật khẩu chưa chính xác. Hãy kiểm tra lại thông tin rồi thử lại.",
    "Tài khoản đã bị khóa": "Tài khoản hiện đã bị khóa. Vui lòng liên hệ Phòng đào tạo để được hỗ trợ.",
    "Mật khẩu cũ không đúng": "Mật khẩu hiện tại chưa chính xác. Hãy kiểm tra lại rồi nhập mật khẩu mới.",
    "Mật khẩu phải có ít nhất 8 ký tự": "Mật khẩu cần có ít nhất 8 ký tự. Hãy nhập mật khẩu dài hơn rồi thử lại.",
    "Mật khẩu mới phải có ít nhất 8 ký tự": "Mật khẩu mới cần có ít nhất 8 ký tự. Hãy nhập mật khẩu dài hơn rồi thử lại.",
    "Phiên đăng nhập đã hết hạn": "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.",
    "Chưa cấu hình khóa ký token": "Hệ thống chưa được cấu hình đầy đủ. Vui lòng liên hệ quản trị viên.",
    "Bạn không có quyền thực hiện thao tác này": "Tài khoản hiện tại không có quyền thực hiện thao tác này. Hãy kiểm tra vai trò hoặc liên hệ Phòng đào tạo.",
    "Chỉ sinh viên mới sử dụng chức năng này": "Chức năng này dành cho tài khoản sinh viên. Hãy đăng nhập bằng tài khoản phù hợp.",
    "Chỉ sinh viên được xem lớp đang mở": "Không tìm thấy hồ sơ sinh viên cho tài khoản này. Vui lòng liên hệ Phòng đào tạo để kiểm tra tài khoản.",
    "Tài khoản sinh viên không hợp lệ": "Tài khoản chưa được liên kết với hồ sơ sinh viên. Vui lòng liên hệ Phòng đào tạo.",
    "Không tìm thấy sinh viên": "Không tìm thấy hồ sơ sinh viên cần thao tác. Hãy kiểm tra mã sinh viên rồi thử lại.",
    "Không tìm thấy đăng ký": "Không tìm thấy đăng ký này. Danh sách có thể đã được cập nhật; hãy tải lại trang.",
    "Không tìm thấy đợt đăng ký": "Không tìm thấy đợt đăng ký đã chọn. Hãy chọn lại đợt từ danh sách mới nhất.",
    "Đợt đăng ký chưa kết thúc": "Đợt này vẫn đang diễn ra. Hãy quay lại xử lý sau thời điểm kết thúc.",
    "Đăng ký không còn hiệu lực": "Đăng ký này đã được hủy hoặc không còn hiệu lực. Hãy tải lại danh sách để xem trạng thái mới nhất.",
    "Chỉ được hủy khi đợt đăng ký đang mở": "Chỉ có thể hủy đăng ký trong thời gian đợt còn mở. Hãy kiểm tra thời hạn của đợt.",
    "Không tìm thấy lớp học phần": "Không tìm thấy lớp học phần này. Lớp có thể đã bị gỡ; hãy tải lại danh sách.",
    "Lớp học phần đã đóng hoặc đã bị hủy": "Lớp học phần đã đóng hoặc bị hủy nên không thể tiếp tục thao tác. Hãy chọn lớp khác đang mở.",
    "Bạn đã đăng ký lớp học phần này": "Bạn đã đăng ký lớp này rồi. Hãy xem danh sách học phần đã đăng ký để kiểm tra.",
    "Bạn đã đăng ký học phần này": "Bạn đã có một lớp của học phần này trong đợt. Hãy kiểm tra danh sách đăng ký trước khi chọn lớp khác.",
    "Bạn chưa ghi danh học phần này": "Bạn cần ghi danh học phần trước. Mở mục Ghi danh học phần, chọn học phần trong đợt hiện tại rồi thử đăng ký lại.",
    "Lớp đã đầy": "Lớp vừa đủ chỗ trước khi yêu cầu được xử lý. Bạn có thể chọn lớp khác hoặc vào danh sách chờ.",
    "Lớp còn chỗ, vui lòng đăng ký trực tiếp": "Lớp hiện còn chỗ. Hãy đăng ký trực tiếp thay vì vào danh sách chờ.",
    "Bạn đã có trong danh sách chờ của lớp này": "Bạn đã có tên trong danh sách chờ lớp này. Hãy mở Danh sách chờ để theo dõi thứ tự.",
    "Bạn chưa phải người đầu tiên trong danh sách chờ": "Bạn chưa đến lượt xác nhận chỗ. Hãy chờ đến khi bạn đứng đầu danh sách rồi thử lại.",
    "Đợt đăng ký chưa mở": "Đợt đăng ký chưa bắt đầu. Hãy kiểm tra thời điểm mở và quay lại sau.",
    "Đợt đăng ký đã đóng": "Đợt đăng ký đã kết thúc nên không thể thực hiện thao tác này.",
    "Đợt đăng ký chưa mở hoặc đã đóng": "Đợt hiện chưa mở hoặc đã kết thúc. Hãy kiểm tra thời gian đăng ký.",
    "Bạn không thuộc nhóm được phép đăng ký đợt này": "Đợt này chưa áp dụng cho nhóm sinh viên của bạn. Hãy kiểm tra thông tin nhóm hoặc liên hệ Phòng đào tạo.",
    "Bạn không thuộc nhóm được phép của đợt này": "Đợt này chưa áp dụng cho nhóm sinh viên của bạn. Hãy kiểm tra thông tin nhóm hoặc liên hệ Phòng đào tạo.",
    "Nhóm của bạn không có yêu cầu ghi danh trong đợt này": "Nhóm của bạn không cần ghi danh trước trong đợt này. Bạn có thể tiếp tục đăng ký lớp học phần.",
    "Học phần không thuộc chương trình đào tạo của bạn": "Học phần này không nằm trong chương trình đào tạo của bạn. Hãy chọn học phần trong chương trình của mình.",
    "Thiếu mã lớp": "Dữ liệu nhập còn thiếu mã lớp. Hãy bổ sung mã lớp ở dòng được báo rồi nhập lại.",
    "Thứ không hợp lệ": "Ngày học phải là một giá trị từ Thứ 2 đến Chủ nhật. Hãy kiểm tra dòng dữ liệu được báo.",
    "Tiết kết thúc nhỏ hơn tiết bắt đầu": "Tiết kết thúc phải bằng hoặc sau tiết bắt đầu. Hãy kiểm tra lịch học ở dòng được báo.",
    "Thời điểm đóng phải sau thời điểm mở": "Thời điểm đóng cần sau thời điểm mở. Hãy chỉnh lại thời gian của đợt rồi lưu.",
    "Số tín chỉ phải lớn hơn 0": "Số tín chỉ phải là số lớn hơn 0. Hãy kiểm tra lại thông tin học phần.",
    "Sức chứa phải lớn hơn 0": "Sức chứa phải lớn hơn 0. Hãy nhập số chỗ hợp lệ rồi lưu lại.",
    "Điểm phải nằm trong khoảng 0 đến 10": "Điểm cần nằm trong khoảng từ 0 đến 10. Hãy kiểm tra lại điểm đã nhập.",
    "Không thể xóa khoa vì đang được sử dụng": "Khoa này đang được gắn với dữ liệu khác nên chưa thể xóa. Hãy chuyển các dữ liệu liên quan sang khoa khác trước.",
    "Không thể xóa nhóm vì đang được sử dụng": "Nhóm này đang có sinh viên hoặc đợt đăng ký sử dụng. Hãy cập nhật các liên kết trước khi xóa.",
    "Không thể xóa học phần vì đang được sử dụng": "Học phần đang được dùng trong chương trình, lớp hoặc kết quả học tập nên chưa thể xóa.",
    "Không thể đổi học phần hoặc đợt của lớp đã có sinh viên đăng ký": "Lớp đã có sinh viên đăng ký nên không thể đổi học phần hoặc đợt. Hãy tạo lớp mới nếu cần thay đổi.",
    "Nhật ký chỉ được thêm, không được sửa hoặc xóa": "Nhật ký thao tác được lưu để đối soát và không thể chỉnh sửa hoặc xóa.",
    "Không xử lý được yêu cầu": "Hệ thống chưa xử lý được yêu cầu. Vui lòng thử lại; nếu lỗi tiếp diễn, hãy liên hệ Phòng đào tạo."
  };
  if (huongDan[thongDiep]) return huongDan[thongDiep];

  const thieuHocPhan = thongDiep.match(/^Thiếu học phần:\s*(.+)$/);
  if (thieuHocPhan) return `Bạn cần hoàn thành học phần tiên quyết: ${thieuHocPhan[1]}. Hãy kiểm tra điều kiện học phần rồi thử lại.`;
  const trungLich = thongDiep.match(/^Trùng lịch với lớp\s+(.+)$/);
  if (trungLich) return `Lịch học bị trùng với lớp ${trungLich[1]}. Hãy chọn lớp có lịch khác.`;
  const sucChua = thongDiep.match(/^Không thể giảm sức chứa xuống dưới sĩ số hiện tại\s*\(?([0-9]+)\)?\.?$/);
  if (sucChua) return `Sức chứa không thể thấp hơn sĩ số hiện tại (${sucChua[1]}). Hãy nhập sức chứa bằng hoặc lớn hơn số này.`;
  const lopTrung = thongDiep.match(/^Trùng lớp\s+(.+)$/);
  if (lopTrung) return `Mã lớp ${lopTrung[1]} đã có trong hệ thống. Hãy dùng mã lớp khác.`;

  // Không đưa chi tiết kỹ thuật của PostgreSQL/PostgREST vào thông báo cho người dùng.
  if (/^(PGRST|HTTP\s*\d|\d{5}:)|permission denied|violates .* constraint|duplicate key|internal server error|invalid input syntax|schema cache|could not find (the )?(function|column)|does not exist/i.test(thongDiep)) {
    return "Hệ thống chưa thể lưu thay đổi. Hãy kiểm tra dữ liệu vừa nhập và thử lại; nếu lỗi tiếp diễn, vui lòng liên hệ Phòng đào tạo.";
  }
  if (loi?.name && !["LoiNghiepVu", "Error"].includes(loi.name)) {
    return "Đã có sự cố khi xử lý yêu cầu. Vui lòng thử lại; nếu vẫn gặp lỗi, hãy tải lại trang hoặc liên hệ Phòng đào tạo.";
  }
  return thongDiep;
}

function thongBaoLoi(loi) {
  if (loi?.name === "LoiPhien") {
    window.dispatchEvent(new CustomEvent("phien-het-han"));
    return;
  }
  thongBao(thongDiepLoi(loi), "loi");
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
  website.gui.thongDiepLoi = thongDiepLoi;
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
