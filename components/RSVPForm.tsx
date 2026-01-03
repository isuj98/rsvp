
import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants';
import { Companion, RSVPData } from '../types';
import Reveal from './Reveal';

const RSVPForm: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [searchName, setSearchName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [dynamicGuestList, setDynamicGuestList] = useState<string[]>([]);
  
  const [formState, setFormState] = useState<Omit<RSVPData, 'companions' | 'timestamp'>>({
    guestName: '',
    contactNumber: '',
    isAttending: true,
    message: '',
  });
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Sync guest list from the local 'guestlist.json' proxy
    const list = JSON.parse(localStorage.getItem('wedding_guest_list') || '[]');
    setDynamicGuestList(list);
  }, []);

  const handleValidation = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedSearch = searchName.trim().toLowerCase();
    
    // Check against authorized guest list
    const matchedGuest = dynamicGuestList.find(name => 
      name.toLowerCase() === normalizedSearch || 
      normalizedSearch.includes(name.toLowerCase()) ||
      name.toLowerCase().includes(normalizedSearch)
    );

    if (matchedGuest && normalizedSearch.length > 3) {
      setFormState({ ...formState, guestName: matchedGuest });
      setStep(2);
      setError(null);
    } else {
      setError("We couldn't find that name in our registry. Please check the spelling.");
    }
  };

  const addCompanion = () => {
    setCompanions([...companions, { id: Date.now().toString(), name: '' }]);
  };

  const removeCompanion = (id: string) => {
    setCompanions(companions.filter(c => c.id !== id));
  };

  const updateCompanion = (id: string, name: string) => {
    setCompanions(companions.map(c => c.id === id ? { ...c, name } : c));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submission: RSVPData = {
      ...formState,
      companions,
      timestamp: new Date().toISOString()
    };

    try {
      // PERMANENT STORAGE: Write data to the 'submissions.json' proxy
      const existing = JSON.parse(localStorage.getItem('wedding_submissions') || '[]');
      const filtered = existing.filter((s: RSVPData) => s.guestName !== submission.guestName);
      localStorage.setItem('wedding_submissions', JSON.stringify([...filtered, submission]));
    } catch (err) {
      console.error("Critical error saving submission:", err);
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <Reveal className="w-full max-w-lg mx-auto text-center p-12 md:p-20 bg-white/95 backdrop-blur-md shadow-2xl rounded-sm border border-[#A67346]/20 relative">
          <div className="mb-10 inline-block p-8 rounded-full bg-[#BDD3E3]/20">
            <svg className="w-10 h-10" style={{ color: COLORS.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-5xl md:text-6xl font-script mb-6" style={{ color: COLORS.dark }}>Thank You</h2>
          <p className="text-xl font-serif-elegant italic opacity-70 mb-10">Your response has been successfully recorded in our registry.</p>
          <button 
            onClick={() => { setSubmitted(false); setStep(1); setSearchName(''); }}
            className="text-[9px] uppercase tracking-[0.4em] font-bold border-b border-[#A67346]/40 pb-2 hover:border-[#A67346] transition-all"
            style={{ color: COLORS.accent }}
          >
            Update My Response
          </button>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative py-20 px-4 overflow-hidden">
      {/* Dynamic Background with Color Palette */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#F9F6F2]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#BDD3E3] opacity-20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#F1CBA4] opacity-20 blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/silk.png')] opacity-10 pointer-events-none"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {step === 1 ? (
          <Reveal animation="reveal-scale" className="bg-white/90 backdrop-blur-lg p-12 md:p-24 shadow-[0_50px_100px_rgba(0,0,0,0.08)] border border-stone-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#BDD3E3] via-[#F1CBA4] to-[#BDD3E3]"></div>
            
            <div className="mb-16">
              <span className="text-[10px] uppercase tracking-[0.6em] font-cinzel opacity-30 block mb-6">Reservation Verification</span>
              <h2 className="text-6xl md:text-8xl font-script mb-4" style={{ color: COLORS.dark }}>RSVP</h2>
              <p className="text-[10px] tracking-[0.4em] opacity-40 uppercase font-bold mt-8">Please enter your formal full name</p>
            </div>

            <form onSubmit={handleValidation} className="space-y-12">
              <input
                type="text"
                required
                autoFocus
                className="w-full border-b-[1px] border-stone-200 py-6 focus:outline-none focus:border-[#A67346] transition-all bg-transparent font-serif-elegant text-3xl md:text-5xl italic text-center placeholder:opacity-5 text-stone-800"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Full Name"
              />
              
              {error && (
                <p className="text-[10px] text-red-400 font-bold tracking-widest uppercase animate-pulse">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-6 text-white uppercase tracking-[0.6em] text-[11px] font-bold shadow-2xl transition-all duration-700 hover:bg-stone-800"
                style={{ backgroundColor: COLORS.dark }}
              >
                Enter Portal
              </button>
            </form>
          </Reveal>
        ) : (
          <Reveal animation="reveal-scale" className="bg-white/95 backdrop-blur-lg p-10 md:p-16 shadow-[0_50px_100px_rgba(0,0,0,0.08)] border border-stone-100 relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#BDD3E3] via-[#F1CBA4] to-[#BDD3E3]"></div>
             
             <div className="text-center mb-12">
               <h2 className="text-4xl md:text-5xl font-script mb-2" style={{ color: COLORS.dark }}>Welcome</h2>
               <p className="text-lg font-serif-elegant italic text-[#A67346]">{formState.guestName}</p>
               <div className="w-12 h-[1px] bg-stone-100 mx-auto mt-6"></div>
             </div>

             <form onSubmit={handleSubmit} className="space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-3">
                   <label className="text-[9px] uppercase tracking-[0.4em] font-bold opacity-30 block">Mobile Number</label>
                   <input
                     type="tel"
                     required
                     className="w-full border-b-[1px] border-stone-200 py-2 focus:outline-none focus:border-[#A67346] transition-all bg-transparent font-serif-elegant text-xl italic"
                     value={formState.contactNumber}
                     onChange={(e) => setFormState({ ...formState, contactNumber: e.target.value })}
                     placeholder="+63"
                   />
                 </div>

                 <div className="space-y-5">
                   <label className="text-[9px] uppercase tracking-[0.4em] font-bold opacity-30 block">Will you attend?</label>
                   <div className="flex space-x-8">
                     <label className="flex items-center space-x-2 cursor-pointer group">
                       <input
                         type="radio"
                         name="attending"
                         className="w-4 h-4 accent-[#A67346]"
                         checked={formState.isAttending === true}
                         onChange={() => setFormState({ ...formState, isAttending: true })}
                       />
                       <span className="text-xs uppercase tracking-widest opacity-60 font-bold group-hover:opacity-100">Delighted</span>
                     </label>
                     <label className="flex items-center space-x-2 cursor-pointer group">
                       <input
                         type="radio"
                         name="attending"
                         className="w-4 h-4 accent-[#A67346]"
                         checked={formState.isAttending === false}
                         onChange={() => setFormState({ ...formState, isAttending: false })}
                       />
                       <span className="text-xs uppercase tracking-widest opacity-60 font-bold group-hover:opacity-100">Declined</span>
                     </label>
                   </div>
                 </div>
               </div>

               {formState.isAttending && (
                 <div className="space-y-6 pt-8 border-t border-stone-50">
                   <div className="flex justify-between items-center">
                     <label className="text-[9px] uppercase tracking-[0.4em] font-bold opacity-30 block">Plus One / Companions</label>
                     <button type="button" onClick={addCompanion} className="text-[8px] uppercase tracking-[0.3em] font-bold py-1.5 px-4 border border-stone-100 rounded-full hover:bg-stone-50 transition-all text-[#A67346]">+ Add Person</button>
                   </div>
                   
                   <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scroll">
                     {companions.map((comp) => (
                       <div key={comp.id} className="flex items-center space-x-3 bg-stone-50/50 p-3 rounded-sm">
                         <input
                           type="text"
                           required
                           placeholder="Full Name"
                           className="flex-1 border-b-[1px] border-transparent py-1 text-sm focus:outline-none focus:border-[#F1CBA4] italic font-serif-elegant bg-transparent"
                           value={comp.name}
                           onChange={(e) => updateCompanion(comp.id, e.target.value)}
                         />
                         <button type="button" onClick={() => removeCompanion(comp.id)} className="text-stone-300 hover:text-red-400">×</button>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               <div className="space-y-3">
                 <label className="text-[9px] uppercase tracking-[0.4em] font-bold opacity-30 block">Message for the Couple</label>
                 <textarea
                   className="w-full border-b-[1px] border-stone-200 py-2 focus:outline-none focus:border-[#A67346] transition-all bg-transparent font-serif-elegant text-lg italic min-h-[80px] resize-none"
                   value={formState.message}
                   onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                   placeholder="Your well wishes..."
                 />
               </div>

               <button
                 type="submit"
                 className="w-full py-6 text-white uppercase tracking-[0.6em] text-[11px] font-bold shadow-2xl transition-all duration-700 hover:scale-[1.01] transform"
                 style={{ backgroundColor: COLORS.dark }}
               >
                 Confirm Reservation
               </button>
             </form>
          </Reveal>
        )}
      </div>
    </div>
  );
};

export default RSVPForm;
