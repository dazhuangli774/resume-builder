import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  Shield,
  UserCheck,
  UserX,
  Loader2,
  Crown,
  Trash2,
} from "lucide-react";

interface UserItem {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  status: number;
  createdAt: string;
}

export default function AdminUsers() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  const fetchUsers = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/admin/users", {
        params: {
          page,
          pageSize,
          keyword: debouncedKeyword || undefined,
        },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setUsers(res.data.list || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("获取用户列表失败", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedKeyword, isAdmin]);

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除该用户吗？此操作不可恢复")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/admin/users/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchUsers();
    } catch (err) {
      alert("删除失败");
    }
  };

  const handleToggleStatus = async (id: number, current: number) => {
    const next = current === 1 ? 0 : 1;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/admin/users/${id}/status`,
        { status: next },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      fetchUsers();
    } catch (err) {
      alert("操作失败");
    }
  };

  const stats = [
    {
      label: "用户总数",
      value: total,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "管理员",
      value: users.filter((u) => u.role === "admin").length,
      icon: Shield,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "正常用户",
      value: users.filter((u) => u.status === 1).length,
      icon: UserCheck,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "已禁用",
      value: users.filter((u) => u.status === 0).length,
      icon: UserX,
      color: "bg-red-50 text-red-600",
    },
  ];

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Link to="/" className="text-sm text-slate-400 hover:text-slate-600">
                首页
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-sm text-slate-600">用户管理</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs tracking-[0.3em] uppercase text-blue-600 font-semibold">
                  后台管理系统
                </span>
                <h1 className="font-display text-3xl md:text-4xl font-light text-slate-800 mt-1">
                  用户列表
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  基于 Spring Boot + MyBatis + PageHelper 分页查询
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Crown className="w-4 h-4 text-amber-500" />
                管理员：{user?.username}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}
                  >
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-light text-slate-800">
                      {s.value}
                    </div>
                    <div className="text-xs text-slate-400">{s.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索用户名或邮箱..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 transition-all"
              />
            </div>
            {keyword && (
              <button
                onClick={() => setKeyword("")}
                className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                清除
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        用户名
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        姓名
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        邮箱
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        角色
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-12 text-slate-400"
                        >
                          暂无数据
                        </td>
                      </tr>
                    ) : (
                      users.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-blue-50/30 transition-colors group"
                        >
                          <td className="px-4 py-3 text-sm text-slate-400">
                            #{row.id}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-800">
                            {row.username}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {row.name || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {row.email || "-"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full border ${
                                row.role === "admin"
                                  ? "bg-amber-50 text-amber-600 border-amber-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              {row.role === "admin" ? "管理员" : "普通用户"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs ${
                                row.status === 1
                                  ? "text-emerald-600"
                                  : "text-red-500"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  row.status === 1
                                    ? "bg-emerald-500"
                                    : "bg-red-500"
                                }`}
                              />
                              {row.status === 1 ? "正常" : "已禁用"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  handleToggleStatus(row.id, row.status)
                                }
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                title={row.status === 1 ? "禁用" : "启用"}
                              >
                                {row.status === 1 ? (
                                  <UserX className="w-3.5 h-3.5" />
                                ) : (
                                  <UserCheck className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDelete(row.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                title="删除"
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

                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400">
                    共 {total} 条 · 第 {page}/{totalPages} 页
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from(
                      { length: Math.min(5, totalPages) },
                      (_, i) => {
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
                      }
                    )}
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
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
    </div>
  );
}