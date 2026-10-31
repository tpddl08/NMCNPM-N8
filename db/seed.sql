truncate table
  public.nhatkythaotac,
  public.nhatkyimport,
  public.ketquahoctap,
  public.ghidanhhocphan,
  public.danhsachcho,
  public.dangky,
  public.lichhoc,
  public.lophocphan,
  public.dotnhom,
  public.dotdangky,
  public.tienquyet,
  public.ctdt_hocphan,
  public.hocphan,
  public.sinhvien,
  public.chuongtrinhdaotao,
  public.nhomsinhvien,
  public.khoa,
  public.nguoidung
restart identity cascade;

insert into public.khoa (ma_khoa, ten_khoa) values
  ('K.CNTT', 'Khoa Công nghệ thông tin'),
  ('K.KT', 'Khoa Kinh tế');

insert into public.nhomsinhvien (ma_nhom, ten_nhom, co_ghi_danh, ma_khoa) values
  ('N01', 'Nhóm 01 - Công nghệ phần mềm', true, 'K.CNTT'),
  ('N02', 'Nhóm 02 - Hệ thống thông tin', true, 'K.CNTT'),
  ('N03', 'Nhóm 03 - Khoa học dữ liệu', false, 'K.CNTT'),
  ('N04', 'Nhóm 04 - Kinh tế số', true, 'K.KT');

insert into public.chuongtrinhdaotao (ma_ctdt, ten_ctdt, nien_khoa) values
  ('CT01', 'Công nghệ thông tin', '2024-2028'),
  ('CT02', 'Kinh tế số', '2024-2028');

insert into public.hocphan (ma_hp, ten_hp, so_tin_chi) values
  ('COMP1001', 'Nhập môn lập trình', 3),
  ('COMP1002', 'Cấu trúc dữ liệu và giải thuật', 3),
  ('COMP1003', 'Cơ sở dữ liệu', 3),
  ('COMP1004', 'Lập trình web', 3),
  ('COMP1005', 'Kỹ thuật phần mềm', 3),
  ('COMP2001', 'Trí tuệ nhân tạo', 3),
  ('COMP2002', 'Mạng máy tính', 3),
  ('COMP2003', 'An toàn thông tin', 3),
  ('MATH1001', 'Giải tích', 4),
  ('MATH1002', 'Đại số tuyến tính', 3),
  ('EDU1001', 'Tâm lý học giáo dục', 2),
  ('PHYS1001', 'Vật lý đại cương', 3);

insert into public.tienquyet (ma_hp, ma_hp_tien_quyet, loai_rang_buoc) values
  ('COMP1002', 'COMP1001', 'TienQuyet'),
  ('COMP1003', 'COMP1002', 'HocTruoc'),
  ('COMP1004', 'COMP1001', 'TienQuyet'),
  ('COMP1004', 'COMP1003', 'HocTruoc'),
  ('COMP1005', 'COMP1002', 'TienQuyet'),
  ('COMP2001', 'COMP1002', 'TienQuyet'),
  ('COMP2002', 'COMP1001', 'TienQuyet'),
  ('COMP2003', 'COMP2002', 'HocTruoc');

insert into public.ctdt_hocphan (ma_ctdt, ma_hp, hoc_ky_du_kien) values
  ('CT01', 'COMP1001', 1),
  ('CT01', 'MATH1001', 1),
  ('CT01', 'COMP1002', 2),
  ('CT01', 'MATH1002', 2),
  ('CT01', 'COMP1003', 3),
  ('CT01', 'COMP2002', 3),
  ('CT01', 'COMP1004', 4),
  ('CT01', 'COMP1005', 4),
  ('CT01', 'COMP2001', 5),
  ('CT01', 'COMP2003', 5),
  ('CT02', 'COMP1001', 1),
  ('CT02', 'EDU1001', 1),
  ('CT02', 'PHYS1001', 2),
  ('CT02', 'MATH1002', 2);

insert into public.dotdangky (ma_dot, ten_dot, hoc_ky, nam_hoc, thoi_diem_mo, thoi_diem_dong, nguong_huy_lop) values
  ('DOT01', 'Đợt đăng ký học kỳ 1', 'HK1', '2026-2027', now() - interval '1 day', now() + interval '7 days', 15),
  ('DOT00', 'Đợt đăng ký học kỳ hè', 'HK3', '2025-2026', now() - interval '30 days', now() - interval '1 day', 15),
  ('DOT02', 'Đợt đăng ký học kỳ 2', 'HK2', '2026-2027', now() + interval '10 days', now() + interval '20 days', 15);

insert into public.dotnhom (ma_dot, ma_nhom) values
  ('DOT01', 'N01'), ('DOT01', 'N02'), ('DOT01', 'N03'),
  ('DOT00', 'N01'), ('DOT00', 'N02'), ('DOT00', 'N03'),
  ('DOT02', 'N01');

insert into public.nguoidung (ten_dang_nhap, mat_khau_bam, vai_tro, trang_thai)
values ('pdt.n8', crypt('Pdt@12345', gen_salt('bf')), 'PDT', 'HoatDong');

do $$
declare
  r record;
  v_ma_tk integer;
begin
  for r in
    select * from (values
      ('48.01.001.001', 'Nguyễn An Bình', date '2006-01-12', 'N01', 'K.CNTT', 'CT01'),
      ('48.01.001.002', 'Trần Bảo Châu', date '2006-02-08', 'N01', 'K.CNTT', 'CT01'),
      ('48.01.001.003', 'Lê Minh Đức', date '2006-03-21', 'N01', 'K.CNTT', 'CT01'),
      ('48.01.001.004', 'Phạm Gia Hân', date '2006-04-05', 'N02', 'K.CNTT', 'CT01'),
      ('48.01.001.005', 'Hoàng Khánh Linh', date '2006-05-17', 'N03', 'K.CNTT', 'CT01'),
      ('48.01.001.006', 'Vũ Minh Khang', date '2006-06-23', 'N01', 'K.CNTT', 'CT01'),
      ('48.01.001.007', 'Đặng Ngọc Mai', date '2006-07-09', 'N01', 'K.CNTT', 'CT01'),
      ('48.01.001.008', 'Bùi Quốc Nam', date '2006-08-30', 'N02', 'K.CNTT', 'CT01'),
      ('48.01.001.009', 'Đỗ Thu Trang', date '2006-09-14', 'N01', 'K.CNTT', 'CT01'),
      ('48.01.001.010', 'Ngô Văn Tú', date '2006-10-02', 'N04', 'K.KT', 'CT02'),
      ('48.01.001.011', 'Đinh Bảo An', date '2006-01-19', 'N02', 'K.CNTT', 'CT01'),
      ('48.01.001.012', 'Lý Hoàng Ân', date '2006-02-26', 'N02', 'K.CNTT', 'CT01'),
      ('48.01.001.013', 'Mai Thị Bích', date '2006-03-03', 'N02', 'K.CNTT', 'CT01'),
      ('48.01.001.014', 'Tạ Quang Cường', date '2006-04-11', 'N02', 'K.CNTT', 'CT01'),
      ('48.01.001.015', 'Phan Diệu Hương', date '2006-05-25', 'N02', 'K.CNTT', 'CT01'),
      ('48.01.001.016', 'Cao Minh Khoa', date '2006-06-06', 'N02', 'K.CNTT', 'CT01'),
      ('48.01.001.017', 'Dương Thanh Lam', date '2006-07-18', 'N02', 'K.CNTT', 'CT01'),
      ('48.01.001.018', 'Hồ Nhật Minh', date '2006-08-04', 'N02', 'K.CNTT', 'CT01'),
      ('48.01.001.019', 'Lâm Yến Nhi', date '2006-09-27', 'N02', 'K.CNTT', 'CT01'),
      ('48.01.001.020', 'Trịnh Hải Phong', date '2006-10-13', 'N02', 'K.CNTT', 'CT01'),
      ('48.01.001.021', 'Võ Thùy Quyên', date '2006-11-01', 'N02', 'K.CNTT', 'CT01'),
      ('48.01.001.022', 'Đoàn Gia Sang', date '2006-11-22', 'N02', 'K.CNTT', 'CT01'),
      ('48.01.001.023', 'Nguyễn Thanh Tâm', date '2006-12-07', 'N02', 'K.CNTT', 'CT01'),
      ('48.01.001.024', 'Trương Anh Thư', date '2006-12-19', 'N02', 'K.CNTT', 'CT01'),
      ('48.01.001.025', 'Lưu Hoàng Vũ', date '2006-01-28', 'N02', 'K.CNTT', 'CT01'),
      ('48.01.001.026', 'Phùng Bảo Yến', date '2006-02-16', 'N02', 'K.CNTT', 'CT01')
    ) as s(ma_sv, ho_ten, ngay_sinh, ma_nhom, ma_khoa, ma_ctdt)
  loop
    insert into public.nguoidung (ten_dang_nhap, mat_khau_bam, vai_tro, trang_thai)
    values (r.ma_sv, crypt('Sv@12345', gen_salt('bf')), 'SV', 'HoatDong')
    returning ma_tk into v_ma_tk;

    insert into public.sinhvien (ma_sv, ho_ten, ngay_sinh, nien_khoa, trang_thai, ma_tk, ma_khoa, ma_nhom, ma_ctdt)
    values (r.ma_sv, r.ho_ten, r.ngay_sinh, '2024-2028', 'DangHoc', v_ma_tk, r.ma_khoa, r.ma_nhom, r.ma_ctdt);
  end loop;
end $$;

insert into public.lophocphan (ma_lop, suc_chua, trang_thai, ma_hp, ma_dot) values
  ('26COMP100101', 40, 'Mo', 'COMP1001', 'DOT01'),
  ('26COMP100102', 40, 'Mo', 'COMP1001', 'DOT01'),
  ('26COMP100201', 30, 'Mo', 'COMP1002', 'DOT01'),
  ('26COMP100202', 30, 'Mo', 'COMP1002', 'DOT01'),
  ('26COMP100301', 25, 'Mo', 'COMP1003', 'DOT01'),
  ('26COMP100401', 20, 'Mo', 'COMP1004', 'DOT01'),
  ('26COMP100501', 25, 'Mo', 'COMP1005', 'DOT01'),
  ('26COMP200101', 15, 'Mo', 'COMP2001', 'DOT01'),
  ('26MATH100101', 50, 'Mo', 'MATH1001', 'DOT01'),
  ('26MATH100201', 40, 'Mo', 'MATH1002', 'DOT01'),
  ('26COMP200201', 30, 'Mo', 'COMP2002', 'DOT01'),
  ('26COMP200301', 6, 'Mo', 'COMP2003', 'DOT01'),
  ('25COMP100101', 30, 'Mo', 'COMP1001', 'DOT00'),
  ('25MATH100101', 40, 'Mo', 'MATH1001', 'DOT00'),
  ('25COMP100201', 20, 'Mo', 'COMP1002', 'DOT00'),
  ('27COMP100101', 40, 'Mo', 'COMP1001', 'DOT02');

insert into public.lichhoc (thu, tiet_bat_dau, tiet_ket_thuc, phong_hoc, giang_vien, ma_lop) values
  (2, 2, 4, 'P.A101', 'TS. Nguyễn Văn An', '26COMP100101'),
  (3, 2, 4, 'P.A102', 'TS. Nguyễn Văn An', '26COMP100102'),
  (2, 2, 4, 'P.B201', 'TS. Trần Thị Bình', '26COMP100201'),
  (4, 5, 7, 'P.B202', 'TS. Trần Thị Bình', '26COMP100202'),
  (3, 5, 7, 'P.C301', 'TS. Lê Quang Cường', '26COMP100301'),
  (5, 2, 4, 'P.C302', 'TS. Lê Quang Cường', '26COMP100401'),
  (6, 5, 7, 'P.A103', 'TS. Phạm Thu Dung', '26COMP100501'),
  (7, 2, 4, 'P.D401', 'TS. Phạm Thu Dung', '26COMP200101'),
  (2, 5, 7, 'P.A104', 'TS. Hoàng Minh Đức', '26MATH100101'),
  (4, 2, 4, 'P.A105', 'TS. Hoàng Minh Đức', '26MATH100201'),
  (5, 5, 7, 'P.B203', 'TS. Vũ Thị Hoa', '26COMP200201'),
  (6, 2, 4, 'P.C303', 'TS. Vũ Thị Hoa', '26COMP200301'),
  (2, 2, 4, 'P.A101', 'TS. Nguyễn Văn An', '25COMP100101'),
  (3, 5, 7, 'P.A102', 'TS. Nguyễn Văn An', '25MATH100101'),
  (4, 2, 4, 'P.B201', 'TS. Trần Thị Bình', '25COMP100201'),
  (2, 2, 4, 'P.A101', 'TS. Nguyễn Văn An', '27COMP100101');

insert into public.ketquahoctap (hoc_ky, diem, ma_sv, ma_hp) values
  ('HK1 2024-2025', 8.0, '48.01.001.001', 'COMP1001'),
  ('HK1 2024-2025', 7.0, '48.01.001.002', 'COMP1001'),
  ('HK2 2024-2025', 7.5, '48.01.001.002', 'COMP1002'),
  ('HK1 2024-2025', 3.5, '48.01.001.003', 'COMP1001'),
  ('HK1 2024-2025', 8.0, '48.01.001.004', 'COMP1001'),
  ('HK2 2024-2025', 8.0, '48.01.001.004', 'COMP1002'),
  ('HK1 2024-2025', 9.0, '48.01.001.005', 'COMP1001'),
  ('HK2 2024-2025', 9.0, '48.01.001.005', 'COMP1002'),
  ('HK1 2024-2025', 8.0, '48.01.001.006', 'COMP1001'),
  ('HK1 2024-2025', 8.0, '48.01.001.007', 'COMP1001'),
  ('HK2 2024-2025', 8.0, '48.01.001.007', 'COMP1002'),
  ('HK1 2024-2025', 8.0, '48.01.001.008', 'COMP2002'),
  ('HK1 2024-2025', 8.0, '48.01.001.009', 'COMP1001'),
  ('HK2 2024-2025', 8.0, '48.01.001.009', 'COMP1002'),
  ('HK2 2024-2025', 8.0, '48.01.001.009', 'COMP1003');

insert into public.ghidanhhocphan (ma_sv, ma_hp, ma_dot) values
  ('48.01.001.001', 'COMP1001', 'DOT01'),
  ('48.01.001.001', 'COMP1002', 'DOT01'),
  ('48.01.001.002', 'COMP1001', 'DOT01'),
  ('48.01.001.003', 'COMP1002', 'DOT01'),
  ('48.01.001.004', 'COMP2001', 'DOT01'),
  ('48.01.001.006', 'COMP1002', 'DOT01'),
  ('48.01.001.006', 'COMP1003', 'DOT01'),
  ('48.01.001.007', 'COMP2001', 'DOT01'),
  ('48.01.001.008', 'COMP2003', 'DOT01'),
  ('48.01.001.009', 'COMP1003', 'DOT01'),
  ('48.01.001.009', 'COMP1004', 'DOT01');

insert into public.dangky (trang_thai, ma_sv, ma_lop) values
  ('HieuLuc', '48.01.001.001', '26COMP100101'),
  ('HieuLuc', '48.01.001.002', '26COMP100102'),
  ('HieuLuc', '48.01.001.003', '26MATH100101');

insert into public.dangky (trang_thai, ma_sv, ma_lop)
select 'HieuLuc', s.ma_sv, '26COMP200101'
from public.sinhvien s
where s.ma_sv between '48.01.001.011' and '48.01.001.025';

insert into public.dangky (trang_thai, ma_sv, ma_lop)
select 'HieuLuc', s.ma_sv, '26COMP200301'
from public.sinhvien s
where s.ma_sv between '48.01.001.011' and '48.01.001.015';

insert into public.dangky (trang_thai, ma_sv, ma_lop)
select 'HieuLuc', s.ma_sv, '25COMP100101'
from public.sinhvien s
where s.ma_sv in ('48.01.001.001', '48.01.001.002', '48.01.001.003');

insert into public.dangky (trang_thai, ma_sv, ma_lop)
select 'HieuLuc', s.ma_sv, '25MATH100101'
from public.sinhvien s
where s.ma_sv between '48.01.001.011' and '48.01.001.025';

insert into public.danhsachcho (thu_tu, ma_sv, ma_lop) values
  (1, '48.01.001.004', '26COMP200101'),
  (2, '48.01.001.006', '26COMP200101');

insert into public.nhatkythaotac (loai_thao_tac, ket_qua, ly_do, ma_tk, ma_sv, ma_lop)
select 'KhoiTaoDuLieu', 'ThanhCong', 'Nạp dữ liệu ban đầu', ma_tk, null, null
from public.nguoidung where ten_dang_nhap = 'pdt.n8';
