import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, Store, Palette, Database, Info,
  Save, UploadCloud, DownloadCloud, Moon, Sun, Monitor
} from 'lucide-react';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { toast } from 'sonner';

export function Settings() {
  const [shopName, setShopName] = useState('VisionTrack Solutions');
  const [shopPhone, setShopPhone] = useState('092-1234567');
  const [shopAddress, setShopAddress] = useState('بنغازي، شارع دبي');
  const [theme, setTheme] = useState('dark');

  const handleSaveInfo = () => {
    // Save info logic here (e.g., in a settings store or DB)
    toast.success('تم حفظ معلومات المحل بنجاح');
  };

  const handleBackup = () => {
    toast.info('جاري إنشاء نسخة احتياطية...');
    setTimeout(() => toast.success('تم حفظ النسخة الاحتياطية بنجاح'), 1500);
  };

  const handleRestore = () => {
    toast.info('جاري استعادة البيانات...');
    setTimeout(() => toast.success('تم استعادة البيانات بنجاح'), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden pr-[240px]">
      <div className="p-6 pb-4">
        <PageHeader 
          title="الإعدادات" 
          description="تكوين النظام وتفضيلات التطبيق"
          icon={<SettingsIcon size={20} />} 
        />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="max-w-3xl space-y-6">
          
          {/* Section 1: Shop Info */}
          <section className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center gap-2">
              <Store size={18} className="text-[var(--color-brand)]" />
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">معلومات المحل</h2>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">اسم المحل</label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={e => setShopName(e.target.value)}
                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">رقم الهاتف</label>
                  <input
                    type="text"
                    value={shopPhone}
                    onChange={e => setShopPhone(e.target.value)}
                    dir="ltr"
                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)] font-mono text-right"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">العنوان</label>
                <input
                  type="text"
                  value={shopAddress}
                  onChange={e => setShopAddress(e.target.value)}
                  className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)]"
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveInfo}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[var(--color-brand)] text-white rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors"
                >
                  <Save size={16} />
                  حفظ التغييرات
                </button>
              </div>
            </div>
          </section>

          {/* Section 2: General Settings (Theme) */}
          <section className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center gap-2">
              <Palette size={18} className="text-[var(--color-brand)]" />
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">المظهر</h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                    theme === 'dark' 
                      ? 'bg-[var(--color-brand)]/10 border-[var(--color-brand)] text-[var(--color-brand)]' 
                      : 'bg-[var(--color-bg-elevated)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border)]/80'
                  }`}
                >
                  <Moon size={24} />
                  <span className="text-sm font-medium">داكن</span>
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all opacity-50 cursor-not-allowed ${
                    theme === 'light' 
                      ? 'bg-[var(--color-brand)]/10 border-[var(--color-brand)] text-[var(--color-brand)]' 
                      : 'bg-[var(--color-bg-elevated)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
                  }`}
                  disabled
                  title="الوضع الفاتح قيد التطوير"
                >
                  <Sun size={24} />
                  <span className="text-sm font-medium">فاتح (قريباً)</span>
                </button>
                <button
                  onClick={() => setTheme('auto')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all opacity-50 cursor-not-allowed ${
                    theme === 'auto' 
                      ? 'bg-[var(--color-brand)]/10 border-[var(--color-brand)] text-[var(--color-brand)]' 
                      : 'bg-[var(--color-bg-elevated)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
                  }`}
                  disabled
                  title="تلقائي قيد التطوير"
                >
                  <Monitor size={24} />
                  <span className="text-sm font-medium">تلقائي (قريباً)</span>
                </button>
              </div>
            </div>
          </section>

          {/* Section 3: Database */}
          <section className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center gap-2">
              <Database size={18} className="text-[var(--color-brand)]" />
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">قاعدة البيانات</h2>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">مسار الملف المحلي</label>
                <input
                  type="text"
                  value="C:\Users\AppData\Roaming\VisionTrack\visiontrack.db"
                  readOnly
                  dir="ltr"
                  className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-muted)] font-mono opacity-70 cursor-not-allowed"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleBackup}
                  className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 text-sm font-medium bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
                >
                  <DownloadCloud size={16} className="text-green-400" />
                  نسخ احتياطي الآن
                </button>
                <button
                  onClick={handleRestore}
                  className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 text-sm font-medium bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
                >
                  <UploadCloud size={16} className="text-amber-400" />
                  استعادة من ملف
                </button>
              </div>
            </div>
          </section>

          {/* Section 4: About */}
          <section className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center gap-2">
              <Info size={18} className="text-[var(--color-brand)]" />
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">عن التطبيق</h2>
            </div>
            <div className="p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--color-text-primary)]">VisionTrack</h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">نظام إدارة وكيل كاميرات المراقبة</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono font-medium text-[var(--color-text-secondary)]">الإصدار 1.1.0</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">تحديث: مايو 2026</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
