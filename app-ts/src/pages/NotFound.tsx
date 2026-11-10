import { Link } from "react-router";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="font-display text-8xl font-extralight text-blue-200 mb-4">404</h1>
        <h2 className="text-2xl text-slate-700 mb-4">页面不存在</h2>
        <p className="text-slate-400 mb-8">你似乎来到了一个未知的领域...</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-md">
          <Home className="w-4 h-4" />返回首页
        </Link>
      </div>
    </div>
  );
}
