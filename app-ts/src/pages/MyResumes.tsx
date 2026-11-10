import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { FileText, Plus, Briefcase, GraduationCap, ArrowRight, Loader2, Trash2, Edit3 } from "lucide-react";

interface Resume {
  id: number;
  title: string;
  purpose: string;
  templateId: number;
  updatedAt: string;
}

export default function MyResumes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // 从 localStorage 读取本地保存的简历
    try {
      const mockResumes = JSON.parse(localStorage.getItem("mock_resumes") || "[]");
      // 按更新时间倒序
      mockResumes.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setResumes(mockResumes.map((r: any) => ({
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
  }, [user, navigate]);

  const handleDelete = (id: number) => {
    if (!confirm("确定要删除这份简历吗？")) return;
    const saved = JSON.parse(localStorage.getItem("mock_resumes") || "[]");
    const filtered = saved.filter((r: any) => r.id !== id);
    localStorage.setItem("mock_resumes", JSON.stringify(filtered));
    setResumes(filtered.map((r: any) => ({
      id: r.id,
      title: r.title || "未命名简历",
      purpose: r.purpose || "job",
      templateId: r.templateId || 1,
      updatedAt: r.updatedAt || new Date().toISOString(),
    })));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-blue-600 tracking-[0.2em] uppercase mb-2">My Resumes</p>
            <h1 className="text-3xl font-bold text-slate-800">我的简历</h1>
          </div>
          <button 
            onClick={() => navigate("/templates")}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
          >
            <Plus className="w-4 h-4" /> 新建简历
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">还没有简历</h3>
            <p className="text-sm text-slate-500 mb-6">选择模板开始创建你的第一份简历</p>
            <button 
              onClick={() => navigate("/templates")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
            >
              <Plus className="w-4 h-4" /> 立即创建
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumes.map((resume) => (
              <div 
                key={resume.id} 
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    resume.purpose === "academic" ? "bg-violet-50" : "bg-emerald-50"
                  }`}>
                    {resume.purpose === "academic" ? (
                      <GraduationCap className="w-5 h-5 text-violet-600" />
                    ) : (
                      <Briefcase className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/editor?resume=${resume.id}`); }}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                      title="编辑"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(resume.id); }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-medium text-slate-800 mb-1">{resume.title}</h3>
                <p className="text-xs text-slate-500 mb-4">
                  {resume.purpose === "academic" ? "升学简历" : resume.purpose === "job" ? "求职简历" : "通用简历"}
                  · {new Date(resume.updatedAt).toLocaleDateString("zh-CN")}
                </p>

                <button 
                  onClick={() => navigate(`/editor?resume=${resume.id}`)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  继续编辑 <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}