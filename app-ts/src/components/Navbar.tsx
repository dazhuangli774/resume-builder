import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [inputName, setInputName] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogin = async () => {
    if (!inputName.trim() || !inputPassword.trim()) {
      alert("请输入用户名和密码");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: inputName.trim(), 
          password: inputPassword.trim()
        }),
      });
      const data = await res.json();
      if (data.code === 1) {
        sessionStorage.setItem("user", JSON.stringify(data.data));
        setUser(data.data);
        setShowLogin(false);
        setInputName("");
        setInputPassword("");
        window.location.reload();
      } else {
        alert(data.msg);
      }
    } catch (e) {
      alert("登录失败，请检查后端服务是否启动");
    }
  };

  const handleRegister = async () => {
    if (!inputName.trim() || !inputPassword.trim()) {
      alert("请输入用户名和密码");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: inputName.trim(), 
          password: inputPassword.trim()
        }),
      });
      const data = await res.json();
      if (data.code === 1) {
        alert("注册成功，请登录");
        setIsRegister(false);
        setInputPassword("");
      } else {
        alert(data.msg);
      }
    } catch (e) {
      alert("注册失败，请检查后端服务是否启动");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  const baseLinks = [
    { label: "首页", href: "/" },
    { label: "模板中心", href: "/templates" },
    { label: "我的简历", href: "/my-resumes" },
    { label: "编辑器", href: "/editor" },
    { label: "仪表盘", href: "/dashboard" },
  ];

  const navLinks = user?.role === "admin" 
    ? [...baseLinks, { label: "后台管理", href: "http://localhost:8080/user_list.html" }]
    : baseLinks;

  const isActive = (path: string) => location.pathname === path;
  const isExternal = (href: string) => href.startsWith("http");

  // 根据滚动状态决定颜色
  const textColor = scrolled ? "text-slate-600" : "text-white/90";
  const textHover = scrolled ? "hover:text-slate-900" : "hover:text-white";
  const activeColor = scrolled ? "text-blue-600" : "text-amber-300";
  const logoColor = scrolled ? "text-slate-800" : "text-white";
  const userText = scrolled ? "text-slate-500" : "text-white/80";
  const logoutText = scrolled ? "text-slate-400 hover:text-slate-600" : "text-white/60 hover:text-white";
  const menuIcon = scrolled ? "text-slate-600" : "text-white";

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm" 
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className={`font-body text-xl font-bold tracking-wide transition-colors duration-300 ${logoColor}`}>
              web课程设计
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              isExternal(link.href) ? (
                <a 
                  key={link.label} 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-lg font-bold transition-all duration-300 ${textColor} ${textHover}`}
                >
                  {link.label}
                </a>
              ) : (
                <Link 
                  key={link.href} 
                  to={link.href}
                  className={`text-lg font-bold transition-all duration-300 ${
                    isActive(link.href) ? activeColor : `${textColor} ${textHover}`
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l transition-colors duration-300"
                style={{ borderColor: scrolled ? "rgba(226,232,240,0.6)" : "rgba(255,255,255,0.2)" }}
              >
                <span className={`text-lg font-bold transition-colors duration-300 ${userText}`}>
                  欢迎，{user.username || "用户"}
                </span>
                <button 
                  onClick={handleLogout}
                  className={`text-lg font-semibold transition-colors duration-300 ${logoutText}`}
                >
                  退出
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { setShowLogin(true); setIsRegister(false); }}
                className={`text-lg px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  scrolled 
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg" 
                    : "bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 hover:border-white/50"
                }`}
              >
                登录
              </button>
            )}
          </div>

          <button 
            className={`md:hidden transition-colors duration-300 ${menuIcon}`} 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* 移动端菜单 */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className={`px-6 py-4 space-y-3 border-t transition-colors duration-300 ${
            scrolled 
              ? "bg-white/95 backdrop-blur-xl border-slate-100 shadow-lg" 
              : "bg-black/30 backdrop-blur-xl border-white/10"
          }`}>
            {navLinks.map((link) => (
              isExternal(link.href) ? (
                <a 
                  key={link.label} 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`block text-lg font-bold transition-colors duration-300 ${
                    scrolled ? "text-slate-600 hover:text-blue-600" : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              ) : (
                <Link 
                  key={link.href} 
                  to={link.href} 
                  onClick={() => setMenuOpen(false)}
                  className={`block text-lg font-bold transition-colors duration-300 ${
                    isActive(link.href) 
                      ? (scrolled ? "text-blue-600" : "text-amber-300") 
                      : (scrolled ? "text-slate-600 hover:text-blue-600" : "text-white/80 hover:text-white")
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
            {user ? (
              <button 
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className={`block text-lg font-semibold transition-colors duration-300 ${
                  scrolled ? "text-slate-500 hover:text-slate-700" : "text-white/60 hover:text-white"
                }`}
              >
                退出登录
              </button>
            ) : (
              <button 
                onClick={() => { setShowLogin(true); setMenuOpen(false); }} 
                className={`block text-lg font-bold transition-colors duration-300 ${
                  scrolled ? "text-blue-600" : "text-amber-300"
                }`}
              >
                登录
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 登录/注册弹窗 */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={() => setShowLogin(false)}>
          <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">
              {{true: '用户注册', false: '用户登录'}[isRegister.toString()]}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-bold text-slate-600 mb-1">用户名</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入用户名"
                  value={inputName}
                  onChange={e => setInputName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-slate-600 mb-1">密码</label>
                <input 
                  type="password" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入密码"
                  value={inputPassword}
                  onChange={e => setInputPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (isRegister ? handleRegister() : handleLogin())}
                />
              </div>
              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                onClick={isRegister ? handleRegister : handleLogin}
              >
                {{true: '注册', false: '登录'}[isRegister.toString()]}
              </button>
              <p className="text-center text-xs text-slate-400">
                {isRegister ? '已有账号？' : '没有账号？'}
                <span 
                  className="text-blue-600 cursor-pointer hover:underline" 
                  onClick={() => { setIsRegister(!isRegister); setInputPassword(""); }}
                >
                  {{true: '去登录', false: '去注册'}[isRegister.toString()]}
                </span>
              </p>
            </div>
            <button className="w-full mt-4 text-slate-400 text-sm hover:text-slate-600" onClick={() => setShowLogin(false)}>取消</button>
          </div>
        </div>
      )}
    </>
  );
}