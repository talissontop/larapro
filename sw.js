function iniciarMonitoramentoOmegaNeural(doc) {
    const netEl = doc.getElementById('pip-net');
    const batEl = doc.getElementById('pip-bat');
    
    // 🛡️ MEMÓRIA DE ESTADO (Fora da função updateNet para persistir)
    let ultimoEstadoGlitch = false; 

    // ================= 🌐 REDE REATIVA COM TRAVA DE ESTADO =================
    const conn = navigator.connection;
    if (conn) {
        const updateNet = () => {
            const type = (conn.effectiveType || '').toUpperCase();
            netEl.innerText = `LINK: ${type || '--'}`;

            const precisaDeGlitch = type.includes('2G');

            // ⚡ SÓ ENVIA SE O ESTADO MUDAR (A Blindagem)
            if (precisaDeGlitch !== ultimoEstadoGlitch) {
                ultimoEstadoGlitch = precisaDeGlitch;
                pipChannel.postMessage({ type: precisaDeGlitch ? "glitch-on" : "glitch-off" });
            }
        };

        updateNet();
        conn.addEventListener('change', updateNet);
    }

    // ================= 🔋 BATERIA REATIVA (Padrão Elite) =================
    const updateStatus = (bat) => {
        batEl.innerText = `${Math.round(bat.level * 100)}%`;
        batEl.style.color = bat.level < 0.2 ? '#ff4444' : 'inherit';
    };

    if (navigator.getBattery) {
        if (!window.__batCache) {
            navigator.getBattery().then(bat => {
                window.__batCache = bat;
                updateStatus(bat);
                bat.addEventListener('levelchange', () => updateStatus(bat));
            });
        } else {
            updateStatus(window.__batCache);
        }
    }
}
