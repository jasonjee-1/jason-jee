import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Wand2, Rocket, Stars, ChevronDown, Send, Mail, Phone, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'sonner';

const inquirySchema = z.object({
  name: z.string().min(2, '이름은 2글자 이상이어야 합니다.'),
  contact: z.string().min(5, '이메일 또는 연락처를 입력해주세요.'),
  message: z.string().min(10, '문의 내용은 10글자 이상이어야 합니다.'),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

const Home = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
  });

  const onSubmit = async (data: InquiryFormValues) => {
    try {
      await addDoc(collection(db, 'inquiries'), {
        name: data.name,
        email: data.contact.includes('@') ? data.contact : '',
        phone: !data.contact.includes('@') ? data.contact : '',
        message: data.message,
        status: 'New',
        createdAt: serverTimestamp(),
      });
      toast.success('문의가 성공적으로 접수되었습니다!');
      reset();
    } catch (error) {
      toast.error('문의 접수 중 오류가 발생했습니다.');
    }
  };

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative">
      <div className="atmosphere" />
      
      {/* Hero Section: The Imagination Store Entry */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Background Decorative Elements */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-brand-purple/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-brand-purple/5 rounded-full blur-[120px] animate-pulse delay-700" />
          
          {/* Floating Icons */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-1/4 right-1/4 text-brand-purple/20"
          >
            <Stars size={120} />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute bottom-1/4 left-1/4 text-brand-purple/10"
          >
            <Sparkles size={80} />
          </motion.div>
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-brand-purple-light text-sm font-bold tracking-widest uppercase"
          >
            <Wand2 size={16} /> Welcome to the Imagination Store
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-[10vw] font-black tracking-tighter mb-8 leading-[0.85] uppercase"
          >
            상상을 <span className="text-brand-purple">현실로</span> <br />
            <span className="text-display italic font-light lowercase tracking-normal">crafting</span> 가능성
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-2xl text-white/50 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
          >
            월드인텍은 당신의 가장 대담한 상상을 정교한 디자인과 <br className="hidden md:block" />
            혁신적인 기술로 구체화하는 <span className="text-white font-medium">상상력 점포</span>입니다.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/portfolio" className="btn-primary group flex items-center gap-3">
              상상의 결과물 보기 
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link to="/contact" className="btn-outline">
              상담 예약하기
            </Link>
          </motion.div>
        </div>

        <motion.div 
          style={{ opacity }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* Marquee Section */}
      <div className="py-10 border-y border-white/5 overflow-hidden bg-white/[0.02]">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-20 mx-10">
              <span className="text-4xl md:text-6xl font-black text-white/10 uppercase italic">Imagination</span>
              <span className="text-4xl md:text-6xl font-black text-brand-purple/20 uppercase">Creativity</span>
              <span className="text-4xl md:text-6xl font-black text-white/10 uppercase italic">Innovation</span>
              <span className="text-4xl md:text-6xl font-black text-brand-purple/20 uppercase">Technology</span>
            </div>
          ))}
        </div>
      </div>

      {/* Concept Section: The Store of Ideas */}
      <section className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-6">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  className="glass-card aspect-square flex flex-col justify-center items-center text-center p-8"
                >
                  <Rocket className="text-brand-purple mb-4" size={48} />
                  <h3 className="text-xl font-bold mb-2">빠른 도약</h3>
                  <p className="text-sm text-white/40">아이디어를 시장에 빠르게 안착시킵니다.</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="glass-card aspect-square flex flex-col justify-center items-center text-center p-8 mt-12"
                >
                  <Stars className="text-brand-purple mb-4" size={48} />
                  <h3 className="text-xl font-bold mb-2">빛나는 감각</h3>
                  <p className="text-sm text-white/40">평범함을 거부하는 독창적인 비주얼.</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  className="glass-card aspect-square flex flex-col justify-center items-center text-center p-8 -mt-12"
                >
                  <Wand2 className="text-brand-purple mb-4" size={48} />
                  <h3 className="text-xl font-bold mb-2">마법같은 경험</h3>
                  <p className="text-sm text-white/40">사용자를 매료시키는 인터랙션.</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="glass-card aspect-square flex flex-col justify-center items-center text-center p-8"
                >
                  <Sparkles className="text-brand-purple mb-4" size={48} />
                  <h3 className="text-xl font-bold mb-2">세밀한 디테일</h3>
                  <p className="text-sm text-white/40">작은 차이가 명품 브랜드를 만듭니다.</p>
                </motion.div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-none">
                  당신의 <br />
                  <span className="text-brand-purple">상상력</span>을 <br />
                  쇼핑하세요
                </h2>
                <p className="text-xl text-white/60 mb-10 leading-relaxed">
                  월드인텍은 고객의 추상적인 아이디어를 구체적인 비즈니스 자산으로 변환합니다. 
                  우리의 '점포'에는 당신이 꿈꾸던 모든 디자인과 기술이 준비되어 있습니다.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 glass rounded-2xl">
                    <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple">01</div>
                    <span className="font-bold">아이디어 큐레이션</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 glass rounded-2xl">
                    <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple">02</div>
                    <span className="font-bold">비주얼 프로토타이핑</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 glass rounded-2xl">
                    <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple">03</div>
                    <span className="font-bold">디지털 익스피리언스 구축</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Section */}
      <section className="py-32 px-4 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase">
                상상을 <br />
                <span className="text-brand-purple">현실로</span> 만드는 <br />
                첫 걸음
              </h2>
              <p className="text-xl text-white/50 mb-8 leading-relaxed">
                아이디어만 있어도 괜찮습니다. <br />
                월드인텍의 전문가들이 당신의 상상을 구체적인 비즈니스로 설계해 드립니다.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-white/70">
                  <Mail className="text-brand-purple" size={20} />
                  <span>jasonjee@daum.net</span>
                </div>
                <div className="flex items-center gap-4 text-white/70">
                  <Phone className="text-brand-purple" size={20} />
                  <span>02-1234-5678</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="glass-card space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-purple/50 to-transparent" />
                
                <div>
                  <label className="block text-sm font-medium text-white/40 mb-2 flex items-center gap-2">
                    <User size={14} /> 성함
                  </label>
                  <input
                    {...register('name')}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-purple/50 transition-all"
                    placeholder="홍길동"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-2 ml-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/40 mb-2 flex items-center gap-2">
                    <Mail size={14} /> 이메일 또는 연락처
                  </label>
                  <input
                    {...register('contact')}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-purple/50 transition-all"
                    placeholder="example@mail.com 또는 010-0000-0000"
                  />
                  {errors.contact && <p className="text-red-500 text-xs mt-2 ml-1">{errors.contact.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/40 mb-2 flex items-center gap-2">
                    <Send size={14} /> 문의 내용
                  </label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-purple/50 transition-all resize-none"
                    placeholder="상상하고 계신 프로젝트에 대해 알려주세요."
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-2 ml-1">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-3 py-5"
                >
                  {isSubmitting ? '전송 중...' : (
                    <>
                      상담 신청하기 <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto glass-card text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-purple to-transparent" />
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">
            READY TO <span className="text-brand-purple">IMAGINE?</span>
          </h2>
          <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto">
            지금 바로 월드인텍과 함께 당신의 상상력을 현실로 만들어보세요. 
            첫 상담은 언제나 무료입니다.
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-3">
            프로젝트 시작하기 <Rocket size={20} />
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
