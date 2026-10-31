create extension if not exists pgcrypto;

create table public.khoa (
  ma_khoa varchar(20) primary key,
  ten_khoa varchar(100) not null
);

create table public.nguoidung (
  ma_tk integer generated always as identity primary key,
  ten_dang_nhap varchar(50) not null unique,
  mat_khau_bam varchar(255) not null,
  vai_tro varchar(10) not null check (vai_tro in ('PDT', 'SV')),
  trang_thai varchar(20) not null default 'HoatDong' check (trang_thai in ('HoatDong', 'BiKhoa'))
);

create table public.nhomsinhvien (
  ma_nhom varchar(20) primary key,
  ten_nhom varchar(100) not null,
  co_ghi_danh boolean not null,
  ma_khoa varchar(20) not null references public.khoa(ma_khoa)
);

create table public.chuongtrinhdaotao (
  ma_ctdt varchar(20) primary key,
  ten_ctdt varchar(150) not null,
  nien_khoa varchar(20) not null
);

create table public.sinhvien (
  ma_sv varchar(20) primary key
    check (ma_sv ~ '^(4[89]|[5-9][0-9])\.01\.[0-9]{3}\.[0-9]{3}$'),
  ho_ten varchar(100) not null,
  ngay_sinh date not null,
  nien_khoa varchar(20) not null,
  trang_thai varchar(20) not null default 'DangHoc'
    check (trang_thai in ('DangHoc', 'BaoLuu', 'DaTotNghiep')),
  ma_tk integer not null unique references public.nguoidung(ma_tk),
  ma_khoa varchar(20) not null references public.khoa(ma_khoa),
  ma_nhom varchar(20) references public.nhomsinhvien(ma_nhom),
  ma_ctdt varchar(20) not null references public.chuongtrinhdaotao(ma_ctdt)
);

create table public.hocphan (
  ma_hp varchar(20) primary key
    check (ma_hp ~ '^(COMP|MATH|EDU|PHYS)(1[0-9]{3}|2[0-9]{3}|3000)$'),
  ten_hp varchar(150) not null,
  so_tin_chi smallint not null check (so_tin_chi > 0)
);

create table public.ctdt_hocphan (
  ma_ctdt varchar(20) not null references public.chuongtrinhdaotao(ma_ctdt) on delete cascade,
  ma_hp varchar(20) not null references public.hocphan(ma_hp),
  hoc_ky_du_kien smallint check (hoc_ky_du_kien between 1 and 8),
  primary key (ma_ctdt, ma_hp)
);

create table public.tienquyet (
  ma_hp varchar(20) not null references public.hocphan(ma_hp),
  ma_hp_tien_quyet varchar(20) not null references public.hocphan(ma_hp),
  loai_rang_buoc varchar(20) not null check (loai_rang_buoc in ('TienQuyet', 'HocTruoc')),
  primary key (ma_hp, ma_hp_tien_quyet),
  check (ma_hp <> ma_hp_tien_quyet)
);

create table public.dotdangky (
  ma_dot varchar(20) primary key,
  ten_dot varchar(150) not null,
  hoc_ky varchar(20) not null,
  nam_hoc varchar(20) not null,
  thoi_diem_mo timestamp not null,
  thoi_diem_dong timestamp not null,
  nguong_huy_lop smallint not null default 15 check (nguong_huy_lop >= 0),
  check (thoi_diem_dong > thoi_diem_mo)
);

create table public.dotnhom (
  ma_dot varchar(20) not null references public.dotdangky(ma_dot) on delete cascade,
  ma_nhom varchar(20) not null references public.nhomsinhvien(ma_nhom),
  primary key (ma_dot, ma_nhom)
);

create table public.lophocphan (
  ma_lop varchar(30) primary key
    check (ma_lop ~ '^[0-9]{2}(COMP|MATH|EDU|PHYS)(1[0-9]{3}|2[0-9]{3}|3000)[0-9]{2}$'),
  suc_chua integer not null check (suc_chua > 0),
  trang_thai varchar(20) not null default 'Mo' check (trang_thai in ('Mo', 'Dong', 'BiHuy')),
  ma_hp varchar(20) not null references public.hocphan(ma_hp),
  ma_dot varchar(20) not null references public.dotdangky(ma_dot)
);

create table public.lichhoc (
  ma_buoi integer generated always as identity primary key,
  thu smallint not null check (thu between 2 and 8),
  tiet_bat_dau smallint not null check (tiet_bat_dau > 0),
  tiet_ket_thuc smallint not null check (tiet_ket_thuc >= tiet_bat_dau),
  phong_hoc varchar(30) not null,
  giang_vien varchar(100) not null,
  ma_lop varchar(30) not null references public.lophocphan(ma_lop) on delete cascade
);

create table public.ghidanhhocphan (
  ma_sv varchar(20) not null references public.sinhvien(ma_sv),
  ma_hp varchar(20) not null references public.hocphan(ma_hp),
  ma_dot varchar(20) not null references public.dotdangky(ma_dot),
  thoi_diem timestamp not null default now(),
  primary key (ma_sv, ma_hp, ma_dot)
);

create table public.dangky (
  ma_dang_ky integer generated always as identity primary key,
  thoi_diem_dang_ky timestamp not null default now(),
  trang_thai varchar(20) not null check (trang_thai in ('HieuLuc', 'DaHuy', 'LopBiHuy')),
  ma_sv varchar(20) not null references public.sinhvien(ma_sv),
  ma_lop varchar(30) not null references public.lophocphan(ma_lop)
);

create table public.danhsachcho (
  ma_ds integer generated always as identity primary key,
  thoi_diem_vao timestamp not null default now(),
  thu_tu integer not null check (thu_tu > 0),
  ma_sv varchar(20) not null references public.sinhvien(ma_sv),
  ma_lop varchar(30) not null references public.lophocphan(ma_lop),
  unique (ma_sv, ma_lop)
);

create table public.ketquahoctap (
  ma_kq integer generated always as identity primary key,
  hoc_ky varchar(20) not null,
  diem numeric(4, 1) not null check (diem between 0 and 10),
  ma_sv varchar(20) not null references public.sinhvien(ma_sv),
  ma_hp varchar(20) not null references public.hocphan(ma_hp),
  unique (ma_sv, ma_hp, hoc_ky)
);

create table public.nhatkyimport (
  ma_import integer generated always as identity primary key,
  thoi_gian timestamp not null default now(),
  ten_file varchar(255) not null,
  so_dong_dung integer not null default 0,
  so_dong_sai integer not null default 0,
  ma_tk integer not null references public.nguoidung(ma_tk)
);

create table public.nhatkythaotac (
  ma_log integer generated always as identity primary key,
  thoi_gian timestamp not null default now(),
  loai_thao_tac varchar(50) not null,
  ket_qua varchar(20) not null,
  ly_do varchar(500) not null default '',
  ma_tk integer not null references public.nguoidung(ma_tk),
  ma_sv varchar(20) references public.sinhvien(ma_sv),
  ma_lop varchar(30) references public.lophocphan(ma_lop)
);

create unique index dangky_hieu_luc_mot_lan on public.dangky (ma_sv, ma_lop) where trang_thai = 'HieuLuc';
create index dangky_ma_lop_idx on public.dangky (ma_lop, trang_thai);
create index dangky_ma_sv_idx on public.dangky (ma_sv, trang_thai);
create index danhsachcho_ma_lop_idx on public.danhsachcho (ma_lop, thu_tu);
create index lichhoc_ma_lop_idx on public.lichhoc (ma_lop);
create index lophocphan_ma_dot_idx on public.lophocphan (ma_dot, trang_thai);
create index nhatkythaotac_ma_sv_idx on public.nhatkythaotac (ma_sv, thoi_gian desc);
create index nhatkythaotac_ma_tk_idx on public.nhatkythaotac (ma_tk, thoi_gian desc);
