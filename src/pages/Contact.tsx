import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const inquirySchema = z.object({
  name: z.string().min(2, '이름은 2글자 이상이어야 합니다.'),
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  phone: z.string().optional(),
  message: z.string().min(10, '문의 내용은 10글자 이상이어야 합니다.'),
  attachment: z.any().optional(),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
  });

  const onSubmit = async (data: InquiryFormValues) => {
    try {
      const file = data.attachment?.[0];

      // 1. Save to Firestore for Admin Dashboard
      await addDoc(collection(db, 'inquiries'), {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        message: data.message,
        attachmentName: file ? file.name : null,
        status: 'New',
        createdAt: serverTimestamp(),
      });

      // 2. Send to Formspree using FormData
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone || '');
      formData.append('message', data.message);
      formData.append('_subject', `[월드인텍] 새로운 견적 문의: ${data.name}님`);
      if (file) {
        formData.append('attachment', file);
      }

      await fetch('https://formspree.io/f/mwvwlvlk', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      toast.success('문의가 성공적으로 접수되었습니다. 곧 연락드리겠습니다!');
      reset();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="py-24 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
          Get In <span className="text-brand-purple">Touch</span>
        </h1>
        <p className="text-xl text-white/60 max-w-3xl mx-auto">
          새로운 프로젝트를 시작할 준비가 되셨나요? 월드인텍이 도와드리겠습니다.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card">
            <h2 className="text-2xl font-bold mb-8">Contact Info</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 glass rounded-xl text-brand-purple">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="text-sm text-white/40">Email</div>
                  <div className="text-lg">jasonjee@daum.net</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 glass rounded-xl text-brand-purple">
                  <Phone size={24} />
                </div>
                <div>
                  <div className="text-sm text-white/40">Phone</div>
                  <div className="text-lg">02-1234-5678</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 glass rounded-xl text-brand-purple">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="text-sm text-white/40">Location</div>
                  <div className="text-lg">서울 보국문로 30길 15</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="glass-card space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">성함</label>
                <input
                  {...register('name')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors"
                  placeholder="홍길동"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">이메일</label>
                <input
                  {...register('email')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors"
                  placeholder="example@mail.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">연락처 (선택)</label>
              <input
                {...register('phone')}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors"
                placeholder="010-0000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">문의 내용</label>
              <textarea
                {...register('message')}
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors resize-none"
                placeholder="프로젝트에 대해 자세히 설명해주세요."
              />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">파일 첨부 (선택)</label>
              <input
                type="file"
                {...register('attachment')}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-purple/20 file:text-brand-purple-light hover:file:bg-brand-purple/30 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isSubmitting ? '전송 중...' : (
                <>
                  문의 보내기 <Send size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
