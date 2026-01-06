
import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants';
import { RSVPData } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'guestlist'>('submissions');
  // Add a tab state for guestlist filtering
  const [guestListTab, setGuestListTab] = useState<'all' | 'attending'>('all');
  const [submissions, setSubmissions] = useState<RSVPData[]>([]);
  const [guestList, setGuestList] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newGuestName, setNewGuestName] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<{ guestName: string; message: string } | null>(null);

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

  // Calculate response counts - include companions in accepted count
  const acceptedCount = submissions
    .filter(s => s.isAttending === true)
    .reduce((total, sub) => {
      // Count the guest (1) + their companions
      const companionCount = sub.companions?.length || 0;
      return total + 1 + companionCount;
    }, 0);
  const declinedCount = submissions.filter(s => s.isAttending === false).length;
  const totalResponses = submissions.length;

  // Helper function for tab display, replacing the Reveal animation component
  const TabPanel: React.FC<{ show: boolean; className?: string; children: React.ReactNode }> = ({ show, className, children }) =>
    show ? <div className={className}>{children}</div> : null;

  // NEW: List of all "Attending" RSVPs and companions, filtered by search
  const acceptedSubs = Array.isArray(submissions)
    ? submissions.filter(s => s.isAttending === true && s.guestName.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  // Utility: get a Set of attending guest names (from submissions only, not guestList, case-insensitive)
  const attendingGuestNames = new Set<string>(
    submissions.filter(s => s.isAttending === true).map(s => s.guestName.toLowerCase())
  );

  // For the Guestlist view: either show all guestList or only those who are in accepted set
  const filteredGuestListForTab = (() => {
    if (guestListTab === 'all') {
      return filteredGuests;
    }
    // Only show guests from guestList who have a submission and are attending
    return filteredGuests.filter(g => attendingGuestNames.has(g.toLowerCase()));
  })();
  
  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12 selection:bg-[#F1CBA4] selection:text-[#5C3D2E]">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
          <div>
            <h1 className="text-6xl md:text-8xl font-script leading-tight" style={{ color: COLORS.dark }}>Admin Desk</h1>
            <div className="flex items-center gap-4 mt-4">
              <span className={`flex items-center gap-2 px-4 py-1.5 bg-stone-100 rounded-full text-[9px] uppercase tracking-widest font-black ${loading ? 'opacity-40' : 'opacity-100'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                MongoDB Live
              </span>
              <button onClick={refreshData} className="text-[9px] uppercase tracking-widest font-bold opacity-30 hover:opacity-100">Manual Sync</button>
            </div>
          </div>
          <button onClick={onLogout} className="px-10 py-4 bg-stone-900 text-white rounded-full text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-black shadow-2xl">Sign Out</button>
        </header>

        <nav className="flex space-x-12 mb-12 border-b border-stone-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button onClick={() => {setActiveTab('submissions'); setSearchTerm('');}} className={`pb-6 text-[11px] uppercase tracking-[0.5em] font-black relative ${activeTab === 'submissions' ? 'opacity-100' : 'opacity-20'}`}>
            RSVP Results
            {activeTab === 'submissions' && <div className="absolute bottom-0 left-0 w-full h-1 bg-stone-800 rounded-t-full"></div>}
          </button>
          <button onClick={() => {setActiveTab('guestlist'); setSearchTerm('');}} className={`pb-6 text-[11px] uppercase tracking-[0.5em] font-black relative ${activeTab === 'guestlist' ? 'opacity-100' : 'opacity-20'}`}>
            Guest Authorization
            {activeTab === 'guestlist' && <div className="absolute bottom-0 left-0 w-full h-1 bg-stone-800 rounded-t-full"></div>}
          </button>
        </nav>

        <TabPanel show={activeTab === 'submissions'}>
          {/* Response Counts Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-stone-100 shadow-sm rounded-sm p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-[0.5em] font-black opacity-30">Total Responses</span>
                <svg className="w-6 h-6 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-5xl font-serif-elegant italic" style={{ color: COLORS.dark }}>{totalResponses}</p>
            </div>
            <div className="bg-green-50 border border-green-100 shadow-sm rounded-sm p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-[0.5em] font-black opacity-60" style={{ color: COLORS.dark }}>Accepted</span>
                <svg className="w-6 h-6 opacity-30" style={{ color: COLORS.dark }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-5xl font-serif-elegant italic text-green-700">{acceptedCount}</p>
            </div>
            <div className="bg-red-50 border border-red-100 shadow-sm rounded-sm p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-[0.5em] font-black opacity-60" style={{ color: COLORS.dark }}>Declined</span>
                <svg className="w-6 h-6 opacity-30" style={{ color: COLORS.dark }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-5xl font-serif-elegant italic text-red-700">{declinedCount}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search by name..."
                className="bg-white border border-stone-100 pl-12 pr-6 py-5 rounded-full text-sm font-serif-elegant italic w-full focus:outline-none shadow-sm focus:ring-1 focus:ring-[#F1CBA4]"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          {/* ---- NEW TABLE FOR ACCEPTED GUESTS & COMPANIONS ---- */}
          <div className="bg-white shadow-[0_40px_100px_rgba(0,0,0,0.06)] rounded-sm overflow-hidden border border-stone-100 mb-12">
            <div className="p-8 pb-0">
              <h3 className="font-serif-elegant italic text-2xl mb-2" style={{ color: COLORS.dark }}>All Attending (Guest & Companions)</h3>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black opacity-30 mb-4">View attendees with their plus ones</p>
            </div>
            <div className="overflow-x-auto custom-scroll">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="px-10 py-7 text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Guest</th>
                    <th className="px-10 py-7 text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Companions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {acceptedSubs.length === 0 && (
                    <tr>
                      <td className="px-10 py-6 italic text-stone-400" colSpan={2}>No attendees found.</td>
                    </tr>
                  )}
                  {acceptedSubs.map((sub, i) => (
                    <tr key={i} className="group hover:bg-stone-50/50">
                      <td className="px-10 py-8">
                        <p className="font-serif-elegant italic text-2xl text-stone-900">{sub.guestName}</p>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-wrap gap-2">
                          {sub.companions && sub.companions.length > 0 ? (
                            sub.companions.map((companion, j) => (
                              <span key={j} className="text-[11px] bg-white border border-stone-200 px-3 py-1 rounded italic text-stone-500">{companion.name}</span>
                            ))
                          ) : (
                            <span className="italic text-stone-300 text-[12px]">No companion</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* ---- END TABLE ---- */}

          {/* Original table (all responses) */}
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
                      <tr key={i} className="group hover:bg-stone-50/50">
                        <td className="px-10 py-10">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-black ${sub.isAttending ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {sub.isAttending ? 'Attending' : 'No'}
                          </span>
                        </td>
                        <td className="px-10 py-10">
                          <p className="font-serif-elegant italic text-3xl text-stone-900">{sub.guestName}</p>
                          {sub.message && (
                            <button
                              onClick={() => setSelectedMessage({ guestName: sub.guestName, message: sub.message })}
                              className="text-xs italic opacity-40 mt-2 max-w-xs truncate hover:opacity-70 hover:underline text-left block cursor-pointer"
                              title="Click to view full message"
                            >
                              "{sub.message}"
                            </button>
                          )}
                        </td>
                        <td className="px-10 py-10">
                          <div className="flex flex-wrap gap-2">
                            {sub.companions?.map((c, j) => <span key={j} className="text-[10px] bg-white border border-stone-200 px-3 py-1 rounded italic text-stone-500">{c.name}</span>)}
                          </div>
                        </td>
                        <td className="px-10 py-10 font-mono text-[11px] opacity-40">{sub.contactNumber}</td>
                        <td className="px-10 py-10 text-right">
                          <button onClick={() => handleDeleteSubmission(sub.guestName)} className="text-stone-200 hover:text-red-500 opacity-0 group-hover:opacity-100 p-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        </TabPanel>
        <TabPanel show={activeTab === 'guestlist'} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-8">
              <div className="bg-white p-12 border border-stone-100 shadow-2xl rounded-sm">
                <h3 className="text-3xl font-serif-elegant italic mb-10">Authorize New Guest</h3>
                <form onSubmit={handleAddGuest} className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.5em] font-black opacity-30">Full Formal Name</label>
                    <input type="text" required className="w-full border-b border-stone-200 py-4 focus:outline-none focus:border-[#F1CBA4] font-serif-elegant italic text-2xl bg-transparent" placeholder="Enter Name..." value={newGuestName} onChange={e => setNewGuestName(e.target.value)} />
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-6 text-white uppercase tracking-[0.5em] text-[10px] font-bold shadow-2xl hover:bg-stone-800 disabled:opacity-50" style={{ backgroundColor: COLORS.dark }}>Add to Registry</button>
                </form>
              </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-10 md:p-14 border border-stone-100 rounded-sm shadow-sm h-full flex flex-col">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                  <h3 className="text-4xl font-serif-elegant italic mb-2">
                    {/* Change display count to match filtered guest list, show total in lighter text */}
                    Master Registry 
                    <span className="text-stone-400 text-lg ml-2">({filteredGuestListForTab.length}/{guestList.length})</span>
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-30">Authorized to RSVP via MongoDB</p>
                </div>
                <div className="flex items-center space-x-4 w-full md:w-auto">
                  {/* NEW: Tab selectors */}
                  <div className="flex space-x-2 bg-stone-50 rounded-full p-1">
                    <button
                      type="button"
                      className={`px-5 py-2 text-xs font-bold rounded-full uppercase tracking-wide transition ${guestListTab === 'all' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
                      onClick={() => setGuestListTab('all')}
                    >
                      All Guests
                    </button>
                    <button
                      type="button"
                      className={`px-5 py-2 text-xs font-bold rounded-full uppercase tracking-wide transition ${guestListTab === 'attending' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
                      onClick={() => setGuestListTab('attending')}
                    >
                      Attending Only
                    </button>
                  </div>
                  <div className="relative flex-1 md:flex-none md:w-64">
                    <input
                      type="text"
                      placeholder="Filter..."
                      className="bg-stone-50 border-none px-8 py-3 rounded-full text-xs font-serif-elegant italic w-full"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto custom-scroll max-h-[60vh] pr-4">
                {filteredGuestListForTab.map((name, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-stone-50/50 rounded-sm group hover:bg-white hover:shadow-xl border border-transparent hover:border-stone-100/50">
                    <span className="text-base font-serif-elegant italic text-stone-800 tracking-wide font-medium">{name}</span>
                    <button onClick={() => handleDeleteGuest(name)} className="text-stone-200 hover:text-red-400 opacity-0 group-hover:opacity-100 p-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                {filteredGuestListForTab.length === 0 && (
                  <div className="col-span-2 text-center text-stone-400 font-serif-elegant italic p-12">
                    No guests found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabPanel>
      </div>

      {/* Message Popup Modal */}
      {selectedMessage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedMessage(null)}
        >
          <div 
            className="bg-white rounded-sm shadow-2xl max-w-2xl w-full p-10 md:p-16 relative border border-stone-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-6 right-6 text-stone-300 hover:text-stone-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="mb-8">
              <span className="text-[9px] uppercase tracking-[0.4em] font-bold opacity-30 block mb-4">Message from</span>
              <h3 className="text-4xl md:text-5xl font-script" style={{ color: COLORS.dark }}>{selectedMessage.guestName}</h3>
              <div className="w-12 h-[1px] bg-[#F1CBA4] mt-6"></div>
            </div>
            <div className="mt-10">
              <p className="text-xl md:text-2xl font-serif-elegant italic leading-relaxed text-stone-700 whitespace-pre-wrap">
                "{selectedMessage.message}"
              </p>
            </div>
            <div className="mt-12 pt-8 border-t border-stone-100">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-8 py-4 bg-stone-900 text-white rounded-full text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
