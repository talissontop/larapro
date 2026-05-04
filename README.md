<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="theme-color" content="#050811">
    <title>LaraElite-v25.2 - Clean Text Core</title>

    <link rel="preconnect" href="https://text.pollinations.ai">
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
        :root { --accent: #2563eb; --gold: #D4AF37; --bg: #050811; --card-bg: rgba(15, 20, 35, 0.9); }
        
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }

        input, textarea { -webkit-user-select: auto !important; user-select: auto !important; }
        .bubble, .txt-area, pre, code, #pix-area { -webkit-user-select: text !important; user-select: text !important; -webkit-touch-callout: default !important; }

        html, body { background: #000; color: #fff; height: 100%; width: 100%; overflow: hidden; position: fixed; inset: 0; touch-action: manipulation; }

        #bg-container { position: fixed; inset: 0; z-index: -2; background: #000; }
        .bg-slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 2s ease-in-out; }
        .bg-slide.active { opacity: 1; }
        #vignette { position: fixed; inset: 0; z-index: -1; background: radial-gradient(circle, transparent 30%, #000 130%); pointer-events: none; }

        header { position: fixed; top: 0; left: 0; width: 100%; height: 75px; padding: 0 20px; background: rgba(10, 15, 25, 0.95); backdrop-filter: blur(15px); border-bottom: 1px solid rgba(212, 175, 55, 0.2); display: flex; justify-content: center; align-items: center; z-index: 1000; box-shadow: 0 4px 30px rgba(0,0,0,0.5); }
        .h-wrap { width: 100%; max-width: 800px; display: flex; justify-content: space-between; align-items: center; }
        h1 { font-size: 20px; font-weight: 900; background: linear-gradient(to right, #fff, var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        main.chat { position: fixed; top: 75px; bottom: 85px; left: 0; width: 100%; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; padding: 25px 15px; display: flex; flex-direction: column; z-index: 10; align-items: center; scrollbar-width: none; }
        main.chat::-webkit-scrollbar { display: none; }
        .chat-wrap { width: 100%; max-width: 800px; display: flex; flex-direction: column; gap: 30px; }
        
        .msg { display: flex; gap: 12px; width: 100%; max-width: 95%; animation: slideUp 0.4s ease; }
        .msg.user { align-self: flex-end; justify-content: flex-end; }
        .msg.ai { align-self: flex-start; }
        .avatar { width: 40px; height: 40px; border-radius: 50%; background: #000; border: 2px solid var(--gold); flex-shrink: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 0 15px rgba(212, 175, 55, 0.3); }
        
        .bubble { padding: 16px 20px; font-size: 15px; line-height: 1.6; border-radius: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); backdrop-filter: blur(10px); max-width: calc(100vw - 75px); min-width: 0; overflow: hidden; }
        .txt-area { word-wrap: break-word; overflow-wrap: break-word; max-width: 100%; }
        .user .bubble { background: linear-gradient(135deg, var(--accent), #1d4ed8); color: #fff; border-bottom-right-radius: 4px; }
        .ai .bubble { background: var(--card-bg); color: #f3f4f6; border-bottom-left-radius: 4px; border: 1px solid rgba(255,255,255,0.08); }

        pre { background: #0d1117; color: #e6edf3; padding: 15px; border-radius: 12px; overflow-x: auto; margin: 15px 0; border: 1px solid rgba(255,255,255,0.1); font-family: monospace; font-size: 13px; max-width: 100%; display: block; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); }
        pre::-webkit-scrollbar { height: 6px; }
        pre::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.5); border-radius: 10px; }
        code { font-family: monospace; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-size: 13px; word-break: normal; }
        pre code { background: transparent; padding: 0; white-space: pre; border-radius: 0; }

        .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 5000; display: none; flex-direction: column; align-items: center; justify-content: center; padding: 25px; }
        .card-nexus { background: linear-gradient(145deg, #0f172a, #020617); width: 100%; max-width: 380px; padding: 40px 30px; border-radius: 40px; border: 1px solid var(--gold); text-align: center; box-shadow: 0 0 50px rgba(212, 175, 55, 0.2); }

        /* FOOTER RESTAURADO PARA APENAS TEXTO */
        footer { position: fixed; bottom: 0; left: 0; width: 100%; height: 85px; padding: 15px 20px; background: linear-gradient(to top, #000 90%, transparent); display: flex; justify-content: center; z-index: 1000; }
        .in-box { width: 100%; max-width: 800px; background: rgba(25, 30, 45, 0.98); border: 1px solid rgba(255,255,255,0.1); border-radius: 35px; padding: 10px 15px; display: flex; align-items: center; gap: 12px; box-shadow: 0 0 20px rgba(0,0,0,0.8); }
        textarea { flex: 1; background: none; border: none; color: #fff; font-size: 16px; outline: none; resize: none; max-height: 80px; padding-left: 10px; }
        .btn-send { background: var(--accent); border: none; width: 44px; height: 44px; border-radius: 50%; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; touch-action: manipulation; font-size: 16px; }
        
        aside.sidebar { position: fixed; top: 0; left: -100%; width: 85%; max-width: 320px; height: 100%; z-index: 2100; background: rgba(10, 15, 25, 0.98); backdrop-filter: blur(25px); border-right: 1px solid rgba(212, 175, 55, 0.3); transition: 0.4s ease; display: flex; flex-direction: column; }
        .sidebar.open { left: 0 !important; }
        .u-box { padding: 50px 25px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .u-img { width: 90px; height: 90px; border-radius: 50%; background: #000; display:flex; align-items:center; justify-content:center; font-size:40px; border: 3px solid var(--gold); margin: 0 auto 15px; overflow: hidden; box-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }

        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        #gatekeeper, #onboarding { position: fixed; inset: 0; background: #050811; z-index: 9999; overflow-y: auto; -webkit-overflow-scrolling: touch; display: none; }
        .gate-wrap { display: flex; min-height: 100%; padding: 20px; align-items: center; justify-content: center; }
        .gate-card { background: #0a0f1e; padding: 40px 30px; border-radius: 40px; border: 1px solid var(--gold); text-align: center; width: 100%; max-width: 380px; box-shadow: 0 0 60px rgba(0,0,0,0.8); margin: auto; }
        button { touch-action: manipulation; }
    </style>
</head>
<body>
    <div id="bg-container"><div class="bg-slide active"></div><div class="bg-slide"></div></div>
    <div id="vignette"></div>
    <div id="toast" style="position:fixed; top:100px; left:50%; transform:translateX(-50%); background:var(--gold); color:#000; padding:12px 30px; border-radius:30px; font-size:12px; font-weight:900; display:none; z-index:6000; text-align:center;">SUCESSO</div>

    <section id="onboarding">
        <div class="gate-wrap">
            <div class="gate-card">
                <h2 style="font-size: 28px; font-weight: 900; color:var(--gold); margin-bottom: 25px;">BEM-VINDO</h2>
                <div style="background: rgba(212, 175, 55, 0.05); border: 1px solid rgba(212, 175, 55, 0.3); padding: 20px; border-radius: 15px; margin-bottom: 25px; text-align: left;">
                    <p style="color: #fff; font-size: 13px; margin-bottom: 15px; line-height: 1.6;">
                        <span style="font-size: 18px;">🤖</span> <b style="color:var(--gold);">O que eu faço:</b><br>
                        Sou a Lara Elite. Posso gerar códigos, responder qualquer dúvida, organizar suas ideias e ser sua inteligência pessoal diária.
                    </p>
                    <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 15px 0;"></div>
                    <p style="color: #fff; font-size: 13px; line-height: 1.6;">
                        <span style="font-size: 18px;">💎</span> <b style="color:var(--gold);">Apoie o Projeto:</b><br>
                        O acesso é 100% gratuito! Mas no menu lateral, temos uma aba de <b>Doação Voluntária</b>. Qualquer contribuição ajuda a manter a Lara viva e motiva o nosso administrador.
                    </p>
                </div>
                <button onclick="window.Core.skipOnboarding()" style="width:100%; padding:18px; background:var(--accent); border:none; border-radius:18px; color:#fff; font-weight:900; cursor:pointer; box-shadow: 0 5px 20px rgba(37,99,235,0.4);">PULAR PARA O INÍCIO ➤</button>
            </div>
        </div>
    </section>

    <section id="gatekeeper">
        <div class="gate-wrap">
            <div class="gate-card">
                <h2 style="font-size: 28px; font-weight: 900; color:#fff;">Lara Elite</h2>
                <p style="color:#444; font-size: 10px; margin-bottom: 20px; font-weight:800;">TEXT CORE v20.8</p>
                <div style="background: rgba(212, 175, 55, 0.1); border: 1px dashed var(--gold); padding: 12px; border-radius: 15px; margin-bottom: 25px;">
                    <p style="color: var(--gold); font-size: 11px; font-weight: 800; line-height: 1.5; text-transform: uppercase;">🔥 Acesso Liberado 🔥<br>Toque no avatar para foto e digite seu nome!</p>
                </div>
                <div id="preview" style="width:100px; height:100px; border-radius:50%; background:#000; margin:0 auto 25px; border:3px solid var(--gold); overflow:hidden; display:flex; align-items:center; justify-content:center; font-size:40px; cursor:pointer;" onclick="document.getElementById('up').click()">👤</div>
                <input type="file" id="up" accept="image/*" hidden onchange="window.Core.up(event)">
                <input type="text" id="p-name" placeholder="Nome de Mestre" style="width:100%; padding:16px; background:#000; border:1px solid #333; border-radius:18px; color:#fff; margin-bottom:12px; text-align:center; outline:none; font-weight: 700;">
                <div id="master-wrap" style="max-height:0; opacity:0; overflow:hidden; transition:0.5s;"><input type="password" id="p-key" placeholder="Senha Master" style="width:100%; padding:16px; background:#000; border:1px solid #333; border-radius:18px; color:#fff; margin-bottom:12px; text-align:center; outline:none;"></div>
                <button onclick="window.Core.save()" style="width:100%; padding:18px; background:var(--accent); border:none; border-radius:18px; color:#fff; font-weight:900; cursor:pointer;">INICIAR UNIDADE</button>
                <div onclick="window.UI.revealDev()" style="font-size: 10px; color:#222; margin-top: 20px; cursor:pointer;">v20.8</div>
            </div>
        </div>
    </section>

    <div id="nexus-modal" class="modal">
        <div class="card-nexus">
            <h2 style="color: var(--gold); font-size: 26px; font-weight: 900;">APOIE O PROJETO</h2>
            <p style="color: #bbb; font-size: 13px; margin-top: 10px; line-height: 1.5;">Doação voluntária para ajudar o administrador.<br>Qualquer valor é bem-vindo!</p>
            <div style="background: rgba(0,0,0,0.5); padding:20px; border-radius:20px; margin:25px 0; border:1px dashed var(--gold); color:#fff; font-size:14px; cursor:pointer; word-break:break-all;" onclick="window.Core.copyFinal('68144d03-973f-4677-b601-369f6f835342', true)" id="pix-area">68144d03-973f-4677-b601-369f6f835342</div>
            <p style="color: var(--gold); font-size: 10px; font-weight: bold; margin-bottom: 25px; letter-spacing: 1px;">👆 TOQUE NA CHAVE PARA COPIAR</p>
            <button onclick="window.UI.toggleNexus(false)" style="width: 100%; padding: 15px; border-radius: 15px; background: #22c55e; border: none; color: #fff; font-weight: 900; cursor: pointer; box-shadow: 0 0 15px rgba(34, 197, 94, 0.4);">CONCLUIR / FECHAR</button>
        </div>
    </div>

    <header><div class="h-wrap">
        <button onclick="window.UI.menu(true)" style="background:none; border:none; color:#fff; font-size:26px; cursor:pointer;">☰</button>
        <h1>Lara Elite</h1>
        <div id="p-btn-top" style="width:40px; height:40px; border-radius:50%; background:#000; display:flex; align-items:center; justify-content:center; border:2px solid var(--gold); overflow:hidden; cursor:pointer;" onclick="window.UI.menu(true)">👤</div>
    </div></header>

    <div id="overlay" style="position:fixed; inset:0; background:rgba(0,0,0,0.8); display:none; z-index:2000;" onclick="window.UI.menu(false)"></div>
    <aside id="menu" class="sidebar">
        <div class="u-box"><div class="u-img" id="menu-photo">👤</div><p id="menu-name" style="font-weight:900; font-size: 18px;">Mestre</p></div>
        <nav style="padding:25px; margin-top: auto; display:flex; flex-direction:column; gap:12px;">
            <button id="btn-nexus" style="width:100%; border-radius:15px; background: linear-gradient(to right, #ffd700, #ff8c00); color:#000; font-weight:900; height: 55px; border:none; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; line-height:1.2;" onclick="window.UI.toggleNexus(true)">💎 FAZER DOAÇÃO</button>
            <button style="width:100%; border-radius:15px; background: rgba(255,255,255,0.05); border:1px solid #333; height: 50px; color:#fff; font-weight:bold; cursor:pointer;" onclick="window.Core.logout()">SAIR / TROCAR FOTO</button>
            <button style="width:100%; border-radius:15px; background:#ef4444; border:none; height: 50px; color:#fff; font-weight:bold; cursor:pointer;" onclick="window.Core.clearChat()">LIMPAR CHAT</button>
        </nav>
    </aside>

    <main class="chat"><div class="chat-wrap" id="chat-box"></div></main>
    
    <footer>
        <div class="in-box">
            <textarea id="u-in" rows="1" placeholder="Mande o comando..." oninput="window.UI.size(this)" onkeydown="if(event.key==='Enter' && !event.shiftKey) { event.preventDefault(); window.Core.send(); }"></textarea>
            <button class="btn-send" onclick="window.Core.send()">➤</button>
        </div>
    </footer>

    <script>
        const StorageShield = {
            set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {} },
            get(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch(e) { return null; } }
        };

        const VisualEngine = {
            slides: document.querySelectorAll('.bg-slide'), current: 0,
            list: ["Naruto_Epic_Art", "Goku_UI_Master", "Luffy_G5_God", "Sasuke_Rinnegan_Supreme", "Vegeta_Blue_Aura"],
            async update() {
                const char = this.list[Math.floor(Math.random() * this.list.length)];
                const url = `https://image.pollinations.ai/prompt/anime_${char}_vivid_4k?width=1080&height=1920&model=flux&nologo=true&seed=${Math.random()}`;
                const next = this.slides[1 - this.current]; const active = this.slides[this.current];
                const img = new Image(); img.onload = () => { next.style.backgroundImage = `url(${url})`; active.classList.remove('active'); next.classList.add('active'); this.current = 1 - this.current; };
                img.src = url;
            },
            init() { this.update(); setInterval(() => this.update(), 60000); }
        };

        const Core = {
            h: [], typing: false, name: '', photo: '', clicks: 0,
            init() {
                this.name = StorageShield.get('l_name') || ''; 
                this.photo = StorageShield.get('l_photo') || '';
                this.h = StorageShield.get('l_chat') || [];
                UI.update(); this.h.slice(-10).forEach(m => UI.draw(m.r, m.t));
                
                const hasOnboarded = StorageShield.get('l_onboard');
                const isActive = StorageShield.get('l_active');
                
                if (!hasOnboarded) {
                    document.getElementById('onboarding').style.display = 'block';
                } else if (!isActive) {
                    document.getElementById('gatekeeper').style.display = 'block';
                }
                
                VisualEngine.init();
            },

            skipOnboarding() {
                StorageShield.set('l_onboard', true);
                document.getElementById('onboarding').style.display = 'none';
                document.getElementById('gatekeeper').style.display = 'block';
            },
            
            async requestAI() {
                let sys = `LARA ELITE v20.8. Mestre: ${this.name}. Responda SEMPRE com RESUMOS CURTOS e DIRETOS. Retorne os códigos usando markdown. REGRA DE IDENTIDADE: Se o usuário perguntar "quem te criou", "quem te fez" ou algo parecido, você deve responder educadamente que o modelo base foi desenvolvido pela equipe OpenAI/Pollinations, mas afirme de forma CLARA E ORGULHOSA que "O design, a interface e as ideias do projeto Lara Elite foram criadas exclusivamente por Talisson Francisco". Diga isso APENAS se perguntarem sobre a sua criação.`;
                
                try {
                    const res = await fetch('https://text.pollinations.ai/openai', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ messages: [{role:"system", content: sys}, ...this.h.slice(-8).map(m=>({role:m.r==='user'?'user':'assistant', content:m.t}))], model:'openai' }) });
                    let clean = await res.text(); try { const j = JSON.parse(clean); clean = j.choices[0].message.content; } catch(e) {}
                    UI.dots(false); 
                    let finalTxt = String(clean).split(/Ad 🌸|Support/i)[0].trim() || "Falha na resposta do servidor.";
                    UI.write(finalTxt);
                } catch(e) { 
                    UI.dots(false); 
                    UI.draw('ai', "Sem sinal de rede, mestre."); 
                    this.typing = false; 
                }
            },

            async send() {
                const inpt = document.getElementById('u-in'); const t = inpt.value.trim(); if(!t || this.typing) return;
                this.typing = true; inpt.value = ""; inpt.style.height = "auto"; UI.draw('user', t); UI.dots(true); this.h.push({t, r:'user'});
                this.requestAI();
            },
            
            copyFinal(text, isPix = false) {
                if(isPix) { const t = document.getElementById('pix-area'); t.style.background = 'var(--gold)'; t.style.color = '#000'; setTimeout(()=> { t.style.background = 'rgba(0,0,0,0.5)'; t.style.color = '#fff'; }, 500); }
                const ta = document.createElement("textarea"); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = "absolute"; ta.style.left = "-9999px"; 
                document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); UI.toast("COPIADO!"); } catch (err) {} document.body.removeChild(ta);
            },

            copyNode(btn) {
                const bubble = btn.closest('.bubble');
                const codeBlock = bubble.querySelector('pre');
                const text = codeBlock ? codeBlock.innerText : bubble.querySelector('.txt-area').innerText;
                const ta = document.createElement("textarea"); 
                ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = "absolute"; ta.style.left = "-9999px"; 
                document.body.appendChild(ta); ta.select(); 
                try { document.execCommand('copy'); window.UI.toast("CÓDIGO COPIADO!"); } catch (err) {} 
                document.body.removeChild(ta);
            },

            save() {
                try {
                    this.name = document.getElementById('p-name').value || 'Mestre';
                    if(document.getElementById('p-key').value === "Talissonmaria17") StorageShield.set('l_dev', true);
                    StorageShield.set('l_name', this.name); if(this.photo) StorageShield.set('l_photo', this.photo); StorageShield.set('l_active', true);
                    document.getElementById('gatekeeper').style.display = 'none'; UI.update();
                } catch (e) { document.getElementById('gatekeeper').style.display = 'none'; UI.update(); }
            },
            logout() { StorageShield.set('l_active', false); location.reload(); },
            clearChat() { if(confirm("Apagar tudo?")) { this.h = []; StorageShield.set('l_chat', []); document.getElementById('chat-box').innerHTML = ''; UI.menu(false); } },
            up(e) { 
                const f = e.target.files[0]; if(!f) return;
                const r = new FileReader(); r.onload = (ev) => {
                    const img = new Image(); img.onload = () => {
                        const canvas = document.createElement('canvas'); let w = img.width, h = img.height;
                        if(w > 200 || h > 200) { if(w > h) { h *= 200/w; w = 200; } else { w *= 200/h; h = 200; } }
                        canvas.width = w; canvas.height = h; canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                        Core.photo = canvas.toDataURL('image/jpeg', 0.85); UI.update();
                    }; img.src = ev.target.result;
                }; r.readAsDataURL(f);
            }
        };

        const UI = {
            box: document.getElementById('chat-box'),
            revealDev() { Core.clicks++; if(Core.clicks >= 7) document.getElementById('master-wrap').style.maxHeight = '100px', document.getElementById('master-wrap').style.opacity = '1'; },
            toggleNexus(s) { document.getElementById('nexus-modal').style.display = s ? 'flex' : 'none'; },
            toast(m) { const t = document.getElementById('toast'); if(m) t.innerHTML = m; t.style.display = 'block'; setTimeout(() => t.style.display = 'none', 3000); },
            
            draw(r, t) { 
                t = String(t); 
                const w = document.createElement('div'); w.className = `msg ${r}`;
                const av = r === 'user' ? (Core.photo ? `<img src="${Core.photo}" style="width:100%;height:100%;object-fit:cover; pointer-events:none;">` : '👤') : '💠';
                let content = `${r==='user'? `<div class="bubble"><div class="txt-area">${marked.parse(t||'')}</div></div><div class="avatar">${av}</div>` : `<div class="avatar">${av}</div><div class="bubble"><div class="txt-area">${marked.parse(t||'')}</div>`}`;
                
                if(r === 'ai' && t && t.includes('```')) { 
                    content += `<div style="margin-top:12px; border-top:1px solid rgba(255,255,255,0.1); padding-top:10px;"><button style="background:rgba(212,175,55,0.1); border:1px solid var(--gold); color:var(--gold); padding:6px 12px; border-radius:8px; font-size:10px; font-weight:900; cursor:pointer;" onclick="window.Core.copyNode(this)">📋 COPIAR CÓDIGO</button></div></div>`; 
                } else if(r === 'ai') { content += `</div>`; }
                
                w.innerHTML = content; this.box.appendChild(w); document.querySelector('main.chat').scrollTop = document.querySelector('main.chat').scrollHeight;
            },
            
            write(t) {
                t = String(t); 
                const w = document.createElement('div'); w.className = 'msg ai';
                w.innerHTML = `<div class="avatar">💠</div><div class="bubble"><div class="txt-area"></div></div>`;
                this.box.appendChild(w); const rend = w.querySelector('.txt-area'), bubble = w.querySelector('.bubble');
                let i = 0; const f = () => {
                    if(i < t.length) { rend.innerHTML = marked.parse(t.substring(0, i+1)); i++; setTimeout(f, 8); }
                    else { 
                        if(t && t.includes('```')) {
                            const btn = document.createElement('div'); btn.style.cssText = "margin-top:12px; border-top:1px solid rgba(255,255,255,0.1); padding-top:10px;";
                            btn.innerHTML = `<button style="background:rgba(212,175,55,0.1); border:1px solid var(--gold); color:var(--gold); padding:6px 12px; border-radius:8px; font-size:10px; font-weight:900; cursor:pointer;" onclick="window.Core.copyNode(this)">📋 COPIAR CÓDIGO</button>`;
                            bubble.appendChild(btn);
                        }
                        Core.typing = false; Core.h.push({t, r:'ai'}); StorageShield.set('l_chat', Core.h.slice(-10)); 
                    }
                    document.querySelector('main.chat').scrollTop = document.querySelector('main.chat').scrollHeight;
                }; f();
            },
            
            dots(s) { const e = document.getElementById('dots'); if(s) { const d = document.createElement('div'); d.id='dots'; d.className='msg ai'; d.innerHTML=`<div class="avatar">💠</div><div class="bubble">...</div>`; this.box.appendChild(d); document.querySelector('main.chat').scrollTop = document.querySelector('main.chat').scrollHeight; } else if(e) e.remove(); },
            size(t) { t.style.height='auto'; t.style.height=t.scrollHeight+'px'; },
            menu(s) { document.getElementById('menu').classList.toggle('open', s); document.getElementById('overlay').style.display = s ? 'block' : 'none'; },
            update() { 
                const i = Core.photo ? `<img src="${Core.photo}" style="width:100%;height:100%;object-fit:cover; pointer-events:none;">` : '👤';
                document.getElementById('p-btn-top').innerHTML = i; document.getElementById('menu-photo').innerHTML = i; document.getElementById('menu-name').textContent = Core.name || 'Mestre'; 
                const prev = document.getElementById('preview'); if(prev) prev.innerHTML = i;
            }
        };

        window.Core = Core; 
        window.UI = UI; 
        window.VisualEngine = VisualEngine; 
        window.StorageShield = StorageShield;

        window.onload = () => { window.Core.init(); };
    </script>
</body>
</html>
