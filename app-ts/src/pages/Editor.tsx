import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Wand2, FileText, Download, Save, Sparkles, Loader2, ChevronLeft, Eye, EyeOff, Send, Copy, CheckCircle, Bot, LayoutTemplate, Type } from "lucide-react";

interface ResumeData {
  name: string; email: string; phone: string; targetPosition: string; targetLocation: string;
  expectedSalary: string; skills: string; education: string; experience: string;
  projects: string; selfIntro: string; gpa: string; research: string;
  publications: string; targetMajor: string; applyType: string;
}
const defaultData: ResumeData = {
  name: "", email: "", phone: "", targetPosition: "", targetLocation: "",
  expectedSalary: "", skills: "", education: "", experience: "", projects: "",
  selfIntro: "", gpa: "", research: "", publications: "", targetMajor: "", applyType: "硕士",
};

/* ============ 模板配置（含布局） ============ */
const TEMPLATES: Record<number, { name: string; primary: string; accent: string; sectionBg: string; font: string; layout: string; bg: string; sidebar: string; line: string; dot: string }> = {
  1: { name: "极简白", primary: "#1e293b", accent: "#2563eb", sectionBg: "#f8fafc", font: "'Noto Sans SC', sans-serif", layout: "single", bg: "bg-white", sidebar: "bg-slate-200", line: "bg-slate-100", dot: "bg-slate-400" },
  2: { name: "学术保研专用", primary: "#1e3a5f", accent: "#1e40af", sectionBg: "#eff6ff", font: "'Noto Sans SC', serif", layout: "academic", bg: "bg-white", sidebar: "bg-blue-800", line: "bg-blue-100", dot: "bg-blue-400" },
  3: { name: "创意设计师", primary: "#7c3aed", accent: "#a855f7", sectionBg: "#faf5ff", font: "'Noto Sans SC', sans-serif", layout: "double", bg: "bg-gradient-to-br from-purple-50 to-pink-50", sidebar: "bg-purple-500", line: "bg-purple-100", dot: "bg-purple-400" },
  4: { name: "全栈工程师", primary: "#0f172a", accent: "#06b6d4", sectionBg: "#ecfeff", font: "'Noto Sans SC', monospace", layout: "tech", bg: "bg-slate-900", sidebar: "bg-slate-800", line: "bg-slate-700", dot: "bg-emerald-400" },
  5: { name: "清新应届生", primary: "#15803d", accent: "#22c55e", sectionBg: "#f0fdf4", font: "'Noto Sans SC', sans-serif", layout: "center", bg: "bg-gradient-to-br from-green-50 to-cyan-50", sidebar: "bg-green-500", line: "bg-green-100", dot: "bg-green-400" },
  6: { name: "通用万能模板", primary: "#374151", accent: "#4b5563", sectionBg: "#f9fafb", font: "'Noto Sans SC', sans-serif", layout: "single", bg: "bg-white", sidebar: "bg-slate-200", line: "bg-slate-100", dot: "bg-slate-400" },
  7: { name: "深蓝科技风", primary: "#1e3a5f", accent: "#0ea5e9", sectionBg: "#f0f9ff", font: "'Noto Sans SC', sans-serif", layout: "sidebar", bg: "bg-blue-50", sidebar: "bg-blue-900", line: "bg-blue-100", dot: "bg-blue-400" },
  8: { name: "优雅学术风", primary: "#451a03", accent: "#92400e", sectionBg: "#fffbeb", font: "'Noto Serif SC', serif", layout: "double", bg: "bg-gradient-to-b from-amber-50 to-white", sidebar: "bg-amber-900", line: "bg-amber-100", dot: "bg-amber-400" },
  9: { name: "黑金商务", primary: "#1a1a1a", accent: "#d4af37", sectionBg: "#fafaf9", font: "'Noto Sans SC', sans-serif", layout: "sidebar", bg: "bg-white", sidebar: "bg-neutral-900", line: "bg-amber-100", dot: "bg-amber-300" },
  10: { name: "薄荷绿清新", primary: "#134e4a", accent: "#14b8a6", sectionBg: "#f0fdfa", font: "'Noto Sans SC', sans-serif", layout: "center", bg: "bg-green-50", sidebar: "bg-emerald-500", line: "bg-emerald-100", dot: "bg-emerald-400" },
  11: { name: "暖橙创意", primary: "#7c2d12", accent: "#f97316", sectionBg: "#fff7ed", font: "'Noto Sans SC', sans-serif", layout: "double", bg: "bg-orange-50", sidebar: "bg-orange-500", line: "bg-orange-100", dot: "bg-orange-400" },
  12: { name: "紫罗兰科技", primary: "#581c87", accent: "#a855f7", sectionBg: "#faf5ff", font: "'Noto Sans SC', sans-serif", layout: "double", bg: "bg-purple-50", sidebar: "bg-purple-600", line: "bg-purple-100", dot: "bg-purple-400" },
  13: { name: "素雅国风", primary: "#3f3f46", accent: "#b45309", sectionBg: "#fefce8", font: "'Noto Serif SC', serif", layout: "single", bg: "bg-stone-50", sidebar: "bg-stone-700", line: "bg-stone-200", dot: "bg-amber-400" },
  14: { name: "红蓝撞色", primary: "#1e3a8a", accent: "#dc2626", sectionBg: "#eff6ff", font: "'Noto Sans SC', sans-serif", layout: "double", bg: "bg-gradient-to-r from-red-50 to-blue-50", sidebar: "bg-red-600", line: "bg-red-100", dot: "bg-blue-400" },
  15: { name: "灰度极简", primary: "#171717", accent: "#525252", sectionBg: "#fafafa", font: "'Noto Sans SC', sans-serif", layout: "single", bg: "bg-gray-50", sidebar: "bg-gray-600", line: "bg-gray-200", dot: "bg-gray-400" },
  16: { name: "暖黄温馨", primary: "#713f12", accent: "#eab308", sectionBg: "#fefce8", font: "'Noto Sans SC', sans-serif", layout: "center", bg: "bg-amber-50", sidebar: "bg-amber-500", line: "bg-amber-100", dot: "bg-amber-400" },
  17: { name: "墨绿沉稳", primary: "#064e3b", accent: "#059669", sectionBg: "#ecfdf5", font: "'Noto Sans SC', sans-serif", layout: "sidebar", bg: "bg-emerald-50", sidebar: "bg-emerald-800", line: "bg-emerald-100", dot: "bg-emerald-400" },
  18: { name: "樱花粉", primary: "#831843", accent: "#ec4899", sectionBg: "#fdf2f8", font: "'Noto Sans SC', sans-serif", layout: "center", bg: "bg-pink-50", sidebar: "bg-pink-400", line: "bg-pink-100", dot: "bg-pink-400" },
  19: { name: "靛青学术", primary: "#312e81", accent: "#6366f1", sectionBg: "#eef2ff", font: "'Noto Serif SC', serif", layout: "academic", bg: "bg-white", sidebar: "bg-blue-800", line: "bg-blue-100", dot: "bg-blue-400" },
  20: { name: "暗夜极客", primary: "#0f172a", accent: "#8b5cf6", sectionBg: "#f8fafc", font: "'Noto Sans SC', monospace", layout: "tech", bg: "bg-neutral-900", sidebar: "bg-neutral-800", line: "bg-neutral-700", dot: "bg-lime-400" },
};

function getTemplate(id: number) {
  return TEMPLATES[id] || TEMPLATES[1];
}

/* ============ AI 侧边栏 ============ */
function AISidebar({ data, purpose }: { data: ResumeData; purpose: string }) {
  const [mode, setMode] = useState<"polish" | "cover" | "keywords">("polish");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [polishLoading, setPolishLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);

  const handleAction = async () => {
    if (mode === "polish") {
      if (!input.trim()) return;
      setResult(""); setPolishLoading(true);

      try {
        const resp = await fetch("/api/ai/polish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: input.trim() }),
        });

        if (!resp.ok) {
          const err = await resp.json();
          throw new Error(err.error || "润色失败");
        }

        const responseData = await resp.json();
        setResult(responseData.polished);
      } catch (error) {
        setResult(`润色失败：${(error as Error).message}`);
      } finally {
        setPolishLoading(false);
      }

    } else if (mode === "cover") {
      setResult(""); setCoverLoading(true);
      await new Promise(r => setTimeout(r, 1000));
      setCoverLoading(false);
      const target = input.trim() || (purpose === "academic" ? "目标院校" : "目标岗位");
      setResult(purpose === "academic"
        ? `尊敬的导师：\n\n您好！我是${data.name || "XXX"}，来自${data.education?.split("|")[0]?.trim() || "XX大学"}，现申请贵校${target}专业硕士研究生。\n\n希望能有机会加入贵课题组，在您的指导下继续深造。\n\n此致\n敬礼！\n\n${data.name || "XXX"}`
        : `尊敬的招聘经理：\n\n您好！我是${data.name || "XXX"}，应聘贵司${target}岗位。\n\n期待能加入贵团队，为公司创造价值。\n\n${data.name || "XXX"}`
      );
    } else {
      const field = purpose === "academic" ? data.targetMajor : data.targetPosition;
      setResult(purpose === "academic"
        ? `针对「${field || "目标专业"}」方向建议关键词：\n\n1. 研究方法：定量分析、文献综述、实证研究\n2. 技术能力：Python、R语言、SPSS、LaTeX\n3. 学术素养：论文发表、期刊审稿、学术会议\n4. 软技能：批判性思维、学术写作、跨学科协作`
        : `针对「${field || "目标岗位"}」方向建议关键词：\n\n1. 技术能力：前端开发、React、TypeScript\n2. 工程实践：敏捷开发、CI/CD、性能优化\n3. 项目成果：用户增长、转化率提升、响应速度\n4. 团队协作：跨部门协作、技术分享、mentorship`
      );
    }
  };
  const isPending = polishLoading || coverLoading;

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shadow-sm">
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><Bot className="w-4 h-4 text-blue-600" /></div>
          <span className="font-medium text-sm text-slate-700">AI 助手</span>
        </div>
        <div className="flex gap-1">
          {[{ key: "polish", label: "润色", icon: Wand2 }, { key: "cover", label: "求职信", icon: FileText }, { key: "keywords", label: "关键词", icon: Sparkles }].map((m) => (
            <button key={m.key} onClick={() => { setMode(m.key as typeof mode); setResult(""); }}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-[11px] transition-all ${mode === m.key ? "bg-blue-50 text-blue-600 border border-blue-200 font-medium" : "text-slate-500 hover:text-slate-700 border border-transparent"}`}>
              <m.icon className="w-3.5 h-3.5" />{m.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {mode === "polish" && (
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="粘贴需要润色的文本..." rows={4}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 resize-none mb-3" />
        )}
        {mode === "cover" && (
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={purpose === "academic" ? "目标院校/专业" : "目标岗位"}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 mb-3" />
        )}
        {mode === "keywords" && <p className="text-[13px] text-slate-500 mb-3">根据目标{purpose === "academic" ? "专业" : "岗位"}推荐核心关键词</p>}
        <button onClick={handleAction} disabled={isPending || (mode === "polish" && !input.trim())}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-[13px] font-medium hover:bg-blue-700 transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 mb-4">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {mode === "polish" ? "润色" : mode === "cover" ? "生成" : "获取关键词"}
        </button>
        {result && (
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-blue-600 font-medium uppercase tracking-wide">结果</span>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-slate-400 hover:text-slate-600">
                {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="text-[13px] text-slate-700 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto border border-slate-100">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ 简历预览（多布局 — 优化版） ============ */
function ResumePreview({ data, purpose, templateId }: { data: ResumeData; purpose: string; templateId: number }) {
  const isJob = purpose === "job";
  const t = getTemplate(templateId);
  const parseLines = (text: string) => text.split("\n").filter(l => l.trim()).map(l => l.trim());

  const SectionHeader = ({ icon, title, en }: { icon: string; title: string; en: string }) => (
    <div className="flex items-center gap-2 mb-3 mt-5">
      <span style={{ color: t.accent }} className="text-sm">{icon}</span>
      <h3 style={{ color: t.primary }} className="text-[13px] font-bold tracking-wider uppercase">
        {title}
      </h3>
      <span style={{ color: t.accent, opacity: 0.5 }} className="text-[10px] font-medium ml-0.5">
        {en}
      </span>
      <div className="flex-1 h-px ml-2" style={{ background: `${t.accent}30` }} />
    </div>
  );

  const ExperienceItem = ({ text }: { text: string }) => {
    const lines = parseLines(text);
    if (!lines.length) return null;
    
    const headerLine = lines[0];
    const headerParts = headerLine.split(/[|｜]/).map(s => s.trim()).filter(Boolean);
    const timeRegex = /\d{4}[.\-/]\d{1,2}[.\-/]\d{1,2}|\d{4}[.\-/]\d{1,2}|\d{4}/;
    const lastPart = headerParts[headerParts.length - 1] || "";
    const hasTime = timeRegex.test(lastPart);
    const timeStr = hasTime ? headerParts.pop() : "";
    
    return (
      <div className="mb-4 last:mb-0">
        <div className="flex justify-between items-baseline mb-1.5">
          <div className="flex items-baseline gap-2 flex-wrap">
            {headerParts.map((part, i) => (
              <span key={i} className={i === 0 ? "text-[13px] font-bold" : "text-[12px] text-slate-500"} style={{ color: i === 0 ? t.primary : undefined }}>
                {part}
                {i < headerParts.length - 1 && <span className="mx-1.5 text-slate-300">|</span>}
              </span>
            ))}
          </div>
          {timeStr && (
            <span className="text-[11px] font-mono text-slate-400 shrink-0 ml-2">{timeStr}</span>
          )}
        </div>
        {lines.slice(1).map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return null;
          const clean = trimmed.replace(/^[•\-]\s*/, "").replace(/^\d+\.\s*/, "");
          return (
            <div key={i} className="flex gap-2 leading-relaxed mb-1 pl-0.5" style={{ fontSize: 12, color: "#475569" }}>
              <span style={{ color: t.accent }} className="mt-1.5 shrink-0 text-[5px]">●</span>
              <span>{clean}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const SkillTags = ({ dark = false }: { dark?: boolean }) => {
    if (!data.skills) return null;
    return (
      <div className="flex flex-wrap gap-2">
        {parseLines(data.skills).map((line, i) => {
          const clean = line.replace(/^[•\-]\s*/, "").replace(/^\d+\.\s*/, "");
          const match = clean.match(/^(.+?)[:：]\s*(.+)$/);
          if (match) {
            const [, category, items] = match;
            return (
              <div key={i} className="w-full mb-2">
                <span className="text-[11px] font-semibold text-slate-500 mr-2">{category}:</span>
                <div className="inline-flex flex-wrap gap-1.5 mt-1">
                  {items.split(/[,，、]/).map((item, j) => (
                    <span key={j} className="px-2.5 py-1 text-[11px] rounded-full border transition-colors"
                      style={{ 
                        borderColor: dark ? "#475569" : "#e2e8f0", 
                        color: dark ? "#cbd5e1" : "#475569",
                        background: dark ? "#1e293b" : "#f8fafc"
                      }}>
                      {item.trim()}
                    </span>
                  ))}
                </div>
              </div>
            );
          }
          return (
            <span key={i} className="px-2.5 py-1 text-[11px] rounded-full border"
              style={{ 
                borderColor: dark ? "#475569" : "#e2e8f0", 
                color: dark ? "#cbd5e1" : "#475569",
                background: dark ? "#1e293b" : "#f8fafc"
              }}>
              {clean}
            </span>
          );
        })}
      </div>
    );
  };

  const renderContent = (dark = false) => (
    <>
      {data.education && (
        <div className="mb-2">
          <SectionHeader icon="🎓" title="教育背景" en="Education" />
          <ExperienceItem text={data.education} />
        </div>
      )}
      {isJob && data.experience && (
        <div className="mb-2">
          <SectionHeader icon="💼" title="实习/工作经历" en="Experience" />
          <ExperienceItem text={data.experience} />
        </div>
      )}
      {!isJob && data.research && (
        <div className="mb-2">
          <SectionHeader icon="🔬" title="科研经历" en="Research" />
          <ExperienceItem text={data.research} />
        </div>
      )}
      {data.projects && (
        <div className="mb-2">
          <SectionHeader icon="🚀" title="项目经历" en="Projects" />
          <ExperienceItem text={data.projects} />
        </div>
      )}
      {!isJob && data.publications && (
        <div className="mb-2">
          <SectionHeader icon="📝" title="论文发表" en="Publications" />
          <div className="space-y-1 pl-1">
            {parseLines(data.publications).map((line, i) => (
              <p key={i} className="leading-relaxed" style={{ fontSize: 12, color: dark ? "#cbd5e1" : "#475569" }}>
                [{i+1}] {line.replace(/^\[\d+\]\s*/, "")}
              </p>
            ))}
          </div>
        </div>
      )}
      {data.skills && (
        <div className="mb-2">
          <SectionHeader icon="⚡" title="专业技能" en="Skills" />
          <div className="pl-1">
            <SkillTags dark={dark} />
          </div>
        </div>
      )}
      {data.selfIntro && (
        <div className="mb-2">
          <SectionHeader icon={isJob ? "👤" : "💡"} title={isJob ? "自我评价" : "个人陈述"} en={isJob ? "Self Evaluation" : "Personal Statement"} />
          <div className="space-y-1 pl-1">
            {parseLines(data.selfIntro).map((line, i) => {
              const clean = line.replace(/^[•\-]\s*/, "");
              return (
                <div key={i} className="flex gap-2 leading-relaxed" style={{ fontSize: 12, color: dark ? "#cbd5e1" : "#475569" }}>
                  <span style={{ color: t.accent }} className="mt-1.5 shrink-0 text-[5px]">●</span>
                  <span>{clean}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );

  const TopHeader = ({ dark = false }: { dark?: boolean }) => {
    const textColor = dark ? "#fff" : t.primary;
    const subColor = dark ? "#94a3b8" : "#64748b";
    return (
      <div className="pb-4 mb-5" style={{ borderBottom: `2px solid ${t.primary}` }}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-[26px] font-bold tracking-widest mb-2" style={{ color: textColor }}>{data.name || "姓 名"}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1" style={{ fontSize: 12, color: subColor }}>
              {data.phone && <span>{data.phone}</span>}
              {data.email && <span>{data.email}</span>}
              {isJob && data.targetLocation && <span>{data.targetLocation}</span>}
              {isJob && data.targetPosition && <span style={{ color: t.accent, fontWeight: 600 }}>{data.targetPosition}</span>}
              {isJob && data.expectedSalary && <span>{data.expectedSalary}</span>}
              {!isJob && data.applyType && <span>{data.applyType}</span>}
              {!isJob && data.targetMajor && <span>{data.targetMajor}</span>}
              {!isJob && data.gpa && <span>GPA: {data.gpa}</span>}
            </div>
          </div>
          <div className="w-[70px] h-[90px] rounded-lg border-2 border-dashed flex items-center justify-center text-[10px] ml-4 shrink-0" 
            style={{ borderColor: dark ? "#475569" : "#e2e8f0", color: dark ? "#64748b" : "#94a3b8", background: dark ? "#1e293b" : "#f8fafc" }}>
            照片
          </div>
        </div>
      </div>
    );
  };

  if (t.layout === "sidebar") {
    return (
      <div className="flex rounded-xl shadow-lg border border-slate-200 overflow-hidden" style={{ fontFamily: t.font, minHeight: 0 }}>
        <div className="w-[30%] p-5 flex flex-col" style={{ background: t.primary }}>
          <div className="text-center mb-5">
            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-[10px] font-medium" 
              style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}>
              照片
            </div>
            <h1 className="text-[18px] font-bold tracking-wider mb-3" style={{ color: "#fff" }}>{data.name || "姓 名"}</h1>
            <div className="space-y-2 text-[11px]" style={{ color: "rgba(255,255,255,0.65)" }}>
              {data.phone && <div className="flex items-center justify-center gap-1.5"><span className="opacity-50">📱</span>{data.phone}</div>}
              {data.email && <div className="flex items-center justify-center gap-1.5"><span className="opacity-50">✉️</span>{data.email}</div>}
              {isJob && data.targetLocation && <div className="flex items-center justify-center gap-1.5"><span className="opacity-50">📍</span>{data.targetLocation}</div>}
              {!isJob && data.applyType && <div className="flex items-center justify-center gap-1.5"><span className="opacity-50">🎓</span>{data.applyType}</div>}
              {!isJob && data.targetMajor && <div className="flex items-center justify-center gap-1.5"><span className="opacity-50">📖</span>{data.targetMajor}</div>}
              {!isJob && data.gpa && <div className="flex items-center justify-center gap-1.5"><span className="opacity-50">📊</span>GPA: {data.gpa}</div>}
            </div>
          </div>
          {data.skills && (
            <div className="mt-auto">
              <div className="text-[11px] font-bold mb-3 uppercase tracking-wider" style={{ color: t.accent }}>专业技能</div>
              <div className="flex flex-wrap gap-1.5">
                {parseLines(data.skills).map((line, i) => {
                  const clean = line.replace(/^[•\-]\s*/, "").replace(/^\d+\.\s*/, "");
                  const parts = clean.split(/[：:]/);
                  return parts[0] ? (
                    <span key={i} className="px-2 py-1 rounded-md text-[10px]" 
                      style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      {parts[0]}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
        <div className="w-[70%] bg-white p-6">
          {renderContent()}
        </div>
      </div>
    );
  }

  if (t.layout === "double") {
    return (
      <div className={`rounded-xl shadow-lg border border-slate-200 p-6 ${t.bg}`} style={{ fontFamily: t.font, color: "#334155", minHeight: 0 }}>
        <TopHeader />
        <div className="flex gap-6">
          <div className="w-1/2">{renderContent()}</div>
          <div className="w-1/2">{renderContent()}</div>
        </div>
      </div>
    );
  }

  if (t.layout === "center") {
    return (
      <div className={`rounded-xl shadow-lg border border-slate-200 p-6 ${t.bg}`} style={{ fontFamily: t.font, color: "#334155", minHeight: 0 }}>
        <div className="text-center pb-4 mb-5" style={{ borderBottom: `2px solid ${t.primary}` }}>
          <div className="w-[70px] h-[90px] rounded-lg border-2 border-dashed mx-auto mb-3 flex items-center justify-center text-[10px]"
            style={{ borderColor: "#e2e8f0", color: "#94a3b8", background: "#f8fafc" }}>
            照片
          </div>
          <h1 className="text-[26px] font-bold tracking-widest mb-2" style={{ color: t.primary }}>{data.name || "姓 名"}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center" style={{ fontSize: 12, color: "#64748b" }}>
            {data.phone && <span>{data.phone}</span>}
            {data.email && <span>{data.email}</span>}
            {isJob && data.targetLocation && <span>{data.targetLocation}</span>}
            {isJob && data.targetPosition && <span style={{ color: t.accent, fontWeight: 600 }}>{data.targetPosition}</span>}
            {!isJob && data.applyType && <span>{data.applyType}</span>}
            {!isJob && data.targetMajor && <span>{data.targetMajor}</span>}
            {!isJob && data.gpa && <span>GPA: {data.gpa}</span>}
          </div>
        </div>
        {renderContent()}
      </div>
    );
  }

  if (t.layout === "tech") {
    return (
      <div className="rounded-xl shadow-lg border border-slate-700 overflow-hidden" style={{ fontFamily: t.font, background: "#0f172a", color: "#cbd5e1", minHeight: 0 }}>
        <div className="p-5 flex items-center gap-4" style={{ borderBottom: "1px solid #334155" }}>
          <div className="w-14 h-14 rounded-lg flex items-center justify-center text-[10px]" style={{ background: "#1e293b", color: "#64748b" }}>照片</div>
          <div>
            <h1 className="text-[22px] font-bold tracking-wider mb-1" style={{ color: "#fff" }}>{data.name || "姓 名"}</h1>
            <div className="flex flex-wrap gap-x-3 gap-y-1" style={{ fontSize: 12, color: "#94a3b8" }}>
              {data.phone && <span>{data.phone}</span>}
              {data.email && <span>{data.email}</span>}
              {isJob && data.targetPosition && <span style={{ color: "#06b6d4" }}>{data.targetPosition}</span>}
            </div>
          </div>
        </div>
        <div className="p-5">{renderContent(true)}</div>
      </div>
    );
  }

  if (t.layout === "academic") {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden" style={{ fontFamily: t.font, color: "#334155", minHeight: 0 }}>
        <div className="px-6 py-4 flex items-center gap-4" style={{ background: t.primary }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-[10px]" style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}>照片</div>
          <div>
            <h1 className="text-[20px] font-bold tracking-wider" style={{ color: "#fff" }}>{data.name || "姓 名"}</h1>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1" style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
              {data.phone && <span>{data.phone}</span>}
              {data.email && <span>{data.email}</span>}
              {!isJob && data.applyType && <span>{data.applyType}</span>}
              {!isJob && data.targetMajor && <span>{data.targetMajor}</span>}
              {!isJob && data.gpa && <span>GPA: {data.gpa}</span>}
            </div>
          </div>
        </div>
        <div className="p-6">{renderContent()}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6" style={{ fontFamily: t.font, color: "#334155", minHeight: 0 }}>
      <TopHeader />
      {renderContent()}
    </div>
  );
}

/* ============ 主编辑器页面 ============ */
export default function Editor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const resumeId = Number(searchParams.get("resume")) || 0;
  const urlTemplateId = Number(searchParams.get("template")) || 0;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-slate-800 mb-2">请先登录</h2>
          <p className="text-sm text-slate-400 mb-6">登录后使用编辑器创建简历</p>
          <button 
            onClick={() => navigate("/")}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            去登录
          </button>
        </div>
      </div>
    );
  }

  const [templateId, setTemplateId] = useState(() => {
    if (urlTemplateId > 0) return urlTemplateId;
    if (resumeId > 0) {
      try {
        const saved = JSON.parse(localStorage.getItem("mock_resumes") || "[]");
        const found = saved.find((r: any) => r.id === resumeId);
        if (found && found.templateId) return found.templateId;
      } catch {}
    }
    return 1;
  });

  const [data, setData] = useState<ResumeData>(defaultData);
  const [purpose, setPurpose] = useState<"job" | "academic">("job");
  const [title, setTitle] = useState("未命名简历");
  const [showPreview, setShowPreview] = useState(true);
  const [showAI, setShowAI] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (resumeId > 0 && !loaded) {
      try {
        const saved = JSON.parse(localStorage.getItem("mock_resumes") || "[]");
        const found = saved.find((r: any) => r.id === resumeId);
        if (found) {
          setTitle(found.title || "未命名简历");
          setPurpose(found.purpose || "job");
          setData((prev) => ({ ...prev, ...(found.data || {}) }));
          if (found.templateId && found.templateId !== templateId) {
            setTemplateId(found.templateId);
          }
        }
      } catch (e) {
        console.error("加载简历失败", e);
      } finally {
        setLoaded(true);
      }
    }
  }, [resumeId, loaded, templateId]);

  const updateField = (field: keyof ResumeData, value: string) => setData((prev) => ({ ...prev, [field]: value }));

  const t = getTemplate(templateId);

  const handleSave = async () => {
    if (!user) { alert("请先登录"); navigate("/login"); return; }
    setSaving(true);
    try {
      const savedResumes = JSON.parse(localStorage.getItem("mock_resumes") || "[]");
      const newResume = {
        id: resumeId > 0 ? resumeId : Date.now(),
        title,
        purpose,
        templateId: templateId || 1,
        data,
        updatedAt: new Date().toISOString(),
      };
      if (resumeId > 0) {
        const idx = savedResumes.findIndex((r: any) => r.id === resumeId);
        if (idx >= 0) savedResumes[idx] = newResume;
        else savedResumes.push(newResume);
      } else {
        savedResumes.push(newResume);
      }
      localStorage.setItem("mock_resumes", JSON.stringify(savedResumes));
      alert(resumeId > 0 ? "保存成功！" : "创建成功！");
      if (resumeId <= 0) navigate("/my-resumes");
    } catch (err) {
      alert("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    const previewEl = document.getElementById("resume-preview");
    if (!previewEl) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const html = previewEl.innerHTML;
    const tStyle = getTemplate(templateId);
    printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title><style>@page { size: A4; margin: 12mm; } * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; } body { margin: 0; padding: 0; font-family: ${tStyle.font}; } .bg-white { background: #fff; } .rounded { border-radius: 0; } .shadow { box-shadow: none; } .border { border: none; } .p-5 { padding: 0; } .flex { display: flex; } .flex-wrap { flex-wrap: wrap; } .justify-between { justify-content: space-between; } .items-start { align-items: flex-start; } .items-center { align-items: center; } .flex-1 { flex: 1; } .shrink-0 { flex-shrink: 0; } .gap-x-3 { column-gap: 12px; } .gap-y-0\.5 { row-gap: 2px; } .gap-1\.5 { gap: 6px; } .gap-x-2 { column-gap: 8px; } .text-\[22px\] { font-size: 22px; } .text-\[13px\] { font-size: 13px; } .text-\[12px\] { font-size: 12px; } .text-\[11px\] { font-size: 11px; } .text-\[10px\] { font-size: 10px; } .text-\[4px\] { font-size: 4px; } .font-bold { font-weight: 700; } .tracking-widest { letter-spacing: 0.15em; } .mb-1\.5 { margin-bottom: 6px; } .mb-2 { margin-bottom: 8px; } .mb-3 { margin-bottom: 12px; } .mb-3\.5 { margin-bottom: 14px; } .mb-4 { margin-bottom: 16px; } .mt-0\.5 { margin-top: 2px; } .ml-3 { margin-left: 12px; } .pl-1 { padding-left: 4px; } .pl-3 { padding-left: 12px; } .py-1 { padding-top: 4px; padding-bottom: 4px; } .px-1\.5 { padding-left: 6px; padding-right: 6px; } .py-0\.5 { padding-top: 2px; padding-bottom: 2px; } .pb-3 { padding-bottom: 12px; } .w-\[32\%\] { width: 32%; } .w-\[68\%\] { width: 68%; } .w-\[60px\] { width: 60px; } .h-\[75px\] { height: 75px; } .border-b-2 { border-bottom-width: 2px; border-bottom-style: solid; } .border { border-width: 1px; border-style: solid; } .rounded { border-radius: 4px; } .space-y-0\.5 > * + * { margin-top: 2px; } .leading-snug { line-height: 1.4; }</style></head><body><div class="bg-white rounded shadow border p-5" style="font-family:${tStyle.font};color:#334155;">${html}</div></body></html>`);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 400);
  };

  const jobFields = [
    { key: "name", label: "姓名", placeholder: "你的姓名" }, { key: "email", label: "邮箱", placeholder: "example@email.com" }, { key: "phone", label: "电话", placeholder: "138-xxxx-xxxx" },
    { key: "targetPosition", label: "目标岗位", placeholder: "例如：前端开发工程师" }, { key: "targetLocation", label: "工作地点", placeholder: "例如：北京" }, { key: "expectedSalary", label: "期望薪资", placeholder: "例如：15K-20K" },
    { key: "education", label: "教育背景", placeholder: "XX大学 | 计算机科学与技术 | 本科 | 2021.09-2025.06\nGPA: 3.8/4.0 | 专业排名前10%\n主修课程：数据结构、操作系统、计算机网络...", multiline: true },
    { key: "skills", label: "专业技能", placeholder: "• 编程语言：Python、JavaScript、TypeScript\n• 前端框架：React、Vue3、Next.js\n• 后端技术：Node.js、Express、MySQL\n• 开发工具：Git、Docker、VS Code\n• 其他：英语CET-6、具备良好的团队协作能力", multiline: true },
    { key: "experience", label: "实习/工作经历", placeholder: "XX科技有限公司 | 前端开发实习生 | 2024.06-2024.09\n• 负责公司官网的前端页面开发，使用 React + TypeScript 技术栈\n• 参与开发了3个核心功能模块，提升了页面加载速度30%\n• 编写了50+个单元测试用例，代码覆盖率达到85%", multiline: true },
    { key: "projects", label: "项目经历", placeholder: "智慧校园二手交易平台 | 项目负责人 | 2024.03-2024.06\n• 项目概述：基于 Vue3 + Node.js 的全栈二手交易平台\n• 技术栈：Vue3、Element Plus、Express、MySQL、JWT\n• 核心工作：独立完成前后端架构设计、数据库设计\n• 项目成果：平台上线首月即获得500+活跃用户", multiline: true },
    { key: "selfIntro", label: "自我评价", placeholder: "• 具备扎实的前端开发基础，熟悉React、Vue等主流框架\n• 有良好的代码习惯和文档意识\n• 具有较强的学习能力和团队协作精神", multiline: true },
  ];
  const academicFields = [
    { key: "name", label: "姓名", placeholder: "你的姓名" }, { key: "email", label: "邮箱", placeholder: "example@email.com" }, { key: "phone", label: "电话", placeholder: "138-xxxx-xxxx" },
    { key: "applyType", label: "申请类别", placeholder: "硕士 / 直博" }, { key: "targetMajor", label: "目标专业", placeholder: "例如：计算机科学与技术" }, { key: "gpa", label: "GPA", placeholder: "例如：3.8/4.0" },
    { key: "education", label: "教育背景", placeholder: "XX大学 | 信息管理与信息系统 | 本科 | 2021.09-2025.06\nGPA: 3.82/4.0 | 综合排名: 5/120\n主修课程：高级数据库(95)、机器学习(94)、算法设计与分析(96)\n荣誉奖项：国家奖学金(2023)、校级一等奖学金(2022-2024)", multiline: true },
    { key: "skills", label: "专业技能", placeholder: "• 编程语言：Python(熟练)、R(熟练)、SQL(熟练)\n• 机器学习：TensorFlow、PyTorch、Scikit-learn\n• 数据处理：Pandas、NumPy、Spark\n• 英语能力：CET-6(580)、雅思7.0", multiline: true },
    { key: "research", label: "科研经历", placeholder: "基于知识图谱的学术推荐系统研究 | 国家级大创项目 | 2023.09-2024.09\n导师：XXX教授\n• 负责学术知识图谱的构建，基于BERT模型实现实体关系抽取\n• 设计并实现了基于图神经网络的推荐算法，较基线方法提升15%\n• 以第一作者身份在《情报学报》发表论文1篇", multiline: true },
    { key: "publications", label: "论文发表", placeholder: "[1] 张三, 李四. 基于知识图谱的学术推荐系统研究[J]. 情报学报, 2024, 43(3): 120-135.\n[2] Zhang S, Li W. Knowledge Graph-based Academic Recommendation[C]. ICML 2024 Workshop.", multiline: true },
    { key: "projects", label: "项目经历", placeholder: "校园智慧图书馆系统 | 课程设计 | 2024.03-2024.06\n• 基于RFID技术和数据分析的图书馆智能管理系统\n• 使用Python Flask + MySQL开发后端，Vue3开发前端\n• 获评课程设计优秀项目(前5%)", multiline: true },
    { key: "selfIntro", label: "个人陈述", placeholder: "• 学术兴趣：对知识图谱、推荐系统和自然语言处理有浓厚兴趣\n• 研究计划：希望在研究生阶段深入研究大语言模型与知识图谱的融合方法\n• 科研素养：具备良好的文献阅读能力、实验设计能力和论文写作能力\n• 申请动机：贵校在该领域享有盛誉，希望能跟随导师开展前沿研究", multiline: true },
  ];
  const fields = purpose === "job" ? jobFields : academicFields;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="bg-blue-600 text-white px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4" />
          <span className="text-[13px]">当前使用模板：<span className="font-medium">{t.name}</span></span>
        </div>
        <button onClick={() => navigate("/templates")} className="text-[12px] text-blue-100 hover:text-white flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> 切换模板
        </button>
      </div>

      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 min-w-[200px]">
            <Type className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="text-[15px] font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 transition-all w-full"
              placeholder="简历标题"
            />
          </div>
          <div className="h-5 w-px bg-slate-200" />
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button 
              onClick={() => setPurpose("job")} 
              className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-all ${purpose === "job" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >求职简历</button>
            <button 
              onClick={() => setPurpose("academic")} 
              className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-all ${purpose === "academic" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >升学简历</button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPreview(!showPreview)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] transition-all ${showPreview ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50"}`}>
            {showPreview ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />} 预览
          </button>
          <button onClick={() => setShowAI(!showAI)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] transition-all ${showAI ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50"}`}>
            <Bot className="w-3.5 h-3.5" /> AI助手
          </button>
          <div className="h-5 w-px bg-slate-200 mx-1" />
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-800 text-white rounded-lg text-[12px] font-medium hover:bg-slate-900 transition-all disabled:opacity-50">
            <Save className="w-3.5 h-3.5" /> {saving ? "保存中..." : "保存"}
          </button>
          <button onClick={handleExportPDF} className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[12px] font-medium hover:bg-blue-700 transition-all">
            <Download className="w-3.5 h-3.5" /> 导出PDF
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 overflow-y-auto p-6 transition-all ${showPreview ? (showAI ? "max-w-[420px]" : "max-w-[520px]") : "max-w-full"}`}>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-[16px] font-bold text-slate-800 mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
              基本信息
            </h2>
            <div className="space-y-5">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">{field.label}</label>
                  {field.multiline ? (
                    <textarea value={data[field.key as keyof ResumeData]} onChange={(e) => updateField(field.key as keyof ResumeData, e.target.value)} placeholder={field.placeholder} rows={5}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 resize-none leading-relaxed" />
                  ) : (
                    <input type="text" value={data[field.key as keyof ResumeData]} onChange={(e) => updateField(field.key as keyof ResumeData, e.target.value)} placeholder={field.placeholder}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {showPreview && (
          <div className={`flex-1 overflow-y-auto p-6 bg-slate-100/50 ${showAI ? "border-r border-slate-200" : ""}`}>
            <div id="resume-preview" className="max-w-[640px] mx-auto">
              <ResumePreview data={data} purpose={purpose} templateId={templateId} />
            </div>
          </div>
        )}

        {showAI && (
          <div className="w-80 flex-shrink-0">
            <AISidebar data={data} purpose={purpose} />
          </div>
        )}
      </div>
    </div>
  );
}