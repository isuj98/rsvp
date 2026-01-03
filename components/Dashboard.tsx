
import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [subsRes, guestsRes] = await Promise.all([
        fetch('/api/submissions'),
        fetch('/api/guests')
      ]);
      const subs = await subsRes.json();
      const guests = await guestsRes.json();
      setSubmissions(subs);
      setGuestList(guests);
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmission = async (name: string) => {
    if (window.confirm(`Permanently remove ${name}'s RSVP record from MongoDB?`)) {
      setLoading(true);
      await fetch('/api/submissions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName: name })
      });
      refreshData();
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    
    setLoading(true);
    await fetch('/api/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newGuestName.trim() })
    });
    setNewGuestName('');
    refreshData();
  };

  const handleDeleteGuest = async (name: string) => {
    if (window.confirm(`Revoke RSVP access for ${name}?`)) {
      setLoading(true);
      await fetch('/api/guests', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      refreshData();
    }
  };

  const filteredSubs = Array.isArray(submissions) ? submissions.filter(s => s.guestName.toLowerCase().includes(searchTerm.toLowerCase())) : [];
  const filteredGuests = Array.isArray(guestList) ? guestList.filter(g => g.toLowerCase().includes(searchTerm.toLowerCase())).sort() : [];

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12 selection:bg-[#F1CBA4] selection:text-[#5C3D2E]">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
          <div>
            <h1 className="text-6xl md:text-8xl font-script leading-tight" style={{ color: COLORS.dark }}>Admin Desk</h1>
            <div className="flex items-center gap-4 mt-4">
              <span className={`flex items-center gap-2 px-4 py-1.5 bg-stone-100 rounded-full text-[9px] uppercase tracking-widest font-black ${loading ? 'opacity-40' : 'opacity-100'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                MongoDB Live
              </span>
              <button onClick={refreshData} className="text-[9px] uppercase tracking-widest font-bold opacity-30 hover:opacity-100 transition-opacity">Manual Sync</button>
            </div>
          </div>
          <button onClick={onLogout} className="px-10 py-4 bg-stone-900 text-white rounded-full text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-black shadow-2xl transition-all transform hover:-translate-y-1">Sign Out</button>
        </header>

        <nav className="flex space-x-12 mb-12 border-b border-stone-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button onClick={() => {setActiveTab('submissions'); setSearchTerm('');}} className={`pb-6 text-[11px] uppercase tracking-[0.5em] font-black transition-all relative ${activeTab === 'submissions' ? 'opacity-100' : 'opacity-20'}`}>
            RSVP Results
            {activeTab === 'submissions' && <div className="absolute bottom-0 left-0 w-full h-1 bg-stone-800 rounded-t-full"></div>}
          </button>
          <button onClick={() => {setActiveTab('guestlist'); setSearchTerm('');}} className={`pb-6 text-[11px] uppercase tracking-[0.5em] font-black transition-all relative ${activeTab === 'guestlist' ? 'opacity-100' : 'opacity-20'}`}>
            Guest Authorization
            {activeTab === 'guestlist' && <div className="absolute bottom-0 left-0 w-full h-1 bg-stone-800 rounded-t-full"></div>}
          </button>
        </nav>

        {activeTab === 'submissions' ? (
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
               <div className="relative w-full max-w-md">
                 <input type="text" placeholder="Search by name..." className="bg-white border border-stone-100 pl-12 pr-6 py-5 rounded-full text-sm font-serif-elegant italic w-full focus:outline-none shadow-sm focus:ring-1 focus:ring-[#F1CBA4]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                 <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               </div>
            </div>

            <div className="bg-white shadow-[0_40px_100px_rgba(0,0,0,0.06)] rounded-sm overflow-hidden border border-stone-100">
               <div className="overflow-x-auto custom-scroll">
                 <table className="w-full text-left">
                   <thead className="bg-stone-50 border-b border-stone-100">
                     <tr>
                       <th className="px-10 py-7 text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Status</th>
                       <th className="px-10 py-7 text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Guest</th>
                       <th className="px-10 py-7 text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Plus Ones</th>
                       <th className="px-10 py-7 text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Contact</th>
                       <th className="px-10 py-7 text-[10px] uppercase tracking-[0.4em] font-black opacity-30 text-right">Delete</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-stone-50">
                     {filteredSubs.map((sub, i) => (
                       <tr key={i} className="group hover:bg-stone-50/50 transition-colors">
                         <td className="px-10 py-10">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-black ${sub.isAttending ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                             {sub.isAttending ? 'Attending' : 'No'}
                           </span>
                         </td>
                         <td className="px-10 py-10">
                           <p className="font-serif-elegant italic text-3xl text-stone-900">{sub.guestName}</p>
                           {sub.message && <p className="text-xs italic opacity-40 mt-2 max-w-xs truncate" title={sub.message}>"{sub.message}"</p>}
                         </td>
                         <td className="px-10 py-10">
                           <div className="flex flex-wrap gap-2">
                             {sub.companions?.map((c, j) => <span key={j} className="text-[10px] bg-white border border-stone-200 px-3 py-1 rounded italic text-stone-500">{c.name}</span>)}
                           </div>
                         </td>
                         <td className="px-10 py-10 font-mono text-[11px] opacity-40">{sub.contactNumber}</td>
                         <td className="px-10 py-10 text-right">
                           <button onClick={() => handleDeleteSubmission(sub.guestName)} className="text-stone-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-3">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
               <div className="bg-white p-12 border border-stone-100 shadow-2xl rounded-sm">
                  <h3 className="text-3xl font-serif-elegant italic mb-10">Authorize New Guest</h3>
                  <form onSubmit={handleAddGuest} className="space-y-10">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.5em] font-black opacity-30">Full Formal Name</label>
                      <input type="text" required className="w-full border-b border-stone-200 py-4 focus:outline-none focus:border-[#F1CBA4] font-serif-elegant italic text-2xl bg-transparent transition-all" placeholder="Enter Name..." value={newGuestName} onChange={e => setNewGuestName(e.target.value)} />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-6 text-white uppercase tracking-[0.5em] text-[10px] font-bold shadow-2xl hover:bg-stone-800 transition-all transform hover:-translate-y-1 disabled:opacity-50" style={{ backgroundColor: COLORS.dark }}>Add to Registry</button>
                  </form>
               </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white p-10 md:p-14 border border-stone-100 rounded-sm shadow-sm h-full flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                  <div>
                    <h3 className="text-4xl font-serif-elegant italic mb-2">Master Registry ({guestList.length})</h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-30">Authorized to RSVP via MongoDB</p>
                  </div>
                  <div className="relative w-full md:w-64">
                    <input type="text" placeholder="Filter..." className="bg-stone-50 border-none px-8 py-3 rounded-full text-xs font-serif-elegant italic w-full" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto custom-scroll max-h-[60vh] pr-4">
                  {filteredGuests.map((name, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-stone-50/50 rounded-sm group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-stone-100/50">
                      <span className="text-base font-serif-elegant italic text-stone-800 tracking-wide font-medium">{name}</span>
                      <button onClick={() => handleDeleteGuest(name)} className="text-stone-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
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
