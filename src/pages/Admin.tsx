import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { Navigate, Routes, Route, Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'sonner';
import { Plus, Trash2, Check, Clock, User, Filter } from 'lucide-react';

const AdminDashboard = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qInquiries = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubInquiries = onSnapshot(qInquiries, (snapshot) => {
      setInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qPortfolio = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
    const unsubPortfolio = onSnapshot(qPortfolio, (snapshot) => {
      setPortfolio(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubInquiries();
      unsubPortfolio();
    };
  }, []);

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { status });
      toast.success('상태가 업데이트되었습니다.');
    } catch (error) {
      toast.error('업데이트 실패');
    }
  };

  const deletePortfolioItem = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'portfolio', id));
      toast.success('삭제되었습니다.');
    } catch (error) {
      toast.error('삭제 실패');
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card">
          <div className="text-white/40 text-sm mb-2">총 문의</div>
          <div className="text-4xl font-black">{inquiries.length}</div>
        </div>
        <div className="glass-card">
          <div className="text-white/40 text-sm mb-2">새 문의</div>
          <div className="text-4xl font-black text-brand-purple">
            {inquiries.filter(i => i.status === 'New').length}
          </div>
        </div>
        <div className="glass-card">
          <div className="text-white/40 text-sm mb-2">포트폴리오</div>
          <div className="text-4xl font-black">{portfolio.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Inquiries List */}
        <div className="glass-card">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Clock size={24} className="text-brand-purple" /> 최근 문의 내역
          </h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {inquiries.map(inquiry => (
              <div key={inquiry.id} className="p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold">{inquiry.name}</div>
                    <div className="text-xs text-white/40">{inquiry.email}</div>
                  </div>
                  <select
                    value={inquiry.status}
                    onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                    className="bg-brand-black border border-white/10 rounded px-2 py-1 text-xs"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <p className="text-sm text-white/70 line-clamp-2 mb-2">{inquiry.message}</p>
                {inquiry.attachmentName && (
                  <div className="flex items-center gap-2 text-[10px] text-brand-purple-light mb-2 bg-brand-purple/10 w-fit px-2 py-1 rounded-md">
                    <Plus size={10} /> 첨부파일: {inquiry.attachmentName}
                  </div>
                )}
                <div className="text-[10px] text-white/30">
                  {inquiry.createdAt?.toDate().toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Management */}
        <div className="glass-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Filter size={24} className="text-brand-purple" /> 포트폴리오 관리
            </h2>
            <Link to="/admin/portfolio/new" className="p-2 glass rounded-lg text-brand-purple hover:bg-brand-purple/20 transition-colors">
              <Plus size={20} />
            </Link>
          </div>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {portfolio.map(item => (
              <div key={item.id} className="flex gap-4 p-3 bg-white/5 rounded-xl items-center">
                <img src={item.imageUrl} className="w-16 h-16 rounded-lg object-cover" referrerPolicy="no-referrer" />
                <div className="flex-grow">
                  <div className="font-bold text-sm">{item.title}</div>
                  <div className="text-xs text-brand-purple">{item.category}</div>
                </div>
                <button 
                  onClick={() => deletePortfolioItem(item.id)}
                  className="text-white/30 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PortfolioEditor = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Logo');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'portfolio'), {
        title,
        category,
        imageUrl,
        description,
        createdAt: serverTimestamp()
      });
      toast.success('포트폴리오가 추가되었습니다.');
      // Reset
      setTitle('');
      setImageUrl('');
      setDescription('');
    } catch (error) {
      toast.error('추가 실패');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card">
        <h2 className="text-2xl font-bold mb-8">새 포트폴리오 추가</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-white/60 mb-2">제목</label>
            <input 
              value={title} onChange={e => setTitle(e.target.value)} required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">카테고리</label>
            <select 
              value={category} onChange={e => setCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple"
            >
              <option value="Logo">Logo</option>
              <option value="Website">Website</option>
              <option value="Branding">Branding</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">이미지 URL</label>
            <input 
              value={imageUrl} onChange={e => setImageUrl(e.target.value)} required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple"
              placeholder="https://picsum.photos/..."
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">설명</label>
            <textarea 
              value={description} onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple resize-none"
            />
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={submitting} className="btn-primary flex-grow">
              {submitting ? '저장 중...' : '저장하기'}
            </button>
            <Link to="/admin" className="btn-outline">취소</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const Admin = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="py-24 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black tracking-tighter">Admin <span className="text-brand-purple">Panel</span></h1>
        <Link to="/admin" className="text-sm text-white/60 hover:text-white">대시보드 홈</Link>
      </div>
      
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/portfolio/new" element={<PortfolioEditor />} />
      </Routes>
    </div>
  );
};

export default Admin;
