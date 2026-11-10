import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { FileText, Plus, Briefcase, GraduationCap, ArrowRight, Loader2 } from "lucide-react";

interface Resume {
  id: number;
  title: string;
  purpose: string;
  templateId: number;
  updatedAt: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    try {
      const saved = JSON.parse(localStorage.getItem("mock_resumes") || "[]");
      saved.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setResumes(saved.map((r: any) => ({
        id: r.id,
        title: r.title || "未命名简历",
        purpose: r.purpose || "job",
        templateId: r.templateId || 1,
        updatedAt: r.updatedAt || new Date().toISOString(),
      })));
    } catch {
      setResumes([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">请先登录</h1>
            <p className="text-slate-500 mb-6">登录后查看你的个人仪表盘</p>
            <button onClick={() => navigate("/login")} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
              去登录
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalResumes = resumes.length;
  const jobResumes = resumes.filter(r => r.purpose === "job").length;
  const academicResumes = resumes.filter(r => r.purpose === "academic").length;
  const recentResumes = resumes.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            欢迎回来，{user.name || user.username || "用户"}
          </h1>
          <p className="text-slate-500 text-sm">这里是你的简历管理中心，快速查看和管理所有简历</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-slate-800">{totalResumes}</span>
            </div>
            <p className="text-sm text-slate-500">简历总数</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-slate-800">{jobResumes}</span>
            </div>
            <p className="text-sm text-slate-500">求职简历</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-violet-600" />
              </div>
              <span className="text-2xl font-bold text-slate-800">{academicResumes}</span>
            </div>
            <p className="text-sm text-slate-500">升学简历</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            快捷操作
          </h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate("/templates")} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
              <Plus className="w-4 h-4" /> 创建新简历
            </button>
            <button onClick={() => navigate("/my-resumes")} className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-all">
              <FileText className="w-4 h-4" /> 查看我的简历
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-blue-600" />
            最近编辑
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : recentResumes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm mb-4">还没有创建过简历</p>
              <button onClick={() => navigate("/templates")} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
                去创建第一份简历
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentResumes.map((resume) => (
                <div key={resume.id} onClick={() => navigate(`/editor?resume=${resume.id}`)}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-all group">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${resume.purpose === "academic" ? "bg-violet-50" : "bg-emerald-50"}`}>
                      {resume.purpose === "academic" ? <GraduationCap className="w-5 h-5 text-violet-600" /> : <Briefcase className="w-5 h-5 text-emerald-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{resume.title}</p>
                      <p className="text-xs text-slate-500">
                        {resume.purpose === "academic" ? "升学简历" : "求职简历"} · {new Date(resume.updatedAt).toLocaleDateString("zh-CN")}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}