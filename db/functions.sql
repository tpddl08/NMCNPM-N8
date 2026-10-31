create or replace function public._kiem_tra_pdt(p_vai_tro text)
returns void
language plpgsql
immutable
as $$
begin
  if p_vai_tro <> 'PDT' then
    raise exception 'Bạn không có quyền thực hiện thao tác này';
  end if;
end;
$$;

create or replace function public._ma_sv_cua(p_ma_tk integer)
returns varchar
language sql
stable
security definer
set search_path = public
as $$
  select ma_sv from public.sinhvien where ma_tk = p_ma_tk;
$$;

create or replace function public._dang_ky(
  p_ma_tk integer,
  p_vai_tro text,
  p_ma_sv varchar,
  p_ma_lop varchar,
  p_bo_qua_dot boolean,
  p_ly_do text
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_lop public.lophocphan%rowtype;
  v_dot public.dotdangky%rowtype;
  v_sv public.sinhvien%rowtype;
  v_nhom public.nhomsinhvien%rowtype;
  v_si_so integer;
  v_thieu text;
  v_trung varchar;
  v_loi text;
  v_ma_dang_ky integer;
begin
  select * into v_sv from public.sinhvien where ma_sv = p_ma_sv;
  if not found then
    return jsonb_build_object('ok', false, 'message', 'Không tìm thấy sinh viên');
  end if;

  select * into v_lop from public.lophocphan where ma_lop = p_ma_lop;
  if not found then
    return jsonb_build_object('ok', false, 'message', 'Không tìm thấy lớp học phần');
  end if;
  select * into v_dot from public.dotdangky where ma_dot = v_lop.ma_dot;

  if not p_bo_qua_dot then
    if now() < v_dot.thoi_diem_mo then
      v_loi := 'Đợt đăng ký chưa mở';
    elsif now() >= v_dot.thoi_diem_dong then
      v_loi := 'Đợt đăng ký đã đóng';
    end if;
  end if;

  if v_loi is null then
    if not p_bo_qua_dot then
      if v_sv.ma_nhom is null or not exists (
        select 1 from public.dotnhom dn
        where dn.ma_dot = v_lop.ma_dot and dn.ma_nhom = v_sv.ma_nhom
      ) then
        v_loi := 'Bạn không thuộc nhóm được phép đăng ký đợt này';
      end if;
    end if;
  end if;

  if v_loi is null and v_lop.trang_thai <> 'Mo' then
    v_loi := 'Lớp học phần đã đóng hoặc đã bị hủy';
  end if;

  if v_loi is null then
    if exists (
      select 1 from public.ketquahoctap k
      where k.ma_sv = p_ma_sv and k.ma_hp = v_lop.ma_hp and k.diem >= 4
    ) then
      v_loi := 'Bạn đã đạt học phần này';
    elsif exists (
      select 1 from public.dangky k
      join public.lophocphan l on l.ma_lop = k.ma_lop
      where k.ma_sv = p_ma_sv and k.trang_thai = 'HieuLuc'
        and l.ma_dot = v_lop.ma_dot and l.ma_hp = v_lop.ma_hp
    ) then
      v_loi := 'Bạn đã đăng ký học phần này';
    end if;
  end if;

  if v_loi is null and v_sv.ma_nhom is not null then
    select * into v_nhom from public.nhomsinhvien where ma_nhom = v_sv.ma_nhom;
    if coalesce(v_nhom.co_ghi_danh, false) and not exists (
      select 1 from public.ghidanhhocphan g
      where g.ma_sv = p_ma_sv and g.ma_hp = v_lop.ma_hp and g.ma_dot = v_lop.ma_dot
    ) then
      v_loi := 'Bạn chưa ghi danh học phần này';
    end if;
  end if;

  if v_loi is null then
    select string_agg(t.ma_hp_tien_quyet, ', ' order by t.ma_hp_tien_quyet)
    into v_thieu
    from public.tienquyet t
    where t.ma_hp = v_lop.ma_hp
      and not exists (
        select 1 from public.ketquahoctap k
        where k.ma_sv = p_ma_sv
          and k.ma_hp = t.ma_hp_tien_quyet
          and (t.loai_rang_buoc = 'HocTruoc' or k.diem >= 4)
      );
    if v_thieu is not null then
      v_loi := 'Thiếu học phần: ' || v_thieu;
    end if;
  end if;

  if v_loi is null then
    select l2.ma_lop into v_trung
    from public.lichhoc l1
    join public.dangky k on k.ma_sv = p_ma_sv and k.trang_thai = 'HieuLuc'
    join public.lophocphan lp on lp.ma_lop = k.ma_lop and lp.ma_dot = v_lop.ma_dot
    join public.lichhoc l2 on l2.ma_lop = k.ma_lop and l2.thu = l1.thu
    where l1.ma_lop = p_ma_lop
      and l1.tiet_bat_dau <= l2.tiet_ket_thuc
      and l2.tiet_bat_dau <= l1.tiet_ket_thuc
    limit 1;
    if v_trung is not null then
      v_loi := 'Trùng lịch với lớp ' || v_trung;
    end if;
  end if;

  if v_loi is null then
    select * into v_lop from public.lophocphan where ma_lop = p_ma_lop for update;
    if v_lop.trang_thai <> 'Mo' then
      v_loi := 'Lớp học phần đã đóng hoặc đã bị hủy';
    else
      select count(*) into v_si_so from public.dangky
      where ma_lop = p_ma_lop and trang_thai = 'HieuLuc';
      if v_si_so >= v_lop.suc_chua then
        v_loi := 'Lớp đã đầy';
      end if;
    end if;
  end if;

  if v_loi is not null then
    perform public._ghi_nhat_ky(
      p_ma_tk, 'DangKy', 'TuChoi',
      case when p_ly_do is null or p_ly_do = '' then v_loi else p_ly_do || ': ' || v_loi end,
      p_ma_sv, p_ma_lop
    );
    return jsonb_build_object('ok', false, 'message', v_loi);
  end if;

  insert into public.dangky (trang_thai, ma_sv, ma_lop)
  values ('HieuLuc', p_ma_sv, p_ma_lop)
  returning ma_dang_ky into v_ma_dang_ky;

  perform public._ghi_nhat_ky(
    p_ma_tk, 'DangKy', 'ThanhCong', coalesce(p_ly_do, ''), p_ma_sv, p_ma_lop
  );

  return jsonb_build_object('ok', true, 'ma_dang_ky', v_ma_dang_ky, 'message', 'Đăng ký thành công');
end;
$$;

create or replace function public.dang_ky(p_token text, p_ma_lop text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_sv varchar;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  if v_xt.vai_tro <> 'SV' then
    raise exception 'Chỉ sinh viên mới sử dụng chức năng này';
  end if;
  v_ma_sv := public._ma_sv_cua(v_xt.ma_tk);
  if v_ma_sv is null then
    raise exception 'Tài khoản sinh viên không hợp lệ';
  end if;
  return public._dang_ky(v_xt.ma_tk, v_xt.vai_tro, v_ma_sv, p_ma_lop, false, '');
end;
$$;

create or replace function public.dang_ky_ho(p_token text, p_ma_sv text, p_ma_lop text, p_ly_do text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);
  if coalesce(trim(p_ly_do), '') = '' then
    raise exception 'Vui lòng nhập lý do đăng ký hộ';
  end if;
  return public._dang_ky(v_xt.ma_tk, v_xt.vai_tro, p_ma_sv, p_ma_lop, true, trim(p_ly_do));
end;
$$;

create or replace function public.huy_dang_ky(p_token text, p_ma_dang_ky integer, p_ly_do text default '')
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_k public.dangky%rowtype;
  v_lop public.lophocphan%rowtype;
  v_dot public.dotdangky%rowtype;
  v_ma_sv varchar;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  select * into v_k from public.dangky where ma_dang_ky = p_ma_dang_ky;
  if not found then
    raise exception 'Không tìm thấy đăng ký';
  end if;

  if v_xt.vai_tro = 'SV' then
    v_ma_sv := public._ma_sv_cua(v_xt.ma_tk);
    if v_k.ma_sv <> v_ma_sv then
      raise exception 'Bạn không có quyền hủy đăng ký của sinh viên khác';
    end if;
  else
    perform public._kiem_tra_pdt(v_xt.vai_tro);
  end if;

  if v_k.trang_thai <> 'HieuLuc' then
    raise exception 'Đăng ký không còn hiệu lực';
  end if;

  select * into v_lop from public.lophocphan where ma_lop = v_k.ma_lop;
  select * into v_dot from public.dotdangky where ma_dot = v_lop.ma_dot;
  if now() < v_dot.thoi_diem_mo or now() >= v_dot.thoi_diem_dong then
    raise exception 'Chỉ được hủy khi đợt đăng ký đang mở';
  end if;

  update public.dangky set trang_thai = 'DaHuy' where ma_dang_ky = p_ma_dang_ky;
  perform public._ghi_nhat_ky(v_xt.ma_tk, 'HuyDangKy', 'ThanhCong', coalesce(p_ly_do, ''), v_k.ma_sv, v_k.ma_lop);
  return jsonb_build_object('ok', true, 'message', 'Đã hủy đăng ký');
end;
$$;

create or replace function public.vao_danh_sach_cho(p_token text, p_ma_lop text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_sv varchar;
  v_lop public.lophocphan%rowtype;
  v_si_so integer;
  v_thu_tu integer;
  v_ma_ds integer;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  if v_xt.vai_tro <> 'SV' then
    raise exception 'Chỉ sinh viên mới sử dụng chức năng này';
  end if;
  v_ma_sv := public._ma_sv_cua(v_xt.ma_tk);
  if v_ma_sv is null then
    raise exception 'Tài khoản sinh viên không hợp lệ';
  end if;

  select * into v_lop from public.lophocphan where ma_lop = p_ma_lop;
  if not found then
    raise exception 'Không tìm thấy lớp học phần';
  end if;
  if v_lop.trang_thai <> 'Mo' then
    raise exception 'Lớp học phần đã đóng hoặc đã bị hủy';
  end if;
  if exists (
    select 1 from public.ketquahoctap k
    where k.ma_sv = v_ma_sv and k.ma_hp = v_lop.ma_hp and k.diem >= 4
  ) then
    raise exception 'Bạn đã đạt học phần này';
  end if;
  if exists (
    select 1 from public.dangky k
    where k.ma_lop = p_ma_lop and k.ma_sv = v_ma_sv and k.trang_thai = 'HieuLuc'
  ) then
    raise exception 'Bạn đã đăng ký lớp học phần này';
  end if;

  select count(*) into v_si_so from public.dangky where ma_lop = p_ma_lop and trang_thai = 'HieuLuc';
  if v_si_so < v_lop.suc_chua then
    raise exception 'Lớp còn chỗ, vui lòng đăng ký trực tiếp';
  end if;
  if exists (select 1 from public.danhsachcho where ma_sv = v_ma_sv and ma_lop = p_ma_lop) then
    raise exception 'Bạn đã có trong danh sách chờ của lớp này';
  end if;

  select coalesce(max(thu_tu), 0) + 1 into v_thu_tu from public.danhsachcho where ma_lop = p_ma_lop;
  insert into public.danhsachcho (thu_tu, ma_sv, ma_lop)
  values (v_thu_tu, v_ma_sv, p_ma_lop)
  returning ma_ds into v_ma_ds;

  perform public._ghi_nhat_ky(v_xt.ma_tk, 'VaoDanhSachCho', 'ThanhCong', 'Vị trí ' || v_thu_tu, v_ma_sv, p_ma_lop);
  return jsonb_build_object('ok', true, 'thu_tu', v_thu_tu, 'message', 'Đã vào danh sách chờ');
end;
$$;

create or replace function public.xac_nhan_cho(p_token text, p_ma_lop text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_sv varchar;
  v_dau varchar;
  v_kq jsonb;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  if v_xt.vai_tro <> 'SV' then
    raise exception 'Chỉ sinh viên mới sử dụng chức năng này';
  end if;
  v_ma_sv := public._ma_sv_cua(v_xt.ma_tk);

  select ma_sv into v_dau from public.danhsachcho
  where ma_lop = p_ma_lop order by thu_tu limit 1;
  if v_dau is null or v_dau <> v_ma_sv then
    raise exception 'Bạn chưa phải người đầu tiên trong danh sách chờ';
  end if;

  v_kq := public._dang_ky(v_xt.ma_tk, v_xt.vai_tro, v_ma_sv, p_ma_lop, false, 'Xác nhận từ danh sách chờ');
  if (v_kq ->> 'ok')::boolean then
    delete from public.danhsachcho where ma_sv = v_ma_sv and ma_lop = p_ma_lop;
  end if;
  return v_kq;
end;
$$;

create or replace function public.roi_danh_sach_cho(p_token text, p_ma_lop text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_sv varchar;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  if v_xt.vai_tro <> 'SV' then
    raise exception 'Chỉ sinh viên mới sử dụng chức năng này';
  end if;
  v_ma_sv := public._ma_sv_cua(v_xt.ma_tk);
  if v_ma_sv is null then
    raise exception 'Tài khoản sinh viên không hợp lệ';
  end if;
  delete from public.danhsachcho where ma_sv = v_ma_sv and ma_lop = p_ma_lop;
  perform public._ghi_nhat_ky(v_xt.ma_tk, 'RoiDanhSachCho', 'ThanhCong', '', v_ma_sv, p_ma_lop);
  return jsonb_build_object('ok', true, 'message', 'Đã rời danh sách chờ');
end;
$$;

create or replace function public.ghi_danh_hoc_phan(p_token text, p_ma_hp text, p_ma_dot text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_sv varchar;
  v_sv public.sinhvien%rowtype;
  v_dot public.dotdangky%rowtype;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  if v_xt.vai_tro <> 'SV' then
    raise exception 'Chỉ sinh viên mới sử dụng chức năng này';
  end if;
  v_ma_sv := public._ma_sv_cua(v_xt.ma_tk);
  select * into v_sv from public.sinhvien where ma_sv = v_ma_sv;
  select * into v_dot from public.dotdangky where ma_dot = p_ma_dot;
  if not found then
    raise exception 'Không tìm thấy đợt đăng ký';
  end if;
  if now() < v_dot.thoi_diem_mo or now() >= v_dot.thoi_diem_dong then
    raise exception 'Đợt đăng ký chưa mở hoặc đã đóng';
  end if;
  if not exists (select 1 from public.dotnhom where ma_dot = p_ma_dot and ma_nhom = v_sv.ma_nhom) then
    raise exception 'Bạn không thuộc nhóm được phép của đợt này';
  end if;
  if not exists (select 1 from public.ctdt_hocphan where ma_ctdt = v_sv.ma_ctdt and ma_hp = p_ma_hp) then
    raise exception 'Học phần không thuộc chương trình đào tạo của bạn';
  end if;

  insert into public.ghidanhhocphan (ma_sv, ma_hp, ma_dot)
  values (v_ma_sv, p_ma_hp, p_ma_dot)
  on conflict (ma_sv, ma_hp, ma_dot) do nothing;

  perform public._ghi_nhat_ky(v_xt.ma_tk, 'GhiDanh', 'ThanhCong', p_ma_hp, v_ma_sv, null);
  return jsonb_build_object('ok', true, 'message', 'Đã ghi danh học phần');
end;
$$;

create or replace function public.xu_ly_sau_dot(p_token text, p_ma_dot text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_dot public.dotdangky%rowtype;
  v_lop public.lophocphan%rowtype;
  v_si_so integer;
  v_so_lop integer := 0;
  v_so_dang_ky integer := 0;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);
  select * into v_dot from public.dotdangky where ma_dot = p_ma_dot;
  if not found then
    raise exception 'Không tìm thấy đợt đăng ký';
  end if;
  if now() < v_dot.thoi_diem_dong then
    raise exception 'Đợt đăng ký chưa kết thúc';
  end if;

  for v_lop in
    select * from public.lophocphan where ma_dot = p_ma_dot and trang_thai = 'Mo'
  loop
    select count(*) into v_si_so from public.dangky
    where ma_lop = v_lop.ma_lop and trang_thai = 'HieuLuc';
    if v_si_so < v_dot.nguong_huy_lop then
      update public.lophocphan set trang_thai = 'BiHuy' where ma_lop = v_lop.ma_lop;
      update public.dangky set trang_thai = 'LopBiHuy'
      where ma_lop = v_lop.ma_lop and trang_thai = 'HieuLuc';
      get diagnostics v_si_so = row_count;
      delete from public.danhsachcho where ma_lop = v_lop.ma_lop;
      v_so_dang_ky := v_so_dang_ky + v_si_so;
      perform public._ghi_nhat_ky(
        v_xt.ma_tk, 'XuLySauDot', 'ThanhCong',
        v_lop.ma_lop || ': sĩ số ' || v_si_so || ' dưới ngưỡng ' || v_dot.nguong_huy_lop,
        null, v_lop.ma_lop
      );
      v_so_lop := v_so_lop + 1;
    end if;
  end loop;

  return jsonb_build_object('so_lop_huy', v_so_lop, 'so_dang_ky_huy', v_so_dang_ky);
end;
$$;

create or replace function public.dot_cua_sinh_vien(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_sv public.sinhvien%rowtype;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  select * into v_sv from public.sinhvien where ma_tk = v_xt.ma_tk;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_dot', d.ma_dot,
      'ten_dot', d.ten_dot,
      'hoc_ky', d.hoc_ky,
      'nam_hoc', d.nam_hoc,
      'thoi_diem_mo', d.thoi_diem_mo,
      'thoi_diem_dong', d.thoi_diem_dong,
      'nguong_huy_lop', d.nguong_huy_lop
    ) order by d.thoi_diem_dong)
    from public.dotdangky d
    join public.dotnhom dn on dn.ma_dot = d.ma_dot and dn.ma_nhom = v_sv.ma_nhom
    where now() >= d.thoi_diem_mo and now() < d.thoi_diem_dong
  ), '[]'::jsonb);
end;
$$;

create or replace function public._lich_cua_lop(p_ma_lop varchar)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'ma_buoi', l.ma_buoi,
    'thu', l.thu,
    'tiet_bat_dau', l.tiet_bat_dau,
    'tiet_ket_thuc', l.tiet_ket_thuc,
    'phong_hoc', l.phong_hoc,
    'giang_vien', l.giang_vien
  ) order by l.thu, l.tiet_bat_dau), '[]'::jsonb)
  from public.lichhoc l
  where l.ma_lop = p_ma_lop;
$$;

create or replace function public.lay_ho_so(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  return (
    select jsonb_build_object(
      'ma_tk', n.ma_tk,
      'ten_dang_nhap', n.ten_dang_nhap,
      'vai_tro', n.vai_tro,
      'trang_thai', n.trang_thai,
      'ho_ten', coalesce(s.ho_ten, 'Phòng đào tạo'),
      'ma_sv', coalesce(s.ma_sv, ''),
      'ngay_sinh', s.ngay_sinh,
      'nien_khoa', s.nien_khoa,
      'ma_khoa', s.ma_khoa,
      'ten_khoa', k.ten_khoa,
      'ma_nhom', s.ma_nhom,
      'ten_nhom', nh.ten_nhom,
      'ma_ctdt', s.ma_ctdt,
      'ten_ctdt', c.ten_ctdt
    )
    from public.nguoidung n
    left join public.sinhvien s on s.ma_tk = n.ma_tk
    left join public.khoa k on k.ma_khoa = s.ma_khoa
    left join public.nhomsinhvien nh on nh.ma_nhom = s.ma_nhom
    left join public.chuongtrinhdaotao c on c.ma_ctdt = s.ma_ctdt
    where n.ma_tk = v_xt.ma_tk
  );
end;
$$;

create or replace function public.thong_ke(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);
  return jsonb_build_object(
    'sinh_vien', (select count(*) from public.sinhvien),
    'hoc_phan', (select count(*) from public.hocphan),
    'lop', (select count(*) from public.lophocphan),
    'dang_ky', (select count(*) from public.dangky where trang_thai = 'HieuLuc'),
    'dot_mo', (select count(*) from public.dotdangky where now() >= thoi_diem_mo and now() < thoi_diem_dong),
    'cho', (select count(*) from public.danhsachcho)
  );
end;
$$;

create or replace function public.danh_sach_sinh_vien(p_token text, p_tu_khoa text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_sv', s.ma_sv,
      'ho_ten', s.ho_ten,
      'ngay_sinh', s.ngay_sinh,
      'nien_khoa', s.nien_khoa,
      'trang_thai', s.trang_thai,
      'ma_tk', s.ma_tk,
      'ten_dang_nhap', n.ten_dang_nhap,
      'ma_khoa', s.ma_khoa,
      'ten_khoa', k.ten_khoa,
      'ma_nhom', s.ma_nhom,
      'ten_nhom', nh.ten_nhom,
      'ma_ctdt', s.ma_ctdt,
      'ten_ctdt', c.ten_ctdt
    ) order by s.ma_sv)
    from public.sinhvien s
    join public.nguoidung n on n.ma_tk = s.ma_tk
    join public.khoa k on k.ma_khoa = s.ma_khoa
    left join public.nhomsinhvien nh on nh.ma_nhom = s.ma_nhom
    join public.chuongtrinhdaotao c on c.ma_ctdt = s.ma_ctdt
    where coalesce(trim(p_tu_khoa), '') = ''
      or s.ma_sv ilike '%' || trim(p_tu_khoa) || '%'
      or s.ho_ten ilike '%' || trim(p_tu_khoa) || '%'
  ), '[]'::jsonb);
end;
$$;

create or replace function public.danh_sach_khoa(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  return coalesce((
    select jsonb_agg(jsonb_build_object('ma_khoa', k.ma_khoa, 'ten_khoa', k.ten_khoa) order by k.ma_khoa)
    from public.khoa k
  ), '[]'::jsonb);
end;
$$;

create or replace function public.danh_sach_nhom(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_nhom', n.ma_nhom,
      'ten_nhom', n.ten_nhom,
      'co_ghi_danh', n.co_ghi_danh,
      'ma_khoa', n.ma_khoa,
      'ten_khoa', k.ten_khoa
    ) order by n.ma_nhom)
    from public.nhomsinhvien n
    join public.khoa k on k.ma_khoa = n.ma_khoa
  ), '[]'::jsonb);
end;
$$;

create or replace function public.danh_sach_ctdt(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_ctdt', c.ma_ctdt,
      'ten_ctdt', c.ten_ctdt,
      'nien_khoa', c.nien_khoa,
      'hoc_phan', coalesce((
        select jsonb_agg(jsonb_build_object(
          'ma_ctdt', ct.ma_ctdt,
          'ma_hp', ct.ma_hp,
          'hoc_ky_du_kien', ct.hoc_ky_du_kien,
          'ten_hp', hp.ten_hp,
          'so_tin_chi', hp.so_tin_chi
        ) order by ct.hoc_ky_du_kien, ct.ma_hp)
        from public.ctdt_hocphan ct
        join public.hocphan hp on hp.ma_hp = ct.ma_hp
        where ct.ma_ctdt = c.ma_ctdt
      ), '[]'::jsonb)
    ) order by c.ma_ctdt)
    from public.chuongtrinhdaotao c
  ), '[]'::jsonb);
end;
$$;

create or replace function public.danh_sach_hoc_phan(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_hp', h.ma_hp,
      'ten_hp', h.ten_hp,
      'so_tin_chi', h.so_tin_chi,
      'tien_quyet', coalesce((
        select jsonb_agg(jsonb_build_object(
          'ma_hp', t.ma_hp,
          'ma_hp_tien_quyet', t.ma_hp_tien_quyet,
          'loai_rang_buoc', t.loai_rang_buoc
        ) order by t.ma_hp_tien_quyet)
        from public.tienquyet t
        where t.ma_hp = h.ma_hp
      ), '[]'::jsonb)
    ) order by h.ma_hp)
    from public.hocphan h
  ), '[]'::jsonb);
end;
$$;

create or replace function public.danh_sach_dot(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_dot', d.ma_dot,
      'ten_dot', d.ten_dot,
      'hoc_ky', d.hoc_ky,
      'nam_hoc', d.nam_hoc,
      'thoi_diem_mo', d.thoi_diem_mo,
      'thoi_diem_dong', d.thoi_diem_dong,
      'nguong_huy_lop', d.nguong_huy_lop,
      'dang_mo', case when now() >= d.thoi_diem_mo and now() < d.thoi_diem_dong then 1 else 0 end,
      'nhom', coalesce((
        select jsonb_agg(jsonb_build_object('ma_dot', dn.ma_dot, 'ma_nhom', dn.ma_nhom, 'ten_nhom', nh.ten_nhom) order by dn.ma_nhom)
        from public.dotnhom dn
        join public.nhomsinhvien nh on nh.ma_nhom = dn.ma_nhom
        where dn.ma_dot = d.ma_dot
      ), '[]'::jsonb)
    ) order by d.thoi_diem_mo desc)
    from public.dotdangky d
  ), '[]'::jsonb);
end;
$$;

create or replace function public.danh_sach_tai_khoan(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_tk', n.ma_tk,
      'ten_dang_nhap', n.ten_dang_nhap,
      'vai_tro', n.vai_tro,
      'trang_thai', n.trang_thai,
      'ho_ten', s.ho_ten,
      'ma_sv', s.ma_sv
    ) order by n.ten_dang_nhap)
    from public.nguoidung n
    left join public.sinhvien s on s.ma_tk = n.ma_tk
  ), '[]'::jsonb);
end;
$$;

create or replace function public.danh_sach_ket_qua(p_token text, p_ma_sv text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_sv varchar;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  if v_xt.vai_tro = 'SV' then
    select ma_sv into v_ma_sv from public.sinhvien where ma_tk = v_xt.ma_tk;
  else
    v_ma_sv := nullif(trim(p_ma_sv), '');
  end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_kq', k.ma_kq,
      'hoc_ky', k.hoc_ky,
      'diem', k.diem,
      'ma_sv', k.ma_sv,
      'ho_ten', s.ho_ten,
      'ma_hp', k.ma_hp,
      'ten_hp', h.ten_hp
    ) order by s.ma_sv, k.hoc_ky, k.ma_hp)
    from public.ketquahoctap k
    join public.sinhvien s on s.ma_sv = k.ma_sv
    join public.hocphan h on h.ma_hp = k.ma_hp
    where v_ma_sv is null or k.ma_sv = v_ma_sv
  ), '[]'::jsonb);
end;
$$;

create or replace function public.lop_dang_mo(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_sv public.sinhvien%rowtype;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  select * into v_sv from public.sinhvien where ma_tk = v_xt.ma_tk;
  if not found then
    raise exception 'Chỉ sinh viên được xem lớp đang mở';
  end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_lop', lp.ma_lop,
      'ma_hp', lp.ma_hp,
      'ten_hp', h.ten_hp,
      'so_tin_chi', h.so_tin_chi,
      'ma_dot', lp.ma_dot,
      'ten_dot', d.ten_dot,
      'suc_chua', lp.suc_chua,
      'si_so', (select count(*) from public.dangky k where k.ma_lop = lp.ma_lop and k.trang_thai = 'HieuLuc'),
      'trang_thai', lp.trang_thai,
      'thoi_diem_mo', d.thoi_diem_mo,
      'thoi_diem_dong', d.thoi_diem_dong,
      'nguong_huy_lop', d.nguong_huy_lop,
      'lich', public._lich_cua_lop(lp.ma_lop),
      'thuoc_nhom', case when v_sv.ma_nhom is not null and exists (
        select 1 from public.dotnhom dn where dn.ma_dot = lp.ma_dot and dn.ma_nhom = v_sv.ma_nhom
      ) then 1 else 0 end,
      'da_dang_ky', case when exists (
        select 1 from public.dangky k where k.ma_lop = lp.ma_lop and k.ma_sv = v_sv.ma_sv and k.trang_thai = 'HieuLuc'
      ) then 1 else 0 end
    ) order by lp.ma_lop)
    from public.lophocphan lp
    join public.hocphan h on h.ma_hp = lp.ma_hp
    join public.dotdangky d on d.ma_dot = lp.ma_dot
    where lp.trang_thai = 'Mo'
      and now() >= d.thoi_diem_mo
      and now() < d.thoi_diem_dong
  ), '[]'::jsonb);
end;
$$;

create or replace function public.chi_tiet_lop(p_token text, p_ma_lop text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  return (
    select jsonb_build_object(
      'ma_lop', lp.ma_lop,
      'ma_hp', lp.ma_hp,
      'ten_hp', h.ten_hp,
      'so_tin_chi', h.so_tin_chi,
      'ma_dot', lp.ma_dot,
      'ten_dot', d.ten_dot,
      'suc_chua', lp.suc_chua,
      'si_so', (select count(*) from public.dangky k where k.ma_lop = lp.ma_lop and k.trang_thai = 'HieuLuc'),
      'trang_thai', lp.trang_thai,
      'thoi_diem_mo', d.thoi_diem_mo,
      'thoi_diem_dong', d.thoi_diem_dong,
      'nguong_huy_lop', d.nguong_huy_lop,
      'lich', public._lich_cua_lop(lp.ma_lop)
    )
    from public.lophocphan lp
    join public.hocphan h on h.ma_hp = lp.ma_hp
    join public.dotdangky d on d.ma_dot = lp.ma_dot
    where lp.ma_lop = p_ma_lop
  );
end;
$$;

create or replace function public.danh_sach_lop(p_token text, p_ma_dot text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_lop', lp.ma_lop,
      'ma_hp', lp.ma_hp,
      'ten_hp', h.ten_hp,
      'so_tin_chi', h.so_tin_chi,
      'ma_dot', lp.ma_dot,
      'ten_dot', d.ten_dot,
      'suc_chua', lp.suc_chua,
      'si_so', (select count(*) from public.dangky k where k.ma_lop = lp.ma_lop and k.trang_thai = 'HieuLuc'),
      'trang_thai', lp.trang_thai,
      'thoi_diem_mo', d.thoi_diem_mo,
      'thoi_diem_dong', d.thoi_diem_dong,
      'nguong_huy_lop', d.nguong_huy_lop,
      'lich', public._lich_cua_lop(lp.ma_lop)
    ) order by lp.ma_lop)
    from public.lophocphan lp
    join public.hocphan h on h.ma_hp = lp.ma_hp
    join public.dotdangky d on d.ma_dot = lp.ma_dot
    where p_ma_dot is null or p_ma_dot = '' or lp.ma_dot = p_ma_dot
  ), '[]'::jsonb);
end;
$$;

create or replace function public.danh_sach_ghi_danh(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_sv varchar;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  if v_xt.vai_tro = 'SV' then
    select ma_sv into v_ma_sv from public.sinhvien where ma_tk = v_xt.ma_tk;
  end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_sv', g.ma_sv,
      'ma_hp', g.ma_hp,
      'ma_dot', g.ma_dot,
      'thoi_diem', g.thoi_diem,
      'ten_hp', h.ten_hp,
      'so_tin_chi', h.so_tin_chi,
      'ten_dot', d.ten_dot,
      'bat_buoc', case when nh.co_ghi_danh then 1 else 0 end
    ) order by g.ma_dot, g.ma_hp)
    from public.ghidanhhocphan g
    join public.hocphan h on h.ma_hp = g.ma_hp
    join public.dotdangky d on d.ma_dot = g.ma_dot
    join public.sinhvien s on s.ma_sv = g.ma_sv
    left join public.nhomsinhvien nh on nh.ma_nhom = s.ma_nhom
    where v_ma_sv is null or g.ma_sv = v_ma_sv
  ), '[]'::jsonb);
end;
$$;

create or replace function public.hoc_phan_da_dang_ky(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_sv varchar;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  select ma_sv into v_ma_sv from public.sinhvien where ma_tk = v_xt.ma_tk;
  if v_ma_sv is null then
    return '[]'::jsonb;
  end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_dang_ky', k.ma_dang_ky,
      'thoi_diem_dang_ky', k.thoi_diem_dang_ky,
      'trang_thai', k.trang_thai,
      'ma_sv', k.ma_sv,
      'ma_lop', k.ma_lop,
      'ma_hp', lp.ma_hp,
      'ten_hp', h.ten_hp,
      'so_tin_chi', h.so_tin_chi,
      'ten_dot', d.ten_dot,
      'lich', public._lich_cua_lop(k.ma_lop)
    ) order by k.thoi_diem_dang_ky desc)
    from public.dangky k
    join public.lophocphan lp on lp.ma_lop = k.ma_lop
    join public.hocphan h on h.ma_hp = lp.ma_hp
    join public.dotdangky d on d.ma_dot = lp.ma_dot
    where k.ma_sv = v_ma_sv
  ), '[]'::jsonb);
end;
$$;

create or replace function public.thoi_khoa_bieu(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_sv varchar;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  select ma_sv into v_ma_sv from public.sinhvien where ma_tk = v_xt.ma_tk;
  if v_ma_sv is null then
    return '[]'::jsonb;
  end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_buoi', l.ma_buoi,
      'thu', l.thu,
      'tiet_bat_dau', l.tiet_bat_dau,
      'tiet_ket_thuc', l.tiet_ket_thuc,
      'phong_hoc', l.phong_hoc,
      'giang_vien', l.giang_vien,
      'ma_lop', l.ma_lop,
      'ma_hp', lp.ma_hp,
      'ten_hp', h.ten_hp
    ) order by l.thu, l.tiet_bat_dau)
    from public.dangky k
    join public.lophocphan lp on lp.ma_lop = k.ma_lop
    join public.hocphan h on h.ma_hp = lp.ma_hp
    join public.lichhoc l on l.ma_lop = lp.ma_lop
    where k.ma_sv = v_ma_sv and k.trang_thai = 'HieuLuc'
  ), '[]'::jsonb);
end;
$$;

create or replace function public.lich_su_thao_tac(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_sv varchar;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  select ma_sv into v_ma_sv from public.sinhvien where ma_tk = v_xt.ma_tk;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_log', l.ma_log,
      'thoi_gian', l.thoi_gian,
      'loai_thao_tac', l.loai_thao_tac,
      'ket_qua', l.ket_qua,
      'ly_do', l.ly_do,
      'ma_tk', l.ma_tk,
      'ma_sv', l.ma_sv,
      'ma_lop', l.ma_lop,
      'ten_dang_nhap', n.ten_dang_nhap
    ) order by l.thoi_gian desc, l.ma_log desc)
    from public.nhatkythaotac l
    join public.nguoidung n on n.ma_tk = l.ma_tk
    where v_xt.vai_tro = 'PDT' or l.ma_tk = v_xt.ma_tk or (v_ma_sv is not null and l.ma_sv = v_ma_sv)
    limit 500
  ), '[]'::jsonb);
end;
$$;

create or replace function public.danh_sach_cho(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_sv varchar;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  select ma_sv into v_ma_sv from public.sinhvien where ma_tk = v_xt.ma_tk;
  if v_ma_sv is null then
    return '[]'::jsonb;
  end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_ds', c.ma_ds,
      'thoi_diem_vao', c.thoi_diem_vao,
      'thu_tu', c.thu_tu,
      'ma_sv', c.ma_sv,
      'ma_lop', c.ma_lop,
      'ma_hp', lp.ma_hp,
      'ten_hp', h.ten_hp,
      'con_cho', case when (
        select count(*) from public.dangky k where k.ma_lop = c.ma_lop and k.trang_thai = 'HieuLuc'
      ) < lp.suc_chua then 1 else 0 end,
      'la_dau', case when c.thu_tu = (
        select min(c2.thu_tu) from public.danhsachcho c2 where c2.ma_lop = c.ma_lop
      ) then 1 else 0 end,
      'ho_ten', s.ho_ten
    ) order by c.thoi_diem_vao)
    from public.danhsachcho c
    join public.lophocphan lp on lp.ma_lop = c.ma_lop
    join public.hocphan h on h.ma_hp = lp.ma_hp
    join public.sinhvien s on s.ma_sv = c.ma_sv
    where c.ma_sv = v_ma_sv
  ), '[]'::jsonb);
end;
$$;

create or replace function public.danh_sach_cho_lop(p_token text, p_ma_lop text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_ds', c.ma_ds,
      'thoi_diem_vao', c.thoi_diem_vao,
      'thu_tu', c.thu_tu,
      'ma_sv', c.ma_sv,
      'ma_lop', c.ma_lop,
      'ma_hp', lp.ma_hp,
      'ten_hp', h.ten_hp,
      'con_cho', case when (
        select count(*) from public.dangky k where k.ma_lop = c.ma_lop and k.trang_thai = 'HieuLuc'
      ) < lp.suc_chua then 1 else 0 end,
      'la_dau', case when c.thu_tu = (
        select min(c2.thu_tu) from public.danhsachcho c2 where c2.ma_lop = c.ma_lop
      ) then 1 else 0 end,
      'ho_ten', s.ho_ten
    ) order by c.thu_tu)
    from public.danhsachcho c
    join public.lophocphan lp on lp.ma_lop = c.ma_lop
    join public.hocphan h on h.ma_hp = lp.ma_hp
    join public.sinhvien s on s.ma_sv = c.ma_sv
    where c.ma_lop = p_ma_lop
  ), '[]'::jsonb);
end;
$$;

create or replace function public.ctdt_cua_sinh_vien(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_sv public.sinhvien%rowtype;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  select * into v_sv from public.sinhvien where ma_tk = v_xt.ma_tk;
  if not found then
    return '[]'::jsonb;
  end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_ctdt', ct.ma_ctdt,
      'ma_hp', ct.ma_hp,
      'hoc_ky_du_kien', ct.hoc_ky_du_kien,
      'ten_hp', h.ten_hp,
      'so_tin_chi', h.so_tin_chi,
      'da_dat', exists (
        select 1 from public.ketquahoctap k
        where k.ma_sv = v_sv.ma_sv and k.ma_hp = ct.ma_hp and k.diem >= 4
      )
    ) order by ct.hoc_ky_du_kien, ct.ma_hp)
    from public.ctdt_hocphan ct
    join public.hocphan h on h.ma_hp = ct.ma_hp
    where ct.ma_ctdt = v_sv.ma_ctdt
  ), '[]'::jsonb);
end;
$$;

create or replace function public.ket_qua_cua_sinh_vien(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_sv varchar;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  select ma_sv into v_ma_sv from public.sinhvien where ma_tk = v_xt.ma_tk;
  if v_ma_sv is null then
    return '[]'::jsonb;
  end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_kq', k.ma_kq,
      'hoc_ky', k.hoc_ky,
      'diem', k.diem,
      'ma_sv', k.ma_sv,
      'ho_ten', s.ho_ten,
      'ma_hp', k.ma_hp,
      'ten_hp', h.ten_hp
    ) order by k.hoc_ky, k.ma_hp)
    from public.ketquahoctap k
    join public.sinhvien s on s.ma_sv = k.ma_sv
    join public.hocphan h on h.ma_hp = k.ma_hp
    where k.ma_sv = v_ma_sv
  ), '[]'::jsonb);
end;
$$;

create or replace function public.luu_khoa(p_token text, p_du_lieu jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);
  if coalesce(trim(p_du_lieu ->> 'ma_khoa'), '') = '' or coalesce(trim(p_du_lieu ->> 'ten_khoa'), '') = '' then
    raise exception 'Vui lòng nhập mã khoa và tên khoa';
  end if;
  insert into public.khoa (ma_khoa, ten_khoa)
  values (trim(p_du_lieu ->> 'ma_khoa'), trim(p_du_lieu ->> 'ten_khoa'))
  on conflict (ma_khoa) do update set ten_khoa = excluded.ten_khoa;
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.xoa_khoa(p_token text, p_ma_khoa text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);
  begin
    delete from public.khoa where ma_khoa = p_ma_khoa;
  exception when foreign_key_violation then
    raise exception 'Không thể xóa khoa vì đang được sử dụng';
  end;
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.luu_nhom(p_token text, p_du_lieu jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);
  if coalesce(trim(p_du_lieu ->> 'ma_nhom'), '') = '' or coalesce(trim(p_du_lieu ->> 'ten_nhom'), '') = '' then
    raise exception 'Vui lòng nhập mã nhóm và tên nhóm';
  end if;
  insert into public.nhomsinhvien (ma_nhom, ten_nhom, co_ghi_danh, ma_khoa)
  values (
    trim(p_du_lieu ->> 'ma_nhom'),
    trim(p_du_lieu ->> 'ten_nhom'),
    coalesce((p_du_lieu ->> 'co_ghi_danh')::boolean, false),
    p_du_lieu ->> 'ma_khoa'
  )
  on conflict (ma_nhom) do update set
    ten_nhom = excluded.ten_nhom,
    co_ghi_danh = excluded.co_ghi_danh,
    ma_khoa = excluded.ma_khoa;
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.xoa_nhom(p_token text, p_ma_nhom text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);
  begin
    delete from public.nhomsinhvien where ma_nhom = p_ma_nhom;
  exception when foreign_key_violation then
    raise exception 'Không thể xóa nhóm vì đang được sử dụng';
  end;
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.luu_sinh_vien(p_token text, p_du_lieu jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_tk integer;
  v_ma_sv text := trim(coalesce(p_du_lieu ->> 'ma_sv', ''));
  v_mat_khau text := coalesce(p_du_lieu ->> 'mat_khau', 'Sv@12345');
  v_ten_dang_nhap text := coalesce(nullif(trim(p_du_lieu ->> 'ten_dang_nhap'), ''), v_ma_sv);
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);

  select ma_tk into v_ma_tk from public.sinhvien where ma_sv = v_ma_sv;

  if v_ma_tk is null then
    if length(v_mat_khau) < 8 then
      raise exception 'Mật khẩu phải có ít nhất 8 ký tự';
    end if;
    insert into public.nguoidung (ten_dang_nhap, mat_khau_bam, vai_tro, trang_thai)
    values (v_ten_dang_nhap, crypt(v_mat_khau, gen_salt('bf')), 'SV', 'HoatDong')
    returning ma_tk into v_ma_tk;

    insert into public.sinhvien (ma_sv, ho_ten, ngay_sinh, nien_khoa, trang_thai, ma_tk, ma_khoa, ma_nhom, ma_ctdt)
    values (
      v_ma_sv,
      trim(p_du_lieu ->> 'ho_ten'),
      (p_du_lieu ->> 'ngay_sinh')::date,
      p_du_lieu ->> 'nien_khoa',
      coalesce(nullif(p_du_lieu ->> 'trang_thai', ''), 'DangHoc'),
      v_ma_tk,
      p_du_lieu ->> 'ma_khoa',
      nullif(p_du_lieu ->> 'ma_nhom', ''),
      p_du_lieu ->> 'ma_ctdt'
    );
  else
    update public.sinhvien set
      ho_ten = trim(p_du_lieu ->> 'ho_ten'),
      ngay_sinh = (p_du_lieu ->> 'ngay_sinh')::date,
      nien_khoa = p_du_lieu ->> 'nien_khoa',
      trang_thai = coalesce(nullif(p_du_lieu ->> 'trang_thai', ''), 'DangHoc'),
      ma_khoa = p_du_lieu ->> 'ma_khoa',
      ma_nhom = nullif(p_du_lieu ->> 'ma_nhom', ''),
      ma_ctdt = p_du_lieu ->> 'ma_ctdt'
    where ma_sv = v_ma_sv;

    if nullif(p_du_lieu ->> 'mat_khau', '') is not null then
      if length(v_mat_khau) < 8 then
        raise exception 'Mật khẩu phải có ít nhất 8 ký tự';
      end if;
      update public.nguoidung set mat_khau_bam = crypt(v_mat_khau, gen_salt('bf')) where ma_tk = v_ma_tk;
    end if;
    update public.nguoidung set ten_dang_nhap = v_ten_dang_nhap where ma_tk = v_ma_tk;
  end if;

  perform public._ghi_nhat_ky(v_xt.ma_tk, 'LuuSinhVien', 'ThanhCong', v_ma_sv, v_ma_sv, null);
  return jsonb_build_object('ok', true, 'ma_sv', v_ma_sv);
end;
$$;

create or replace function public.luu_hoc_phan(p_token text, p_du_lieu jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_hp text := trim(coalesce(p_du_lieu ->> 'ma_hp', ''));
  v_mon jsonb;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);

  if coalesce((p_du_lieu ->> 'so_tin_chi')::integer, 0) <= 0 then
    raise exception 'Số tín chỉ phải lớn hơn 0';
  end if;

  insert into public.hocphan (ma_hp, ten_hp, so_tin_chi)
  values (v_ma_hp, trim(p_du_lieu ->> 'ten_hp'), (p_du_lieu ->> 'so_tin_chi')::smallint)
  on conflict (ma_hp) do update set
    ten_hp = excluded.ten_hp,
    so_tin_chi = excluded.so_tin_chi;

  delete from public.tienquyet where ma_hp = v_ma_hp;
  for v_mon in select * from jsonb_array_elements(coalesce(p_du_lieu -> 'tien_quyet', '[]'::jsonb))
  loop
    if coalesce(v_mon ->> 'ma_hp_tien_quyet', '') <> '' then
      insert into public.tienquyet (ma_hp, ma_hp_tien_quyet, loai_rang_buoc)
      values (v_ma_hp, v_mon ->> 'ma_hp_tien_quyet', v_mon ->> 'loai_rang_buoc');
    end if;
  end loop;

  perform public._ghi_nhat_ky(v_xt.ma_tk, 'LuuHocPhan', 'ThanhCong', v_ma_hp, null, null);
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.xoa_hoc_phan(p_token text, p_ma_hp text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);
  begin
    delete from public.hocphan where ma_hp = p_ma_hp;
  exception when foreign_key_violation then
    raise exception 'Không thể xóa học phần vì đang được sử dụng';
  end;
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.luu_ctdt(p_token text, p_du_lieu jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_ctdt text := trim(coalesce(p_du_lieu ->> 'ma_ctdt', ''));
  v_mon jsonb;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);

  insert into public.chuongtrinhdaotao (ma_ctdt, ten_ctdt, nien_khoa)
  values (v_ma_ctdt, trim(p_du_lieu ->> 'ten_ctdt'), p_du_lieu ->> 'nien_khoa')
  on conflict (ma_ctdt) do update set
    ten_ctdt = excluded.ten_ctdt,
    nien_khoa = excluded.nien_khoa;

  delete from public.ctdt_hocphan where ma_ctdt = v_ma_ctdt;
  for v_mon in select * from jsonb_array_elements(coalesce(p_du_lieu -> 'hoc_phan', '[]'::jsonb))
  loop
    insert into public.ctdt_hocphan (ma_ctdt, ma_hp, hoc_ky_du_kien)
    values (v_ma_ctdt, v_mon ->> 'ma_hp', nullif(v_mon ->> 'hoc_ky_du_kien', '')::smallint);
  end loop;

  perform public._ghi_nhat_ky(v_xt.ma_tk, 'LuuChuongTrinh', 'ThanhCong', v_ma_ctdt, null, null);
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.luu_lop(p_token text, p_du_lieu jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_lop text := trim(coalesce(p_du_lieu ->> 'ma_lop', ''));
  v_suc_chua integer := coalesce((p_du_lieu ->> 'suc_chua')::integer, 0);
  v_si_so integer;
  v_buoi jsonb;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);

  if v_suc_chua <= 0 then
    raise exception 'Sức chứa phải lớn hơn 0';
  end if;

  if exists (select 1 from public.lophocphan where ma_lop = v_ma_lop) then
    select count(*) into v_si_so from public.dangky where ma_lop = v_ma_lop and trang_thai = 'HieuLuc';
    if v_suc_chua < v_si_so then
      raise exception 'Không thể giảm sức chứa xuống dưới sĩ số hiện tại (%)', v_si_so;
    end if;
    if v_si_so > 0 and exists (
      select 1 from public.lophocphan
      where ma_lop = v_ma_lop
        and (ma_hp <> (p_du_lieu ->> 'ma_hp') or ma_dot <> (p_du_lieu ->> 'ma_dot'))
    ) then
      raise exception 'Không thể đổi học phần hoặc đợt của lớp đã có sinh viên đăng ký';
    end if;
    update public.lophocphan set
      suc_chua = v_suc_chua,
      trang_thai = coalesce(nullif(p_du_lieu ->> 'trang_thai', ''), 'Mo'),
      ma_hp = p_du_lieu ->> 'ma_hp',
      ma_dot = p_du_lieu ->> 'ma_dot'
    where ma_lop = v_ma_lop;
  else
    insert into public.lophocphan (ma_lop, suc_chua, trang_thai, ma_hp, ma_dot)
    values (v_ma_lop, v_suc_chua, coalesce(nullif(p_du_lieu ->> 'trang_thai', ''), 'Mo'),
      p_du_lieu ->> 'ma_hp', p_du_lieu ->> 'ma_dot');
  end if;

  delete from public.lichhoc where ma_lop = v_ma_lop;
  for v_buoi in select * from jsonb_array_elements(coalesce(p_du_lieu -> 'lich', '[]'::jsonb))
  loop
    insert into public.lichhoc (thu, tiet_bat_dau, tiet_ket_thuc, phong_hoc, giang_vien, ma_lop)
    values (
      (v_buoi ->> 'thu')::smallint,
      (v_buoi ->> 'tiet_bat_dau')::smallint,
      (v_buoi ->> 'tiet_ket_thuc')::smallint,
      v_buoi ->> 'phong_hoc',
      v_buoi ->> 'giang_vien',
      v_ma_lop
    );
  end loop;

  perform public._ghi_nhat_ky(v_xt.ma_tk, 'LuuLop', 'ThanhCong', v_ma_lop, null, v_ma_lop);
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.huy_lop(p_token text, p_ma_lop text, p_ly_do text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_lop public.lophocphan%rowtype;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);
  if coalesce(trim(p_ly_do), '') = '' then
    raise exception 'Vui lòng nhập lý do hủy lớp';
  end if;
  select * into v_lop from public.lophocphan where ma_lop = p_ma_lop;
  if not found then
    raise exception 'Không tìm thấy lớp học phần';
  end if;
  if v_lop.trang_thai = 'BiHuy' then
    return jsonb_build_object('ok', true, 'message', 'Lớp đã được hủy trước đó');
  end if;

  update public.lophocphan set trang_thai = 'BiHuy' where ma_lop = p_ma_lop;
  update public.dangky set trang_thai = 'LopBiHuy' where ma_lop = p_ma_lop and trang_thai = 'HieuLuc';
  perform public._ghi_nhat_ky(v_xt.ma_tk, 'HuyLop', 'ThanhCong', trim(p_ly_do), null, p_ma_lop);
  return jsonb_build_object('ok', true, 'message', 'Đã hủy lớp');
end;
$$;

create or replace function public.luu_dot(p_token text, p_du_lieu jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_dot text := trim(coalesce(p_du_lieu ->> 'ma_dot', ''));
  v_nhom jsonb;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);

  if (p_du_lieu ->> 'thoi_diem_dong')::timestamp <= (p_du_lieu ->> 'thoi_diem_mo')::timestamp then
    raise exception 'Thời điểm đóng phải sau thời điểm mở';
  end if;

  insert into public.dotdangky (ma_dot, ten_dot, hoc_ky, nam_hoc, thoi_diem_mo, thoi_diem_dong, nguong_huy_lop)
  values (
    v_ma_dot, trim(p_du_lieu ->> 'ten_dot'), p_du_lieu ->> 'hoc_ky', p_du_lieu ->> 'nam_hoc',
    (p_du_lieu ->> 'thoi_diem_mo')::timestamp,
    (p_du_lieu ->> 'thoi_diem_dong')::timestamp,
    coalesce((p_du_lieu ->> 'nguong_huy_lop')::smallint, 15)
  )
  on conflict (ma_dot) do update set
    ten_dot = excluded.ten_dot,
    hoc_ky = excluded.hoc_ky,
    nam_hoc = excluded.nam_hoc,
    thoi_diem_mo = excluded.thoi_diem_mo,
    thoi_diem_dong = excluded.thoi_diem_dong,
    nguong_huy_lop = excluded.nguong_huy_lop;

  delete from public.dotnhom where ma_dot = v_ma_dot;
  for v_nhom in select * from jsonb_array_elements(coalesce(p_du_lieu -> 'nhom', '[]'::jsonb))
  loop
    insert into public.dotnhom (ma_dot, ma_nhom) values (v_ma_dot, v_nhom ->> 'ma_nhom');
  end loop;

  perform public._ghi_nhat_ky(v_xt.ma_tk, 'LuuDot', 'ThanhCong', v_ma_dot, null, null);
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.luu_tai_khoan(p_token text, p_du_lieu jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_tk integer := nullif(p_du_lieu ->> 'ma_tk', '')::integer;
  v_mat_khau text := coalesce(p_du_lieu ->> 'mat_khau', '');
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);

  if v_ma_tk is null then
    if length(v_mat_khau) < 8 then
      raise exception 'Mật khẩu phải có ít nhất 8 ký tự';
    end if;
    insert into public.nguoidung (ten_dang_nhap, mat_khau_bam, vai_tro, trang_thai)
    values (
      trim(p_du_lieu ->> 'ten_dang_nhap'),
      crypt(v_mat_khau, gen_salt('bf')),
      p_du_lieu ->> 'vai_tro',
      coalesce(nullif(p_du_lieu ->> 'trang_thai', ''), 'HoatDong')
    )
    returning ma_tk into v_ma_tk;
  else
    update public.nguoidung set
      ten_dang_nhap = trim(p_du_lieu ->> 'ten_dang_nhap'),
      vai_tro = p_du_lieu ->> 'vai_tro',
      trang_thai = coalesce(nullif(p_du_lieu ->> 'trang_thai', ''), 'HoatDong')
    where ma_tk = v_ma_tk;
    if v_mat_khau <> '' then
      if length(v_mat_khau) < 8 then
        raise exception 'Mật khẩu phải có ít nhất 8 ký tự';
      end if;
      update public.nguoidung set mat_khau_bam = crypt(v_mat_khau, gen_salt('bf')) where ma_tk = v_ma_tk;
    end if;
  end if;

  perform public._ghi_nhat_ky(v_xt.ma_tk, 'LuuTaiKhoan', 'ThanhCong', v_ma_tk::text, null, null);
  return jsonb_build_object('ok', true, 'ma_tk', v_ma_tk);
end;
$$;

create or replace function public.luu_ket_qua(p_token text, p_du_lieu jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_ma_kq integer := nullif(p_du_lieu ->> 'ma_kq', '')::integer;
  v_diem numeric := (p_du_lieu ->> 'diem')::numeric;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);
  if v_diem < 0 or v_diem > 10 then
    raise exception 'Điểm phải nằm trong khoảng 0 đến 10';
  end if;

  if v_ma_kq is null then
    insert into public.ketquahoctap (hoc_ky, diem, ma_sv, ma_hp)
    values (p_du_lieu ->> 'hoc_ky', v_diem, p_du_lieu ->> 'ma_sv', p_du_lieu ->> 'ma_hp')
    on conflict (ma_sv, ma_hp, hoc_ky) do update set diem = excluded.diem
    returning ma_kq into v_ma_kq;
  else
    update public.ketquahoctap set
      hoc_ky = p_du_lieu ->> 'hoc_ky',
      diem = v_diem,
      ma_sv = p_du_lieu ->> 'ma_sv',
      ma_hp = p_du_lieu ->> 'ma_hp'
    where ma_kq = v_ma_kq;
  end if;

  perform public._ghi_nhat_ky(v_xt.ma_tk, 'LuuKetQua', 'ThanhCong', v_ma_kq::text, p_du_lieu ->> 'ma_sv', null);
  return jsonb_build_object('ok', true, 'ma_kq', v_ma_kq);
end;
$$;

create or replace function public.nhap_lop(p_token text, p_ten_file text, p_dong jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_xt record;
  v_dong jsonb;
  v_so_dung integer := 0;
  v_so_sai integer := 0;
  v_loi jsonb := '[]'::jsonb;
  v_ma_lop text;
  v_stt integer := 0;
  v_thong_bao text;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);

  for v_dong in select * from jsonb_array_elements(p_dong)
  loop
    v_stt := v_stt + 1;
    v_ma_lop := trim(coalesce(v_dong ->> 'ma_lop', ''));
    begin
      if v_ma_lop = '' then
        raise exception 'Thiếu mã lớp';
      end if;
      if exists (select 1 from public.lophocphan where ma_lop = v_ma_lop) then
        raise exception 'Trùng lớp %', v_ma_lop;
      end if;
      if (v_dong ->> 'thu')::smallint < 2 or (v_dong ->> 'thu')::smallint > 8 then
        raise exception 'Thứ không hợp lệ';
      end if;
      if (v_dong ->> 'tiet_ket_thuc')::smallint < (v_dong ->> 'tiet_bat_dau')::smallint then
        raise exception 'Tiết kết thúc nhỏ hơn tiết bắt đầu';
      end if;

      insert into public.lophocphan (ma_lop, suc_chua, trang_thai, ma_hp, ma_dot)
      values (
        v_ma_lop,
        (v_dong ->> 'suc_chua')::integer,
        'Mo',
        v_dong ->> 'ma_hp',
        v_dong ->> 'ma_dot'
      );
      insert into public.lichhoc (thu, tiet_bat_dau, tiet_ket_thuc, phong_hoc, giang_vien, ma_lop)
      values (
        (v_dong ->> 'thu')::smallint,
        (v_dong ->> 'tiet_bat_dau')::smallint,
        (v_dong ->> 'tiet_ket_thuc')::smallint,
        coalesce(v_dong ->> 'phong_hoc', ''),
        coalesce(v_dong ->> 'giang_vien', ''),
        v_ma_lop
      );
      v_so_dung := v_so_dung + 1;
    exception when others then
      v_thong_bao := sqlerrm;
      v_so_sai := v_so_sai + 1;
      if jsonb_array_length(v_loi) < 50 then
        v_loi := v_loi || jsonb_build_array(jsonb_build_object('dong', v_stt, 'ma_lop', v_ma_lop, 'ly_do', v_thong_bao));
      end if;
    end;
  end loop;

  insert into public.nhatkyimport (ten_file, so_dong_dung, so_dong_sai, ma_tk)
  values (p_ten_file, v_so_dung, v_so_sai, v_xt.ma_tk);

  perform public._ghi_nhat_ky(v_xt.ma_tk, 'NhapLop', 'ThanhCong',
    p_ten_file || ': ' || v_so_dung || ' đúng, ' || v_so_sai || ' sai', null, null);

  return jsonb_build_object('so_dong_dung', v_so_dung, 'so_dong_sai', v_so_sai, 'loi', v_loi);
end;
$$;

create or replace function public.danh_sach_nhat_ky_import(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_xt record;
begin
  select * into v_xt from public.xac_thuc_token(p_token);
  perform public._kiem_tra_pdt(v_xt.vai_tro);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'ma_import', i.ma_import, 'thoi_gian', i.thoi_gian, 'ten_file', i.ten_file,
      'so_dong_dung', i.so_dong_dung, 'so_dong_sai', i.so_dong_sai,
      'ten_dang_nhap', n.ten_dang_nhap
    ) order by i.thoi_gian desc)
    from public.nhatkyimport i join public.nguoidung n on n.ma_tk = i.ma_tk
  ), '[]'::jsonb);
end;
$$;

revoke execute on all functions in schema public from public, anon, authenticated;

grant execute on function public.dang_nhap(text, text) to anon, authenticated;
grant execute on function public.doi_mat_khau(text, text, text) to anon, authenticated;
grant execute on function public.lay_ho_so(text) to anon, authenticated;
grant execute on function public.thong_ke(text) to anon, authenticated;
grant execute on function public.danh_sach_sinh_vien(text, text) to anon, authenticated;
grant execute on function public.danh_sach_khoa(text) to anon, authenticated;
grant execute on function public.danh_sach_nhom(text) to anon, authenticated;
grant execute on function public.danh_sach_ctdt(text) to anon, authenticated;
grant execute on function public.danh_sach_hoc_phan(text) to anon, authenticated;
grant execute on function public.danh_sach_lop(text, text) to anon, authenticated;
grant execute on function public.danh_sach_dot(text) to anon, authenticated;
grant execute on function public.danh_sach_tai_khoan(text) to anon, authenticated;
grant execute on function public.danh_sach_ket_qua(text, text) to anon, authenticated;
grant execute on function public.lop_dang_mo(text) to anon, authenticated;
grant execute on function public.chi_tiet_lop(text, text) to anon, authenticated;
grant execute on function public.danh_sach_ghi_danh(text) to anon, authenticated;
grant execute on function public.hoc_phan_da_dang_ky(text) to anon, authenticated;
grant execute on function public.thoi_khoa_bieu(text) to anon, authenticated;
grant execute on function public.lich_su_thao_tac(text) to anon, authenticated;
grant execute on function public.danh_sach_cho(text) to anon, authenticated;
grant execute on function public.danh_sach_cho_lop(text, text) to anon, authenticated;
grant execute on function public.ctdt_cua_sinh_vien(text) to anon, authenticated;
grant execute on function public.ket_qua_cua_sinh_vien(text) to anon, authenticated;
grant execute on function public.dot_cua_sinh_vien(text) to anon, authenticated;
grant execute on function public.dang_ky(text, text) to anon, authenticated;
grant execute on function public.dang_ky_ho(text, text, text, text) to anon, authenticated;
grant execute on function public.huy_dang_ky(text, integer, text) to anon, authenticated;
grant execute on function public.vao_danh_sach_cho(text, text) to anon, authenticated;
grant execute on function public.xac_nhan_cho(text, text) to anon, authenticated;
grant execute on function public.roi_danh_sach_cho(text, text) to anon, authenticated;
grant execute on function public.ghi_danh_hoc_phan(text, text, text) to anon, authenticated;
grant execute on function public.xu_ly_sau_dot(text, text) to anon, authenticated;
grant execute on function public.luu_khoa(text, jsonb) to anon, authenticated;
grant execute on function public.xoa_khoa(text, text) to anon, authenticated;
grant execute on function public.luu_nhom(text, jsonb) to anon, authenticated;
grant execute on function public.xoa_nhom(text, text) to anon, authenticated;
grant execute on function public.luu_sinh_vien(text, jsonb) to anon, authenticated;
grant execute on function public.luu_hoc_phan(text, jsonb) to anon, authenticated;
grant execute on function public.xoa_hoc_phan(text, text) to anon, authenticated;
grant execute on function public.luu_ctdt(text, jsonb) to anon, authenticated;
grant execute on function public.luu_lop(text, jsonb) to anon, authenticated;
grant execute on function public.huy_lop(text, text, text) to anon, authenticated;
grant execute on function public.luu_dot(text, jsonb) to anon, authenticated;
grant execute on function public.luu_tai_khoan(text, jsonb) to anon, authenticated;
grant execute on function public.luu_ket_qua(text, jsonb) to anon, authenticated;
grant execute on function public.nhap_lop(text, text, jsonb) to anon, authenticated;
grant execute on function public.danh_sach_nhat_ky_import(text) to anon, authenticated;
