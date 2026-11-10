import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";  // ← 新增 useLocation
import { useAuth } from "@/hooks/useAuth";
import { LogIn, UserPlus, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();  // ← 新增
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 获取被拦截前的页面路径，默认进 dashboard
  const from = (location.state as any)?.from || "/dashboard";

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const doMockLogin = () => {
    console.warn("后端未连接，使用本地 Mock 登录");
    const mockUser = { 
      id: 1, 
      username: form.username, 
      name: form.username,
      email: form.email || "user@example.com" 
    };
    const mockToken = "mock-token-" + Date.now();
    login(mockUser, mockToken);
    navigate(from, { replace: true });  // ← 改这里：跳回被拦截前的页面
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.username.trim()) { setError("请输入用户名"); return; }
    if (!form.password.trim()) { setError("请输入密码"); return; }

    if (isRegister) {
      if (!form.email.trim()) { setError("请输入邮箱"); return; }
      if (form.password !== form.confirmPassword) { setError("两次密码不一致"); return; }
      if (form.password.length < 6) { setError("密码至少6位"); return; }
    }

    setLoading(true);

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister 
        ? { username: form.username, email: form.email, password: form.password }
        : { username: form.username, password: form.password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        doMockLogin();
        return;
      }

      if (!res.ok) {
        if (data.message) {
          setError(data.message);
          return;
        }
        doMockLogin();
        return;
      }

      if (data.token && data.user) {
        login(data.user, data.token);
        navigate(from, { replace: true });  // ← 改这里：跳回被拦截前的页面
      } else {
        setError("登录响应格式错误");
      }
    } catch (err: any) {
      const msg = err?.message || "";
      const isNetworkError = 
        msg.includes("fetch") || msg.includes("network") || msg.includes("Failed") ||
        msg.includes("CORS") || msg.includes("ERR_CONNECTION") ||
        msg.includes("无法连接") || !msg;

      if (isNetworkError) {
        doMockLogin();
      } else {
        setError(msg || "请求失败，请稍后重试");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center px-4">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> 返回首页
      </Link>

      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <span className="text-white text-xl font-bold">W</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">web课程设计</h1>
          <p className="text-sm text-slate-500">{isRegister ? "创建你的账号" : "欢迎回来"}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
          <div className="flex bg-slate-100 rounded-lg p-0.5 mb-6">
            <button 
              onClick={() => { setIsRegister(false); setError(""); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${!isRegister ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >登录</button>
            <button 
              onClick={() => { setIsRegister(true); setError(""); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${isRegister ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >注册</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">用户名</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => updateField("username", e.target.value)}
                placeholder="请输入用户名"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">邮箱</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="example@email.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">密码</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder={isRegister ? "至少6位密码" : "请输入密码"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 pr-10 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">确认密码</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  placeholder="再次输入密码"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              {loading ? "处理中..." : isRegister ? "注册账号" : "立即登录"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-4">
            {isRegister ? "已有账号？" : "还没有账号？"}
            <button onClick={() => { setIsRegister(!isRegister); setError(""); }} className="text-blue-600 hover:text-blue-700 font-medium ml-1">
              {isRegister ? "去登录" : "去注册"}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          登录即表示你同意我们的服务条款和隐私政策
        </p>
      </div>
    </div>
  );
}