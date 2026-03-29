import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="py-24 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
          About <span className="text-brand-purple">World InTech</span>
        </h1>
        <p className="text-xl text-white/60 max-w-3xl mx-auto">
          우리는 단순한 디자인을 넘어, 비즈니스의 본질을 꿰뚫는 시각적 언어를 창조합니다.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
        <div className="glass-card">
          <h2 className="text-3xl font-bold mb-6">우리의 철학</h2>
          <p className="text-white/70 leading-relaxed mb-6">
            월드인텍은 'World'와 'InTech'의 합성어로, 전 세계를 향한 혁신적인 기술과 디자인의 융합을 의미합니다. 
            우리는 고객의 아이디어를 가장 아름답고 효율적인 방식으로 실현하는 것을 목표로 합니다.
          </p>
          <p className="text-white/70 leading-relaxed">
            모든 프로젝트는 고객과의 깊은 소통에서 시작됩니다. 
            우리는 브랜드의 스토리를 이해하고, 이를 통해 시장에서 독보적인 존재감을 드러낼 수 있는 결과물을 만들어냅니다.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-8 rounded-2xl text-center">
            <div className="text-4xl font-black text-brand-purple mb-2">500+</div>
            <div className="text-sm text-white/60">완료된 프로젝트</div>
          </div>
          <div className="glass p-8 rounded-2xl text-center">
            <div className="text-4xl font-black text-brand-purple mb-2">150+</div>
            <div className="text-sm text-white/60">함께한 파트너사</div>
          </div>
          <div className="glass p-8 rounded-2xl text-center">
            <div className="text-4xl font-black text-brand-purple mb-2">10+</div>
            <div className="text-sm text-white/60">디자인 어워드</div>
          </div>
          <div className="glass p-8 rounded-2xl text-center">
            <div className="text-4xl font-black text-brand-purple mb-2">24/7</div>
            <div className="text-sm text-white/60">고객 지원</div>
          </div>
        </div>
      </div>

      <section className="mb-32">
        <h2 className="text-4xl font-bold mb-12 text-center">History</h2>
        <div className="space-y-12">
          {[
            { year: '2026', title: 'AI 기반 디자인 자동화 시스템 도입' },
            { year: '2024', title: '글로벌 디자인 에이전시 협업 체계 구축' },
            { year: '2022', title: '월드인텍 법인 설립 및 강남 오피스 확장' },
            { year: '2018', title: '디자인 스튜디오 월드인텍 창업' }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-8 items-start">
              <div className="text-2xl font-black text-brand-purple pt-1">{item.year}</div>
              <div className="pb-8 border-b border-white/10 flex-grow">
                <h3 className="text-xl font-bold">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
