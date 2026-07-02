import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, Award, Sparkles, Check, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BespokeConsultation: React.FC = () => {
  const { bookConsultation, currentUser, showToast } = useApp();

  const [bookingForm, setBookingForm] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    date: '',
    time: '11:30 AM',
    type: 'Bespoke Design' as 'Bespoke Design' | 'Sizing & Fitting' | 'Gifting Advice',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState<any>(null);

  const consultationTypes = [
    {
      id: 'Bespoke Design',
      label: 'Bespoke Design',
      description: 'Collaborate with our lead gemologist to sketch, render and cast a completely custom ring, necklace or heirloom.'
    },
    {
      id: 'Sizing & Fitting',
      label: 'Sizing & Fitting',
      description: 'Private fitting consultation. Learn precise sizing, proportion recommendations and styling combinations.'
    },
    {
      id: 'Gifting Advice',
      label: 'Gifting Advice',
      description: 'Curated styling advisory. Perfect for selecting proposal rings, anniversary pieces or bespoke heirloom gifting.'
    }
  ] as const;

  const timeSlots = [
    '10:00 AM',
    '11:30 AM',
    '1:00 PM',
    '2:30 PM',
    '4:00 PM',
    '5:30 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.date) {
      showToast('Please fulfill name, email and appointment date', 'error');
      return;
    }

    setLoading(true);
    try {
      await bookConsultation(bookingForm);
      setConfirmed(bookingForm);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      id="bespoke-consultation-section"
      className="max-w-5xl mx-auto px-6 md:px-12 py-24 sm:py-32"
    >
      {/* Intro header */}
      <div className="text-center mb-16">
        <span className="text-[10px] tracking-[0.3em] font-medium text-gold-400 uppercase block mb-3">
          PRIVATE SALON ADVISORY
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-[#F5F5F0] mb-4">
          Studio Consultations
        </h2>
        <div className="w-12 h-[1px] bg-gold-400 mx-auto mb-6" />
        <p className="max-w-xl mx-auto text-[#F5F5F0]/60 font-light text-sm leading-relaxed tracking-wide">
          Bring your dream creation to life. Whether sketch-rendering a custom proposal ring or seeking curated sizing recommendations, book a private virtual or salon session with our lead artisan.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!confirmed ? (
          <motion.div
            key="consultation-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
          >
            {/* Left Column: Visual details / checklist */}
            <div className="lg:col-span-5 space-y-8 bg-[#111111] p-6 sm:p-8 border border-white/10">
              <h3 className="font-serif text-lg text-[#F5F5F0] font-light uppercase tracking-wider">
                The Advisory Experience
              </h3>

              <div className="space-y-6 text-xs text-[#F5F5F0]/60 font-light leading-relaxed tracking-wide">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gold-400/10 flex-shrink-0 flex items-center justify-center text-gold-400 border border-gold-400/20">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#F5F5F0]/80 uppercase tracking-widest text-[10px] mb-1">
                      GEMSTONE CURATION
                    </h4>
                    <p>Access our secure private vaults holding rare ethically-sourced diamonds, Sri Lankan sapphires, and South Sea pearls.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gold-400/10 flex-shrink-0 flex items-center justify-center text-gold-400 border border-gold-400/20">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#F5F5F0]/80 uppercase tracking-widest text-[10px] mb-1">
                      REALTIME SKETCHING
                    </h4>
                    <p>Review real-time digital 3D renders and hand-sketched proportions sculpted dynamically during your design consultation.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gold-400/10 flex-shrink-0 flex items-center justify-center text-gold-400 border border-gold-400/20">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#F5F5F0]/80 uppercase tracking-widest text-[10px] mb-1">
                      LIFETIME CARE INSTRUCTION
                    </h4>
                    <p>Receive certification of metal purity and conflict-free diamond guarantee accompanying your custom selection.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 text-[10px] text-gold-400/60 font-light uppercase tracking-widest text-center">
                All consultations are complementary & non-binding
              </div>
            </div>

            {/* Right Column: Form inputs */}
            <div className="lg:col-span-7 bg-[#0D0D0D] p-6 sm:p-8 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Consultation Type cards */}
                <div>
                  <label className="block text-[10px] tracking-widest text-[#F5F5F0]/40 uppercase mb-3.5 font-bold">
                    1. SELECT CONSULTATION PATHWAY *
                  </label>
                  <div className="space-y-3">
                    {consultationTypes.map((type) => (
                      <button
                        id={`consult-type-btn-${type.id.replace(/\s+/g, '-').toLowerCase()}`}
                        key={type.id}
                        type="button"
                        onClick={() => setBookingForm({ ...bookingForm, type: type.id })}
                        className={`w-full text-left p-4 border transition-all flex items-start justify-between rounded-none focus:outline-none ${
                          bookingForm.type === type.id
                            ? 'border-gold-400 bg-gold-400/5 ring-1 ring-gold-400'
                            : 'border-white/10 hover:border-white/30 bg-[#121212]'
                        }`}
                      >
                        <div className="pr-4">
                          <span className="font-serif text-sm font-medium text-[#F5F5F0] block mb-1">
                            {type.label}
                          </span>
                          <span className="text-[10px] text-[#F5F5F0]/60 font-light leading-relaxed tracking-wide block">
                            {type.description}
                          </span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          bookingForm.type === type.id ? 'border-gold-400 bg-gold-400 text-[#080808]' : 'border-white/20'
                        }`}>
                          {bookingForm.type === type.id && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Client Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-5">
                  <div>
                    <label className="block text-[10px] tracking-widest text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">Your Full Name *</label>
                    <input
                      id="consult-name-input"
                      type="text"
                      required
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0]"
                      placeholder="e.g. Katherine Hepburn"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-widest text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">Email Address *</label>
                    <input
                      id="consult-email-input"
                      type="email"
                      required
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0]"
                      placeholder="curator@example.com"
                    />
                  </div>
                </div>

                {/* 3. Date & Time picker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-5">
                  <div>
                    <label className="block text-[10px] tracking-widest text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">Appointment Date *</label>
                    <input
                      id="consult-date-input"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-widest text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">Preferred Time slot *</label>
                    <select
                      id="consult-time-input"
                      value={bookingForm.time}
                      onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                      className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3.2 text-xs focus:outline-none rounded-none text-[#F5F5F0] font-mono"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot} className="bg-[#0D0D0D] text-[#F5F5F0]">{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. Notes vision */}
                <div className="border-t border-white/5 pt-5">
                  <label className="block text-[10px] tracking-widest text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">What is your creative vision? (Optional)</label>
                  <textarea
                    id="consult-notes-input"
                    rows={4}
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0]"
                    placeholder="Describe metal preferences, carat sizing, gemstone vision or proposal planning..."
                  />
                </div>

                <button
                  id="consult-form-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#F5F5F0] hover:bg-gold-400 hover:text-[#080808] text-[#080808] text-[11px] tracking-[0.25em] font-bold py-4.5 mt-6 transition-colors focus:outline-none flex items-center justify-center gap-2 rounded-none shadow-lg"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#080808]" />
                  ) : (
                    <span>SCHEDULE SECURE RESERVATION</span>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          /* ================= SUCCESS APPOINTMENT ================= */
          <motion.div
            key="booking-success"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-[#0D0D0D] border border-white/10 p-8 text-center shadow-xl rounded-none"
          >
            <CheckCircle className="w-14 h-14 text-gold-400 mx-auto mb-6" />
            
            <span className="text-[10px] tracking-[0.3em] font-semibold text-gold-400 uppercase block mb-1">
              RESERVATION COMPLETED
            </span>
            <h3 className="font-serif text-2xl text-[#F5F5F0] tracking-wide font-light mb-4">
              Salon Consultation Set
            </h3>
            
            <p className="text-[#F5F5F0]/70 text-xs leading-relaxed mb-6">
              Thank you, {confirmed.name}. We have logged your reservation for <span className="font-semibold text-[#F5F5F0]">{confirmed.type}</span> on <span className="font-mono font-medium text-gold-400">{confirmed.date}</span> at <span className="font-mono font-medium text-gold-400">{confirmed.time}</span>.
            </p>

            <div className="bg-[#121212] p-4 border border-white/10 text-left text-xs mb-8">
              <p className="font-semibold text-gold-400/80 uppercase text-[9px] tracking-wider mb-2">Pre-Session Checklist:</p>
              <ul className="space-y-1.5 list-disc list-inside text-[#F5F5F0]/60 font-light">
                <li>A secure private video link will be sent to {confirmed.email}.</li>
                <li>Keep any design inspirations or sketched photos ready.</li>
                <li>Your complementary ring-sizer tool will be shipped.</li>
              </ul>
            </div>

            <button
              id="close-consult-success-btn"
              onClick={() => setConfirmed(null)}
              className="w-full bg-[#F5F5F0] hover:bg-gold-400 text-[#080808] text-[11px] tracking-widest font-bold py-3.5 transition-colors focus:outline-none rounded-none"
            >
              SCHEDULE ANOTHER SESSION
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
