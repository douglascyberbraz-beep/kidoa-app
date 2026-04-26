// ================================================================
// GoHappy Quests Page v2.0 — UI completa con racha, animación y free/premium
// ================================================================
window.GoHappyQuestsPage = {

    // ─────────────────────────────────────────────────────────
    // RENDER PRINCIPAL
    // ─────────────────────────────────────────────────────────
    render: async (container) => {
        const user = window.GoHappyAuth.checkAuth();
        const familyId = user?.familyId || null;

        // Estructura HTML principal
        container.innerHTML = `
            <div class="quests-page" style="background:#f8fafc; min-height:100vh; padding-bottom:120px;">

                <!-- HEADER con racha -->
                <div class="q-header-premium">
                    <div style="position:relative; z-index:1;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                            <div>
                                <h2 style="color:white; font-size:1.8rem; font-weight:900; margin:0; letter-spacing:-0.5px;">⚔️ Quests</h2>
                                <p style="color:rgba(255,255,255,0.75); font-size:13px; margin-top:4px;">
                                    ${familyId ? `Familia · ${user?.familyName || 'Mi Familia'}` : 'Misiones familiares'}
                                </p>
                            </div>
                            <!-- Racha -->
                            <div id="racha-badge" style="background:rgba(255,255,255,0.15); backdrop-filter:blur(10px); border-radius:16px; padding:10px 16px; text-align:center; border:1px solid rgba(255,255,255,0.2);">
                                <div style="font-size:22px;">🔥</div>
                                <div id="racha-num" style="font-size:1.4rem; font-weight:900; color:white; line-height:1;">-</div>
                                <div style="font-size:10px; color:rgba(255,255,255,0.7); font-weight:700; text-transform:uppercase;">Racha</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- STATS BAR flotante -->
                <div style="margin:-28px 16px 0; position:relative; z-index:10;">
                    <div style="background:white; border-radius:24px; padding:20px; box-shadow:0 8px 30px rgba(11,113,252,0.12); display:grid; grid-template-columns:1fr 1fr 1fr; gap:0;">
                        <div style="text-align:center; border-right:1px solid #f1f5f9;">
                            <div id="stat-pendientes" style="font-size:1.5rem; font-weight:900; color:var(--primary-cobalt);">-</div>
                            <div style="font-size:11px; color:#94a3b8; font-weight:600; margin-top:2px;">Pendientes</div>
                        </div>
                        <div style="text-align:center; border-right:1px solid #f1f5f9;">
                            <div id="stat-completadas" style="font-size:1.5rem; font-weight:900; color:#27AE60;">-</div>
                            <div style="font-size:11px; color:#94a3b8; font-weight:600; margin-top:2px;">Hoy</div>
                        </div>
                        <div style="text-align:center;">
                            <div id="stat-puntos" style="font-size:1.5rem; font-weight:900; color:#F39C12;">-</div>
                            <div style="font-size:11px; color:#94a3b8; font-weight:600; margin-top:2px;">Pts Familia</div>
                        </div>
                    </div>
                </div>

                <!-- Mensaje sin familia -->
                ${!familyId && !user?.isGuest ? `
                    <div style="margin:20px 16px 0; background:rgba(11,113,252,0.06); border-radius:20px; padding:16px 20px; border:1px solid rgba(11,113,252,0.15); display:flex; align-items:center; gap:14px;">
                        <span style="font-size:28px;">👨‍👩‍👧</span>
                        <div>
                            <div style="font-size:13px; font-weight:800; color:var(--primary-cobalt);">¡Únete a una familia!</div>
                            <div style="font-size:12px; color:#64748b; margin-top:2px;">Las quests son más divertidas en equipo. Completa los registros y los puntos se suman a tu familia.</div>
                        </div>
                        <button id="btn-join-family-quests" style="background:var(--primary-cobalt);color:white;border:none;padding:8px 14px;border-radius:12px;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap;">
                            Crear / Unirse
                        </button>
                    </div>
                ` : ''}

                <!-- FILTROS de frecuencia -->
                <div style="display:flex; gap:10px; padding:20px 16px 10px; overflow-x:auto; scrollbar-width:none;">
                    <button class="q-filter-btn active" data-filter="todas" style="flex-shrink:0;">Todas</button>
                    <button class="q-filter-btn" data-filter="diaria" style="flex-shrink:0;">☀️ Diarias</button>
                    <button class="q-filter-btn" data-filter="semanal" style="flex-shrink:0;">📅 Semanales</button>
                    <button class="q-filter-btn" data-filter="fisica" style="flex-shrink:0;">🏃 Física</button>
                    <button class="q-filter-btn" data-filter="familiar" style="flex-shrink:0;">👨‍👩‍👧 Familiar</button>
                    <button class="q-filter-btn" data-filter="educativa" style="flex-shrink:0;">📚 Educativa</button>
                    <button class="q-filter-btn" data-filter="bienestar" style="flex-shrink:0;">🌱 Bienestar</button>
                </div>

                <!-- LISTA DE QUESTS -->
                <div id="quests-list" style="padding:0 16px;">
                    <div class="center-text p-20">
                        <div class="typing-dots"><span></span><span></span><span></span></div>
                        <p style="color:#94a3b8; margin-top:10px;">Preparando tus misiones...</p>
                    </div>
                </div>

                <!-- Banner Premium (solo en plan free) -->
                ${!user?.isPremium ? `
                    <div id="premium-banner" style="margin:10px 16px 0; background:linear-gradient(135deg,#8E44AD,#6C3483); border-radius:24px; padding:20px; color:white;">
                        <div style="display:flex; align-items:center; gap:14px;">
                            <span style="font-size:32px;">✨</span>
                            <div style="flex:1;">
                                <div style="font-weight:900; font-size:14px;">Desbloquea GoHappy Premium</div>
                                <div style="font-size:12px; opacity:0.85; margin-top:3px;">Quests ilimitadas + generadas por IA según tu ubicación</div>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        // Estilos para los filtros y tarjetas (Sincronizados con la paleta oficial)
        const style = document.createElement('style');
        style.id = 'quests-v2-styles';
        const oldStyle = document.getElementById('quests-v2-styles');
        if (oldStyle) oldStyle.remove();

        style.textContent = `
            .quests-page {
                background: #f8fafc;
                min-height: 100vh;
                margin-top: -20px; /* Compensa el padding del contenedor global */
            }

            .q-header-premium {
                background: linear-gradient(135deg, var(--primary-cobalt, #0B4C8F) 0%, #003666 100%);
                padding: 40px 20px 60px;
                position: relative;
                overflow: hidden;
                border-radius: 0 0 40px 40px;
                box-shadow: 0 10px 30px rgba(11, 76, 143, 0.2);
            }

            .q-header-premium::before {
                content: '';
                position: absolute;
                top: -50px; right: -50px;
                width: 200px; height: 200px;
                background: var(--accent-cyan, #08FEFE);
                opacity: 0.1;
                border-radius: 50%;
            }

            .q-filter-btn {
                background: white; 
                border: 1px solid rgba(11, 76, 143, 0.1); 
                color: #64748B;
                padding: 10px 18px; 
                border-radius: 20px; 
                font-size: 13px; 
                font-weight: 700;
                cursor: pointer; 
                transition: all 0.3s ease; 
                white-space: nowrap;
                box-shadow: 0 4px 10px rgba(0,0,0,0.03);
            }
            
            .q-filter-btn.active {
                background: var(--primary-cobalt, #0B4C8F); 
                color: white; 
                border-color: var(--primary-cobalt, #0B4C8F);
                box-shadow: 0 8px 15px rgba(11, 76, 143, 0.25);
            }

            .quest-card-v2 {
                background: white; 
                border-radius: 28px; 
                margin-bottom: 20px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.05); 
                overflow: hidden;
                border: 1px solid rgba(0,0,0,0.02);
                margin-left: 5px;
                margin-right: 5px;
            }
            
            .quest-v2-body { 
                padding: 20px;
            }

            .btn-completar-quest {
                background: linear-gradient(135deg, var(--primary-cobalt, #0B4C8F), #2A9DF4);
                color: white;
                border: none;
                padding: 14px;
                border-radius: 16px;
                font-weight: 800;
                font-size: 14px;
                box-shadow: 0 6px 15px rgba(11, 76, 143, 0.2);
                cursor: pointer;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            @keyframes quest-celebrate {
                0%   { transform: scale(1); }
                50%  { transform: scale(1.03); }
                100% { transform: scale(1); }
            }
            .quest-celebrating { animation: quest-celebrate 0.4s ease-out; }
        `;
        document.head.appendChild(style);

        // ── Cargar datos en paralelo ──
        const [quests, stats, racha] = await Promise.all([
            window.GoHappyQuests.getQuestsDelDia().catch(() => window.GoHappyQuests._getQuestsDemo()),
            familyId ? window.GoHappyQuests.getEstadisticasFamilia(familyId).catch(() => ({ puntosTotales: 0, completadasHoy: 0 })) : { puntosTotales: user?.points || 0, completadasHoy: 0 },
            familyId ? window.GoHappyQuests.getRacha(familyId).catch(() => 0) : 0
        ]);

        // ── Actualizar stats header ──
        const pendientes   = quests.filter(q => !q.completadaHoy).length;
        const completadas  = quests.filter(q => q.completadaHoy).length;
        document.getElementById('stat-pendientes').textContent = pendientes;
        document.getElementById('stat-completadas').textContent = completadas;
        document.getElementById('stat-puntos').textContent = stats.puntosTotales;
        document.getElementById('racha-num').textContent = racha;

        // Racha especial visual
        if (racha >= 7) document.getElementById('racha-badge').style.background = 'rgba(243,156,18,0.3)';
        if (racha === 0) document.getElementById('racha-badge').style.opacity = '0.6';

        // ── Referencia activa a todas las quests para filtrado ──
        let questsActuales = quests;

        const renderLista = (items) => {
            const list = document.getElementById('quests-list');
            list.innerHTML = '';

            if (!items || items.length === 0) {
                list.innerHTML = `
                    <div style="text-align:center; padding:40px 20px;">
                        <div style="font-size:48px; margin-bottom:15px;">🎉</div>
                        <h3 style="color:var(--primary-cobalt); font-weight:900;">¡Todo completado!</h3>
                        <p style="color:#64748b; font-size:13px; margin-top:8px;">Habéis terminado todas las misiones de hoy. ¡Volved mañana!</p>
                    </div>
                `;
                return;
            }

            items.forEach(quest => {
                const cat = window.GoHappyQuests.CATEGORIAS[quest.categoria] ||
                            { icon: '🎯', label: 'Misión', color: '#666' };
                const completada = quest.completadaHoy;

                const card = document.createElement('div');
                card.className = `quest-card-v2 ${completada ? 'completada' : ''}`;
                card.dataset.questId = quest.id;
                card.dataset.categoria = quest.categoria || '';
                card.dataset.frecuencia = quest.frecuencia || '';

                card.innerHTML = `
                    <!-- Franja de categoría -->
                    <div style="height:5px; background:linear-gradient(90deg,${cat.color},${cat.color}88);"></div>

                    <div class="quest-v2-body" style="padding:18px 18px 16px;">
                        <!-- Fila superior -->
                        <div style="display:flex; align-items:flex-start; gap:14px;">
                            <!-- Icono -->
                            <div style="
                                width:52px; height:52px; border-radius:18px; flex-shrink:0;
                                background:${cat.color}15; display:flex; align-items:center;
                                justify-content:center; font-size:26px;
                                ${completada ? 'position:relative;' : ''}
                            ">
                                ${quest.icono || cat.icon}
                                ${completada ? `<div style="position:absolute;inset:0;background:rgba(39,174,96,0.85);border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:22px;">✅</div>` : ''}
                            </div>

                            <!-- Texto -->
                            <div style="flex:1; min-width:0;">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                                    <h3 style="margin:0; font-size:0.95rem; font-weight:900; color:${completada ? '#64748b' : 'var(--primary-cobalt)'}; line-height:1.3; ${completada ? 'text-decoration:line-through;' : ''}">
                                        ${quest.titulo}
                                    </h3>
                                    <div style="flex-shrink:0; text-align:right;">
                                        <div style="font-size:1rem; font-weight:900; color:${completada ? '#27AE60' : '#F39C12'};">
                                            ${completada ? '✅' : `+${quest.puntos}`}
                                        </div>
                                        ${!completada ? `<div style="font-size:10px; color:#94a3b8; font-weight:600;">pts</div>` : ''}
                                    </div>
                                </div>

                                <p style="margin:6px 0 10px; font-size:12px; color:#64748b; line-height:1.4;">
                                    ${quest.descripcion}
                                </p>

                                <!-- Tags -->
                                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                                    <span style="
                                        background:${cat.color}12; color:${cat.color};
                                        padding:3px 10px; border-radius:20px; font-size:10px; font-weight:700;
                                    ">
                                        ${cat.icon} ${cat.label}
                                    </span>
                                    <span style="
                                        background:${quest.frecuencia === 'diaria' ? '#FFF3CD' : '#E8F5E9'};
                                        color:${quest.frecuencia === 'diaria' ? '#856404' : '#1a6b3c'};
                                        padding:3px 10px; border-radius:20px; font-size:10px; font-weight:700;
                                    ">
                                        ${quest.frecuencia === 'diaria' ? '☀️ Diaria' : '📅 Semanal'}
                                    </span>
                                    ${completada && quest.completadaPor ? `
                                        <span style="background:#E8F5E9;color:#1a6b3c;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;">
                                            👤 ${quest.completadaPorNick || 'Tú'}
                                        </span>
                                    ` : ''}
                                </div>
                            </div>
                        </div>

                        <!-- Botón Completar -->
                        ${!completada ? `
                            <button
                                id="btn-completar-${quest.id}"
                                class="btn-completar-quest"
                                data-quest-id="${quest.id}"
                                style="
                                    width:100%; margin-top:16px; height:46px; border-radius:14px; border:none;
                                    background:linear-gradient(135deg,${cat.color},${cat.color}CC); color:white;
                                    font-size:14px; font-weight:800; cursor:pointer;
                                    box-shadow:0 4px 15px ${cat.color}44;
                                    transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px;
                                "
                            >
                                <span>✓</span> Marcar como completada
                            </button>
                        ` : `
                            <div style="margin-top:14px; background:#f0fdf4; border-radius:12px; padding:10px 14px; display:flex; align-items:center; gap:10px;">
                                <span style="font-size:18px;">✨</span>
                                <span style="font-size:13px; font-weight:700; color:#166534;">¡Misión completada hoy! +${quest.puntos} pts para la familia</span>
                            </div>
                        `}
                    </div>
                `;

                list.appendChild(card);
            });

            // ── Eventos de los botones completar ──
            list.querySelectorAll('.btn-completar-quest').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const qId = btn.dataset.questId;
                    const quest = questsActuales.find(q => q.id === qId);
                    if (!quest) return;

                    btn.disabled = true;
                    btn.innerHTML = '<span style="opacity:0.7">⌛ Guardando...</span>';

                    const result = await window.GoHappyQuests.completarQuest(qId, quest);

                    if (result.ok) {
                        // Marcar como completada en memoria
                        quest.completadaHoy = true;
                        quest.completadaPorNick = window.GoHappyAuth.checkAuth()?.nickname || 'Tú';

                        // Animación en la card
                        const card = btn.closest('.quest-card-v2');
                        if (card) {
                            card.classList.add('quest-celebrating');
                            setTimeout(() => card.classList.remove('quest-celebrating'), 500);
                        }

                        // Lanzar confetti ligero
                        window.GoHappyQuestsPage._confetti(btn);

                        // Toast de puntos
                        window.GoHappyToast.points(`¡Quest completada! +${result.puntos} pts para la familia 🎉`);

                        // Actualizar stats header
                        const totalCompletadas = questsActuales.filter(q => q.completadaHoy).length;
                        const totalPendientes  = questsActuales.filter(q => !q.completadaHoy).length;
                        document.getElementById('stat-completadas').textContent = totalCompletadas;
                        document.getElementById('stat-pendientes').textContent = totalPendientes;
                        const statsActuales = await window.GoHappyQuests.getEstadisticasFamilia(user?.familyId || '').catch(() => ({}));
                        if (statsActuales.puntosTotales !== undefined) {
                            document.getElementById('stat-puntos').textContent = statsActuales.puntosTotales;
                        }

                        // Re-renderizar la card como completada
                        renderLista(questsActuales);

                    } else {
                        btn.disabled = false;
                        btn.innerHTML = '<span>✓</span> Marcar como completada';
                        window.GoHappyToast.error(result.error || 'Error al completar la misión.');
                    }
                });
            });
        };

        // ── Render inicial ──
        renderLista(quests);

        // ── Filtros ──
        container.querySelectorAll('.q-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.q-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filtro = btn.dataset.filter;
                if (filtro === 'todas') {
                    renderLista(questsActuales);
                } else if (filtro === 'diaria' || filtro === 'semanal') {
                    renderLista(questsActuales.filter(q => q.frecuencia === filtro));
                } else {
                    renderLista(questsActuales.filter(q => q.categoria === filtro));
                }
            });
        });

        // ── Botón unirse a familia (si se muestra) ──
        const joinBtn = document.getElementById('btn-join-family-quests');
        if (joinBtn && window.GoHappyFamilyOnboarding) {
            joinBtn.onclick = () => window.GoHappyFamilyOnboarding.show();
        }
    },

    // ─────────────────────────────────────────────────────────
    // ANIMACIÓN: Confetti ligero en CSS puro al completar
    // ─────────────────────────────────────────────────────────
    _confetti: (anchorEl) => {
        if (!anchorEl) return;
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#0B71FC', '#27AE60', '#E67E22'];
        const rect = anchorEl.getBoundingClientRect();

        for (let i = 0; i < 18; i++) {
            const dot = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 8 + 4;
            dot.style.cssText = `
                position: fixed;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top}px;
                width: ${size}px; height: ${size}px;
                background: ${color};
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                pointer-events: none; z-index: 99999;
                animation: confetti-drop ${0.6 + Math.random() * 0.6}s ease-out forwards;
                animation-delay: ${Math.random() * 0.3}s;
            `;
            document.body.appendChild(dot);
            setTimeout(() => dot.remove(), 1500);
        }
    }
};
