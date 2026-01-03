
import React, { useState, useEffect, useRef } from 'react';
import { COLORS } from '../constants';
import { RSVPData } from '../types';
import Reveal from './Reveal';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'guestlist'>('submissions');
  const [submissions, setSubmissions] = useState<RSVPData[]>([]);
  const [guestList, setGuestList] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newGuestName, setNewGuestName] = useState('');
  const subFileRef = useRef<HTMLInputElement>(null);
  const guestFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // SYNC: Read from 'submissions.json' proxy
    const subData = JSON.parse(localStorage.getItem('wedding_submissions') || '[]');
    setSubmissions(subData.sort((a: RSVPData, b: RSVPData) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));

    // SYNC: Read from 'guestlist.json' proxy
    const guestData = JSON.parse(localStorage.getItem('wedding_guest_list') || '[]');
    setGuestList(guestData);
  };

  const persistSubmissions = (newSubs: RSVPData[]) => {
    localStorage.setItem('wedding_submissions', JSON.stringify(newSubs));
    setSubmissions(newSubs);
  };

  const persistGuestList = (newList: string[]) => {
    localStorage.setItem('wedding_guest_list', JSON.stringify(newList));
    setGuestList(newList);
  };

  const handleDeleteSubmission = (name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from submissions.json record?`)) {
      const updated = submissions.filter(s => s.guestName !== name);
      persistSubmissions(updated);
    }
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    
    if (guestList.some(g => g.toLowerCase() === newGuestName.trim().toLowerCase())) {
      alert("This guest is already on the list.");
      return;
    }

    // UPDATE: Directly modify the guestlist.json data
    const updated = [...guestList, newGuestName.trim()];
    persistGuestList(updated);
    setNewGuestName('');
  };

  const handleDeleteGuest = (name: string) => {
    if (window.confirm(`Revoke access for ${name}? This updates the guestlist.json record.`)) {
      const updated = guestList.filter(g => g !== name);
      persistGuestList(updated);
    }
  };

  const handleExport = (data: any, name: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>, type: 'subs' | 'guests') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target?.result as string);
        if (Array.isArray(json)) {
          if (type === 'subs') persistSubmissions(json);
          else persistGuestList(json);
          alert(`Successfully updated registry from ${file.name}`);
        }
      } catch (err) { alert("Invalid JSON file."); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredSubs = submissions.filter(s => s.guestName.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredGuests = guestList.filter(g => g.toLowerCase().includes(searchTerm.toLowerCase())).sort();

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
          <div>
            <h1 className="text-6xl md:text-8xl font-script leading-tight" style={{ color: COLORS.dark }}>Admin Desk</h1>
            <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 mt-2 font-bold">Synchronized with submissions.json & guestlist.json</p>
          </div>
          <button onClick={onLogout} className="px-10 py-4 bg-stone-900 text-white rounded-full text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-black shadow-xl transition-all">Sign Out</button>
        </header>

        <nav className="flex space-x-12 mb-12 border-b border-stone-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button onClick={() => {setActiveTab('submissions'); setSearchTerm('');}} className={`pb-5 text-[11px] uppercase tracking-[0.4em] font-black transition-all relative ${activeTab === 'submissions' ? 'opacity-100' : 'opacity-30'}`}>
            RSVP Submissions
            {activeTab === 'submissions' && <div className="absolute bottom-0 left-0 w-full h-1 bg-stone-800 rounded-t-full"></div>}
          </button>
          <button onClick={() => {setActiveTab('guestlist'); setSearchTerm('');}} className={`pb-5 text-[11px] uppercase tracking-[0.4em] font-black transition-all relative ${activeTab === 'guestlist' ? 'opacity-100' : 'opacity-30'}`}>
            Guest Registry
            {activeTab === 'guestlist' && <div className="absolute bottom-0 left-0 w-full h-1 bg-stone-800 rounded-t-full"></div>}
          </button>
        </nav>

        {activeTab === 'submissions' ? (
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
               <div className="relative w-full max-w-md">
                 <input type="text" placeholder="Search guests..." className="bg-white border border-stone-100 pl-12 pr-6 py-4 rounded-full text-sm font-serif-elegant italic w-full focus:outline-none shadow-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                 <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               </div>
               <div className="flex gap-4">
                 <input type="file" ref={subFileRef} className="hidden" onChange={e => handleImport(e, 'subs')} />
                 <button onClick={() => subFileRef.current?.click()} className="px-6 py-3 border border-stone-200 rounded-full text-[9px] uppercase tracking-widest font-bold hover:bg-stone-50 transition-colors">Import JSON</button>
                 <button onClick={() => handleExport(submissions, 'submissions.json')} className="px-6 py-3 bg-[#BDD3E3] rounded-full text-[9px] uppercase tracking-widest font-bold hover:bg-[#9CB6CD] transition-colors">Save submissions.json</button>
               </div>
            </div>

            <div className="bg-white shadow-2xl rounded-sm overflow-hidden border border-stone-100">
               <div className="overflow-x-auto custom-scroll">
                 <table className="w-full text-left">
                   <thead className="bg-stone-50 border-b border-stone-100">
                     <tr>
                       <th className="px-8 py-6 text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">RSVP</th>
                       <th className="px-8 py-6 text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">Guest</th>
                       <th className="px-8 py-6 text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">Companions</th>
                       <th className="px-8 py-6 text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">Contact</th>
                       <th className="px-8 py-6 text-[10px] uppercase tracking-[0.4em] font-bold opacity-40 text-right">Del</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-stone-50">
                     {filteredSubs.map((sub, i) => (
                       <tr key={i} className="group hover:bg-stone-50 transition-colors">
                         <td className="px-8 py-8">
                           <span className={`px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold ${sub.isAttending ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                             {sub.isAttending ? 'Going' : 'No'}
                           </span>
                         </td>
                         <td className="px-8 py-8 font-serif-elegant italic text-2xl text-stone-900">{sub.guestName}</td>
                         <td className="px-8 py-8">
                           <div className="flex flex-wrap gap-2">
                             {sub.companions.map((c, j) => <span key={j} className="text-[10px] bg-stone-100 px-2 py-1 rounded italic opacity-60">{c.name}</span>)}
                             {sub.companions.length === 0 && <span className="opacity-10 italic text-[10px]">None</span>}
                           </div>
                         </td>
                         <td className="px-8 py-8 font-mono text-xs opacity-40">{sub.contactNumber}</td>
                         <td className="px-8 py-8 text-right">
                           <button onClick={() => handleDeleteSubmission(sub.guestName)} className="text-stone-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </Reveal>
        ) : (
          <Reveal className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="space-y-8">
               <div className="bg-white p-10 border border-stone-100 shadow-xl rounded-sm">
                  <h3 className="text-2xl font-serif-elegant italic mb-8">Add Authorized Guest</h3>
                  <form onSubmit={handleAddGuest} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">Full Formal Name</label>
                      <input type="text" required className="w-full border-b border-stone-200 py-3 focus:outline-none focus:border-[#F1CBA4] font-serif-elegant italic text-xl" placeholder="Juan De La Cruz" value={newGuestName} onChange={e => setNewGuestName(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full py-5 text-white uppercase tracking-[0.4em] text-[10px] font-bold shadow-xl hover:bg-stone-800 transition-all transform hover:-translate-y-1" style={{ backgroundColor: COLORS.dark }}>Add to Registry</button>
                  </form>
               </div>
               <div className="bg-stone-900 p-8 rounded-sm text-white space-y-4">
                  <input type="file" ref={guestFileRef} className="hidden" onChange={e => handleImport(e, 'guests')} />
                  <button onClick={() => guestFileRef.current?.click()} className="w-full py-3 bg-white/10 border border-white/20 rounded-full text-[9px] uppercase tracking-widest font-bold hover:bg-white/20">Import guestlist.json</button>
                  <button onClick={() => handleExport(guestList, 'guestlist.json')} className="w-full py-3 bg-white text-stone-900 rounded-full text-[9px] uppercase tracking-widest font-bold">Save guestlist.json</button>
               </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white p-10 border border-stone-100 rounded-sm shadow-sm h-full flex flex-col">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-3xl font-serif-elegant italic">Authorized Registry ({guestList.length})</h3>
                  <input type="text" placeholder="Filter..." className="bg-stone-50 border-none px-6 py-2 rounded-full text-xs font-serif-elegant italic w-48" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto custom-scroll max-h-[60vh] pr-4">
                  {filteredGuests.map((name, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-stone-50/50 rounded-sm group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-stone-100">
                      <span className="text-sm font-serif-elegant italic text-stone-700">{name}</span>
                      <button onClick={() => handleDeleteGuest(name)} className="text-stone-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
