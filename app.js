const { useState, useEffect, useRef } = React;

const supabaseUrl = "https://mrhgitbdobfnelnulnbg.supabase.co";
const supabaseKey = "sb_publishable_IaM9WgZS8_juRrtHTZBFMQ_BUgc3-uh";
const supabase = supabasejs.createClient(supabaseUrl, supabaseKey);

const REALMS = [
    { id: 'LIME', name: 'Liyue', color: 'text-yellow-500', theme: 'bg-lime' },
    { id: 'AVA', name: 'Fontaine', color: 'text-sky-400', theme: 'bg-ava' },
    { id: 'ASH', name: 'Inazuma', color: 'text-purple-500', theme: 'bg-ash' }
];

function App() {
    const [realmIdx, setRealmIdx] = useState(1); // Default to AVA
    const [count, setCount] = useState(0);
    const [logs, setLogs] = useState([]);
    const [touchStart, setTouchStart] = useState(null);
    const currentRealm = REALMS[realmIdx];

    useEffect(() => {
        fetchData();
        const subscription = supabase
            .channel('any')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'medicine_supply' }, fetchData)
            .subscribe();
        return () => supabase.removeChannel(subscription);
    }, [realmIdx]);

    const fetchData = async () => {
        const { data: supply } = await supabase
            .from('medicine_supply')
            .select('value')
            .eq('label', currentRealm.id)
            .single();
        
        const { data: logData } = await supabase
            .from('medicine_log')
            .select('*')
            .eq('supply_type', currentRealm.id)
            .order('created_at', { ascending: false })
            .limit(3);

        if (supply) setCount(supply.value);
        if (logData) setLogs(logData);
    };

    const updateCount = async (delta) => {
        const newValue = Math.max(0, count + delta);
        setCount(newValue); // Optimistic Update

        await supabase.from('medicine_supply').update({ value: newValue }).eq('label', currentRealm.id);
        await supabase.from('medicine_log').insert([{ 
            supply_type: currentRealm.id, 
            change_type: delta > 0 ? 'INCREMENT' : 'DECREMENT' 
        }]);
        fetchData();
    };

    // Swipe Logic
    const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
    const handleTouchEnd = (e) => {
        const touchEnd = e.changedTouches[0].clientX;
        if (!touchStart) return;
        if (touchStart - touchEnd > 70) setRealmIdx((prev) => Math.min(prev + 1, 2));
        if (touchStart - touchEnd < -70) setRealmIdx((prev) => Math.max(prev - 1, 0));
    };

    return (
        <div 
            className={`h-screen w-full flex flex-col items-center justify-center transition-colors duration-700 ${currentRealm.theme}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Artifact Card */}
            <div className="artifact-card w-11/12 max-w-md p-8 rounded-sm shadow-2xl relative">
                <div className="corner-gold top-left"></div>
                <div className="corner-gold bottom-right"></div>

                <h2 className="cinzel text-center text-yellow-500 font-bold uppercase mb-4" style={{ letterSpacing: '0.6em', fontSize: '1rem' }}>
                    LEGENDARY SUPPLY
                </h2>

                <div className="flex flex-col items-center mb-8">
                    <div className={`w-24 h-24 mb-6 flex items-center justify-center ${count <= 2 ? 'icon-pyro' : 'icon-hydro'}`}>
                        {/* Simplified 5-Star Cartridge Icon SVG */}
                        <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-sky-300">
                            <path d="M19,3H5C3.89,3 3,3.9 3,5V19C3,20.1 3.89,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19M12,17L15,13H13V7H11V13H9L12,17Z" />
                        </svg>
                    </div>

                    <div className="cinzel text-white font-black leading-none" style={{ fontSize: '13vh' }}>
                        {count}
                    </div>

                    {count <= 2 && (
                        <div className="text-red-500 font-bold bounce-alert mt-2" style={{ fontSize: '18.5px' }}>
                            Ava Wagner Needs her Meds!!!
                        </div>
                    )}
                </div>

                {/* Action Orbs */}
                <div className="flex justify-between px-4 mb-10">
                    <button 
                        onClick={() => updateCount(-1)}
                        className="w-20 h-20 rounded-full border-[5px] border-[#fdf5e6] bg-gradient-to-b from-[#5d4037] to-[#3e2723] text-white text-4xl font-bold shadow-lg active:scale-90 transition-transform"
                    >
                        -
                    </button>
                    <button 
                        onClick={() => updateCount(1)}
                        className="w-20 h-20 rounded-full border-[5px] border-[#fdf5e6] bg-gradient-to-b from-[#5d4037] to-[#3e2723] text-white text-4xl font-bold shadow-lg active:scale-90 transition-transform"
                    >
                        +
                    </button>
                </div>

                {/* Recent Chronicles */}
                <div className="border-t border-gray-700 pt-4">
                    <p className="cinzel text-xs text-gray-400 mb-2 tracking-widest uppercase">Recent Chronicles</p>
                    <div className="space-y-2">
                        {logs.map((log) => (
                            <div key={log.id} className="flex justify-between text-xs font-semibold">
                                <span className={log.change_type === 'INCREMENT' ? 'text-green-400' : 'text-red-400'}>
                                    {log.change_type}
                                </span>
                                <span className="text-gray-500">
                                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex space-x-3 mt-10">
                {REALMS.map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${i === realmIdx ? 'bg-yellow-500 scale-125' : 'bg-gray-600'}`}
                    />
                ))}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
