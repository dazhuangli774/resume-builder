import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useMemo } from "react";
import { LayoutTemplate, Briefcase, GraduationCap, FileText, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import TemplateThumbnail from "@/components/TemplateThumbnail";

interface Template {
  id: number;
  name: string;
  category: string;
  purpose: "job" | "academic" | "universal";
  style: string;
}

const MOCK_TEMPLATES: Template[] = [
  { id: 1, name: "极简白", category: "简约", purpose: "universal", style: "minimal" },
  { id: 2, name: "学术保研专用", category: "商务", purpose: "academic", style: "academic" },
  { id: 3, name: "创意设计师", category: "创意", purpose: "job", style: "creative" },
  { id: 4, name: "全栈工程师", category: "科技", purpose: "job", style: "tech" },
  { id: 5, name: "清新应届生", category: "简约", purpose: "job", style: "fresh" },
  { id: 6, name: "通用万能模板", category: "通用", purpose: "universal", style: "minimal" },
  { id: 7, name: "深蓝科技风", category: "科技", purpose: "job", style: "tech" },
  { id: 8, name: "优雅学术风", category: "商务", purpose: "academic", style: "elegant" },
  { id: 9, name: "黑金商务", category: "商务", purpose: "job", style: "professional" },
  { id: 10, name: "薄荷绿清新", category: "简约", purpose: "job", style: "fresh" },
  { id: 11, name: "暖橙创意", category: "创意", purpose: "job", style: "creative" },
  { id: 12, name: "紫罗兰科技", category: "科技", purpose: "job", style: "creative" },
  { id: 13, name: "素雅国风", category: "通用", purpose: "universal", style: "elegant" },
  { id: 14, name: "红蓝撞色", category: "创意", purpose: "job", style: "creative" },
  { id: 15, name: "灰度极简", category: "简约", purpose: "universal", style: "minimal" },
  { id: 16, name: "暖黄温馨", category: "通用", purpose: "universal", style: "elegant" },
  { id: 17, name: "墨绿沉稳", category: "商务", purpose: "job", style: "professional" },
  { id: 18, name: "樱花粉", category: "创意", purpose: "job", style: "creative" },
  { id: 19, name: "靛青学术", category: "商务", purpose: "academic", style: "academic" },
  { id: 20, name: "暗夜极客", category: "科技", purpose: "job", style: "tech" },
  { id: 21, name: "珍珠白", category: "简约", purpose: "universal", style: "minimal" },
  { id: 22, name: "冰川蓝", category: "简约", purpose: "job", style: "fresh" },
  { id: 23, name: "赤焰红", category: "创意", purpose: "job", style: "creative" },
  { id: 24, name: "冰蓝科技", category: "科技", purpose: "job", style: "tech" },
  { id: 25, name: "柠檬黄", category: "创意", purpose: "job", style: "creative" },
  { id: 26, name: "经典蓝白", category: "商务", purpose: "job", style: "professional" },
  { id: 27, name: "玫瑰金", category: "创意", purpose: "job", style: "elegant" },
  { id: 28, name: "天空蓝", category: "简约", purpose: "job", style: "fresh" },
  { id: 29, name: "深海蓝", category: "科技", purpose: "job", style: "tech" },
  { id: 30, name: "焦糖奶油", category: "通用", purpose: "universal", style: "elegant" },
  { id: 31, name: "青柠绿", category: "简约", purpose: "job", style: "fresh" },
  { id: 32, name: "云朵白", category: "简约", purpose: "universal", style: "minimal" },
  { id: 33, name: "砂岩褐", category: "通用", purpose: "universal", style: "elegant" },
  { id: 34, name: "暗红", category: "创意", purpose: "job", style: "creative" },
  { id: 35, name: "墨蓝", category: "商务", purpose: "job", style: "professional" },
  { id: 36, name: "珊瑚橙", category: "创意", purpose: "job", style: "creative" },
  { id: 37, name: "电光紫", category: "科技", purpose: "job", style: "creative" },
  { id: 38, name: "薰衣草", category: "创意", purpose: "job", style: "creative" },
  { id: 39, name: "霓虹粉", category: "创意", purpose: "job", style: "creative" },
  { id: 40, name: "裸粉", category: "创意", purpose: "job", style: "creative" },
  { id: 41, name: "象牙白", category: "简约", purpose: "universal", style: "minimal" },
  { id: 42, name: "米白", category: "简约", purpose: "universal", style: "minimal" },
  { id: 43, name: "石墨灰", category: "简约", purpose: "job", style: "minimal" },
  { id: 44, name: "银月灰", category: "简约", purpose: "job", style: "minimal" },
  { id: 45, name: "钛金灰", category: "简约", purpose: "job", style: "minimal" },
  { id: 46, name: "冰蓝", category: "简约", purpose: "job", style: "fresh" },
  { id: 47, name: "湖蓝", category: "简约", purpose: "job", style: "fresh" },
  { id: 48, name: "雾蓝", category: "简约", purpose: "job", style: "fresh" },
  { id: 49, name: "天青", category: "简约", purpose: "job", style: "fresh" },
  { id: 50, name: "翡翠绿", category: "商务", purpose: "job", style: "professional" },
  { id: 51, name: "松石绿", category: "商务", purpose: "job", style: "professional" },
  { id: 52, name: "青瓷绿", category: "商务", purpose: "job", style: "professional" },
  { id: 53, name: "草绿", category: "简约", purpose: "job", style: "fresh" },
  { id: 54, name: "麦浪金", category: "通用", purpose: "universal", style: "elegant" },
  { id: 55, name: "姜黄", category: "通用", purpose: "universal", style: "elegant" },
  { id: 56, name: "荧光", category: "创意", purpose: "job", style: "creative" },
  { id: 57, name: "栗棕", category: "通用", purpose: "universal", style: "elegant" },
  { id: 58, name: "海军蓝", category: "商务", purpose: "job", style: "professional" },
  { id: 59, name: "藏青", category: "商务", purpose: "job", style: "professional" },
  { id: 60, name: "钴蓝", category: "商务", purpose: "job", style: "professional" },
  { id: 61, name: "砖红", category: "创意", purpose: "job", style: "creative" },
  { id: 62, name: "铁锈红", category: "创意", purpose: "job", style: "creative" },
  { id: 63, name: "绛红", category: "创意", purpose: "job", style: "creative" },
  { id: 64, name: "橘红", category: "创意", purpose: "job", style: "creative" },
  { id: 65, name: "酒红", category: "创意", purpose: "job", style: "creative" },
  { id: 66, name: "曜石黑", category: "科技", purpose: "job", style: "tech" },
  { id: 67, name: "星际黑", category: "科技", purpose: "job", style: "tech" },
  { id: 68, name: "炭黑", category: "科技", purpose: "job", style: "tech" },
  { id: 69, name: "玄黑", category: "科技", purpose: "job", style: "tech" },
  { id: 70, name: "豆沙", category: "创意", purpose: "job", style: "creative" },
  { id: 71, name: "杏花粉", category: "创意", purpose: "job", style: "creative" },
  { id: 72, name: "黛紫", category: "科技", purpose: "job", style: "creative" },
  { id: 73, name: "藕荷", category: "创意", purpose: "job", style: "creative" },
  { id: 74, name: "森林绿", category: "简约", purpose: "job", style: "fresh" },
  { id: 75, name: "银灰", category: "简约", purpose: "job", style: "minimal" },
  { id: 76, name: "冰川白", category: "简约", purpose: "universal", style: "minimal" },
  { id: 77, name: "荧光绿", category: "创意", purpose: "job", style: "creative" },
  { id: 78, name: "赛博朋克", category: "科技", purpose: "job", style: "tech" },
  { id: 79, name: "元宇宙", category: "科技", purpose: "job", style: "tech" },
  { id: 80, name: "AI风", category: "科技", purpose: "job", style: "tech" },
];

const PAGE_SIZE = 12;

export default function Templates() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "job" | "academic" | "universal">("all");
  const [activeCategory, setActiveCategory] = useState("全部");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch("/api/templates");
        if (!res.ok) throw new Error("后端未响应");
        const data = await res.json();
        setTemplates(data);
      } catch {
        setTemplates(MOCK_TEMPLATES);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchTemplates();
  }, [user]);

  /* 筛选 */
  const filtered = useMemo(() => {
    return templates.filter((t) => {
      if (activeFilter !== "all" && t.purpose !== activeFilter) return false;
      if (activeCategory !== "全部" && t.category !== activeCategory) return false;
      return true;
    });
  }, [templates, activeFilter, activeCategory]);

  /* 分页 */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageTemplates = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  /* 切换筛选时重置页码 */
  const handleFilterChange = (filter: typeof activeFilter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  /* 页码数组 */
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  const categories = ["全部", "简约", "商务", "创意", "科技", "通用"];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <p className="text-xs font-bold text-blue-600 tracking-[0.2em] uppercase mb-2">Templates</p>
          <h1 className="text-3xl font-bold text-slate-800 mb-3">模板中心</h1>
          <p className="text-sm text-slate-500 max-w-lg">
            80 款精心设计的模板，覆盖求职、升学、通用场景。
            <span className="text-blue-600 font-medium">全部免费使用</span>，选择适合你的风格快速创建专业简历。
          </p>
        </div>

        <div className="flex gap-6 mb-6 text-sm text-slate-600">
          <span><strong className="text-slate-800">{templates.length}</strong> 模板</span>
          <span><strong className="text-slate-800">7</strong> 大风格</span>
          <span><strong className="text-slate-800">3</strong> 种场景</span>
          <span className="text-blue-600 font-medium">100% 免费</span>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { key: "all", label: "全部", icon: FileText },
            { key: "job", label: "求职", icon: Briefcase },
            { key: "academic", label: "升学", icon: GraduationCap },
            { key: "universal", label: "通用", icon: LayoutTemplate },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => handleFilterChange(f.key as typeof activeFilter)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === f.key
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <f.icon className="w-4 h-4" /> {f.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                activeCategory === cat
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-500 border border-slate-200 hover:text-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 分页信息 */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-sm text-slate-400">
            共 <span className="font-semibold text-slate-600">{filtered.length}</span> 款
            {activeCategory !== "全部" && <span> · 分类「<span className="text-blue-600 font-medium">{activeCategory}</span>」</span>}
            {activeFilter !== "all" && <span> · 场景「<span className="text-blue-600 font-medium">
              {activeFilter === "job" ? "求职" : activeFilter === "academic" ? "升学" : "通用"}
            </span>」</span>}
          </p>
          <p className="text-sm text-slate-400">
            第 <span className="font-semibold text-slate-600">{currentPage}</span> / {totalPages || 1} 页
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {pageTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => navigate(`/editor?template=${template.id}`)}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all"
                >
                  <div className="h-40 relative">
                    <TemplateThumbnail 
                      name={template.name} 
                      style={template.style} 
                      className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-all flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform translate-y-2 group-hover:translate-y-0">
                        使用此模板
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-slate-800 mb-1">{template.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded">{template.category}</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded">{template.style}</span>
                      {template.purpose === "academic" && (
                        <span className="px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded">升学</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 分页导航 */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {pageNumbers.map((page, idx) => (
                    <button
                      key={idx}
                      onClick={() => typeof page === 'number' && setCurrentPage(page)}
                      disabled={page === '...'}
                      className={`min-w-[40px] h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                        page === currentPage
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                          : page === '...'
                          ? 'text-slate-400 cursor-default'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">跳转到</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    placeholder="页码"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = parseInt((e.target as HTMLInputElement).value);
                        if (val >= 1 && val <= totalPages) setCurrentPage(val);
                      }
                    }}
                    className="w-14 px-2 py-1.5 rounded-lg text-sm text-center bg-white border border-slate-200 focus:border-blue-400 focus:outline-none transition-colors"
                  />
                  <span className="text-xs text-slate-400">页</span>
                </div>
              </div>
            )}
          </>
        )}

        {filtered.length === 0 && !loading && (
          <div className="text-center py-16 text-slate-500">
            <LayoutTemplate className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>没有符合条件的模板</p>
          </div>
        )}
      </div>
    </div>
  );
}