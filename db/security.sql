do $$
declare
  t text;
begin
  foreach t in array array[
    'nguoidung', 'khoa', 'nhomsinhvien', 'sinhvien', 'chuongtrinhdaotao',
    'ctdt_hocphan', 'hocphan', 'tienquyet', 'dotdangky', 'dotnhom',
    'lophocphan', 'lichhoc', 'dangky', 'danhsachcho', 'ghidanhhocphan',
    'ketquahoctap', 'nhatkyimport', 'nhatkythaotac'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from anon, authenticated', t);
  end loop;
end $$;

revoke all on all sequences in schema public from anon, authenticated;

create or replace function public.chan_sua_nhat_ky()
returns trigger
language plpgsql
as $$
begin
  raise exception 'Nhật ký chỉ được thêm, không được sửa hoặc xóa';
end;
$$;

drop trigger if exists nhatkythaotac_chi_them on public.nhatkythaotac;
create trigger nhatkythaotac_chi_them
before update or delete on public.nhatkythaotac
for each row execute function public.chan_sua_nhat_ky();

drop trigger if exists nhatkyimport_chi_them on public.nhatkyimport;
create trigger nhatkyimport_chi_them
before update or delete on public.nhatkyimport
for each row execute function public.chan_sua_nhat_ky();

create or replace function public._b64url_encode(p bytea)
returns text
language sql
immutable
as $$
  select rtrim(translate(encode(p, 'base64'), '+/', '-_'), '=');
$$;

create or replace function public._b64url_decode(p text)
returns bytea
language sql
immutable
as $$
  select decode(
    translate(p, '-_', '+/') || repeat('=', (4 - length(p) % 4) % 4),
    'base64'
  );
$$;

create or replace function public._khoa_ky()
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_khoa constant text := '__DIEN_BI_MAT_TOKEN__';
begin
  if v_khoa = '__DIEN_BI_MAT_TOKEN__' or length(v_khoa) < 32 then
    raise exception 'Chưa cấu hình khóa ký token';
  end if;
  return v_khoa;
end;
$$;

create or replace function public._tao_token(p_ma_tk integer, p_vai_tro text)
returns text
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
declare
  v_payload jsonb;
  v_chuoi text;
begin
  v_payload := jsonb_build_object(
    'ma_tk', p_ma_tk,
    'vai_tro', p_vai_tro,
    'het_han', extract(epoch from now() + interval '2 hours')::bigint
  );
  v_chuoi := public._b64url_encode(convert_to(v_payload::text, 'utf8'));
  return v_chuoi || '.' ||
    public._b64url_encode(hmac(v_chuoi, public._khoa_ky(), 'sha256'));
end;
$$;

create or replace function public.xac_thuc_token(p_token text)
returns table (ma_tk integer, vai_tro text)
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
declare
  v_payload_chuoi text;
  v_chu_ky text;
  v_payload jsonb;
  v_nd public.nguoidung%rowtype;
begin
  if p_token is null or p_token !~ '^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$' then
    raise exception 'Phiên đăng nhập đã hết hạn';
  end if;

  v_payload_chuoi := split_part(p_token, '.', 1);
  v_chu_ky := split_part(p_token, '.', 2);

  if v_chu_ky <> public._b64url_encode(hmac(v_payload_chuoi, public._khoa_ky(), 'sha256')) then
    raise exception 'Phiên đăng nhập đã hết hạn';
  end if;

  begin
    v_payload := convert_from(public._b64url_decode(v_payload_chuoi), 'utf8')::jsonb;
  exception when others then
    raise exception 'Phiên đăng nhập đã hết hạn';
  end;

  if v_payload is null
     or (v_payload ->> 'het_han') is null
     or (v_payload ->> 'het_han')::bigint <= extract(epoch from now())::bigint then
    raise exception 'Phiên đăng nhập đã hết hạn';
  end if;

  select * into v_nd from public.nguoidung n
  where n.ma_tk = (v_payload ->> 'ma_tk')::integer;

  if not found
     or v_nd.vai_tro <> (v_payload ->> 'vai_tro')
     or v_nd.trang_thai <> 'HoatDong' then
    raise exception 'Phiên đăng nhập đã hết hạn';
  end if;

  ma_tk := v_nd.ma_tk;
  vai_tro := v_nd.vai_tro;
  return next;
end;
$$;

create or replace function public.dang_nhap(p_ten_dang_nhap text, p_mat_khau text)
returns text
language plpgsql
volatile
security definer
set search_path = public, extensions
as $$
declare
  v_nd public.nguoidung%rowtype;
begin
  select * into v_nd from public.nguoidung
  where ten_dang_nhap = trim(p_ten_dang_nhap);

  if not found
     or p_mat_khau is null
     or v_nd.mat_khau_bam is null
     or crypt(p_mat_khau, v_nd.mat_khau_bam) <> v_nd.mat_khau_bam then
    raise exception 'Tên đăng nhập hoặc mật khẩu không đúng';
  end if;

  if v_nd.trang_thai <> 'HoatDong' then
    raise exception 'Tài khoản đã bị khóa';
  end if;

  return public._tao_token(v_nd.ma_tk, v_nd.vai_tro);
end;
$$;

create or replace function public._ghi_nhat_ky(
  p_ma_tk integer,
  p_loai varchar,
  p_ket_qua varchar,
  p_ly_do varchar,
  p_ma_sv varchar default null,
  p_ma_lop varchar default null
)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.nhatkythaotac (loai_thao_tac, ket_qua, ly_do, ma_tk, ma_sv, ma_lop)
  values (p_loai, p_ket_qua, coalesce(p_ly_do, ''), p_ma_tk, p_ma_sv, p_ma_lop);
$$;

create or replace function public.doi_mat_khau(p_token text, p_mat_khau_cu text, p_mat_khau_moi text)
returns void
language plpgsql
volatile
security definer
set search_path = public, extensions
as $$
declare
  v_xac_thuc record;
  v_nd public.nguoidung%rowtype;
begin
  select * into v_xac_thuc from public.xac_thuc_token(p_token);

  if length(coalesce(p_mat_khau_moi, '')) < 8 then
    raise exception 'Mật khẩu mới phải có ít nhất 8 ký tự';
  end if;

  select * into v_nd from public.nguoidung where ma_tk = v_xac_thuc.ma_tk;
  if crypt(p_mat_khau_cu, v_nd.mat_khau_bam) <> v_nd.mat_khau_bam then
    raise exception 'Mật khẩu cũ không đúng';
  end if;

  update public.nguoidung
  set mat_khau_bam = crypt(p_mat_khau_moi, gen_salt('bf'))
  where ma_tk = v_nd.ma_tk;

  perform public._ghi_nhat_ky(v_nd.ma_tk, 'DoiMatKhau', 'ThanhCong', '');
end;
$$;

revoke execute on function public.chan_sua_nhat_ky() from public, anon, authenticated;
revoke execute on function public._b64url_encode(bytea) from public, anon, authenticated;
revoke execute on function public._b64url_decode(text) from public, anon, authenticated;
revoke execute on function public._khoa_ky() from public, anon, authenticated;
revoke execute on function public._tao_token(integer, text) from public, anon, authenticated;
revoke execute on function public.xac_thuc_token(text) from public, anon, authenticated;
revoke execute on function public._ghi_nhat_ky(integer, varchar, varchar, varchar, varchar, varchar) from public, anon, authenticated;

grant execute on function public.dang_nhap(text, text) to anon, authenticated;
grant execute on function public.doi_mat_khau(text, text, text) to anon, authenticated;
