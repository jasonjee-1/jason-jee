import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

const Portfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const portfolioData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PortfolioItem[];
      setItems(portfolioData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sample data if empty
  const displayItems = items.length > 0 ? items : [
    { id: '1', title: '로고 디자인 샘플 1', category: 'Logo', imageUrl: 'https://picsum.photos/seed/logo1/800/600', description: '세련된 미니멀리즘 로고' },
    { id: '2', title: '홈페이지 제작 사례 A', category: 'Website', imageUrl: 'https://picsum.photos/seed/web1/800/600', description: '반응형 기업 홍보 사이트' },
    { id: '3', title: '브랜딩 프로젝트 X', category: 'Branding', imageUrl: 'https://picsum.photos/seed/brand1/800/600', description: '통합 브랜드 아이덴티티' },
    { id: '4', title: '로고 디자인 샘플 2', category: 'Logo', imageUrl: 'https://picsum.photos/seed/logo2/800/600', description: '역동적인 심볼형 로고' },
    { id: '5', title: '홈페이지 제작 사례 B', category: 'Website', imageUrl: 'https://picsum.photos/seed/web2/800/600', description: '모던한 포트폴리오 사이트' },
    { id: '6', title: '로고 디자인 샘플 3', category: 'Logo', imageUrl: 'https://picsum.photos/seed/logo3/800/600', description: '고급스러운 워드마크' },
  ];

  const filteredItems = filter === 'All' 
    ? displayItems 
    : displayItems.filter(item => item.category === filter);

  const categories = ['All', 'Logo', 'Website', 'Branding'];

  return (
    <div className="py-24 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
          Our <span className="text-brand-purple">Portfolio</span>
        </h1>
        <p className="text-xl text-white/60 max-w-3xl mx-auto">
          월드인텍의 감각이 담긴 결과물들을 확인해보세요.
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === cat 
                ? 'bg-brand-purple text-white' 
                : 'glass text-white/60 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group relative glass rounded-2xl overflow-hidden aspect-[4/3]"
            >
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-brand-purple text-xs font-bold uppercase tracking-widest mb-2">{item.category}</span>
                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Portfolio;
