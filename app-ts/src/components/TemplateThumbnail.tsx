interface Props {
  name: string;
  style?: string;
  id?: number;
  className?: string;
}

function getConfig(name: string, style: string) {
  const n = name;

  if (n.includes("黑金")) return { bg: "bg-white", sidebar: "bg-neutral-900", accent: "bg-amber-400", line: "bg-amber-100", dot: "bg-amber-300", layout: "sidebar" as const };
  if (n.includes("薄荷绿") || n.includes("森林绿") || n.includes("青柠绿")) return { bg: "bg-green-50", sidebar: "bg-emerald-500", accent: "bg-emerald-300", line: "bg-emerald-100", dot: "bg-emerald-400", layout: "center" as const };
  if (n.includes("暖橙") || n.includes("珊瑚橙") || n.includes("焦糖")) return { bg: "bg-orange-50", sidebar: "bg-orange-500", accent: "bg-orange-300", line: "bg-orange-100", dot: "bg-orange-400", layout: "double" as const };
  if (n.includes("紫罗兰") || n.includes("电光紫") || n.includes("薰衣草") || n.includes("黛紫") || n.includes("藕荷")) return { bg: "bg-purple-50", sidebar: "bg-purple-600", accent: "bg-purple-300", line: "bg-purple-100", dot: "bg-purple-400", layout: "double" as const };
  if (n.includes("深蓝") || n.includes("海军蓝") || n.includes("藏青") || n.includes("钴蓝") || n.includes("靛蓝") || n.includes("靛青")) return { bg: "bg-blue-50", sidebar: "bg-blue-900", accent: "bg-blue-400", line: "bg-blue-100", dot: "bg-blue-400", layout: "sidebar" as const };
  if (n.includes("赤焰红") || n.includes("砖红") || n.includes("铁锈红") || n.includes("绛红") || n.includes("橘红") || n.includes("酒红")) return { bg: "bg-red-50", sidebar: "bg-red-700", accent: "bg-red-400", line: "bg-red-100", dot: "bg-red-400", layout: "sidebar" as const };
  if (n.includes("暗夜") || n.includes("曜石黑") || n.includes("星际黑") || n.includes("炭黑") || n.includes("玄黑")) return { bg: "bg-neutral-900", sidebar: "bg-neutral-800", accent: "bg-lime-400", line: "bg-neutral-700", dot: "bg-lime-400", layout: "tech" as const };
  if (n.includes("樱花粉") || n.includes("霓虹粉") || n.includes("裸粉") || n.includes("豆沙") || n.includes("杏花粉")) return { bg: "bg-pink-50", sidebar: "bg-pink-400", accent: "bg-pink-300", line: "bg-pink-100", dot: "bg-pink-400", layout: "center" as const };
  if (n.includes("珍珠白") || n.includes("象牙白") || n.includes("冰川白") || n.includes("云朵白") || n.includes("米白")) return { bg: "bg-white", sidebar: "bg-slate-200", accent: "bg-slate-400", line: "bg-slate-100", dot: "bg-slate-400", layout: "single" as const };
  if (n.includes("灰度") || n.includes("石墨灰") || n.includes("银月灰") || n.includes("钛金灰") || n.includes("银灰")) return { bg: "bg-gray-50", sidebar: "bg-gray-600", accent: "bg-gray-300", line: "bg-gray-200", dot: "bg-gray-400", layout: "single" as const };
  if (n.includes("冰川蓝") || n.includes("冰蓝") || n.includes("湖蓝") || n.includes("雾蓝") || n.includes("深海蓝") || n.includes("天青")) return { bg: "bg-sky-50", sidebar: "bg-sky-600", accent: "bg-sky-300", line: "bg-sky-100", dot: "bg-sky-400", layout: "single" as const };
  if (n.includes("墨绿") || n.includes("翡翠绿") || n.includes("松石绿") || n.includes("青瓷绿") || n.includes("草绿")) return { bg: "bg-emerald-50", sidebar: "bg-emerald-800", accent: "bg-emerald-400", line: "bg-emerald-100", dot: "bg-emerald-400", layout: "sidebar" as const };
  if (n.includes("柠檬黄") || n.includes("麦浪金") || n.includes("姜黄") || n.includes("荧光")) return { bg: "bg-yellow-50", sidebar: "bg-yellow-400", accent: "bg-yellow-300", line: "bg-yellow-100", dot: "bg-yellow-400", layout: "center" as const };
  if (n.includes("砂岩褐") || n.includes("栗棕")) return { bg: "bg-stone-100", sidebar: "bg-stone-600", accent: "bg-stone-400", line: "bg-stone-200", dot: "bg-stone-400", layout: "single" as const };
  if (n.includes("暗红")) return { bg: "bg-neutral-900", sidebar: "bg-red-900", accent: "bg-red-600", line: "bg-neutral-800", dot: "bg-red-500", layout: "tech" as const };
  if (n.includes("墨蓝")) return { bg: "bg-slate-100", sidebar: "bg-slate-800", accent: "bg-slate-500", line: "bg-slate-200", dot: "bg-slate-500", layout: "sidebar" as const };
  if (n.includes("红蓝")) return { bg: "bg-gradient-to-r from-red-50 to-blue-50", sidebar: "bg-red-600", accent: "bg-blue-400", line: "bg-red-100", dot: "bg-blue-400", layout: "double" as const };
  if (n.includes("素雅国风")) return { bg: "bg-stone-50", sidebar: "bg-stone-700", accent: "bg-amber-400", line: "bg-stone-200", dot: "bg-amber-400", layout: "single" as const };
  if (n.includes("暖黄")) return { bg: "bg-amber-50", sidebar: "bg-amber-500", accent: "bg-amber-300", line: "bg-amber-100", dot: "bg-amber-400", layout: "center" as const };
  if (n.includes("经典蓝白")) return { bg: "bg-white", sidebar: "bg-blue-800", accent: "bg-blue-400", line: "bg-blue-100", dot: "bg-blue-400", layout: "sidebar" as const };
  if (n.includes("玫瑰金")) return { bg: "bg-rose-50", sidebar: "bg-rose-400", accent: "bg-rose-300", line: "bg-rose-100", dot: "bg-rose-400", layout: "double" as const };
  if (n.includes("天空蓝")) return { bg: "bg-sky-50", sidebar: "bg-sky-500", accent: "bg-sky-300", line: "bg-sky-100", dot: "bg-sky-400", layout: "center" as const };
  if (n.includes("深海蓝")) return { bg: "bg-blue-900", sidebar: "bg-blue-700", accent: "bg-blue-300", line: "bg-blue-800", dot: "bg-blue-400", layout: "tech" as const };
  if (n.includes("焦糖奶油")) return { bg: "bg-amber-100", sidebar: "bg-amber-600", accent: "bg-amber-400", line: "bg-amber-200", dot: "bg-amber-400", layout: "center" as const };
  if (n.includes("青柠绿")) return { bg: "bg-lime-50", sidebar: "bg-lime-500", accent: "bg-lime-300", line: "bg-lime-100", dot: "bg-lime-400", layout: "center" as const };
  if (n.includes("云朵白")) return { bg: "bg-sky-50", sidebar: "bg-sky-300", accent: "bg-sky-100", line: "bg-sky-50", dot: "bg-sky-400", layout: "single" as const };
  if (n.includes("赤焰红")) return { bg: "bg-red-50", sidebar: "bg-red-600", accent: "bg-red-400", line: "bg-red-100", dot: "bg-red-400", layout: "sidebar" as const };
  if (n.includes("冰蓝科技")) return { bg: "bg-cyan-50", sidebar: "bg-cyan-600", accent: "bg-cyan-400", line: "bg-cyan-100", dot: "bg-cyan-400", layout: "tech" as const };

  if (style === "minimal") return { bg: "bg-white", sidebar: "bg-slate-200", accent: "bg-slate-400", line: "bg-slate-100", dot: "bg-slate-400", layout: "single" as const };
  if (style === "professional") return { bg: "bg-white", sidebar: "bg-slate-800", accent: "bg-amber-400", line: "bg-slate-100", dot: "bg-amber-400", layout: "sidebar" as const };
  if (style === "creative") return { bg: "bg-gradient-to-br from-purple-50 to-pink-50", sidebar: "bg-purple-500", accent: "bg-purple-300", line: "bg-purple-100", dot: "bg-purple-400", layout: "double" as const };
  if (style === "tech") return { bg: "bg-slate-900", sidebar: "bg-slate-800", accent: "bg-emerald-400", line: "bg-slate-700", dot: "bg-emerald-400", layout: "tech" as const };
  if (style === "academic") return { bg: "bg-white", sidebar: "bg-blue-800", accent: "bg-blue-400", line: "bg-blue-100", dot: "bg-blue-400", layout: "academic" as const };
  if (style === "elegant") return { bg: "bg-gradient-to-b from-amber-50 to-white", sidebar: "bg-amber-900", accent: "bg-amber-400", line: "bg-amber-100", dot: "bg-amber-400", layout: "double" as const };
  if (style === "fresh") return { bg: "bg-gradient-to-br from-green-50 to-cyan-50", sidebar: "bg-green-500", accent: "bg-green-300", line: "bg-green-100", dot: "bg-green-400", layout: "center" as const };

  return { bg: "bg-white", sidebar: "bg-slate-200", accent: "bg-slate-400", line: "bg-slate-100", dot: "bg-slate-400", layout: "single" as const };
}

export default function TemplateThumbnail({ name, style = "minimal", className = "" }: Props) {
  const cfg = getConfig(name, style);

  const SingleLayout = () => (
    <div className={`w-full h-full ${cfg.bg} p-3 flex flex-col gap-2`}>
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded-full ${cfg.sidebar} opacity-30`} />
        <div className="flex flex-col gap-1">
          <div className={`h-2 w-14 rounded-sm ${cfg.accent}`} />
          <div className={`h-1 w-20 rounded-sm ${cfg.line}`} />
        </div>
      </div>
      <div className={`h-px w-full ${cfg.line}`} />
      <div className="flex flex-col gap-1">
        <div className={`h-1.5 w-3/4 rounded-sm ${cfg.accent} opacity-70`} />
        <div className={`h-1 w-full rounded-sm ${cfg.line}`} />
        <div className={`h-1 w-5/6 rounded-sm ${cfg.line} opacity-70`} />
      </div>
      <div className="flex flex-col gap-1 mt-1">
        <div className={`h-1.5 w-2/3 rounded-sm ${cfg.accent} opacity-70`} />
        <div className={`h-1 w-full rounded-sm ${cfg.line}`} />
        <div className={`h-1 w-4/5 rounded-sm ${cfg.line} opacity-70`} />
      </div>
      <div className="flex gap-1 mt-auto">
        <div className={`h-1.5 w-5 rounded-full ${cfg.dot}`} />
        <div className={`h-1.5 w-7 rounded-full ${cfg.dot}`} />
        <div className={`h-1.5 w-4 rounded-full ${cfg.dot}`} />
      </div>
    </div>
  );

  const SidebarLayout = () => (
    <div className={`w-full h-full flex`}>
      <div className={`w-1/3 h-full ${cfg.sidebar} p-2 flex flex-col items-center gap-2`}>
        <div className="w-6 h-6 rounded-full bg-white/20" />
        <div className="h-1.5 w-8 rounded-sm bg-white/30" />
        <div className="h-1 w-6 rounded-sm bg-white/20" />
        <div className="h-1 w-7 rounded-sm bg-white/20" />
        <div className="mt-auto flex flex-col gap-1 w-full">
          <div className="h-1 w-full rounded-sm bg-white/10" />
          <div className="h-1 w-4/5 rounded-sm bg-white/10" />
        </div>
      </div>
      <div className="flex-1 bg-white p-2.5 flex flex-col gap-2">
        <div className={`h-2 w-16 rounded-sm ${cfg.accent}`} />
        <div className="h-px w-full bg-slate-100" />
        <div className="flex flex-col gap-1">
          <div className="h-1.5 w-3/4 rounded-sm bg-slate-400" />
          <div className="h-1 w-full rounded-sm bg-slate-300" />
          <div className="h-1 w-5/6 rounded-sm bg-slate-300" />
        </div>
        <div className="flex flex-col gap-1 mt-1">
          <div className="h-1.5 w-2/3 rounded-sm bg-slate-400" />
          <div className="h-1 w-full rounded-sm bg-slate-300" />
          <div className="h-1 w-4/5 rounded-sm bg-slate-300" />
        </div>
        <div className="flex gap-1 mt-auto">
          <div className={`h-1.5 w-5 rounded-full ${cfg.line}`} />
          <div className={`h-1.5 w-7 rounded-full ${cfg.line}`} />
          <div className={`h-1.5 w-4 rounded-full ${cfg.line}`} />
        </div>
      </div>
    </div>
  );

  const DoubleLayout = () => (
    <div className={`w-full h-full ${cfg.bg} p-3 flex gap-2`}>
      <div className="w-1/2 flex flex-col gap-2">
        <div className={`h-2 w-12 rounded-sm ${cfg.accent}`} />
        <div className={`h-px w-full ${cfg.line}`} />
        <div className="flex flex-col gap-1">
          <div className="h-1 w-full rounded-sm bg-slate-400" />
          <div className="h-1 w-5/6 rounded-sm bg-slate-300" />
          <div className="h-1 w-4/5 rounded-sm bg-slate-300" />
        </div>
        <div className={`h-8 w-full rounded-lg ${cfg.line} opacity-50`} />
      </div>
      <div className="w-1/2 flex flex-col gap-2">
        <div className={`h-2 w-10 rounded-sm ${cfg.accent}`} />
        <div className={`h-px w-full ${cfg.line}`} />
        <div className="flex flex-col gap-1">
          <div className="h-1 w-full rounded-sm bg-slate-400" />
          <div className="h-1 w-5/6 rounded-sm bg-slate-300" />
        </div>
        <div className={`h-6 w-full rounded-lg ${cfg.line} opacity-40`} />
      </div>
    </div>
  );

  const CenterLayout = () => (
    <div className={`w-full h-full ${cfg.bg} p-3 flex flex-col items-center gap-2`}>
      <div className={`w-8 h-8 rounded-full ${cfg.sidebar} opacity-30`} />
      <div className={`h-2 w-14 rounded-full ${cfg.accent}`} />
      <div className={`h-1 w-20 rounded-full ${cfg.line}`} />
      <div className="w-full flex flex-col gap-1 mt-1">
        <div className={`h-1 w-full rounded-full ${cfg.line}`} />
        <div className={`h-1 w-5/6 rounded-full ${cfg.line} opacity-70`} />
        <div className={`h-1 w-4/5 rounded-full ${cfg.line} opacity-70`} />
      </div>
      <div className="flex gap-1 mt-auto">
        <div className={`h-1.5 w-5 rounded-full ${cfg.dot}`} />
        <div className={`h-1.5 w-7 rounded-full ${cfg.dot}`} />
        <div className={`h-1.5 w-4 rounded-full ${cfg.dot}`} />
      </div>
    </div>
  );

  const TechLayout = () => (
    <div className={`w-full h-full ${cfg.bg} p-3 flex flex-col gap-2`}>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-white/10" />
        <div className="flex flex-col gap-1">
          <div className={`h-2 w-14 rounded-sm ${cfg.accent}`} />
          <div className={`h-1 w-20 rounded-sm ${cfg.line}`} />
        </div>
      </div>
      <div className="h-px w-full bg-white/10" />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="h-1 w-8 rounded-sm bg-white/30" />
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full w-4/5 rounded-full ${cfg.accent}`} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1 w-6 rounded-sm bg-white/30" />
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full w-3/4 rounded-full ${cfg.accent}`} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1 w-10 rounded-sm bg-white/30" />
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full w-5/6 rounded-full ${cfg.accent}`} />
          </div>
        </div>
      </div>
      <div className="h-px w-full bg-white/10" />
      <div className="flex flex-col gap-1">
        <div className={`h-1.5 w-16 rounded-sm ${cfg.accent} opacity-80`} />
        <div className="h-1 w-full rounded-sm bg-white/20" />
        <div className="h-1 w-5/6 rounded-sm bg-white/20" />
      </div>
      <div className="flex gap-1.5 mt-auto">
        <div className={`h-1.5 w-5 rounded-full ${cfg.accent} opacity-50`} />
        <div className={`h-1.5 w-7 rounded-full ${cfg.accent} opacity-50`} />
        <div className={`h-1.5 w-4 rounded-full ${cfg.accent} opacity-50`} />
      </div>
    </div>
  );

  const AcademicLayout = () => (
    <div className={`w-full h-full bg-white flex flex-col`}>
      <div className={`h-10 w-full ${cfg.sidebar} flex items-center px-3 gap-2`}>
        <div className="w-6 h-6 rounded-full bg-white/20" />
        <div className="flex flex-col gap-1">
          <div className="h-1.5 w-16 rounded-sm bg-white/80" />
          <div className="h-1 w-20 rounded-sm bg-white/50" />
        </div>
      </div>
      <div className="flex-1 flex gap-2 p-2.5">
        <div className="w-1/2 flex flex-col gap-2">
          <div className={`h-1.5 w-10 rounded-sm ${cfg.accent}`} />
          <div className={`h-px w-full ${cfg.line}`} />
          <div className="flex flex-col gap-1">
            <div className="h-1 w-full rounded-sm bg-slate-400" />
            <div className="h-1 w-5/6 rounded-sm bg-slate-300" />
            <div className="h-1 w-4/5 rounded-sm bg-slate-300" />
          </div>
          <div className="flex flex-col gap-1 mt-1">
            <div className="h-1 w-full rounded-sm bg-slate-400" />
            <div className="h-1 w-3/4 rounded-sm bg-slate-300" />
          </div>
        </div>
        <div className="w-1/2 flex flex-col gap-2">
          <div className={`h-1.5 w-10 rounded-sm ${cfg.accent}`} />
          <div className={`h-px w-full ${cfg.line}`} />
          <div className="flex flex-col gap-1">
            <div className="h-1 w-full rounded-sm bg-slate-400" />
            <div className="h-1 w-5/6 rounded-sm bg-slate-300" />
          </div>
          <div className="flex flex-col gap-1 mt-1">
            <div className="h-1 w-full rounded-sm bg-slate-400" />
            <div className="h-1 w-4/5 rounded-sm bg-slate-300" />
            <div className="h-1 w-3/4 rounded-sm bg-slate-300" />
          </div>
        </div>
      </div>
      <div className="px-2.5 pb-2 flex gap-1">
        <div className={`h-1.5 w-6 rounded-full ${cfg.line}`} />
        <div className={`h-1.5 w-8 rounded-full ${cfg.line}`} />
        <div className={`h-1.5 w-5 rounded-full ${cfg.line}`} />
      </div>
    </div>
  );

  const LayoutMap = {
    single: SingleLayout,
    sidebar: SidebarLayout,
    double: DoubleLayout,
    center: CenterLayout,
    tech: TechLayout,
    academic: AcademicLayout,
  };

  const Layout = LayoutMap[cfg.layout] || SingleLayout;

  return (
    <div className={`overflow-hidden ${className}`}>
      <Layout />
    </div>
  );
}