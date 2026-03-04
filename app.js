<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Supply Log</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body class="bg-slate-900 text-white font-sans">
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect } = React;
        // PASTE YOUR KEYS HERE
        const supabaseUrl = https://mrhgitbdobfnelnulnbg.supabase.co;
        const supabaseKey = sb_publishable_IaM9WgZS8_juRrtHTZBFMQ_BUgc3-uh;
        const supabase = supabase.createClient(supabaseUrl, supabaseKey);

        function App() {
            const [count, setCount] = useState(0);
            const [loading, setLoading] = useState(true);

            useEffect(() => {
                const fetchCount = async () => {
                    const { data } = await supabase.from('medicine_supply').select('value').eq('label', 'cartridge_count').single();
                    if (data) setCount(data.value);
                    setLoading(false);
                };
                fetchCount();

                const channel = supabase.channel('db-changes').on('postgres_changes', 
                    { event: 'UPDATE', schema: 'public', table: 'medicine_supply' },
                    (payload) => { setCount(payload.new.value); }
                ).subscribe();
                return () => supabase.removeChannel(channel);
            }, []);

            const updateCount = async (newVal) => {
                setCount(newVal);
                await supabase.from('medicine_supply').update({ value: newVal }).eq('label', 'cartridge_count');
            };

            if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

            return (
                <div className="flex h-screen items-center justify-center p-6">
                    <div className="w-full max-w-sm bg-slate-800 p-10 rounded-3xl border border-slate-700 text-center shadow-2xl">
                        <h1 className="text-xs uppercase tracking-[0.2em] mb-10 text-slate-500 font-bold">Cartridges Remaining</h1>
                        <div className="text-9xl font-black mb-12 text-white tabular-nums">{count}</div>
                        <div className="flex justify-between gap-6">
                            <button onClick={() => updateCount(count - 1)} className="flex-1 py-6 rounded-2xl border-2 border-slate-600 text-4xl hover:bg-slate-700 active:scale-95 transition-all">–</button>
                            <button onClick={() => updateCount(count + 1)} className="flex-1 py-6 rounded-2xl bg-blue-600 text-4xl font-bold hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-900/40">+</button>
                        </div>
                    </div>
                </div>
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
