    <script>
        const Storage = { set: (k, v) => localStorage.setItem(k, JSON.stringify(v)), get: (k) => JSON.parse(localStorage.getItem(k)) };
        const VERSION = "26.0"; // Gatilho para o teste de notificação
        const AI_AVATAR_URL = "https://spicy-harlequin-pqaujlkovi.edgeone.app/pngtree-beautiful-ai-generated-girl-so-much-attractive-png-image_12342109.png";
        const pipChannel = new BroadcastChannel("lara_pip_sync");
        let laraPipWindow = null;

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
                this.checkUpdates();
                prepararMotorPiPAndroid(); 
            },
            
            // 🛰️ RADAR DE AUTO-IGNIÇÃO COM GARANTIA VISUAL NO CHAT
            checkUpdates() {
                const lastV = Storage.get('l_version');
                if (lastV !== VERSION) {
                    const splash = document.getElementById('update-splash');
                    const bar = document.getElementById('u-progress');
                    if (splash && bar) {
                        splash.style.display = 'flex';
                        let p = 0;
                        const interval = setInterval(() => {
                            p += 5; if (p >= 100) p = 100;
                            bar.style.width = p + '%'; document.getElementById('u-perc').innerText = p + '%';
                            if (p === 100) { 
                                clearInterval(interval); 
                                setTimeout(() => { 
                                    splash.style.display = 'none'; 
                                    Storage.set('l_version', VERSION);
                                    
                                    // 1. Notificação Nativa (Banner no topo)
                                    UI.notify("LARA ELITE v" + VERSION + " ONLINE", "Sincronização completa mestre!");
                                    
                                    // 2. AVISO DE SEGURANÇA NO CHAT (Garantia se o banner falhar)
                                    if (Storage.get('l_active')) {
                                        setTimeout(() => {
                                            const aviso = "⚡ **SISTEMA ATUALIZADO:** Mestre, a Matriz subiu para a **v" + VERSION + "** com sucesso. Notificações e Radar Agressivo em 100% de performance.";
                                            UI.draw('ai', aviso);
                                            Core.h.push({t: aviso, r:'ai'});
                                            Storage.set('l_chat', Core.h);
                                        }, 1500);
                                    }
                                }, 600); 
                            }
                        }, 80);
                    }
                }
            },
            
            save() { 
                this.name = document.getElementById('p-name').value || 'Mestre'; 
                Storage.set('l_name', this.name); Storage.set('l_photo', this.photo); Storage.set('l_active', true); 
                UI.forceNotifyAuth(); 
                setTimeout(() => location.reload(), 500); 
            },
            initOnboarding() { Storage.set('l_onboard', true); location.reload(); },
            logout() { if(confirm("Sair?")) { Storage.set('l_active', false); location.reload(); } },
            
            async send() {
                if (this.typing) return;
                const i = document.getElementById('u-in'); const t = i.value.trim(); if(!t) return;
                
                this.typing = true; i.value = ""; UI.draw('user', t); UI.dots(true);
                this.h.push({t, r:'user'});
                
                try {
                    const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(t)}?private=true`);
                    if (!res.ok) throw new Error("Sinal ruim");
                    
                    const txt = await res.text(); 
                    UI.dots(false);
                    const finalTxt = txt.replace(/Ad 🌸|Support/gi, '').trim();
                    UI.draw('ai', finalTxt); 
                    this.h.push({t: finalTxt, r:'ai'});
                } catch (error) {
                    UI.dots(false);
                    UI.draw('ai', "⚠️ *Sinal interrompido.* A conexão com a Matriz oscilou. Tente enviar novamente, irmão.");
                }

                Storage.set('l_chat', this.h.slice(-20)); 
                this.typing = false;
            },
            clearChat() { 
                if(confirm("Deseja apagar as mensagens? O sistema v" + VERSION + " será preservado.")) { 
                    Storage.set('l_chat', []); location.reload(); 
                } 
            },
            exportChat() {
                let text = this.h.map(m => `[${m.r}]: ${m.t}`).join('\n\n');
                const blob = new Blob([text], { type: 'text/plain' });
                const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
                a.download = `Log_Lara_v25.txt`; a.click();
            },
            up(e) {
                const f = e.target.files[0]; const r = new FileReader();
                r.onload = (ev) => { this.photo = ev.target.result; document.getElementById('preview').innerHTML = `<img src="${this.photo}" style="width:100%;height:100%;object-fit:cover;">`; };
                r.readAsDataURL(f);
            }
        };

        const UI = {
            box: document.getElementById('chat-box'), main: document.getElementById('chat-main'),
            setSkin(skin) {
                document.body.className = skin === 'gold' ? '' : `theme-${skin}`;
                document.querySelectorAll('.skin-btn').forEach(b => b.classList.toggle('active', b.id === `skin-${skin}`));
                Storage.set('l_skin', skin);
            },
            scrollToEnd() { this.main.scrollTop = this.main.scrollHeight; },

            copyPix() {
                const pixText = "61318165300";
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(pixText).then(() => {
                        alert("Lara: Chave PIX copiada com sucesso! Obrigado pelo apoio, mestre!");
                    });
                } else {
                    alert("Sua chave PIX é: " + pixText);
                }
            },

            // ⚡ FORÇA BRUTA NA NOTIFICAÇÃO NATIVA
            notify(title, body) {
                if (!("Notification" in window)) {
                    alert(`🔔 ${title}\n${body}`); return;
                }
                if (Notification.permission === "granted") {
                    navigator.serviceWorker.ready.then(reg => {
                        reg.showNotification(title, { 
                            body: body, 
                            icon: AI_AVATAR_URL, 
                            vibrate: [200, 100, 200, 100, 200],
                            requireInteraction: true 
                        }).catch(() => console.log("Notificação Nativa suprimida pelo OS."));
                    });
                } else if (Notification.permission !== "denied") {
                    Notification.requestPermission();
                }
            },
            forceNotifyAuth() {
                if (window.Notification && Notification.permission !== "granted") {
                    Notification.requestPermission().then(perm => {
                        if(perm === "granted") alert("Lara: Permissão de Alertas Garantida!");
                    });
                }
            },
            draw(r, t) {
                const w = document.createElement('div'); w.className = `msg ${r}`;
                let av = r === 'user' ? (Core.photo ? `<img src="${Core.photo}" style="width:100%;height:100%;object-fit:cover;">` : '<i class="fa-solid fa-user-secret"></i>') : `<img src="${AI_AVATAR_URL}" style="width:100%;height:100%;object-fit:cover;">`;
                w.innerHTML = `${r === 'ai' ? `<div class="avatar">${av}</div>` : ''}<div class="bubble-container"><div class="bubble">${marked.parse(t)}</div></div>${r === 'user' ? `<div class="avatar">${av}</div>` : ''}`;
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

        // 🛡️ MOTOR DE PROJEÇÃO PRESERVADO
        let motorDeVideoOculto = null;

        function prepararMotorPiPAndroid() {
            const canvas = document.createElement('canvas');
            canvas.width = 300; canvas.height = 400;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://quick-plum-ydrhk4qkr9.edgeone.app/images.jpeg");
            let floatY = 0; let dir = 1;
            function renderizarHolograma() {
                ctx.fillStyle = '#050811';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = 'rgba(0, 242, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(150, 190, 110 + floatY, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = '#00f2ff';
                ctx.font = 'bold 16px sans-serif';
                ctx.fillText('⚡ LARA OMEGA', 15, 30);
                ctx.fillStyle = '#22c55e';
                ctx.fillText('ONLINE', 210, 30);
                floatY += dir * 0.4;
                if(floatY > 15) dir = -1; if(floatY < -15) dir = 1;
                if(img.complete && img.naturalWidth > 0) { ctx.drawImage(img, 20, 60 + floatY, 260, 260); }
                else { ctx.fillStyle = '#00f2ff'; ctx.font = '14px monospace'; ctx.fillText('[ Carregando Matriz... ]', 55, 190); }
                requestAnimationFrame(renderizarHolograma);
            }
            renderizarHolograma();
            const stream = canvas.captureStream(30);
            motorDeVideoOculto = document.createElement('video');
            motorDeVideoOculto.srcObject = stream;
            motorDeVideoOculto.muted = true;
            motorDeVideoOculto.playsInline = true;
            motorDeVideoOculto.style.display = 'none';
            document.body.appendChild(motorDeVideoOculto);
            motorDeVideoOculto.play().catch(()=>{}); 
        }

        async function ativarProjeçãoLara() {
            try {
                if (motorDeVideoOculto) {
                    await motorDeVideoOculto.play(); 
                    await motorDeVideoOculto.requestPictureInPicture(); 
                } else {
                    alert("Aguardando inicialização da Matriz...");
                }
            } catch (e) {
                alert("Feche o menu e tente o Modo Projeção novamente.");
            }
        }

        // 🛰️ AGENTE DE ATUALIZAÇÃO AGRESSIVO
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('./sw.js').then(reg => {
              reg.update();
              document.addEventListener('visibilitychange', () => {
                  if (document.visibilityState === 'visible') reg.update();
              });
              setInterval(() => reg.update(), 60000);
          });
          let isRefreshing = false;
          navigator.serviceWorker.addEventListener('controllerchange', () => {
              if (!isRefreshing) {
                  isRefreshing = true;
                  window.location.reload(true); 
              }
          });
        }
        window.onload = () => Core.init();
    </script>
