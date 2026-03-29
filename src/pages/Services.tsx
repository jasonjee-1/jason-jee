import { motion } from 'framer-motion';
import { Palette, Globe, Zap, Search, Smartphone, ShieldCheck } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Palette size={48} />,
      title: '로고 디자인',
      features: ['심볼형 로고', '워드마크 로고', '엠블럼 디자인', '브랜드 가이드라인'],
      desc: '브랜드의 첫인상을 결정짓는 로고를 전문 디자이너가 1:1 맞춤 제작합니다.'
    },
    {
      icon: <Globe size={48} />,
      title: '홈페이지 제작',
      features: ['반응형 웹', '기업 홍보 사이트', '랜딩 페이지', '쇼핑몰 구축'],
      desc: '모든 디바이스에서 완벽하게 작동하는 고성능 웹사이트를 구축합니다.'
    },
    {
      icon: <Zap size={48} />,
      title: 'UI/UX 디자인',
      features: ['사용자 경험 분석', '인터페이스 설계', '프로토타이핑', '앱 디자인'],
      desc: '사용자가 편리하게 이용할 수 있는 직관적인 인터페이스를 설계합니다.'
    },
    {
      icon: <Search size={48} />,
      title: 'SEO 최적화',
      features: ['키워드 분석', '메타 태그 설정', '콘텐츠 최적화', '구글 검색 등록'],
      desc: '검색 엔진 상단 노출을 위한 기술적 최적화 작업을 수행합니다.'
    },
    {
      icon: <Smartphone size={48} />,
      title: '모바일 앱 개발',
      features: ['iOS/Android 앱', '하이브리드 앱', '앱 스토어 등록', '유지보수'],
      desc: '비즈니스 목적에 맞는 최적의 모바일 애플리케이션을 개발합니다.'
    },
    {
      icon: <ShieldCheck size={48} />,
      title: '유지보수 및 관리',
      features: ['서버 호스팅', '도메인 관리', '보안 업데이트', '실시간 모니터링'],
      desc: '사이트가 안정적으로 운영될 수 있도록 전문적인 관리 서비스를 제공합니다.'
    }
  ];

  return (
    <div className="py-24 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
          Our <span className="text-brand-purple">Services</span>
        </h1>
        <p className="text-xl text-white/60 max-w-3xl mx-auto">
          월드인텍은 비즈니스의 성장을 위한 통합 디지털 솔루션을 제공합니다.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card flex flex-col h-full"
          >
            <div className="text-brand-purple mb-6">{service.icon}</div>
            <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
            <p className="text-white/60 mb-6 flex-grow">{service.desc}</p>
            <ul className="space-y-2">
              {service.features.map((feature, fIdx) => (
                <li key={fIdx} className="text-sm text-white/40 flex items-center gap-2">
                  <div className="w-1 h-1 bg-brand-purple rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Services;
