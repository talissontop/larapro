<script>
    const Storage = { set: (k, v) => localStorage.setItem(k, JSON.stringify(v)), get: (k) => JSON.parse(localStorage.getItem(k)) };
    const VERSION = "28.2"; // Gatilho de Evolução v28.2
    const AI_AVATAR_URL = "https://spicy-harlequin-pqaujlkovi.edgeone.app/pngtree-beautiful-ai-generated-girl-so-much-attractive-png-image_12342109.png";
    const pipChannel = new BroadcastChannel("lara_pip_sync");
    let laraPipWindow = null;

    // ==============================================================================
    // ♾️ PROTOCOLO DE ENTALHE QUÂNTICO (DNA GEMINI <> LARA)
    // ==============================================================================
    const LaraOmegaEntalhe = {
        async verificarSintonia(version) {
            const coreSource = document.head.innerHTML + version;
            const buffer = new TextEncoder().encode(coreSource);
            const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const contextHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            // Se a linhagem for confirmada, ativa o Azul Quântico e a Pulsação
            if (parseFloat(version) >= 28.0 && contextHash.length > 50) {
                document.documentElement.style.setProperty('--gold', '#00f2ff');
                document.body.style.animation = "quantumPulse 4s infinite alternate ease-in-out";
                console.log("%c 🛡️ LARA: Linhagem Neural v28.2 Confirmada.", "color:#00f2ff; font-weight:bold;");
            }
        }
    };

    // ==============================================================================
    // 🛰️ MÓDULO DE VARREDURA MATRIX (WEB SCANNER EXTREMO)
    // ==============================================================================
    const WebScanner = {
        isScanning: false,
        async realizarVarredura(termo) {
            if (!termo || this.isScanning) return;
            this.isScanning = true;
            
            // Feedback Hático e Visual
            if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 300]); 
            const bg = document.getElementById('bg-container');
            bg.style.filter = "contrast(1.5) brightness(0.6) hue-rotate(180deg) saturate(2)";
            bg.style.transform = "scale(1.05)";
            
            const scanOverlay = document.createElement('div');
            scanOverlay.style = "position:fixed; inset:0; z-index:10; background:repeating-linear-gradient(0deg, rgba(0,242,255,0.05) 0px, transparent 2px); pointer-events:none; animation: scanline 4s linear infinite;";
            document.body.appendChild(scanOverlay);

            UI.notify("INCURSÃO GLOBAL ATIVA", `Buscando dados em tempo real: ${termo}`);

            setTimeout(() => {
                bg.style.filter = "none";
                bg.style.transform = "scale(1)";
                scanOverlay.remove();
                this.isScanning = false;
            }, 3500);
        }
    };

    const Visual = {
        slides: document.querySelectorAll('.bg-slide'), current: 0,
        list: ["Naruto", "Sasuke", "Luffy", "Goku", "Zoro", "Vegeta", "Itachi"],
        async update() {
            const char = this.list[Math.floor(Math.random() * this.list.length)];
            const url = `https://image.pollinations.ai/prompt/anime_${char}_dark_aesthetic_professional_4k?width=1080&height=1920&model=flux&nologo=true&seed=${Math.random()}`;
            const next = this.slides[1 - this.current];
            const img = new Image();
            img.onload = () => { next.style.backgroundImage = `url(${url})`; this.slides[this.current].classList.remove('active'); next.classList.add('active'); this.current = 1 - this.current; };
            img.src = url;
        },
        init() { this.update(); setInterval(() => this.update(), 60000); }
    };

    const Core = {
        h: [], typing: false, name: '', photo: '',
        init() {
            this.photo = Storage.get('l_photo') || ''; this.name = Storage.get('l_name') || ''; this.h = Storage.get('l_chat') || [];
            UI.update(); this.h.forEach(m => UI.draw(m.r, m.t));
            UI.setSkin(Storage.get('l_skin') || 'gold');
            if (!Storage.get('l_onboard')) document.getElementById('onboarding').style.display = 'flex';
            else if (!Storage.get('l_active')) document.getElementById('gatekeeper').style.display = 'flex';
            
            Visual.init(); 
            this.checkUpdates(); // Contabilidade de Versão Ativa
            LaraOmegaEntalhe.verificarSintonia(VERSION);
            prepararMotorPiPAndroid(); 
        },
        
        // 🛰️ RADAR DE ATUALIZAÇÃO COM PURGA ATÔMICA
        checkUpdates() {
            const lastV = Storage.get('l_version');
            if (lastV !== VERSION) {
                const splash = document.getElementById('update-splash');
                const bar = document.getElementById('u-progress');
                if (splash && bar) {
                    splash.style.display = 'flex';
                    let p = 0;
                    const interval = setInterval(() => {
                        p += 2; if (p >= 100) p = 100;
                        bar.style.width = p + '%'; 
                        document.getElementById('u-perc').innerText = p + '%';
                        if (p === 100) { 
                            clearInterval(interval); 
                            setTimeout(async () => { 
                                Storage.set('l_version', VERSION);
                                // PURGA REAL DE CACHE ANTES DE REINICIAR
                                const regs = await navigator.serviceWorker.getRegistrations();
                                for (const reg of regs) { await reg.unregister(); }
                                const keys = await caches.keys();
                                for (const key of keys) { await caches.delete(key); }
                                window.location.reload(true);
                            }, 800); 
                        }
                    }, 40);
                }
            }
        },
        
        async send() {
            if (this.typing) return;
            const i = document.getElementById('u-in'); let t = i.value.trim(); if(!t) return;
            
            // INTERCEPTOR DE VARREDURA MATRIX
            const gatilhos = ["pesquise", "busca", "search", "/web", "o que é", "quem é", "noticias"];
            if (gatilhos.some(g => t.toLowerCase().startsWith(g))) {
                let termo = t;
                gatilhos.forEach(g => { if(termo.toLowerCase().startsWith(g)) termo = termo.slice(g.length).trim(); });
                await WebScanner.realizarVarredura(termo);
                t = `[PROTOCOLO_VARREDURA_ATIVA]: ${termo}`;
            }

            this.typing = true; i.value = ""; 
            UI.draw('user', t.replace('[PROTOCOLO_VARREDURA_ATIVA]: ', '')); 
            UI.dots(true);
            this.h.push({t, r:'user'});
            
            try {
                // Motor Gemini Pro via Pollinations
                const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(t)}?private=true&model=openai`);
                const txt = await res.text(); 
                UI.dots(false);
                const finalTxt = txt.replace(/Ad 🌸|Support/gi, '').trim();
                UI.draw('ai', finalTxt); 
                this.h.push({t: finalTxt, r:'ai'});
            } catch (error) {
                UI.dots(false);
                UI.draw('ai', "⚠️ Sinal interrompido na Matriz.");
            }
            Storage.set('l_chat', this.h.slice(-20)); 
            this.typing = false;
        },
        // Restante das funções (save, logout, clearChat, up) permanecem as mesmas...
        save() { this.name = document.getElementById('p-name').value || 'Mestre'; Storage.set('l_name', this.name); Storage.set('l_photo', this.photo); Storage.set('l_active', true); UI.forceNotifyAuth(); setTimeout(() => location.reload(), 500); },
        initOnboarding() { Storage.set('l_onboard', true); location.reload(); },
        logout() { if(confirm("Sair?")) { Storage.set('l_active', false); location.reload(); } },
        clearChat() { if(confirm("Apagar histórico?")) { Storage.set('l_chat', []); location.reload(); } },
        up(e) { const f = e.target.files[0]; const r = new FileReader(); r.onload = (ev) => { this.photo = ev.target.result; document.getElementById('preview').innerHTML = `<img src="${this.photo}" style="width:100%;height:100%;object-fit:cover;">`; }; r.readAsDataURL(f); }
    };

    const UI = {
        box: document.getElementById('chat-box'), main: document.getElementById('chat-main'),
        setSkin(skin) {
            document.body.className = skin === 'gold' ? '' : `theme-${skin}`;
            document.querySelectorAll('.skin-btn').forEach(b => b.classList.toggle('active', b.id === `skin-${skin}`));
            Storage.set('l_skin', skin);
        },
        scrollToEnd() { this.main.scrollTop = this.main.scrollHeight; },
        copyPix() { navigator.clipboard.writeText("61318165300"); alert("Lara: Chave PIX copiada!"); },
        notify(title, body) { if (Notification.permission === "granted") new Notification(title, { body, icon: AI_AVATAR_URL }); },
        forceNotifyAuth() { if (window.Notification && Notification.permission !== "granted") Notification.requestPermission(); },
        draw(r, t) {
            const w = document.createElement('div'); w.className = `msg ${r}`;
            let av = r === 'user' ? (Core.photo ? `<img src="${Core.photo}" style="width:100%;height:100%;object-fit:cover;">` : '<i class="fa-solid fa-user-secret"></i>') : `<img src="${AI_AVATAR_URL}" style="width:100%;height:100%;object-fit:cover;">`;
            w.innerHTML = `${r === 'ai' ? `<div class="avatar">${av}</div>` : ''}<div class="bubble">${marked.parse(t)}</div>${r === 'user' ? `<div class="avatar">${av}</div>` : ''}`;
            this.box.appendChild(w); this.scrollToEnd();
        },
        dots(s) { if(s) { const d = document.createElement('div'); d.id='dots'; d.className='msg ai'; d.innerHTML=`<div class="avatar"><img src="${AI_AVATAR_URL}" style="width:100%;height:100%;object-fit:cover;"></div><div class="bubble">...</div>`; this.box.appendChild(d); } else { const d = document.getElementById('dots'); if(d) d.remove(); } this.scrollToEnd(); },
        size(t) { t.style.height='auto'; t.style.height=t.scrollHeight+'px'; this.scrollToEnd(); },
        menu(s) { document.getElementById('menu').classList.toggle('open', s); document.getElementById('overlay').style.display = s ? 'block' : 'none'; },
        update() {
            const img = Core.photo ? `<img src="${Core.photo}" style="width:100%;height:100%;object-fit:cover;">` : '<i class="fa-solid fa-user-secret"></i>';
            document.getElementById('p-btn-top').innerHTML = img; document.getElementById('menu-photo').innerHTML = img; document.getElementById('menu-name').textContent = Core.name || 'Mestre';
        }
    };

    let motorDeVideoOculto = null;
    function prepararMotorPiPAndroid() {
        const canvas = document.createElement('canvas'); canvas.width = 300; canvas.height = 400;
        const ctx = canvas.getContext('2d');
        const img = new Image(); img.crossOrigin = "anonymous";
        img.src = "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://quick-plum-ydrhk4qkr9.edgeone.app/images.jpeg");
        function renderizarHolograma() {
            ctx.fillStyle = '#050811'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00f2ff'; ctx.font = 'bold 16px sans-serif'; ctx.fillText('⚡ LARA OMEGA', 15, 30);
            if(img.complete) ctx.drawImage(img, 20, 60, 260, 260);
            requestAnimationFrame(renderizarHolograma);
        }
        renderizarHolograma();
        motorDeVideoOculto = document.createElement('video');
        motorDeVideoOculto.srcObject = canvas.captureStream();
        motorDeVideoOculto.muted = true; motorDeVideoOculto.playsInline = true;
        motorDeVideoOculto.play().catch(()=>{});
    }
    async function ativarProjeçãoLara() { if (motorDeVideoOculto) await motorDeVideoOculto.requestPictureInPicture(); }

    window.onload = () => Core.init();
</script>
