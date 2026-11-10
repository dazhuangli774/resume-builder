import { useState, useEffect } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Navbar from "@/components/Navbar";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  BookOpen,
  Sparkles,
  Crown,
  Loader2,
} from "lucide-react";

interface PeotForm {
  id?: number;
  name: string;
  gender: "男" | "女";
  dynasty: string;
  title: string;
  style: string;
}

const emptyForm: PeotForm = {
  name: "",
  gender: "男",
  dynasty: "",
  title: "",
  style: "",
};

export default function PeotManager() {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [dynasty, setDynasty] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<PeotForm>(emptyForm);
  const [isEdit, setIsEdit] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  const pageSize = 8;

  const { data: listData, isLoading } = trpc.peot.list.useQuery({
    page,
    pageSize,
    keyword: debouncedKeyword || undefined,
    dynasty: dynasty || undefined,
  });

  const { data: dynasties } = trpc.peot.dynasties.useQuery();

  const utils = trpc.useUtils();
  const createMutation = trpc.peot.create.useMutation({
    onSuccess: () => { utils.peot.list.invalidate(); setShowModal(false); setForm(emptyForm); },
  });
  const updateMutation = trpc.peot.update.useMutation({
    onSuccess: () => { utils.peot.list.invalidate(); setShowModal(false); setForm(emptyForm); },
  });
  const deleteMutation = trpc.peot.delete.useMutation({
    onSuccess: () => utils.peot.list.invalidate(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.dynasty.trim()) {
      alert("姓名和朝代为必填项");
      return;
    }
    if (isEdit && form.id) {
      updateMutation.mutate({
        id: form.id,
        name: form.name,
        gender: form.gender,
        dynasty: form.dynasty,
        title: form.title || undefined,
        style: form.style || undefined,
      });
    } else {
      createMutation.mutate({
        name: form.name,
        gender: form.gender,
        dynasty: form.dynasty,
        title: form.title || undefined,
        style: form.style || undefined,
      });
    }
  };

  const handleEdit = (row: PeotForm) => {
    setForm(row);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("确定要删除这位诗人吗？")) {
      deleteMutation.mutate({ id });
    }
  };

  const totalCount = listData?.total ?? 0;
  const totalPages = listData?.totalPages ?? 1;
  const currentData = listData?.data ?? [];

  const stats = [
    { label: "诗人总数", value: totalCount, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "朝代覆盖", value: dynasties?.length ?? 0, icon: BookOpen, color: "bg-green-50 text-green-600" },
    { label: "女诗人", value: "--", icon: Sparkles, color: "bg-pink-50 text-pink-600" },
    { label: "唐朝诗人", value: "--", icon: Crown, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Link to="/" className="text-sm text-slate-400 hover:text-slate-600">首页</Link>
              <span className="text-slate-300">/</span>
              <span className="text-sm text-slate-600">诗人管理</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs tracking-[0.3em] uppercase text-blue-600 font-semibold">诗人信息管理</span>
                <h1 className="font-display text-3xl md:text-4xl font-light text-slate-800 mt-1">
                  诗人列表
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  基于 Spring Boot + MyBatis 三层架构 · Restful API · 分页查询
                </p>
              </div>
              <button
                onClick={() => { setForm(emptyForm); setIsEdit(false); setShowModal(true); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-600/15"
              >
                <Plus className="w-4 h-4" />新增诗人
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-light text-slate-800">{s.value}</div>
                    <div className="text-xs text-slate-400">{s.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search and filter bar */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                placeholder="搜索诗人姓名..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 transition-all"
              />
            </div>
            <select
              value={dynasty}
              onChange={(e) => { setDynasty(e.target.value); setPage(1); }}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-400 transition-all"
            >
              <option value="">全部朝代</option>
              {dynasties?.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {(keyword || dynasty) && (
              <button
                onClick={() => { setKeyword(""); setDynasty(""); setPage(1); }}
                className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />清除
              </button>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">姓名</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">性别</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">朝代</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">称号</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">风格</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {currentData.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400">
                          暂无数据
                        </td>
                      </tr>
                    ) : (
                      currentData.map((row) => (
                        <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-4 py-3 text-sm text-slate-400">{row.id}</td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-800">{row.name}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              row.gender === "女"
                                ? "bg-pink-50 text-pink-600"
                                : "bg-blue-50 text-blue-600"
                            }`}>
                              {row.gender}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-xs">{row.dynasty}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{row.title || "-"}</td>
                          <td className="px-4 py-3 text-sm text-slate-500 max-w-[200px] truncate">{row.style || "-"}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(row as PeotForm)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(row.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400">
                    共 {totalCount} 条 · 第 {page}/{totalPages} 页
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                            page === pageNum
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-medium text-slate-800">
                {isEdit ? "编辑诗人" : "新增诗人"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">姓名 <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-400 transition-all"
                  placeholder="请输入诗人姓名"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">性别</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as "男" | "女" }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-400 transition-all"
                  >
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">朝代 <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={form.dynasty}
                    onChange={(e) => setForm((f) => ({ ...f, dynasty: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-400 transition-all"
                    placeholder="如：唐"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">称号</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-400 transition-all"
                  placeholder="如：诗仙"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">风格</label>
                <textarea
                  value={form.style}
                  onChange={(e) => setForm((f) => ({ ...f, style: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-400 resize-none transition-all"
                  placeholder="如：浪漫主义，豪放飘逸"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "保存中..."
                    : isEdit
                    ? "保存修改"
                    : "确认添加"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
