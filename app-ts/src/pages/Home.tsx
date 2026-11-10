import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Link } from "react-router";
import Navbar from "@/components/Navbar";
import { 
  ArrowRight, Brain, Layout, Shield, FileText, 
  Zap, Star, ChevronRight, ChevronLeft, Code2, Server, Database, Lock,
  Sparkles, Target, PenTool, Cpu, Globe, Fingerprint,
  Layers, Wand2, BookOpen, ArrowUpRight,
  Wand, FileCheck, Palette
} from "lucide-react";

/* ========== 数据 ========== */
const categories = ['极简', '学术', '科技', '创意', '商务', '设计', '金融'];
const scenes = ['求职', '升学', '保研'];
const colors = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#059669', '#475569', '#0891b2'];

const allTemplates = Array.from({ length: 80 }, (_, i) => {
  const catIdx = i % 7;
  const sceneIdx = i % 3;
  const c = colors[catIdx];
  return {
    id: i + 1,
    name: `${categories[catIdx]}风格模板 ${String(i + 1).padStart(2, '0')}`,
    category: categories[catIdx],
    scene: scenes[sceneIdx],
    color: c,
    isHot: i < 8,
    isNew: i >= 72,
  };
});

const heroSlides = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1920&q=80',
];

/* ========== 滚动触发 Hook ========== */
function useOnScreen(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); ob.disconnect(); } }, { threshold });
    ob.observe(el);
    return () => ob.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ========== 滚动进度条 ========== */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[9999] bg-transparent">
      <div className="h-full transition-all duration-150" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #2563eb, #7c3aed, #db2777)' }} />
    </div>
  );
}

/* ========== Hero ========== */
function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const next = useCallback(() => setCurrent((p) => (p + 1) % heroSlides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + heroSlides.length) % heroSlides.length), []);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);
  useEffect(() => { if (isHovered) return; const timer = setInterval(next, 4000); return () => clearInterval(timer); }, [next, isHovered]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden select-none" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="absolute inset-0">
        {heroSlides.map((src, i) => (
          <div key={i} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${src})`, transform: (mounted && i === current) ? 'scale(1)' : 'scale(1.08)', transition: 'opacity 1s ease, transform 6.5s ease-out' }} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 40%, transparent 65%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none" style={{ background: 'linear-gradient(to top, #faf9f7 0%, rgba(250,249,247,0.7) 25%, transparent 100%)' }} />
      </div>

      <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white hover:bg-white/40 hover:scale-110 transition-all duration-300 shadow-xl">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white hover:bg-white/40 hover:scale-110 transition-all duration-300 shadow-xl">
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-[3px] rounded-full transition-all duration-500 ${i === current ? 'w-10 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]' : 'w-[6px] bg-white/50 hover:bg-white/80'}`} />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl">
            <div className="flex justify-end mb-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-white/40 shadow-xl shadow-black/10">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs tracking-[0.25em] uppercase text-slate-800 font-extrabold">AI-Powered Resume System</span>
              </div>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.2] mb-8 text-white tracking-tight drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] flex flex-wrap items-center gap-x-4">
              <span className="whitespace-nowrap">让每一份简历</span>
              <span className="text-transparent bg-clip-text whitespace-nowrap" style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa, #fbbf24, #f472b6)' }}>都闪闪发光</span>
            </h1>

            <p className="text-lg md:text-xl text-white/95 font-light leading-relaxed mb-6 max-w-lg drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
              基于 <span className="font-semibold text-white">React 18 + Hono + Drizzle</span> 全栈架构，融合 AI 智能润色引擎与多维度模板系统。
            </p>
            <p className="text-base text-white/80 leading-relaxed mb-12 max-w-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
              三步生成：选择模板 → 智能填充 → 一键导出。所见即所得的编辑体验，让每一份简历都精准匹配目标场景。
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/templates" className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-semibold text-sm hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-600/40 hover:shadow-blue-600/60 hover:-translate-y-0.5">
                开始创建简历 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/editor" className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium hover:bg-white/30 transition-all border border-white/30 shadow-lg">
                直接进入编辑器
              </Link>
            </div>

            <div className="flex gap-12 mt-16 pt-8 border-t border-white/20">
              {[{ num: '80+', label: '专业模板' }, { num: '7', label: '设计风格' }, { num: '100%', label: '免费使用' }].map((item) => (
                <div key={item.label}>
                  <div className="text-2xl font-bold text-white drop-shadow">{item.num}</div>
                  <div className="text-xs text-white/60 mt-1 tracking-wide">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:flex justify-center items-center" style={{ perspective: '1200px' }}>
            <div className="relative" style={{ transform: 'rotateY(-6deg) rotateX(2deg)', transformStyle: 'preserve-3d' }}>
              <div className="absolute -inset-2 rounded-3xl opacity-40 blur-2xl" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.5), rgba(217,119,6,0.3), rgba(236,72,153,0.2))' }} />
              <div className="w-[420px] rounded-3xl p-8 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(50px) saturate(180%)', WebkitBackdropFilter: 'blur(50px) saturate(180%)', boxShadow: '0 32px 64px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.25)' }}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl" />
                <div className="flex items-center justify-between mb-8 pb-6 relative z-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">我的简历</div>
                      <div className="text-xs text-white/50">Resume_v3.pdf</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                  </div>
                </div>
                <div className="space-y-5 relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                      <span className="text-2xl font-bold text-white/40">?</span>
                    </div>
                    <div>
                      <div className="h-3 w-32 bg-white/30 rounded-full mb-2"></div>
                      <div className="h-2.5 w-24 bg-white/20 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-2.5 bg-white/20 rounded-full w-full"></div>
                  <div className="h-2.5 bg-white/25 rounded-full w-[90%]"></div>
                  <div className="h-2.5 bg-white/20 rounded-full w-[75%]"></div>
                  <div className="h-2.5 bg-white/25 rounded-full w-[85%]"></div>
                  <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                    <div className="h-2 bg-white/30 rounded-full w-[40%] mb-4"></div>
                    <div className="h-2.5 bg-white/20 rounded-full w-full mb-2"></div>
                    <div className="h-2.5 bg-white/20 rounded-full w-[80%]"></div>
                  </div>
                </div>
                <div className="absolute top-32 -right-4 bg-white/20 backdrop-blur-md rounded-xl px-3 py-2 border border-amber-400/40 flex items-center gap-2 z-20" style={{ animation: 'float 3s ease-in-out infinite' }}>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-200">AI 润色</span>
                </div>
                <div className="absolute bottom-24 -left-4 bg-white/20 backdrop-blur-md rounded-xl px-3 py-2 border border-blue-400/40 flex items-center gap-2 z-20" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '1s' }}>
                  <Wand className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-blue-200">关键词匹配</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 rounded-2xl p-5 flex items-center gap-4 bg-white/20 backdrop-blur-xl border border-white/30 z-30" style={{ animation: 'float 4s ease-in-out infinite' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500/30 border border-emerald-400/40">
                  <FileCheck className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">简历已优化</div>
                  <div className="text-xs text-white/50 mt-0.5">匹配度 98%</div>
                </div>
              </div>
              <div className="absolute -top-4 -left-8 rounded-2xl p-4 bg-white/20 backdrop-blur-xl border border-white/30 z-30" style={{ animation: 'float 5s ease-in-out infinite', animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/30 flex items-center justify-center border border-amber-400/40">
                    <Palette className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">80+ 模板</div>
                    <div className="text-[10px] text-white/50">7 种风格可选</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== Metrics ========== */
function MetricsSection() {
  const metrics = [
    { value: 80, suffix: '+', label: '精英模板', desc: '覆盖求职、升学、保研全场景', icon: Layout, gradient: 'from-indigo-500 to-purple-500', borderColors: ['#4F46E5', '#7C3AED', '#A855F7'] },
    { value: 7, suffix: '', label: '设计风格', desc: '极简到商务，一键切换', icon: Palette, gradient: 'from-pink-500 to-rose-400', borderColors: ['#EC4899', '#F472B6', '#FB7185'] },
    { value: 3, suffix: '', label: '步生成', desc: '选模板 → 填信息 → 导出', icon: Zap, gradient: 'from-cyan-500 to-blue-400', borderColors: ['#06B6D4', '#3B82F6', '#8B5CF6'] },
    { value: 100, suffix: '%', label: '免费使用', desc: '无隐藏收费，开箱即用', icon: Star, gradient: 'from-amber-500 to-orange-400', borderColors: ['#F59E0B', '#F97316', '#EF4444'] },
  ];

  const useCountUp = (target: number, duration = 2000) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    useEffect(() => {
      if (!ref.current) return;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const step = Math.ceil(target / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(start);
          }, 16);
          return () => clearInterval(timer);
        }
      }, { threshold: 0.3 });
      observer.observe(ref.current);
      return () => observer.disconnect();
    }, [target, duration, hasAnimated]);
    return { count, ref };
  };

  return (
    <section className="relative py-28 overflow-hidden bg-[#faf9f7]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-400/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-slate-200/60 mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-pink-400" />
            <span className="text-xs tracking-[0.3em] uppercase text-slate-500 font-medium">Premium Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif italic font-bold text-slate-800 tracking-wide">为什么选择我们</h2>
          <p className="text-slate-400 mt-3 text-base">数据驱动 · 智能高效 · 即刻提升你的简历竞争力</p>
        </div>

        <div className="space-y-5">
          {metrics.map((m, i) => {
            const { ref: cardRef, visible } = useOnScreen(0.2);
            const { count, ref: countRef } = useCountUp(m.value);
            return (
              <div key={i} ref={cardRef} className={`group relative transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="absolute -inset-[2px] rounded-3xl opacity-40 group-hover:opacity-70 transition-opacity" style={{ background: `conic-gradient(from 0deg, ${m.borderColors[0]}, ${m.borderColors[1]}, ${m.borderColors[2]}, ${m.borderColors[0]})`, animation: 'spinBorder 6s linear infinite', mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: '2px' }} />
                <div className="relative z-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 shadow-sm">
                  <div className="flex items-center gap-5 flex-1">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br ${m.gradient} bg-opacity-10 border border-slate-100`}>
                      <m.icon className="w-6 h-6" style={{ color: m.borderColors[0] }} />
                    </div>
                    <div>
                      <div ref={countRef} className={`text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r ${m.gradient} bg-clip-text text-transparent`}>
                        {count}<span className="text-slate-400">{m.suffix}</span>
                      </div>
                      <div className="text-lg font-semibold text-slate-800">{m.label}</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 md:text-right md:max-w-[200px]">{m.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`@keyframes spinBorder { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </section>
  );
}

/* ========== TechStack — Apple 风格自动轮播 ========== */
function TechStackSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const stacks = [
    { icon: Code2, color: "#0071e3", bg: "#eef2ff", title: "React 18", desc: "函数组件 + Hooks + TypeScript + Vite" },
    { icon: Server, color: "#34c759", bg: "#ecfdf5", title: "Hono + Drizzle", desc: "tRPC 风格 API + Drizzle ORM" },
    { icon: Database, color: "#f5a623", bg: "#fffbeb", title: "MySQL", desc: "关系型数据库 + MyBatis ORM" },
    { icon: Lock, color: "#5e5ce6", bg: "#f5f3ff", title: "权限控制", desc: "Session + JWT 双认证机制" },
    { icon: Cpu, color: "#bf5af2", bg: "#fdf2f8", title: "Vue 3", desc: "Composition API + 响应式绑定" },
    { icon: Globe, color: "#06c", bg: "#ecfeff", title: "Axios", desc: "HTTP 拦截 + 统一错误处理" },
    { icon: Layers, color: "#0071e3", bg: "#eef2ff", title: "Element Plus", desc: "企业级 UI + 表单验证" },
    { icon: Fingerprint, color: "#ff3b30", bg: "#fef2f2", title: "Maven", desc: "依赖管理 + 自动化构建" },
  ];

  const displayStacks = [...stacks, ...stacks];
  const cardWidth = 300;

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const nextScroll = el.scrollLeft + cardWidth;
      if (nextScroll >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'auto' });
        setActiveIndex(0);
      } else {
        el.scrollBy({ left: cardWidth, behavior: 'smooth' });
        setActiveIndex((p) => (p + 1) % stacks.length);
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused, stacks.length]);

  const scrollTo = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const delta = direction === 'left' ? -cardWidth : cardWidth;
    el.scrollBy({ left: delta, behavior: 'smooth' });
    setActiveIndex((p) => {
      if (direction === 'left') return (p - 1 + stacks.length) % stacks.length;
      return (p + 1) % stacks.length;
    });
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-[40px] md:text-[56px] font-semibold text-[#1d1d1f] leading-tight mb-4">
            全栈技术架构
          </h2>
          <p className="text-[17px] text-[#86868b] max-w-xl mx-auto leading-relaxed">
            前后端分离，企业级工程标准，从数据库到界面完整覆盖
          </p>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button
            onClick={() => scrollTo('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-[#e8e8ed] shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white"
          >
            <ChevronLeft className="w-5 h-5 text-[#1d1d1f]" />
          </button>

          <button
            onClick={() => scrollTo('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-[#e8e8ed] shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white"
          >
            <ChevronRight className="w-5 h-5 text-[#1d1d1f]" />
          </button>

          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-hidden px-4 py-4"
          >
            {displayStacks.map((s, i) => (
              <div
                key={i}
                className="group shrink-0 w-[280px]"
              >
                <div className="h-full rounded-[28px] p-7 bg-[#f5f5f7] border border-transparent hover:border-[#e8e8ed] hover:bg-white hover:shadow-2xl hover:shadow-black/[0.04] transition-all duration-500 cursor-pointer relative overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                    style={{ background: s.color }} 
                  />
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                    style={{ background: s.bg }}
                  >
                    <s.icon className="w-7 h-7" style={{ color: s.color }} />
                  </div>
                  <h3 className="text-[18px] font-semibold text-[#1d1d1f] mb-2 group-hover:text-[#0071e3] transition-colors duration-300">
                    {s.title}
                  </h3>
                  <p className="text-[14px] text-[#86868b] leading-relaxed">
                    {s.desc}
                  </p>
                  <div className="mt-6 h-[2px] rounded-full w-8 group-hover:w-full transition-all duration-700 ease-out" style={{ background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-10">
          {stacks.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const el = scrollRef.current;
                if (el) {
                  el.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
                  setActiveIndex(i);
                }
              }}
              className={`h-[6px] rounded-full transition-all duration-500 ${i === activeIndex ? 'w-6 bg-[#1d1d1f]' : 'w-[6px] bg-[#d2d2d7] hover:bg-[#86868b]'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
/* ========== Features（修复滚动显现 + 暖白背景） ========== */
function FeaturesSection() {
  const [showPrinciple, setShowPrinciple] = useState(false);
  const { ref: r1, visible: v1 } = useOnScreen(0.15);
  const { ref: r2, visible: v2 } = useOnScreen(0.15);
  const { ref: r3, visible: v3 } = useOnScreen(0.15);
  const { ref: r4, visible: v4 } = useOnScreen(0.15);
  const { ref: r5, visible: v5 } = useOnScreen(0.15);
  const { ref: r6, visible: v6 } = useOnScreen(0.15);

  return (
    <section className="relative py-28 overflow-hidden bg-[#faf9f7]">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-xs tracking-[0.2em] uppercase text-slate-500 font-semibold">Core Advantages</span>
          </div>
          <h2 className="font-serif italic text-4xl md:text-5xl font-bold text-slate-800">核心功能优势</h2>
        </div>
        
        <div className="space-y-24">
          {/* 01 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div ref={r1} className={`transition-all duration-700 ${v1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative rounded-3xl p-10 border shadow-lg bg-white border-slate-100">
                <div className="bg-slate-50 rounded-2xl p-8 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1.5 bg-slate-200 text-slate-600 text-xs font-bold rounded-full">原句</span>
                    <span className="text-slate-700 font-medium">负责网站开发</span>
                  </div>
                  <div className="flex justify-center mb-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #2563eb, #d97706)' }}>
                      <ArrowRight className="w-5 h-5 rotate-90" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">润色</span>
                    <span className="text-blue-700 font-semibold text-sm">主导全栈 Web 系统开发，独立完成前后端架构设计</span>
                  </div>
                </div>
              </div>
            </div>
            <div ref={r2} className={`transition-all duration-700 ${v2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '150ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-white border-slate-200 shadow-sm">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-slate-400 font-medium">01</span>
              </div>
              <h3 className="font-serif italic text-4xl font-bold text-slate-800 mb-6">AI 智能润色</h3>
              <p className="text-slate-500 leading-relaxed mb-6 text-lg">
                基于 <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-700 font-semibold text-sm mx-1">Kimi API</span> 大模型驱动的一键文本优化引擎，自动匹配岗位关键词，让经历描述更专业、更具吸引力。
              </p>
              <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">Kimi 大模型接入</div>
                  <div className="text-xs text-slate-500 mt-0.5">Moonshot AI · 超长上下文 · 智能语义理解</div>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-600">已接入</span>
                </div>
              </div>
              <button onClick={() => setShowPrinciple(!showPrinciple)} className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors mb-6">
                {showPrinciple ? '收起技术原理' : '查看技术原理'} 
                <ChevronRight className={`w-4 h-4 transition-transform ${showPrinciple ? 'rotate-90' : ''}`} />
              </button>
              {showPrinciple && (
                <div className="rounded-2xl p-7 border space-y-5 bg-white border-slate-100 shadow-sm">
                  {[
                    { num: '1', title: '语义解析层', desc: '分词与句法分析，提取核心动词与成果指标' },
                    { num: '2', title: '关键词匹配层', desc: 'TF-IDF 词向量空间，识别缺失高频能力词' },
                    { num: '3', title: '生成增强层', desc: '预训练模型重构为 STAR 结构化表达' },
                    { num: '4', title: '一致性校验层', desc: '规则引擎过滤敏感信息，符合中文规范' },
                  ].map((item) => (
                    <div key={item.num} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: 'linear-gradient(135deg, #2563eb, #d97706)' }}>
                        {item.num}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm mb-1">{item.title}</div>
                        <div className="text-xs text-slate-500 leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 02 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div ref={r3} className={`lg:order-1 transition-all duration-700 ${v3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-white border-slate-200 shadow-sm">
                  <Layout className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-sm text-slate-400 font-medium">02</span>
              </div>
              <h3 className="font-serif italic text-4xl font-bold text-slate-800 mb-6">多维度模板中心</h3>
              <p className="text-slate-500 leading-relaxed mb-6 text-lg">
                80+ 款精心设计的模板，覆盖求职、升学、保研等场景。支持极简、学术、科技、创意等多种风格。
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full text-xs font-medium border bg-white text-slate-600 border-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div ref={r4} className={`lg:order-2 transition-all duration-700 ${v4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '150ms' }}>
              <div 
                className="relative h-[400px] flex items-center justify-center group/cards"
                style={{ perspective: '1200px' }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
                  const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
                  e.currentTarget.style.setProperty('--mx', `${x * 15}deg`);
                  e.currentTarget.style.setProperty('--my', `${-y * 15}deg`);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--mx', '0deg');
                  e.currentTarget.style.setProperty('--my', '0deg');
                }}
              >
                <div className="absolute w-72 h-72 rounded-full bg-amber-100/30 blur-3xl transition-all duration-700 group-hover/cards:scale-125" />
                <div className="absolute w-56 h-56 rounded-full bg-blue-100/30 blur-3xl translate-x-8 transition-all duration-700 group-hover/cards:scale-110" />

                {[
                  { bg: 'linear-gradient(145deg, #fffbeb, #fef3c7)', accent: '#d97706', title: '学术风格', rotate: -10, x: -50, y: 30, z: 1, scene: '升学', style: '学术', lines: ['rgba(251,191,36,0.35)', 'rgba(245,158,11,0.25)', 'rgba(217,119,6,0.2)'] },
                  { bg: 'linear-gradient(145deg, #eff6ff, #dbeafe)', accent: '#2563eb', title: '极简风格', rotate: 0, x: 0, y: 0, z: 2, scene: '求职', style: '极简', lines: ['rgba(96,165,250,0.35)', 'rgba(59,130,246,0.25)', 'rgba(37,99,235,0.2)'] },
                  { bg: 'linear-gradient(145deg, #fdf2f8, #fce7f3)', accent: '#db2777', title: '创意风格', rotate: 10, x: 50, y: -30, z: 1, scene: '保研', style: '创意', lines: ['rgba(244,114,182,0.35)', 'rgba(236,72,153,0.25)', 'rgba(219,39,119,0.2)'] },
                ].map((card, i) => (
                  <div 
                    key={i} 
                    className="absolute w-[190px] h-[260px] rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 cursor-pointer group/card"
                    style={{ 
                      background: card.bg, 
                      transform: `translateX(${card.x}px) translateY(${card.y}px) rotate(${card.rotate}deg)`, 
                      zIndex: card.z === 2 ? 20 : 10 - i, 
                      boxShadow: `0 20px 40px -10px ${card.accent}25, 0 0 0 1px rgba(255,255,255,0.6) inset`,
                      transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)'
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
                      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
                      e.currentTarget.style.transform = `translateX(${card.x + x * 20}px) translateY(${card.y + y * 20}px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) scale(1.05)`;
                      e.currentTarget.style.zIndex = '30';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = `translateX(${card.x}px) translateY(${card.y}px) rotate(${card.rotate}deg)`;
                      e.currentTarget.style.zIndex = String(card.z === 2 ? 20 : 10 - i);
                    }}
                  >
                    <div className="h-1 w-full transition-all duration-300 group-hover/card:h-1.5" style={{ background: card.accent }} />
                    <div className="p-5 h-full flex flex-col relative">
                      {/* 悬浮光效 */}
                      <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: `radial-gradient(circle at 50% 0%, ${card.accent}10, transparent 70%)` }} />

                      <div className="flex items-center gap-2.5 mb-4 relative z-10">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover/card:scale-110 group-hover/card:rotate-3" style={{ background: `${card.accent}15` }}>
                          <Layout className="w-4 h-4" style={{ color: card.accent }} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-700">{card.title}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{card.style} · {card.scene}</div>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2 relative z-10">
                        <div className="h-2 rounded-full w-[55%] transition-all duration-300 group-hover/card:w-[65%]" style={{ background: card.lines[0] }} />
                        <div className="h-1.5 rounded-full w-full" style={{ background: card.lines[1] }} />
                        <div className="h-1.5 rounded-full w-[85%] transition-all duration-500 group-hover/card:w-[95%]" style={{ background: card.lines[1] }} />
                        <div className="h-1.5 rounded-full w-[70%]" style={{ background: card.lines[2] }} />
                        <div className="h-1.5 rounded-full w-[90%] transition-all duration-500 group-hover/card:w-full" style={{ background: card.lines[1] }} />
                        <div className="h-2 rounded-full w-[45%] transition-all duration-300 group-hover/card:w-[55%]" style={{ background: card.lines[0] }} />
                        <div className="h-1.5 rounded-full w-full" style={{ background: card.lines[2] }} />
                        <div className="h-1.5 rounded-full w-[75%]" style={{ background: card.lines[1] }} />
                        <div className="h-1.5 rounded-full w-[60%] transition-all duration-500 group-hover/card:w-[70%]" style={{ background: card.lines[2] }} />
                      </div>
                      <div className="flex gap-2 mt-4 pt-3 relative z-10" style={{ borderTop: `1px solid ${card.accent}12` }}>
                        <span className="text-[10px] px-2.5 py-1 rounded-full font-bold transition-all duration-300 group-hover/card:px-3.5" style={{ background: `${card.accent}12`, color: card.accent }}>{card.scene}</span>
                        <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-slate-50 text-slate-400 border border-slate-100 transition-all duration-300 group-hover/card:bg-white group-hover/card:shadow-sm">{card.style}</span>
                      </div>
                    </div>
                    {/* 角标装饰 */}
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-300 scale-0 group-hover/card:scale-100 flex items-center justify-center" style={{ background: card.accent }}>
                      <ArrowUpRight className="w-3 h-3 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div><div ref={r5} className={`transition-all duration-700 ${v5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div 
                className="relative rounded-3xl p-12 border shadow-xl flex items-center justify-center bg-white border-slate-100 overflow-hidden group/shield"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
                  const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
                  const shield = e.currentTarget.querySelector('.shield-svg') as HTMLElement;
                  if (shield) {
                    shield.style.transform = `translateX(${x * 8}px) translateY(${y * 8}px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
                  }
                }}
                onMouseLeave={(e) => {
                  const shield = e.currentTarget.querySelector('.shield-svg') as HTMLElement;
                  if (shield) shield.style.transform = 'translateX(0) translateY(0) rotateX(0) rotateY(0)';
                }}
              >
                <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, #1e293b 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="relative">
                  <div className="absolute inset-0 -m-12 rounded-full bg-blue-400/8 blur-3xl animate-pulse" />
                  <div className="absolute inset-0 -m-8 rounded-full bg-purple-400/5 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

                  <div className="relative w-52 h-52 flex items-center justify-center shield-svg transition-transform duration-200 ease-out" style={{ transformStyle: 'preserve-3d' }}>
                    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
                      <defs>
                        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="50%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                        <linearGradient id="shieldInner" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#eff6ff" />
                          <stop offset="100%" stopColor="#dbeafe" />
                        </linearGradient>
                        <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="transparent" />
                          <stop offset="50%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>

                      {/* 旋转虚线环 */}
                      <circle cx="100" cy="100" r="88" fill="none" stroke="url(#shieldGrad)" strokeWidth="0.5" opacity="0.2" strokeDasharray="6 4">
                        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="100" cy="100" r="80" fill="none" stroke="url(#shieldGrad)" strokeWidth="0.5" opacity="0.1" strokeDasharray="3 6">
                        <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="15s" repeatCount="indefinite" />
                      </circle>

                      {/* 脉动光晕 */}
                      <circle cx="100" cy="100" r="70" fill="url(#shieldGrad)" opacity="0">
                        <animate attributeName="r" values="70;75;70" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.05;0.1;0.05" dur="3s" repeatCount="indefinite" />
                      </circle>

                      {/* 盾牌主体 */}
                      <path d="M100 25 L165 52 L165 105 Q165 160 100 185 Q35 160 35 105 L35 52 Z" fill="url(#shieldInner)" stroke="url(#shieldGrad)" strokeWidth="2.5" opacity="0.9" />
                      <path d="M100 35 L155 57 L155 102 Q155 148 100 170 Q45 148 45 102 L45 57 Z" fill="none" stroke="url(#shieldGrad)" strokeWidth="1" opacity="0.2" />

                      {/* 锁图标 */}
                      <g transform="translate(75, 75)">
                        <path d="M25 12 L25 8 Q25 0 15 0 Q5 0 5 8 L5 12" fill="none" stroke="url(#shieldGrad)" strokeWidth="3" strokeLinecap="round" />
                        <rect x="0" y="12" width="50" height="38" rx="6" fill="url(#shieldGrad)" opacity="0.9" />
                        <circle cx="25" cy="28" r="4" fill="white" opacity="0.9" />
                        <path d="M25 28 L25 35" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                      </g>

                      {/* 扫描线 */}
                      <rect x="35" y="25" width="130" height="2" fill="url(#scanGrad)" opacity="0.6">
                        <animate attributeName="y" values="25;185;25" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
                      </rect>

                      {/* 底部装饰点 */}
                      <circle cx="100" cy="165" r="2" fill="url(#shieldGrad)" opacity="0.4" />
                      <circle cx="85" cy="158" r="1.5" fill="url(#shieldGrad)" opacity="0.25" />
                      <circle cx="115" cy="158" r="1.5" fill="url(#shieldGrad)" opacity="0.25" />
                    </svg>
                  </div>

                  {/* 右上角验证徽章 */}
                  <div className="absolute -top-2 -right-2 w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg border-2 border-emerald-100 transition-all duration-300 group-hover/shield:scale-110 group-hover/shield:rotate-6">
                    <svg viewBox="0 0 24 24" className="w-8 h-8">
                      <circle cx="12" cy="12" r="10" fill="#dcfce7" />
                      <path d="M7 12 L10.5 15.5 L17 9" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>

                  {/* 左下角状态标签 */}
                  <div className="absolute -bottom-3 -left-6 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white shadow-lg border border-slate-100 transition-all duration-300 group-hover/shield:-translate-y-1 group-hover/shield:shadow-xl">
                    <div className="relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-40" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">端到端加密</span>
                  </div>

                  {/* 右下角权限标签 */}
                  <div className="absolute -bottom-1 -right-8 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white shadow-lg border border-slate-100 transition-all duration-300 group-hover/shield:-translate-y-1 group-hover/shield:shadow-xl" style={{ transitionDelay: '50ms' }}>
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-[11px] font-bold text-slate-600">RBAC 权限</span>
                  </div>
                </div>
              </div>
            </div><div ref={r6} className={`transition-all duration-700 ${v6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '150ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-white border-slate-200 shadow-sm">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm text-slate-400 font-medium">03</span>
              </div>
              <h3 className="font-serif italic text-4xl font-bold text-slate-800 mb-6">零泄露与权限控制</h3>
              <p className="text-slate-500 leading-relaxed text-lg">
                端到端数据安全，admin / user 分级权限管理。后台用户列表采用 RESTful 分页查询，非法访问自动拦截。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== Methodology — Apple 风格网格 ========== */
function MethodologySection() {
  const methods = [
    { 
      icon: Target, 
      title: "STAR 法则", 
      subtitle: "STAR Method",
      desc: "情境 - 任务 - 行动 - 结果。用叙事方式展现项目经历，让 HR 一眼看到你的价值。",
      bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
      iconBg: "bg-blue-100",
      iconColor: "#2563eb",
      accent: "#2563eb"
    },
    { 
      icon: PenTool, 
      title: "量化表达", 
      subtitle: "Quantify Results",
      desc: '将"提升了性能"改写为"响应时间降低 35%"。数字是最有力的语言。',
      bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
      iconBg: "bg-emerald-100",
      iconColor: "#059669",
      accent: "#059669"
    },
    { 
      icon: Wand2, 
      title: "关键词匹配", 
      subtitle: "Keyword Match",
      desc: "AI 自动分析岗位 JD，提取核心关键词融入简历，提升 ATS 通过率。",
      bg: "bg-gradient-to-br from-purple-50 to-pink-50",
      iconBg: "bg-purple-100",
      iconColor: "#7c3aed",
      accent: "#7c3aed"
    },
    { 
      icon: BookOpen, 
      title: "结构化排版", 
      subtitle: "Structured Layout",
      desc: "遵循视觉层次理论，重要信息优先呈现，模块化布局行云流水。",
      bg: "bg-gradient-to-br from-amber-50 to-orange-50",
      iconBg: "bg-amber-100",
      iconColor: "#d97706",
      accent: "#d97706"
    },
  ];

  return (
    <section className="relative py-28 overflow-hidden bg-[#faf9f7]">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-xs tracking-[0.2em] uppercase text-slate-500 font-semibold">Methodology</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">专业的简历构建方法</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            科学的简历撰写方法论，从内容组织到视觉呈现，全面提升简历竞争力
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {methods.map((m, i) => {
            const { ref, visible } = useOnScreen(0.15);
            return (
              <div 
                key={i} 
                ref={ref}
                className={`group relative rounded-[2rem] p-8 md:p-10 ${m.bg} border border-slate-100/60 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-500 cursor-default overflow-hidden ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* 装饰背景圆 */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-700" style={{ background: m.accent }} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 rounded-2xl ${m.iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <m.icon className="w-8 h-8" style={{ color: m.iconColor }} />
                    </div>
                    <span className="text-5xl font-bold opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{ color: m.accent }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mb-3">
                    <h4 className="text-2xl font-bold text-slate-900 mb-1">{m.title}</h4>
                    <p className="text-sm font-medium tracking-wider uppercase" style={{ color: m.accent }}>{m.subtitle}</p>
                  </div>

                  <p className="text-base text-slate-500 leading-relaxed max-w-sm">
                    {m.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}/* ========== TemplatesPreview — 精致流动模板画廊 ========== */
function TemplatesPreview() {
  const templateCards = Array.from({ length: 24 }, (_, i) => {
    const catIdx = i % 7;
    const sceneIdx = i % 3;
    const c = colors[catIdx];
    const sizes = [
      { w: 180, h: 240, scale: 1 },
      { w: 160, h: 220, scale: 0.92 },
      { w: 200, h: 260, scale: 1.08 },
      { w: 170, h: 230, scale: 0.96 },
    ];
    const size = sizes[i % 4];
    const rotations = [-3, 2, -2, 4, -4, 3, -1, 5];
    const yOffsets = [0, 10, -8, 15, -5, 8, -12, 6];
    return {
      id: i + 1,
      name: `${categories[catIdx]}风格模板 ${String(i + 1).padStart(2, '0')}`,
      category: categories[catIdx],
      scene: scenes[sceneIdx],
      color: c,
      isHot: i < 8,
      isNew: i >= 20,
      width: size.w,
      height: size.h,
      rotate: rotations[i % 8],
      yOffset: yOffsets[i % 8],
    };
  });

  const topRow = templateCards.slice(0, 12);
  const bottomRow = templateCards.slice(12, 24);

  const Card = ({ t }: { t: typeof templateCards[0] }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setTilt({ x: y * 12, y: -x * 12 });
    };

    return (
      <div
        className="shrink-0 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:z-10 transition-all duration-300 cursor-pointer overflow-hidden group"
        style={{
          width: t.width,
          height: t.height,
          transform: `rotate(${t.rotate}deg) translateY(${t.yOffset}px) ${isHovered ? `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.06)` : ''}`,
          transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
          boxShadow: isHovered ? `0 25px 50px -12px ${t.color}20` : undefined,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setTilt({ x: 0, y: 0 }); }}
        onMouseMove={handleMouseMove}
      >
        {/* 顶部色条 */}
        <div className="h-[3px] w-full" style={{ background: t.color }} />

        <div className="p-4 h-full flex flex-col relative">
          {/* 悬浮光效 */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 0%, ${t.color}08, transparent 60%)` }}
          />

          {/* 头部信息 */}
          <div className="flex items-center gap-2.5 mb-3 relative z-10">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0 transition-transform duration-300 group-hover:scale-110"
              style={{ background: t.color }}
            >
              {t.category[0]}
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-800 truncate">{t.name}</div>
              <div className="text-[9px] text-slate-400 font-medium">{t.category} · {t.scene}</div>
            </div>
            <div className="ml-auto flex gap-1">
              {t.isHot && (
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-red-50 text-red-500 font-bold border border-red-100">
                  HOT
                </span>
              )}
              {t.isNew && (
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-500 font-bold border border-emerald-100">
                  NEW
                </span>
              )}
            </div>
          </div>

          {/* 模拟简历内容 — 更精致 */}
          <div className="flex-1 space-y-1.5 relative z-10">
            {/* 姓名行 */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full" style={{ background: `${t.color}30` }} />
              </div>
              <div className="h-2 rounded-full w-[45%]" style={{ background: `${t.color}25` }} />
            </div>
            {/* 分隔线 */}
            <div className="h-px bg-slate-50 my-1.5" />
            {/* 内容行 */}
            <div className="h-1.5 rounded-full w-full" style={{ background: `${t.color}15` }} />
            <div className="h-1.5 rounded-full w-[90%]" style={{ background: `${t.color}12` }} />
            <div className="h-1.5 rounded-full w-[75%]" style={{ background: `${t.color}15` }} />
            <div className="h-1.5 rounded-full w-[85%]" style={{ background: `${t.color}12` }} />
            <div className="h-1.5 rounded-full w-[60%]" style={{ background: `${t.color}15` }} />
            {/* 第二段 */}
            <div className="h-px bg-slate-50 my-1.5" />
            <div className="h-1.5 rounded-full w-full" style={{ background: `${t.color}12` }} />
            <div className="h-1.5 rounded-full w-[70%]" style={{ background: `${t.color}15` }} />
            <div className="h-1.5 rounded-full w-[80%]" style={{ background: `${t.color}12` }} />
            <div className="h-1.5 rounded-full w-[55%]" style={{ background: `${t.color}15` }} />
            {/* 第三段 */}
            <div className="h-px bg-slate-50 my-1.5" />
            <div className="h-1.5 rounded-full w-[90%]" style={{ background: `${t.color}12` }} />
            <div className="h-1.5 rounded-full w-[65%]" style={{ background: `${t.color}15` }} />
          </div>

          {/* 底部标签 */}
          <div className="flex gap-1.5 mt-3 pt-2.5 relative z-10" style={{ borderTop: `1px solid ${t.color}08` }}>
            <span 
              className="text-[9px] px-2 py-1 rounded-full font-bold text-white transition-all duration-300 group-hover:px-2.5"
              style={{ background: t.color }}
            >
              {t.scene}
            </span>
            <span className="text-[9px] px-2 py-1 rounded-full font-medium bg-slate-50 text-slate-400 border border-slate-100 transition-all duration-300 group-hover:bg-white group-hover:shadow-sm">
              {t.category}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative py-20 overflow-hidden bg-[#faf9f7]">
      {/* 上方流动行 — 向左 */}
      <div className="relative mb-8 overflow-hidden">
        <div className="flex gap-4 items-end animate-flow-left w-max hover:[animation-play-state:paused]">
          {[...topRow, ...topRow, ...topRow].map((t, i) => (
            <Card key={`top-${t.id}-${i}`} t={t} />
          ))}
        </div>
        {/* 左侧渐变遮罩 */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#faf9f7] to-transparent z-10 pointer-events-none" />
        {/* 右侧渐变遮罩 */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#faf9f7] to-transparent z-10 pointer-events-none" />
      </div>

      {/* 中间标题 */}
      <div className="relative z-10 py-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-xs tracking-[0.2em] uppercase text-slate-500 font-semibold">
              Template Gallery
            </span>
          </div>
          <h2 className="font-serif italic text-5xl md:text-6xl font-bold text-slate-800 mb-5">
            精选简历模板
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg mb-8">
            80+ 款专业模板，覆盖 7 种风格与 3 大场景
          </p>
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            查看全部 80+ 模板 <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 下方流动行 — 向右 */}
      <div className="relative mt-8 overflow-hidden">
        <div className="flex gap-4 items-start animate-flow-right w-max hover:[animation-play-state:paused]">
          {[...bottomRow, ...bottomRow, ...bottomRow].map((t, i) => (
            <Card key={`bottom-${t.id}-${i}`} t={t} />
          ))}
        </div>
        {/* 左侧渐变遮罩 */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#faf9f7] to-transparent z-10 pointer-events-none" />
        {/* 右侧渐变遮罩 */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#faf9f7] to-transparent z-10 pointer-events-none" />
      </div>

      <style>{`
        @keyframes flow-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes flow-right {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
        .animate-flow-left {
          animation: flow-left 50s linear infinite;
        }
        .animate-flow-right {
          animation: flow-right 50s linear infinite;
        }
      `}</style>
    </section>
  );
}
/* ========== CTA ========== */
function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 生成金色粒子
  const particles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 1,
      delay: Math.random() * 6,
      duration: Math.random() * 4 + 2,
      opacity: Math.random() * 0.6 + 0.2,
    }));
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #faf9f7 30%, #fffefb 50%, #faf9f7 75%, #ffffff 100%)' }}
    >
      {/* 金色粒子层 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle, rgba(180,160,100,${p.opacity * 0.6}) 0%, transparent 70%)`,
              boxShadow: `0 0 ${p.size * 4}px rgba(200,180,140,${p.opacity * 0.3})`,
              animation: `goldenTwinkle ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* 鼠标跟随光晕 */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(251,191,36,0.08) 0%, rgba(255,255,255,0.12) 30%, transparent 60%)`,
        }}
      />

      {/* 顶部金色光晕 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.08) 0%, rgba(255,255,255,0.15) 40%, transparent 70%)',
        }}
      />

      {/* 底部光晕 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(251,191,36,0.05) 0%, transparent 60%)',
        }}
      />

      {/* 浮动装饰圆 */}
      <div className="absolute top-20 left-[15%] w-20 h-20 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,180,140,0.06) 0%, transparent 70%)',
          animation: 'goldenFloat 8s ease-in-out infinite',
        }}
      />
      <div className="absolute top-40 right-[20%] w-16 h-16 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(180,160,120,0.04) 0%, transparent 70%)',
          animation: 'goldenFloat 10s ease-in-out 2s infinite',
        }}
      />
      <div className="absolute bottom-32 left-[25%] w-24 h-24 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,180,140,0.04) 0%, transparent 70%)',
          animation: 'goldenFloat 12s ease-in-out 4s infinite',
        }}
      />

      {/* 星座连线装饰 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" preserveAspectRatio="none">
        <defs>
          <linearGradient id="goldenLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251,191,36,0.4)" />
            <stop offset="100%" stopColor="rgba(217,119,6,0.2)" />
          </linearGradient>
        </defs>
        <line x1="8%" y1="15%" x2="22%" y2="30%" stroke="url(#goldenLine)" strokeWidth="0.5" strokeDasharray="3 6" />
        <line x1="22%" y1="30%" x2="18%" y2="55%" stroke="url(#goldenLine)" strokeWidth="0.5" strokeDasharray="3 6" />
        <line x1="78%" y1="10%" x2="88%" y2="25%" stroke="url(#goldenLine)" strokeWidth="0.5" strokeDasharray="3 6" />
        <line x1="88%" y1="25%" x2="82%" y2="50%" stroke="url(#goldenLine)" strokeWidth="0.5" strokeDasharray="3 6" />
        <circle cx="8%" cy="15%" r="2" fill="rgba(251,191,36,0.5)">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="22%" cy="30%" r="2" fill="rgba(251,191,36,0.5)">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" begin="1s" />
        </circle>
        <circle cx="78%" cy="10%" r="2" fill="rgba(217,119,6,0.4)">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="4s" repeatCount="indefinite" begin="0.5s" />
        </circle>
        <circle cx="88%" cy="25%" r="2" fill="rgba(217,119,6,0.4)">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="4s" repeatCount="indefinite" begin="1.5s" />
        </circle>
      </svg>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* 顶部标签 */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 transition-all duration-300 hover:scale-105"
          style={{ 
            background: 'rgba(251,191,36,0.06)', 
            border: '1px solid rgba(200,180,140,0.25)',
            backdropFilter: 'blur(10px)'
          }}>
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span className="text-xs tracking-[0.2em] uppercase font-semibold text-amber-700">开始创建</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* 主标题 — 带光效 */}
        <h2 
          className="font-serif italic text-5xl md:text-6xl font-bold mb-6 leading-tight"
          style={{
            background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 30%, #fbbf24 50%, #f59e0b 70%, #d97706 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 40px rgba(251,191,36,0.3))',
          }}
        >
          让每一份简历都闪闪发光
        </h2>

        {/* 副标题 */}
        <p className="text-amber-700/50 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
          选择模板，填写信息，AI 智能优化。三步生成你的专属简历。
        </p>

        {/* 按钮组 */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/templates" 
            className="group inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#fff',
              boxShadow: '0 10px 30px -5px rgba(217,119,6,0.4)',
            }}
          >
            立即开始创建 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/editor" 
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border"
            style={{
              background: 'rgba(255,255,255,0.8)',
              borderColor: 'rgba(200,180,140,0.4)',
              color: '#d97706',
              backdropFilter: 'blur(10px)',
            }}
          >
            直接进入编辑器
          </Link>
        </div>

        {/* 底部装饰数据 */}
        <div className="flex justify-center gap-16 mt-16 pt-8" style={{ borderTop: '1px solid rgba(200,180,140,0.15)' }}>
          {[
            { num: '80+', label: '专业模板', color: '#d97706' },
            { num: '3', label: '步生成', color: '#2563eb' },
            { num: '100%', label: '免费', color: '#d97706' },
          ].map((item) => (
            <div key={item.label} className="text-center group cursor-default">
              <div 
                className="text-3xl font-bold mb-1 transition-all duration-300 group-hover:scale-110"
                style={{ color: item.color, textShadow: `0 0 20px ${item.color}20` }}
              >
                {item.num}
              </div>
              <div className="text-xs text-amber-600/50 tracking-wide">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes goldenTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes goldenFloat {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-15px) translateX(5px); }
          66% { transform: translateY(8px) translateX(-8px); }
        }
      `}</style>
    </section>
  );
}
/* ========== Footer ========== */
function Footer() {
  return (
    <footer 
      className="relative py-16 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #faf9f7 0%, #ffffff 40%, #fffefb 70%, #ffffff 100%)' }}
    >
      {/* 顶部金色分隔线 */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,180,140,0.2), transparent)' }} />

      {/* 背景金色粒子 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 25 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              background: `radial-gradient(circle, rgba(180,160,100,${Math.random() * 0.2 + 0.05}) 0%, transparent 70%)`,
              animation: `goldenTwinkle ${Math.random() * 4 + 3}s ease-in-out ${Math.random() * 5}s infinite`,
            }}
          />
        ))}
      </div>

      {/* 浮动光晕 */}
      <div className="absolute top-10 right-[20%] w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,180,140,0.04) 0%, transparent 70%)',
          animation: 'goldenFloat 10s ease-in-out infinite',
        }}
      />
      <div className="absolute bottom-20 left-[15%] w-24 h-24 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(180,160,120,0.03) 0%, transparent 70%)',
          animation: 'goldenFloat 8s ease-in-out 3s infinite',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
              >
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-amber-800">让每一份简历都闪闪发光</span>
            </div>
            <p className="text-amber-800/50 text-sm leading-relaxed max-w-sm">
              基于 React 18 + Hono + Drizzle 全栈架构，融合 AI 智能润色引擎与多维度模板系统，助力每一位求职者打造高质量简历。
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm text-amber-700">产品</h4>
            <ul className="space-y-3 text-sm text-amber-800/50">
              <li><Link to="/templates" className="hover:text-amber-600 transition-colors">模板中心</Link></li>
              <li><Link to="/editor" className="hover:text-amber-600 transition-colors">简历编辑器</Link></li>
              <li><Link to="/ai" className="hover:text-amber-600 transition-colors">AI 润色</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm text-amber-700">支持</h4>
            <ul className="space-y-3 text-sm text-amber-800/50">
              <li><span className="hover:text-amber-600 transition-colors cursor-pointer">使用指南</span></li>
              <li><span className="hover:text-amber-600 transition-colors cursor-pointer">常见问题</span></li>
              <li><span className="hover:text-amber-600 transition-colors cursor-pointer">联系我们</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-amber-100/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-amber-700/40 text-xs">© 2026 AI Resume Builder. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-amber-700/40">
            <span className="hover:text-amber-600 cursor-pointer transition-colors">隐私政策</span>
            <span className="hover:text-amber-600 cursor-pointer transition-colors">用户协议</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
/* ========== 主页面组件 ========== */

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <HeroSection />
        <MetricsSection />
        <TechStackSection />
        <FeaturesSection />
        <MethodologySection />
        <TemplatesPreview />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}