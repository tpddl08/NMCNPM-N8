alter table public.chuongtrinhdaotao enable row level security;

alter table public.ctdt_hocphan enable row level security;

alter table public.dangky enable row level security;

alter table public.danhsachcho enable row level security;

alter table public.dotdangky enable row level security;

alter table public.dotnhom enable row level security;

alter table public.ghidanhhocphan enable row level security;

alter table public.hocphan enable row level security;

alter table public.ketquahoctap enable row level security;

alter table public.khoa enable row level security;

alter table public.lichhoc enable row level security;

alter table public.lophocphan enable row level security;

alter table public.nguoidung enable row level security;

alter table public.nhatkyimport enable row level security;

alter table public.nhatkythaotac enable row level security;

alter table public.nhomsinhvien enable row level security;

alter table public.sinhvien enable row level security;

alter table public.tienquyet enable row level security;

CREATE TRIGGER nhatkyimport_chi_them BEFORE DELETE OR UPDATE ON public.nhatkyimport FOR EACH ROW EXECUTE FUNCTION chan_sua_nhat_ky();

CREATE TRIGGER nhatkythaotac_chi_them BEFORE DELETE OR UPDATE ON public.nhatkythaotac FOR EACH ROW EXECUTE FUNCTION chan_sua_nhat_ky();

grant DELETE on public.chuongtrinhdaotao to service_role;

grant INSERT on public.chuongtrinhdaotao to service_role;

grant REFERENCES on public.chuongtrinhdaotao to service_role;

grant SELECT on public.chuongtrinhdaotao to service_role;

grant TRIGGER on public.chuongtrinhdaotao to service_role;

grant TRUNCATE on public.chuongtrinhdaotao to service_role;

grant UPDATE on public.chuongtrinhdaotao to service_role;

grant DELETE on public.ctdt_hocphan to service_role;

grant INSERT on public.ctdt_hocphan to service_role;

grant REFERENCES on public.ctdt_hocphan to service_role;

grant SELECT on public.ctdt_hocphan to service_role;

grant TRIGGER on public.ctdt_hocphan to service_role;

grant TRUNCATE on public.ctdt_hocphan to service_role;

grant UPDATE on public.ctdt_hocphan to service_role;

grant DELETE on public.dangky to service_role;

grant INSERT on public.dangky to service_role;

grant REFERENCES on public.dangky to service_role;

grant SELECT on public.dangky to service_role;

grant TRIGGER on public.dangky to service_role;

grant TRUNCATE on public.dangky to service_role;

grant UPDATE on public.dangky to service_role;

grant DELETE on public.danhsachcho to service_role;

grant INSERT on public.danhsachcho to service_role;

grant REFERENCES on public.danhsachcho to service_role;

grant SELECT on public.danhsachcho to service_role;

grant TRIGGER on public.danhsachcho to service_role;

grant TRUNCATE on public.danhsachcho to service_role;

grant UPDATE on public.danhsachcho to service_role;

grant DELETE on public.dotdangky to service_role;

grant INSERT on public.dotdangky to service_role;

grant REFERENCES on public.dotdangky to service_role;

grant SELECT on public.dotdangky to service_role;

grant TRIGGER on public.dotdangky to service_role;

grant TRUNCATE on public.dotdangky to service_role;

grant UPDATE on public.dotdangky to service_role;

grant DELETE on public.dotnhom to service_role;

grant INSERT on public.dotnhom to service_role;

grant REFERENCES on public.dotnhom to service_role;

grant SELECT on public.dotnhom to service_role;

grant TRIGGER on public.dotnhom to service_role;

grant TRUNCATE on public.dotnhom to service_role;

grant UPDATE on public.dotnhom to service_role;

grant DELETE on public.ghidanhhocphan to service_role;

grant INSERT on public.ghidanhhocphan to service_role;

grant REFERENCES on public.ghidanhhocphan to service_role;

grant SELECT on public.ghidanhhocphan to service_role;

grant TRIGGER on public.ghidanhhocphan to service_role;

grant TRUNCATE on public.ghidanhhocphan to service_role;

grant UPDATE on public.ghidanhhocphan to service_role;

grant DELETE on public.hocphan to service_role;

grant INSERT on public.hocphan to service_role;

grant REFERENCES on public.hocphan to service_role;

grant SELECT on public.hocphan to service_role;

grant TRIGGER on public.hocphan to service_role;

grant TRUNCATE on public.hocphan to service_role;

grant UPDATE on public.hocphan to service_role;

grant DELETE on public.ketquahoctap to service_role;

grant INSERT on public.ketquahoctap to service_role;

grant REFERENCES on public.ketquahoctap to service_role;

grant SELECT on public.ketquahoctap to service_role;

grant TRIGGER on public.ketquahoctap to service_role;

grant TRUNCATE on public.ketquahoctap to service_role;

grant UPDATE on public.ketquahoctap to service_role;

grant DELETE on public.khoa to service_role;

grant INSERT on public.khoa to service_role;

grant REFERENCES on public.khoa to service_role;

grant SELECT on public.khoa to service_role;

grant TRIGGER on public.khoa to service_role;

grant TRUNCATE on public.khoa to service_role;

grant UPDATE on public.khoa to service_role;

grant DELETE on public.lichhoc to service_role;

grant INSERT on public.lichhoc to service_role;

grant REFERENCES on public.lichhoc to service_role;

grant SELECT on public.lichhoc to service_role;

grant TRIGGER on public.lichhoc to service_role;

grant TRUNCATE on public.lichhoc to service_role;

grant UPDATE on public.lichhoc to service_role;

grant DELETE on public.lophocphan to service_role;

grant INSERT on public.lophocphan to service_role;

grant REFERENCES on public.lophocphan to service_role;

grant SELECT on public.lophocphan to service_role;

grant TRIGGER on public.lophocphan to service_role;

grant TRUNCATE on public.lophocphan to service_role;

grant UPDATE on public.lophocphan to service_role;

grant DELETE on public.nguoidung to service_role;

grant INSERT on public.nguoidung to service_role;

grant REFERENCES on public.nguoidung to service_role;

grant SELECT on public.nguoidung to service_role;

grant TRIGGER on public.nguoidung to service_role;

grant TRUNCATE on public.nguoidung to service_role;

grant UPDATE on public.nguoidung to service_role;

grant DELETE on public.nhatkyimport to service_role;

grant INSERT on public.nhatkyimport to service_role;

grant REFERENCES on public.nhatkyimport to service_role;

grant SELECT on public.nhatkyimport to service_role;

grant TRIGGER on public.nhatkyimport to service_role;

grant TRUNCATE on public.nhatkyimport to service_role;

grant UPDATE on public.nhatkyimport to service_role;

grant DELETE on public.nhatkythaotac to service_role;

grant INSERT on public.nhatkythaotac to service_role;

grant REFERENCES on public.nhatkythaotac to service_role;

grant SELECT on public.nhatkythaotac to service_role;

grant TRIGGER on public.nhatkythaotac to service_role;

grant TRUNCATE on public.nhatkythaotac to service_role;

grant UPDATE on public.nhatkythaotac to service_role;

grant DELETE on public.nhomsinhvien to service_role;

grant INSERT on public.nhomsinhvien to service_role;

grant REFERENCES on public.nhomsinhvien to service_role;

grant SELECT on public.nhomsinhvien to service_role;

grant TRIGGER on public.nhomsinhvien to service_role;

grant TRUNCATE on public.nhomsinhvien to service_role;

grant UPDATE on public.nhomsinhvien to service_role;

grant DELETE on public.sinhvien to service_role;

grant INSERT on public.sinhvien to service_role;

grant REFERENCES on public.sinhvien to service_role;

grant SELECT on public.sinhvien to service_role;

grant TRIGGER on public.sinhvien to service_role;

grant TRUNCATE on public.sinhvien to service_role;

grant UPDATE on public.sinhvien to service_role;

grant DELETE on public.tienquyet to service_role;

grant INSERT on public.tienquyet to service_role;

grant REFERENCES on public.tienquyet to service_role;

grant SELECT on public.tienquyet to service_role;

grant TRIGGER on public.tienquyet to service_role;

grant TRUNCATE on public.tienquyet to service_role;

grant UPDATE on public.tienquyet to service_role;

grant execute on function public._b64url_decode(p text) to service_role;

grant execute on function public._b64url_encode(p bytea) to service_role;

grant execute on function public._dang_ky(p_ma_tk integer, p_vai_tro text, p_ma_sv character varying, p_ma_lop character varying, p_bo_qua_dot boolean, p_ly_do text) to service_role;

grant execute on function public._ghi_nhat_ky(p_ma_tk integer, p_loai character varying, p_ket_qua character varying, p_ly_do character varying, p_ma_sv character varying, p_ma_lop character varying) to service_role;

grant execute on function public._khoa_ky() to service_role;

grant execute on function public._kiem_tra_pdt(p_vai_tro text) to service_role;

grant execute on function public._lich_cua_lop(p_ma_lop character varying) to service_role;

grant execute on function public._ma_sv_cua(p_ma_tk integer) to service_role;

grant execute on function public._tao_token(p_ma_tk integer, p_vai_tro text) to service_role;

grant execute on function public.chan_sua_nhat_ky() to service_role;

grant execute on function public.chan_sua_xoa_nhat_ky() to service_role;

grant execute on function public.chi_tiet_lop(p_token text, p_ma_lop text) to anon;

grant execute on function public.chi_tiet_lop(p_token text, p_ma_lop text) to authenticated;

grant execute on function public.chi_tiet_lop(p_token text, p_ma_lop text) to service_role;

grant execute on function public.ctdt_cua_sinh_vien(p_token text) to anon;

grant execute on function public.ctdt_cua_sinh_vien(p_token text) to authenticated;

grant execute on function public.ctdt_cua_sinh_vien(p_token text) to service_role;

grant execute on function public.dang_ky(p_token text, p_ma_lop text) to anon;

grant execute on function public.dang_ky(p_token text, p_ma_lop text) to authenticated;

grant execute on function public.dang_ky(p_token text, p_ma_lop text) to service_role;

grant execute on function public.dang_ky_ho(p_token text, p_ma_sv text, p_ma_lop text, p_ly_do text) to anon;

grant execute on function public.dang_ky_ho(p_token text, p_ma_sv text, p_ma_lop text, p_ly_do text) to authenticated;

grant execute on function public.dang_ky_ho(p_token text, p_ma_sv text, p_ma_lop text, p_ly_do text) to service_role;

grant execute on function public.dang_nhap(p_ten_dang_nhap text, p_mat_khau text) to anon;

grant execute on function public.dang_nhap(p_ten_dang_nhap text, p_mat_khau text) to authenticated;

grant execute on function public.dang_nhap(p_ten_dang_nhap text, p_mat_khau text) to service_role;

grant execute on function public.danh_sach_cho(p_token text) to anon;

grant execute on function public.danh_sach_cho(p_token text) to authenticated;

grant execute on function public.danh_sach_cho(p_token text) to service_role;

grant execute on function public.danh_sach_cho_lop(p_token text, p_ma_lop text) to anon;

grant execute on function public.danh_sach_cho_lop(p_token text, p_ma_lop text) to authenticated;

grant execute on function public.danh_sach_cho_lop(p_token text, p_ma_lop text) to service_role;

grant execute on function public.danh_sach_ctdt(p_token text) to anon;

grant execute on function public.danh_sach_ctdt(p_token text) to authenticated;

grant execute on function public.danh_sach_ctdt(p_token text) to service_role;

grant execute on function public.danh_sach_dot(p_token text) to anon;

grant execute on function public.danh_sach_dot(p_token text) to authenticated;

grant execute on function public.danh_sach_dot(p_token text) to service_role;

grant execute on function public.danh_sach_ghi_danh(p_token text) to anon;

grant execute on function public.danh_sach_ghi_danh(p_token text) to authenticated;

grant execute on function public.danh_sach_ghi_danh(p_token text) to service_role;

grant execute on function public.danh_sach_hoc_phan(p_token text) to anon;

grant execute on function public.danh_sach_hoc_phan(p_token text) to authenticated;

grant execute on function public.danh_sach_hoc_phan(p_token text) to service_role;

grant execute on function public.danh_sach_ket_qua(p_token text, p_ma_sv text) to anon;

grant execute on function public.danh_sach_ket_qua(p_token text, p_ma_sv text) to authenticated;

grant execute on function public.danh_sach_ket_qua(p_token text, p_ma_sv text) to service_role;

grant execute on function public.danh_sach_khoa(p_token text) to anon;

grant execute on function public.danh_sach_khoa(p_token text) to authenticated;

grant execute on function public.danh_sach_khoa(p_token text) to service_role;

grant execute on function public.danh_sach_lop(p_token text, p_ma_dot text) to anon;

grant execute on function public.danh_sach_lop(p_token text, p_ma_dot text) to authenticated;

grant execute on function public.danh_sach_lop(p_token text, p_ma_dot text) to service_role;

grant execute on function public.danh_sach_nhat_ky_import(p_token text) to anon;

grant execute on function public.danh_sach_nhat_ky_import(p_token text) to authenticated;

grant execute on function public.danh_sach_nhat_ky_import(p_token text) to service_role;

grant execute on function public.danh_sach_nhom(p_token text) to anon;

grant execute on function public.danh_sach_nhom(p_token text) to authenticated;

grant execute on function public.danh_sach_nhom(p_token text) to service_role;

grant execute on function public.danh_sach_sinh_vien(p_token text, p_tu_khoa text) to anon;

grant execute on function public.danh_sach_sinh_vien(p_token text, p_tu_khoa text) to authenticated;

grant execute on function public.danh_sach_sinh_vien(p_token text, p_tu_khoa text) to service_role;

grant execute on function public.danh_sach_tai_khoan(p_token text) to anon;

grant execute on function public.danh_sach_tai_khoan(p_token text) to authenticated;

grant execute on function public.danh_sach_tai_khoan(p_token text) to service_role;

grant execute on function public.doi_mat_khau(p_token text, p_mat_khau_cu text, p_mat_khau_moi text) to anon;

grant execute on function public.doi_mat_khau(p_token text, p_mat_khau_cu text, p_mat_khau_moi text) to authenticated;

grant execute on function public.doi_mat_khau(p_token text, p_mat_khau_cu text, p_mat_khau_moi text) to service_role;

grant execute on function public.dot_cua_sinh_vien(p_token text) to anon;

grant execute on function public.dot_cua_sinh_vien(p_token text) to authenticated;

grant execute on function public.dot_cua_sinh_vien(p_token text) to service_role;

grant execute on function public.ghi_danh_hoc_phan(p_token text, p_ma_hp text, p_ma_dot text) to anon;

grant execute on function public.ghi_danh_hoc_phan(p_token text, p_ma_hp text, p_ma_dot text) to authenticated;

grant execute on function public.ghi_danh_hoc_phan(p_token text, p_ma_hp text, p_ma_dot text) to service_role;

grant execute on function public.hoc_phan_da_dang_ky(p_token text) to anon;

grant execute on function public.hoc_phan_da_dang_ky(p_token text) to authenticated;

grant execute on function public.hoc_phan_da_dang_ky(p_token text) to service_role;

grant execute on function public.huy_dang_ky(p_token text, p_ma_dang_ky integer, p_ly_do text) to anon;

grant execute on function public.huy_dang_ky(p_token text, p_ma_dang_ky integer, p_ly_do text) to authenticated;

grant execute on function public.huy_dang_ky(p_token text, p_ma_dang_ky integer, p_ly_do text) to service_role;

grant execute on function public.huy_ghi_danh_hoc_phan(p_token text, p_ma_hp text, p_ma_dot text) to anon;

grant execute on function public.huy_ghi_danh_hoc_phan(p_token text, p_ma_hp text, p_ma_dot text) to authenticated;

grant execute on function public.huy_ghi_danh_hoc_phan(p_token text, p_ma_hp text, p_ma_dot text) to service_role;

grant execute on function public.huy_lop(p_token text, p_ma_lop text, p_ly_do text) to anon;

grant execute on function public.huy_lop(p_token text, p_ma_lop text, p_ly_do text) to authenticated;

grant execute on function public.huy_lop(p_token text, p_ma_lop text, p_ly_do text) to service_role;

grant execute on function public.ket_qua_cua_sinh_vien(p_token text) to anon;

grant execute on function public.ket_qua_cua_sinh_vien(p_token text) to authenticated;

grant execute on function public.ket_qua_cua_sinh_vien(p_token text) to service_role;

grant execute on function public.lay_ho_so(p_token text) to anon;

grant execute on function public.lay_ho_so(p_token text) to authenticated;

grant execute on function public.lay_ho_so(p_token text) to service_role;

grant execute on function public.lich_su_thao_tac(p_token text) to anon;

grant execute on function public.lich_su_thao_tac(p_token text) to authenticated;

grant execute on function public.lich_su_thao_tac(p_token text) to service_role;

grant execute on function public.lop_dang_mo(p_token text) to anon;

grant execute on function public.lop_dang_mo(p_token text) to authenticated;

grant execute on function public.lop_dang_mo(p_token text) to service_role;

grant execute on function public.luu_ctdt(p_token text, p_du_lieu jsonb) to anon;

grant execute on function public.luu_ctdt(p_token text, p_du_lieu jsonb) to authenticated;

grant execute on function public.luu_ctdt(p_token text, p_du_lieu jsonb) to service_role;

grant execute on function public.luu_dot(p_token text, p_du_lieu jsonb) to anon;

grant execute on function public.luu_dot(p_token text, p_du_lieu jsonb) to authenticated;

grant execute on function public.luu_dot(p_token text, p_du_lieu jsonb) to service_role;

grant execute on function public.luu_hoc_phan(p_token text, p_du_lieu jsonb) to anon;

grant execute on function public.luu_hoc_phan(p_token text, p_du_lieu jsonb) to authenticated;

grant execute on function public.luu_hoc_phan(p_token text, p_du_lieu jsonb) to service_role;

grant execute on function public.luu_ket_qua(p_token text, p_du_lieu jsonb) to anon;

grant execute on function public.luu_ket_qua(p_token text, p_du_lieu jsonb) to authenticated;

grant execute on function public.luu_ket_qua(p_token text, p_du_lieu jsonb) to service_role;

grant execute on function public.luu_khoa(p_token text, p_du_lieu jsonb) to anon;

grant execute on function public.luu_khoa(p_token text, p_du_lieu jsonb) to authenticated;

grant execute on function public.luu_khoa(p_token text, p_du_lieu jsonb) to service_role;

grant execute on function public.luu_lop(p_token text, p_du_lieu jsonb) to anon;

grant execute on function public.luu_lop(p_token text, p_du_lieu jsonb) to authenticated;

grant execute on function public.luu_lop(p_token text, p_du_lieu jsonb) to service_role;

grant execute on function public.luu_nhom(p_token text, p_du_lieu jsonb) to anon;

grant execute on function public.luu_nhom(p_token text, p_du_lieu jsonb) to authenticated;

grant execute on function public.luu_nhom(p_token text, p_du_lieu jsonb) to service_role;

grant execute on function public.luu_sinh_vien(p_token text, p_du_lieu jsonb) to anon;

grant execute on function public.luu_sinh_vien(p_token text, p_du_lieu jsonb) to authenticated;

grant execute on function public.luu_sinh_vien(p_token text, p_du_lieu jsonb) to service_role;

grant execute on function public.luu_tai_khoan(p_token text, p_du_lieu jsonb) to anon;

grant execute on function public.luu_tai_khoan(p_token text, p_du_lieu jsonb) to authenticated;

grant execute on function public.luu_tai_khoan(p_token text, p_du_lieu jsonb) to service_role;

grant execute on function public.nhap_lop(p_token text, p_ten_file text, p_dong jsonb) to anon;

grant execute on function public.nhap_lop(p_token text, p_ten_file text, p_dong jsonb) to authenticated;

grant execute on function public.nhap_lop(p_token text, p_ten_file text, p_dong jsonb) to service_role;

grant execute on function public.roi_danh_sach_cho(p_token text, p_ma_lop text) to anon;

grant execute on function public.roi_danh_sach_cho(p_token text, p_ma_lop text) to authenticated;

grant execute on function public.roi_danh_sach_cho(p_token text, p_ma_lop text) to service_role;

grant execute on function public.thoi_khoa_bieu(p_token text) to anon;

grant execute on function public.thoi_khoa_bieu(p_token text) to authenticated;

grant execute on function public.thoi_khoa_bieu(p_token text) to service_role;

grant execute on function public.thoi_khoa_bieu_du_kien(p_token text) to anon;

grant execute on function public.thoi_khoa_bieu_du_kien(p_token text) to authenticated;

grant execute on function public.thoi_khoa_bieu_du_kien(p_token text) to service_role;

grant execute on function public.thong_ke(p_token text) to anon;

grant execute on function public.thong_ke(p_token text) to authenticated;

grant execute on function public.thong_ke(p_token text) to service_role;

grant execute on function public.thong_ke_ghi_danh(p_token text) to anon;

grant execute on function public.thong_ke_ghi_danh(p_token text) to authenticated;

grant execute on function public.thong_ke_ghi_danh(p_token text) to service_role;

grant execute on function public.vao_danh_sach_cho(p_token text, p_ma_lop text) to anon;

grant execute on function public.vao_danh_sach_cho(p_token text, p_ma_lop text) to authenticated;

grant execute on function public.vao_danh_sach_cho(p_token text, p_ma_lop text) to service_role;

grant execute on function public.xac_nhan_cho(p_token text, p_ma_lop text) to anon;

grant execute on function public.xac_nhan_cho(p_token text, p_ma_lop text) to authenticated;

grant execute on function public.xac_nhan_cho(p_token text, p_ma_lop text) to service_role;

grant execute on function public.xac_thuc_token(p_token text) to service_role;

grant execute on function public.xoa_hoc_phan(p_token text, p_ma_hp text) to anon;

grant execute on function public.xoa_hoc_phan(p_token text, p_ma_hp text) to authenticated;

grant execute on function public.xoa_hoc_phan(p_token text, p_ma_hp text) to service_role;

grant execute on function public.xoa_khoa(p_token text, p_ma_khoa text) to anon;

grant execute on function public.xoa_khoa(p_token text, p_ma_khoa text) to authenticated;

grant execute on function public.xoa_khoa(p_token text, p_ma_khoa text) to service_role;

grant execute on function public.xoa_nhom(p_token text, p_ma_nhom text) to anon;

grant execute on function public.xoa_nhom(p_token text, p_ma_nhom text) to authenticated;

grant execute on function public.xoa_nhom(p_token text, p_ma_nhom text) to service_role;

grant execute on function public.xu_ly_sau_dot(p_token text, p_ma_dot text) to anon;

grant execute on function public.xu_ly_sau_dot(p_token text, p_ma_dot text) to authenticated;

grant execute on function public.xu_ly_sau_dot(p_token text, p_ma_dot text) to service_role;
