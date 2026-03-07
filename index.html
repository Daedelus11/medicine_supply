<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-select=none">
    <title>Ava's Meds</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22 fill=%22%23d4af37%22 font-family=%22serif%22 font-weight=%22bold%22>A</text></svg>">
    
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Quicksand:wght@300;500&display=swap" rel="stylesheet">
    
    <style>
        body {
            background: radial-gradient(circle at center, #111b27 0%, #050a0f 100%);
            font-family: 'Quicksand', sans-serif;
            overflow: hidden;
        }
        .gear { 
            position: absolute; z-index: -1; opacity: 0.12; 
            animation: rotate 120s linear infinite; pointer-events: none;
        }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .artifact-card {
            background: linear-gradient(180deg, rgba(30, 45, 65, 0.98) 0%, rgba(10, 15, 20, 1) 100%);
            background-image: url("https://www.transparenttextures.com/patterns/dark-matter.png");
            backdrop-filter: blur(40px);
            border: 2px solid #d4af37;
            box-shadow: 0 0 50px rgba(0, 0, 0, 1), inset 0 0 20px rgba(212, 175, 55, 0.1);
            position: relative; flex: 1; height: 85vh;
        }
        .corner { position: absolute; width: 30px; height: 30px; border: 4px solid #d4af37; z-index: 10; }
        .tc_l { top: -10px; left: -10px; border-right: 0; border-bottom: 0; }
        .bc_r { bottom: -10px; right: -10px; border-left: 0; border-top: 0; }
        .chiseled-text { font-family: 'Cinzel', serif; text-shadow: 0 0 15px rgba(255, 255, 255, 0.3); }
        .action-orb {
            width: 65px; height: 65px; border-radius: 50%;
            background: linear-gradient(180deg, #6b4d34 0%, #4a3522 100%); 
            border: 5px solid #f9f0d1; display: flex; align-items: center; justify-content: center;
            transition: all 0.1s ease; color: #f9f0d1;
        }
        .action-orb:active { background: #f9f0d1; color: #4a3522; box-shadow: 0 0 50px #f9f0d1; transform: scale(0.9); }
        .rarity-slot {
            background: linear-gradient(180deg, #d29762 0%, #7d5a3c 100%);
            border: 2px solid #f9f0d1; width: 60px; height: 60px; border-bottom-right-radius: 15px;
        }
        .star { color: #f3e5ab; font-size: 10px; }
    </style>
</head>
<body class="text-white flex items-center justify-center min-h-screen p-4">
    <svg class="gear" style="top: -10%; right: -10%; width: 700px;" viewBox="0 0 100 100">
        <path fill="#d4af37" d="M95,50c0-2.2-1.4-4-3.4-4.8l-4.5-1.8c-0.6-1.9-1.4-3.7-2.5-5.4l2.5-4.2c1.1-1.9,0.7-4.3-1-5.8L78,21c-1.6-1.4-4-1.2-5.4,0.6l-3.2,4.1c-1.8-0.9-3.7-1.6-5.7-2.1l-0.8-4.8c-0.4-2.1-2.2-3.7-4.3-3.7H51.4c-2.1,0-4,1.6-4.3,3.7l-0.8,4.8c-2,0.5-3.9,1.2-5.7,2.1l-3.2-4.1c-1.4-1.8-3.8-2-5.4-0.6L22,28.1c-1.7,1.5-2.1,3.9-1,5.8l2.5,4.2c-1.1,1.7-1.9,3.5-2.5,5.4l-4.5,1.8c-2,0.8-3.4,2.6-3.4,4.8v10c0,2.2,1.4,4,3.4,4.8l4.5,1.8c0.6,1.9,1.4,3.7,2.5,5.4l-2.5,4.2c-1.1,1.9-0.7,4.3,1,5.8L32,79c1.6,1.4,4,1.2,5.4-0.6l3.2-4.1c1.8,0.9,3.7,1.6,5.7,2.1l0.8,4.8c0.4,2.1,2.2,3.7,4.3,3.7h17.1c2.1,0,4-1.6,4.3-3.7l0.8-4.8c2-0.5,3.9-1.2,5.7-2.1l3.2,4.1c1.4,1.8,3.8,2,5.4,0.6L88,71.9c1.7-1.5,2.1-3.9,1-5.8l-2.5-4.2c1.1-1.7,1.9-3.5,2.5-5.4l4.5-1.8c2-0.8,3.4-2.6,3.4-4.8V50z M50,65c-8.3,0-15-6.7-15-15s6.7-15,15-15s15,6.7,15,15S58.3,65,50,65z"/>
    </svg>
    <div id="root" class="flex flex-row gap-6 w-full h-full max-w-6xl"></div>
    <script type="text/babel">
        const { useState, useEffect, useRef } = React;
        const supabaseUrl = 'https://mrhgitbdobfnelnulnbg.supabase.co';
        const supabaseKey = 'sb_publishable_IaM9WgZS8_juRrtHTZBFMQ_BUgc3-uh';
        const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
        const plinkUrl = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

        const SupplyCard = ({ label, audioReady }) => {
            const [count, setCount] = useState(0);
            const [history, setHistory] = useState([]);
            const audioRef = useRef(new Audio(plinkUrl));
            const isLowSupply = count <= 2;

            const fetchData = async () => {
                const { data: c } = await supabaseClient.from('medicine_supply').select('value').eq('label', label).single();
                const { data: h } = await supabaseClient.from('medicine_log').select('timestamp, change_type').eq('supply_type', label).order('timestamp', { ascending: false }).limit(2);
                if (c) setCount(c.value);
                if (h) setHistory(h);
            };

            useEffect(() => {
                fetchData();
                const channel = supabaseClient.channel(`realtime-${label}`).on('postgres_changes', 
                    { event: '*', schema: 'public', table: 'medicine_supply' }, () => fetchData()
                ).subscribe();
                return () => supabaseClient.removeChannel(channel);
            }, []);

            const updateCount = async (newVal) => {
                const v = newVal < 0 ? 0 : newVal;
                if (audioReady) { audioRef.current.currentTime = 0; audioRef.current.play(); }
                setCount(v);
                await supabaseClient.from('medicine_supply').update({ value: v }).eq('label', label);
                await supabaseClient.from('medicine_log').insert([{ supply_type: label, change_type: v > count ? 'RESTOCK' : 'CONSUMED' }]);
            };

            return (
                <div className={`artifact-card p-4 rounded-xl text-center flex flex-col justify-between ${isLowSupply ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)]' : ''}`}>
                    <div className="corner tc_l"></div><div className="corner bc_r"></div>
                    <div className="flex flex-col items-center">
                        <div className="rarity-slot flex items-center justify-center">
                             <svg width="45" height="45" viewBox="0 0 100 100">
                                <path d="M40,15 L60,15 L60,75 L40,75 Z" fill="rgba(0,0,0,0.8)" stroke="#f3e5ab" strokeWidth="2" />
                                <rect x="43" y="35" width="14" height="30" rx="2" fill={isLowSupply ? "#ef4444" : "#60a5fa"} />
                                <path d="M38,20 L62,20 L62,28 L38,28 Z" fill="#d4af37" /><circle cx="50" cy="82" r="6" fill="#f3e5ab" />
                            </svg>
                        </div>
                        <h1 className="chiseled-text text-[10px] uppercase tracking-[0.4em] text-[#d4af37] mt-3 font-black">{label}</h1>
                    </div>
                    <div className={`chiseled-text text-[9vh] font-black tabular-nums ${isLowSupply ? 'text-red-500' : 'text-white'}`}>{count}</div>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => updateCount(count - 1)} className="action-orb text-2xl">−</button>
                        <button onClick={() => updateCount(count + 1)} className="action-orb text-3xl">+</button>
                    </div>
                    <div className="mt-2 pt-2 border-t border-yellow-600/10 text-left bg-black/40 px-2 rounded-b-lg">
                        {history.map((l, i) => (
                            <div key={i} className="flex justify-between text-[8px] text-yellow-600/60 font-bold uppercase">
                                <span>{l.change_type}</span>
                                <span>{new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        function App() {
            const [audioReady, setAudioReady] = useState(false);
            return (
                <div onClick={() => setAudioReady(true)} className="flex flex-row gap-6 w-full h-full">
                    {['Ash', 'A', 'Lime'].map(l => <SupplyCard key={l} label={l} audioReady={audioReady} />)}
                </div>
            );
        }
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
