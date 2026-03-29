import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './AuthContext';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { Menu, X, Instagram, MessageCircle, Facebook, LayoutDashboard, LogOut, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('로그인되었습니다.');
    } catch (error) {
      toast.error('로그인에 실패했습니다.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('로그아웃되었습니다.');
  };

  const navLinks = [
    { name: '홈', path: '/' },
    { name: '소개', path: '/about' },
    { name: '서비스', path: '/services' },
    { name: '포트폴리오', path: '/portfolio' },
    { name: '문의하기', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
              <span className="text-brand-purple">W</span>ORLD INTECH
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-brand-purple ${
                    location.pathname === link.path ? 'text-brand-purple' : 'text-white/70'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" className="text-white/70 hover:text-brand-purple transition-colors">
                  <LayoutDashboard size={20} />
                </Link>
              )}
              {user ? (
                <button onClick={handleLogout} className="text-white/70 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              ) : (
                <button onClick={handleLogin} className="text-white/70 hover:text-brand-purple transition-colors">
                  <LogIn size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            {isAdmin && <Link to="/admin" className="text-white/70"><LayoutDashboard size={20} /></Link>}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-brand-purple/20"
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <button
                  onClick={() => { handleLogin(); setIsOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-brand-purple/20"
                >
                  로그인
                </button>
              )}
              {user && (
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-500/10"
                >
                  로그아웃
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-brand-black border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-black tracking-tighter mb-4">
              <span className="text-brand-purple">W</span>ORLD INTECH
            </h2>
            <p className="text-white/60 max-w-md">
              월드인텍은 로고 디자인과 홈페이지 제작을 통해 브랜드의 가치를 높이는 전문 디자인 스튜디오입니다.
              혁신적인 기술과 감각적인 디자인으로 비즈니스의 성공을 지원합니다.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-white/60">
              <li><Link to="/about" className="hover:text-brand-purple transition-colors">회사 소개</Link></li>
              <li><Link to="/services" className="hover:text-brand-purple transition-colors">서비스</Link></li>
              <li><Link to="/portfolio" className="hover:text-brand-purple transition-colors">포트폴리오</Link></li>
              <li><Link to="/contact" className="hover:text-brand-purple transition-colors">견적 문의</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Social</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-brand-purple transition-colors"><Instagram size={24} /></a>
              <a href="#" className="text-white/60 hover:text-brand-purple transition-colors"><MessageCircle size={24} /></a>
              <a href="#" className="text-white/60 hover:text-brand-purple transition-colors"><Facebook size={24} /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-white/40 text-sm">
          © 2026 월드인텍 (World InTech). All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-20">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin/*" element={<Admin />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
          <Toaster position="top-center" theme="dark" />
        </div>
      </Router>
    </AuthProvider>
  );
}
