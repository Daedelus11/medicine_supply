const { useState, useEffect, useRef } = React;
const supabaseUrl = 'https://mrhgitbdobfnelnulnbg.supabase.co';
const supabaseKey = 'sb_publishable_IaM9WgZS8_juRrtHTZBFMQ_BUgc3-uh';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
const plinkUrl = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

const REALMS = [
    { id: 'Lime', name: 'LIYUE', theme: 'theme-liyue', icon: '🔶' },
    { id: 'Ava', name: 'FONTAINE', theme: 'theme-fontaine', icon: '💧' },
    { id: 'Ash', name: 'INAZUMA', theme: 'theme-inazuma', icon: '⚡' }
];

const ArtifactScreen = ({ realm, audioReady }) => {
    const [count, setCount] = useState(0);
    const [history, setHistory] = useState([]);
    const audioRef = useRef(new Audio(plinkUrl));
    const isLowSupply = count <= 2;

    const fetchData = async () => {
        const { data: c } = await supabaseClient.from('medicine_supply').select('value').eq('label', realm.id).single();
        const { data: h } = await supabaseClient.from('medicine_log').select('timestamp, change_type').eq('supply_type', realm.id).order('timestamp', { ascending: false }).limit(3);
        if (c) setCount(c.value);
        if (h) setHistory(h);
    };

    useEffect(() => {
        fetchData();
        const channel = supabaseClient.channel(`realtime-${realm.id}`).on('postgres_changes', 
            { event: '*', schema: 'public', table: 'medicine_supply' }, () => fetchData()
        ).subscribe();
        return () => supabaseClient.removeChannel(channel);
    }, [realm.id]);

    const updateCount = async (newVal) => {
        const v = newVal < 0 ? 0 : newVal;
        if (audioReady) { audioRef.current.currentTime = 0; audioRef.current.volume = 0.9; audioRef.current.play(); }
        setCount(v);
        await supabaseClient.from('medicine_supply').update({ value: v }).eq('label', realm.id);
        await supabaseClient.from('medicine_log').insert([{ supply_type: realm.id, change_type: v > count ? 'RESTOCK' : 'CONSUMED', timestamp: new Date().toISOString() }]);
    };

    return (
        <div className={`artifact-card w-[90vw] max-w-sm h-[75vh] p-10 rounded-2xl text-center flex flex-col justify-between transition-all ${isLowSupply ? 'border-red-500' : ''}`}>
            <div className="corner tc_l"></div><div className="corner bc_r"></div>

            <div className="flex flex-col items-center">
                <div className="rarity-slot bg-gradient-to-b from-[#d29762] to-[#7d5a3c] border-2 border-[#f9f0d1] w-20 h-20 rounded-br-2xl flex items-center justify-center">
                    <svg width="67" height="67" viewBox="0 0 100 100">
                        <path d="M40,15 L60,15 L60,75 L40,75 Z" fill="rgba(0,0,0,0.8)" stroke="#f3e5ab" strokeWidth="2" />
                        <rect x="43" y="35" width="14" height="30" rx="2" fill={isLowSupply ? "#ef4444" : "#60a5fa"} className="animate-pulse" />
                        <path d="M38,20 L62,20 L62,28 L38,28 Z" fill="#d4af37" /><circle cx="50" cy="82" r="6" fill="#f3e5ab" />
                    </svg>
                </div>
                <div className="flex gap-1 mt-2 text-[#f3e5ab] text-sm">★ ★ ★ ★ ★</div>
            </div>

            <h1 className="font-serif uppercase tracking-[0.6em] text-[#d4af37] font-black text-xs mt-4">
                {realm.id} Legendary Supply
            </h1>
            
            <div className={`font-serif text-[13vh] font-black leading-none tabular-nums my-4 ${isLowSupply ? 'text-red-500' : 'text-white'}`}>
                {count}
            </div>
            
            <div className="flex justify-center gap-10">
                <button onClick={() => updateCount(count - 1)} className="action-orb w-20 h-20 rounded-full text-3xl font-light">−</button>
                <button onClick={() => updateCount(count + 1)} className="action-orb w-20 h-20 rounded-full text-4xl font-bold">+</button>
            </div>

            {isLowSupply && (
                <div className="mt-4 text-[18.5px] text-red-500 font-black animate-bounce font-serif drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                    Ava Wagner Needs her Meds!!!
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-yellow-600/20 text-left bg-black/40 rounded-b-xl px-4">
                {history.map((l, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-white/5 font-serif text-[10px] text-yellow-600/80 font-bold uppercase">
                        <span>{l.change_type}</span>
                        <span>{new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

function App() {
    const [currentIdx, setCurrentIdx] = useState(1);
    const [audioReady, setAudioReady] = useState(false);

    return (
        <div onClick={() => setAudioReady(true)} className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-1000 ${REALMS[currentIdx].theme}`}>
            <svg class="gear" style="top: -10%; right: -10%; width: 650px;" viewBox="0 0 100 100">
                <path fill="#d4af37" d="M95,50c0-2.2-1.4-4-3.4-4.8l-4.5-1.8c-0.6-1.9-1.4-3.7-2.5-5.4l2.5-4.2c1.1-1.9,0.7-4.3-1-5.8L78,21c-1.6-1.4-4-1.2-5.4,0.6l-3.2,4.1c-1.8-0.9-3.7-1.6-5.7-2.1l-0.8-4.8c-0.4-2.1-2.2-3.7-4.3-3.7H51.4c-2.1,0-4,1.6-4.3,3.7l-0.8,4.8c-2,0.5-3.9,1.2-5.7,2.1l-3.2-4.1c-1.4-1.8-3.8-2-5.4-0.6L22,28.1c-1.7,1.5-2.1,3.9-1,5.8l2.5,4.2c-1.1,1.7-1.9,3.5-2.5,5.4l-4.5,1.8c-2,0.8-3.4,2.6-3.4,4.8v10c0,2.2,1.4,4,3.4,4.8l4.5,1.8c0.6,1.9,1.4,3.7,2.5,5.4l-2.5,4.2c-1.1,1.9-0.7,4.3,1,5.8L32,79c1.6,1.4,4,1.2,5.4-0.6l3.2-4.1c1.8,0.9,3.7,1.6,5.7,2.1l0.8,4.8c0.4,2.1,2.2,3.7,4.3,3.7h17.1c2.1,0,4-1.6,4.3-3.7l0.8-4.8c2-0.5,3.9-1.2,5.7-2.1l3.2,4.1c1.4,1.8,3.8,2,5.4,0.6L88,71.9c1.7-1.5,2.1-3.9,1-5.8l-2.5-4.2c1.1-1.7,1.9-3.5,2.5-5.4l4.5-1.8c2-0.8,3.4-2.6,3.4-4.8V50z M50,65c-8.3,0-15-6.7-15-15s6.7-15,15-15s15,6.7,15,15S58.3,65,50,65z"/>
            </svg>
            
            <ArtifactScreen realm={REALMS[currentIdx]} audioReady={audioReady} />

            <div className="nav-bar fixed bottom-0 left-0 right-0 h-24 flex items-center px-4">
                {REALMS.map((r, idx) => (
                    <button key={r.id} onClick={() => setCurrentIdx(idx)} className={`flex-1 flex flex-col items-center gap-1 opacity-40 transition-all ${currentIdx === idx ? 'nav-button active' : ''}`}>
                        <span className="text-2xl">{r.icon}</span>
                        <span className="font-serif text-[10px] tracking-widest font-black text-[#d4af37]">{r.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
