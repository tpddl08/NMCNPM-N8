create table public.chuongtrinhdaotao (
  ma_ctdt character varying(20) not null,
  ten_ctdt character varying(150) not null,
  nien_khoa character varying(20) not null
);

create table public.ctdt_hocphan (
  ma_ctdt character varying(20) not null,
  ma_hp character varying(20) not null,
  hoc_ky_du_kien smallint
);

create table public.dangky (
  ma_dang_ky integer not null generated always as identity,
  thoi_diem_dang_ky timestamp without time zone not null default now(),
  trang_thai character varying(20) not null,
  ma_sv character varying(20) not null,
  ma_lop character varying(30) not null
);

create table public.danhsachcho (
  ma_ds integer not null generated always as identity,
  thoi_diem_vao timestamp without time zone not null default now(),
  thu_tu integer not null,
  ma_sv character varying(20) not null,
  ma_lop character varying(30) not null
);

create table public.dotdangky (
  ma_dot character varying(20) not null,
  ten_dot character varying(150) not null,
  hoc_ky character varying(20) not null,
  nam_hoc character varying(20) not null,
  thoi_diem_mo timestamp without time zone not null,
  thoi_diem_dong timestamp without time zone not null,
  nguong_huy_lop smallint not null default 15
);

create table public.dotnhom (
  ma_dot character varying(20) not null,
  ma_nhom character varying(20) not null,
  co_ghi_danh boolean not null default false
);

create table public.ghidanhhocphan (
  ma_sv character varying(20) not null,
  ma_hp character varying(20) not null,
  ma_dot character varying(20) not null,
  thoi_diem timestamp without time zone not null default now()
);

create table public.hocphan (
  ma_hp character varying(20) not null,
  ten_hp character varying(150) not null,
  so_tin_chi smallint not null
);

create table public.ketquahoctap (
  ma_kq integer not null generated always as identity,
  hoc_ky character varying(20) not null,
  diem numeric(4,1) not null,
  ma_sv character varying(20) not null,
  ma_hp character varying(20) not null
);

create table public.khoa (
  ma_khoa character varying(20) not null,
  ten_khoa character varying(100) not null
);

create table public.lichhoc (
  ma_buoi integer not null generated always as identity,
  thu smallint not null,
  tiet_bat_dau smallint not null,
  tiet_ket_thuc smallint not null,
  phong_hoc character varying(30) not null,
  giang_vien character varying(100) not null,
  ma_lop character varying(30) not null
);

create table public.lophocphan (
  ma_lop character varying(30) not null,
  suc_chua integer not null,
  trang_thai character varying(20) not null default 'Mo'::character varying,
  ma_hp character varying(20) not null,
  ma_dot character varying(20) not null
);

create table public.nguoidung (
  ma_tk integer not null generated always as identity,
  ten_dang_nhap character varying(50) not null,
  mat_khau_bam character varying(255) not null,
  vai_tro character varying(10) not null,
  trang_thai character varying(20) not null default 'HoatDong'::character varying
);

create table public.nhatkyimport (
  ma_import integer not null generated always as identity,
  thoi_gian timestamp without time zone not null default now(),
  ten_file character varying(255) not null,
  so_dong_dung integer not null default 0,
  so_dong_sai integer not null default 0,
  ma_tk integer not null
);

create table public.nhatkythaotac (
  ma_log integer not null generated always as identity,
  thoi_gian timestamp without time zone not null default now(),
  loai_thao_tac character varying(50) not null,
  ket_qua character varying(20) not null,
  ly_do character varying(500) not null default ''::character varying,
  ma_tk integer not null,
  ma_sv character varying(20),
  ma_lop character varying(30)
);

create table public.nhomsinhvien (
  ma_nhom character varying(20) not null,
  ten_nhom character varying(100) not null,
  ma_khoa character varying(20) not null
);

create table public.sinhvien (
  ma_sv character varying(20) not null,
  ho_ten character varying(100) not null,
  ngay_sinh date not null,
  nien_khoa character varying(20) not null,
  trang_thai character varying(20) not null default 'DangHoc'::character varying,
  ma_tk integer not null,
  ma_khoa character varying(20) not null,
  ma_nhom character varying(20),
  ma_ctdt character varying(20) not null
);

create table public.tienquyet (
  ma_hp character varying(20) not null,
  ma_hp_tien_quyet character varying(20) not null,
  loai_rang_buoc character varying(20) not null
);

alter table public.chuongtrinhdaotao add constraint chuongtrinhdaotao_pkey PRIMARY KEY (ma_ctdt);

alter table public.ctdt_hocphan add constraint ctdt_hocphan_hoc_ky_du_kien_check CHECK (((hoc_ky_du_kien >= 1) AND (hoc_ky_du_kien <= 8)));

alter table public.ctdt_hocphan add constraint ctdt_hocphan_pkey PRIMARY KEY (ma_ctdt, ma_hp);

alter table public.dangky add constraint dangky_pkey PRIMARY KEY (ma_dang_ky);

alter table public.dangky add constraint dangky_trang_thai_check CHECK (((trang_thai)::text = ANY ((ARRAY['HieuLuc'::character varying, 'DaHuy'::character varying, 'LopBiHuy'::character varying])::text[])));

alter table public.danhsachcho add constraint danhsachcho_ma_sv_ma_lop_key UNIQUE (ma_sv, ma_lop);

alter table public.danhsachcho add constraint danhsachcho_pkey PRIMARY KEY (ma_ds);

alter table public.danhsachcho add constraint danhsachcho_thu_tu_check CHECK ((thu_tu > 0));

alter table public.dotdangky add constraint dotdangky_check CHECK ((thoi_diem_dong > thoi_diem_mo));

alter table public.dotdangky add constraint dotdangky_nguong_huy_lop_check CHECK ((nguong_huy_lop >= 0));

alter table public.dotdangky add constraint dotdangky_pkey PRIMARY KEY (ma_dot);

alter table public.dotnhom add constraint dotnhom_pkey PRIMARY KEY (ma_dot, ma_nhom);

alter table public.ghidanhhocphan add constraint ghidanhhocphan_pkey PRIMARY KEY (ma_sv, ma_hp, ma_dot);

alter table public.hocphan add constraint hocphan_ma_hp_check CHECK (((ma_hp)::text ~ '^(COMP|MATH|EDU|PHYS)(1[0-9]{3}|2[0-9]{3}|3000)$'::text));

alter table public.hocphan add constraint hocphan_pkey PRIMARY KEY (ma_hp);

alter table public.hocphan add constraint hocphan_so_tin_chi_check CHECK ((so_tin_chi > 0));

alter table public.ketquahoctap add constraint ketquahoctap_diem_check CHECK (((diem >= (0)::numeric) AND (diem <= (10)::numeric)));

alter table public.ketquahoctap add constraint ketquahoctap_ma_sv_ma_hp_hoc_ky_key UNIQUE (ma_sv, ma_hp, hoc_ky);

alter table public.ketquahoctap add constraint ketquahoctap_pkey PRIMARY KEY (ma_kq);

alter table public.khoa add constraint khoa_pkey PRIMARY KEY (ma_khoa);

alter table public.lichhoc add constraint lichhoc_check CHECK ((tiet_ket_thuc >= tiet_bat_dau));

alter table public.lichhoc add constraint lichhoc_pkey PRIMARY KEY (ma_buoi);

alter table public.lichhoc add constraint lichhoc_thu_check CHECK (((thu >= 2) AND (thu <= 8)));

alter table public.lichhoc add constraint lichhoc_tiet_bat_dau_check CHECK ((tiet_bat_dau > 0));

alter table public.lophocphan add constraint lophocphan_ma_lop_check CHECK (((ma_lop)::text ~ '^[0-9]{2}(COMP|MATH|EDU|PHYS)(1[0-9]{3}|2[0-9]{3}|3000)[0-9]{2}$'::text));

alter table public.lophocphan add constraint lophocphan_pkey PRIMARY KEY (ma_lop);

alter table public.lophocphan add constraint lophocphan_suc_chua_check CHECK ((suc_chua > 0));

alter table public.lophocphan add constraint lophocphan_trang_thai_check CHECK (((trang_thai)::text = ANY ((ARRAY['Mo'::character varying, 'Dong'::character varying, 'BiHuy'::character varying])::text[])));

alter table public.nguoidung add constraint nguoidung_pkey PRIMARY KEY (ma_tk);

alter table public.nguoidung add constraint nguoidung_ten_dang_nhap_key UNIQUE (ten_dang_nhap);

alter table public.nguoidung add constraint nguoidung_trang_thai_check CHECK (((trang_thai)::text = ANY ((ARRAY['HoatDong'::character varying, 'BiKhoa'::character varying])::text[])));

alter table public.nguoidung add constraint nguoidung_vai_tro_check CHECK (((vai_tro)::text = ANY ((ARRAY['PDT'::character varying, 'SV'::character varying])::text[])));

alter table public.nhatkyimport add constraint nhatkyimport_pkey PRIMARY KEY (ma_import);

alter table public.nhatkythaotac add constraint nhatkythaotac_pkey PRIMARY KEY (ma_log);

alter table public.nhomsinhvien add constraint nhomsinhvien_pkey PRIMARY KEY (ma_nhom);

alter table public.sinhvien add constraint sinhvien_ma_sv_check CHECK (((ma_sv)::text ~ '^(4[89]|[5-9][0-9])\.01\.[0-9]{3}\.[0-9]{3}$'::text));

alter table public.sinhvien add constraint sinhvien_ma_tk_key UNIQUE (ma_tk);

alter table public.sinhvien add constraint sinhvien_pkey PRIMARY KEY (ma_sv);

alter table public.sinhvien add constraint sinhvien_trang_thai_check CHECK (((trang_thai)::text = ANY ((ARRAY['DangHoc'::character varying, 'BaoLuu'::character varying, 'DaTotNghiep'::character varying])::text[])));

alter table public.tienquyet add constraint tienquyet_check CHECK (((ma_hp)::text <> (ma_hp_tien_quyet)::text));

alter table public.tienquyet add constraint tienquyet_loai_rang_buoc_check CHECK (((loai_rang_buoc)::text = ANY ((ARRAY['TienQuyet'::character varying, 'HocTruoc'::character varying])::text[])));

alter table public.tienquyet add constraint tienquyet_pkey PRIMARY KEY (ma_hp, ma_hp_tien_quyet);

alter table public.ctdt_hocphan add constraint ctdt_hocphan_ma_ctdt_fkey FOREIGN KEY (ma_ctdt) REFERENCES chuongtrinhdaotao(ma_ctdt) ON DELETE CASCADE;

alter table public.ctdt_hocphan add constraint ctdt_hocphan_ma_hp_fkey FOREIGN KEY (ma_hp) REFERENCES hocphan(ma_hp);

alter table public.dangky add constraint dangky_ma_lop_fkey FOREIGN KEY (ma_lop) REFERENCES lophocphan(ma_lop);

alter table public.dangky add constraint dangky_ma_sv_fkey FOREIGN KEY (ma_sv) REFERENCES sinhvien(ma_sv);

alter table public.danhsachcho add constraint danhsachcho_ma_lop_fkey FOREIGN KEY (ma_lop) REFERENCES lophocphan(ma_lop);

alter table public.danhsachcho add constraint danhsachcho_ma_sv_fkey FOREIGN KEY (ma_sv) REFERENCES sinhvien(ma_sv);

alter table public.dotnhom add constraint dotnhom_ma_dot_fkey FOREIGN KEY (ma_dot) REFERENCES dotdangky(ma_dot) ON DELETE CASCADE;

alter table public.dotnhom add constraint dotnhom_ma_nhom_fkey FOREIGN KEY (ma_nhom) REFERENCES nhomsinhvien(ma_nhom);

alter table public.ghidanhhocphan add constraint ghidanhhocphan_ma_dot_fkey FOREIGN KEY (ma_dot) REFERENCES dotdangky(ma_dot);

alter table public.ghidanhhocphan add constraint ghidanhhocphan_ma_hp_fkey FOREIGN KEY (ma_hp) REFERENCES hocphan(ma_hp);

alter table public.ghidanhhocphan add constraint ghidanhhocphan_ma_sv_fkey FOREIGN KEY (ma_sv) REFERENCES sinhvien(ma_sv);

alter table public.ketquahoctap add constraint ketquahoctap_ma_hp_fkey FOREIGN KEY (ma_hp) REFERENCES hocphan(ma_hp);

alter table public.ketquahoctap add constraint ketquahoctap_ma_sv_fkey FOREIGN KEY (ma_sv) REFERENCES sinhvien(ma_sv);

alter table public.lichhoc add constraint lichhoc_ma_lop_fkey FOREIGN KEY (ma_lop) REFERENCES lophocphan(ma_lop) ON DELETE CASCADE;

alter table public.lophocphan add constraint lophocphan_ma_dot_fkey FOREIGN KEY (ma_dot) REFERENCES dotdangky(ma_dot);

alter table public.lophocphan add constraint lophocphan_ma_hp_fkey FOREIGN KEY (ma_hp) REFERENCES hocphan(ma_hp);

alter table public.nhatkyimport add constraint nhatkyimport_ma_tk_fkey FOREIGN KEY (ma_tk) REFERENCES nguoidung(ma_tk);

alter table public.nhatkythaotac add constraint nhatkythaotac_ma_lop_fkey FOREIGN KEY (ma_lop) REFERENCES lophocphan(ma_lop);

alter table public.nhatkythaotac add constraint nhatkythaotac_ma_sv_fkey FOREIGN KEY (ma_sv) REFERENCES sinhvien(ma_sv);

alter table public.nhatkythaotac add constraint nhatkythaotac_ma_tk_fkey FOREIGN KEY (ma_tk) REFERENCES nguoidung(ma_tk);

alter table public.nhomsinhvien add constraint nhomsinhvien_ma_khoa_fkey FOREIGN KEY (ma_khoa) REFERENCES khoa(ma_khoa);

alter table public.sinhvien add constraint sinhvien_ma_ctdt_fkey FOREIGN KEY (ma_ctdt) REFERENCES chuongtrinhdaotao(ma_ctdt);

alter table public.sinhvien add constraint sinhvien_ma_khoa_fkey FOREIGN KEY (ma_khoa) REFERENCES khoa(ma_khoa);

alter table public.sinhvien add constraint sinhvien_ma_nhom_fkey FOREIGN KEY (ma_nhom) REFERENCES nhomsinhvien(ma_nhom);

alter table public.sinhvien add constraint sinhvien_ma_tk_fkey FOREIGN KEY (ma_tk) REFERENCES nguoidung(ma_tk);

alter table public.tienquyet add constraint tienquyet_ma_hp_fkey FOREIGN KEY (ma_hp) REFERENCES hocphan(ma_hp);

alter table public.tienquyet add constraint tienquyet_ma_hp_tien_quyet_fkey FOREIGN KEY (ma_hp_tien_quyet) REFERENCES hocphan(ma_hp);

CREATE UNIQUE INDEX dangky_hieu_luc_mot_lan ON public.dangky USING btree (ma_sv, ma_lop) WHERE ((trang_thai)::text = 'HieuLuc'::text);

CREATE INDEX dangky_ma_lop_idx ON public.dangky USING btree (ma_lop, trang_thai);

CREATE INDEX dangky_ma_sv_idx ON public.dangky USING btree (ma_sv, trang_thai);

CREATE INDEX danhsachcho_ma_lop_idx ON public.danhsachcho USING btree (ma_lop, thu_tu);

CREATE INDEX lichhoc_ma_lop_idx ON public.lichhoc USING btree (ma_lop);

CREATE INDEX lophocphan_ma_dot_idx ON public.lophocphan USING btree (ma_dot, trang_thai);

CREATE INDEX nhatkythaotac_ma_sv_idx ON public.nhatkythaotac USING btree (ma_sv, thoi_gian DESC);

CREATE INDEX nhatkythaotac_ma_tk_idx ON public.nhatkythaotac USING btree (ma_tk, thoi_gian DESC);
