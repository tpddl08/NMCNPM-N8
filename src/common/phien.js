var website = window.website = window.website || {};
website.phien = website.phien || {};

(function () {
  "use strict";

const KHOA_PHIEN = "phien-dang-nhap";

class LoiNghiepVu extends Error {
  constructor(thongBao) {
    super(thongBao);
    this.name = "LoiNghiepVu";
  }
}

class LoiPhien extends LoiNghiepVu {
  constructor() {
    super("Phiên đăng nhập đã hết hạn");
    this.name = "LoiPhien";
  }
}

function daCauHinh() {
  return !website.cauHinh.SUPABASE_URL.startsWith("__DIEN_") && !website.cauHinh.SUPABASE_ANON_KEY.startsWith("__DIEN_");
}

function layToken() {
  return localStorage.getItem(KHOA_PHIEN) || "";
}

function luuToken(token) {
  localStorage.setItem(KHOA_PHIEN, token);
}

function xoaToken() {
  localStorage.removeItem(KHOA_PHIEN);
}

function dungDangToken(token) {
  return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token || "");
}

async function goiRpc(tenHam, thamSo = {}) {
  if (!daCauHinh()) {
    throw new LoiNghiepVu("Chưa cấu hình kết nối cơ sở dữ liệu");
  }
  let phanHoi;
  try {
    phanHoi = await fetch(`${website.cauHinh.SUPABASE_URL}/rest/v1/rpc/${tenHam}`, {
      method: "POST",
      headers: {
        apikey: website.cauHinh.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${website.cauHinh.SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(thamSo)
    });
  } catch {
    throw new LoiNghiepVu("Không kết nối được cơ sở dữ liệu");
  }

  const noiDung = await phanHoi.text();
  let duLieu = null;
  if (noiDung) {
    try {
      duLieu = JSON.parse(noiDung);
    } catch {
      duLieu = noiDung;
    }
  }

  if (!phanHoi.ok) {
    const thongBao = (duLieu && (duLieu.message || duLieu.hint)) || "Không xử lý được yêu cầu";
    if (thongBao.includes("Phiên đăng nhập đã hết hạn")) {
      xoaToken();
      throw new LoiPhien();
    }
    throw new LoiNghiepVu(thongBao);
  }
  return duLieu;
}

async function goiRpcCoToken(tenHam, thamSo = {}) {
  const token = layToken();
  if (!dungDangToken(token)) {
    xoaToken();
    throw new LoiPhien();
  }
  return goiRpc(tenHam, { p_token: token, ...thamSo });
}

  website.phien.LoiNghiepVu = LoiNghiepVu;
  website.phien.LoiPhien = LoiPhien;
  website.phien.daCauHinh = daCauHinh;
  website.phien.layToken = layToken;
  website.phien.luuToken = luuToken;
  website.phien.xoaToken = xoaToken;
  website.phien.dungDangToken = dungDangToken;
  website.phien.goiRpc = goiRpc;
  website.phien.goiRpcCoToken = goiRpcCoToken;
})();
