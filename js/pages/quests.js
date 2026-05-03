// ================================================================
// GoHappy Quests Page v2.1 — SMART CARDS DESIGN
// UI compacta, inmersiva y sin desbordamientos.
// ================================================================
window.GoHappyQuestsPage = {

    render: async (container) => {
        const user = window.GoHappyAuth.checkAuth();
        const familyId = user?.familyId || null;

        // Estructura Base (Control total del ancho)
        container.innerHTML = `
            <div class="quests-page">

                <!-- HEADER COMPACTO -->
                <div class="q-header-premium">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div>
                            <h2 style="color:white; font-size:1.6rem; font-weight:900; margin:0; letter-spacing:-0.5px;">⚔️ Quests</h2>
                            <p style="color:rgba(255,255,255,0.7); font-size:12px; margin-top:2px;">
                                ${familyId ? `Tribu ${user?.familyName || 'GoHappy'}` : 'Misiones Familiares'}
                            </p>
                        </div>
                        <div id="racha-badge" style="background:rgba(255,255,255,0.15); backdrop-filter:blur(10px); border-radius:18px; padding:8px 14px; text-align:center; border:1px solid rgba(255,255,255,0.2);">
                            <span style="font-size:18px;">🔥</span>
                            <span id="racha-num" style="font-size:1.1rem; font-weight:900; color:white; margin-left:4px;">-</span>
                        </div>
                    </div>
                </div>

                <!-- BARRA DE STATS (Sutil) -->
                <div style="margin:-20px 20px 0; background:white; border-radius:20px; padding:15px; box-shadow:0 8px 30px rgba(0,0,0,0.06); display:flex; justify-content:space-around; align-items:center;">
                    <div style="text-align:center;">
                        <div id="stat-pendientes" style="font-size:1.1rem; font-weight:900; color:var(--primary-cobalt);">-</div>
                        <div style="font-size:9px; color:#94a3b8; font-weight:700; text-transform:uppercase;">Libres</div>
                    </div>
                    <div style="width:1px; height:20px; background:#f1f5f9;"></div>
                    <div style="text-align:center;">
                        <div id="stat-completadas" style="font-size:1.1rem; font-weight:900; color:#27AE60;">-</div>
                        <div style="font-size:9px; color:#94a3b8; font-weight:700; text-transform:uppercase;">Hechas</div>
                    </div>
                    <div style="width:1px; height:20px; background:#f1f5f9;"></div>
                    <div style="text-align:center;">
                        <div id="stat-puntos" style="font-size:1.1rem; font-weight:900; color:#F39C12;">-</div>
                        <div style="font-size:9px; color:#94a3b8; font-weight:700; text-transform:uppercase;">Puntos</div>
                    </div>
                </div>

                <!-- FILTROS SCROLLABLE -->
                <div style="display:flex; gap:8px; padding:20px 20px 5px; overflow-x:auto; scrollbar-width:none;">
                    <button class="q-filter-btn active" data-filter="todas">Todas</button>
                    <button class="q-filter-btn" data-filter="diaria">☀️ Diaria</button>
                    <button class="q-filter-btn" data-filter="semanal">📅 Semanal</button>
                    <button class="q-filter-btn" data-filter="fisica">🏃 Activa</button>
                </div>

                <!-- LISTA DE TARJETAS INTELIGENTES -->
                <div id="quests-list">
                    <!-- Dinámico -->
                </div>

                <div style="height:120px;"></div>
            </div>
        `;

        // INYECCIÓN DE ESTILOS SMART (Garantiza que no haya bordes rotos)
        const styleId = 'quests-smart-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .quests-page { width:100%; box-sizing:border-box; overflow-x:hidden; }
                .q-header-premium { width:100%; box-sizing:border-box; background:linear-gradient(135deg, #0B4C8F 0%, #051937 100%); padding:45px 20px 40px; border-radius:0 0 32px 32px; }
                .q-filter-btn { background:#fff; border:none; padding:8px 16px; border-radius:12px; font-size:12px; font-weight:700; color:#64748b; box-shadow:0 2px 5px rgba(0,0,0,0.05); flex-shrink:0; cursor:pointer; }
                .q-filter-btn.active { background:var(--primary-cobalt); color:#fff; }
                
                #quests-list { padding:15px 20px; display:flex; flex-direction:column; gap:12px; width:100%; box-sizing:border-box; }
                
                .quest-card-smart {
                    background: #fff; border-radius: 20px; padding: 14px;
                    display: flex; align-items: center; gap: 14px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
                    border: 1px solid rgba(0,0,0,0.02);
                    transition: transform 0.2s;
                    position: relative; overflow: hidden;
                }
                .quest-card-smart::after {
                    content: ''; position:absolute; left:0; top:0; bottom:0; width:4px; background:var(--primary-cobalt);
                }
                .quest-card-smart.done { opacity: 0.7; background:#f8fafc; }
                .quest-card-smart.done::after { background:#27AE60; }
                
                .q-icon { width:44px; height:44px; background:#f1f5f9; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
                .q-content { flex:1; min-width:0; }
                .q-title { font-weight:800; font-size:14px; color:#1e293b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
                .q-points { font-size:11px; font-weight:700; color:#F39C12; margin-top:2px; }
                
                .q-check {
                    width:36px; height:36px; border-radius:50%; border:2px solid #e2e8f0; 
                    background:#fff; display:flex; align-items:center; justify-content:center;
                    cursor:pointer; color:#e2e8f0; font-weight:bold; transition:all 0.2s;
                }
                .q-check.active { background:#27AE60; border-color:#27AE60; color:#fff; }
            `;
            document.head.appendChild(style);
        }

        // Cargar datos
        await window.GoHappyQuestsPage.loadQuests();
        window.GoHappyQuestsPage.setupFilters();
    },

    loadQuests: async (filtro = 'todas') => {
        const listContainer = document.getElementById('quests-list');
        const user = window.GoHappyAuth.checkAuth();
        if (!user) return;

        try {
            // Usar la API correcta del servicio
            const questsDelDia = await window.GoHappyQuests.getQuestsDelDia();
            
            // Estadísticas
            const stats = await window.GoHappyQuests.getEstadisticasFamilia(user.familyId);
            const puntosTotales = stats.puntosTotales;
            const completadasHoyCount = stats.completadasHoy;
            
            const elPendientes = document.getElementById('stat-pendientes');
            const elCompletadas = document.getElementById('stat-completadas');
            const elPuntos = document.getElementById('stat-puntos');
            const elRacha = document.getElementById('racha-num');

            if (elPendientes) elPendientes.textContent = (questsDelDia.length || 0) - (completadasHoyCount || 0);
            if (elCompletadas) elCompletadas.textContent = completadasHoyCount || 0;
            if (elPuntos) elPuntos.textContent = puntosTotales || 0;
            
            const racha = await window.GoHappyQuests.getRacha(user.familyId);
            if (elRacha) elRacha.textContent = racha || 0;

            let filtradas = questsDelDia;
            if (filtro !== 'todas') {
                filtradas = questsDelDia.filter(q => q.frecuencia === filtro || q.categoria === filtro);
            }

            listContainer.innerHTML = filtradas.map(q => {
                const isDone = q.completadaHoy;
                return `
                    <div class="quest-card-smart ${isDone ? 'done' : ''}">
                        <div class="q-icon">${q.icono || '✨'}</div>
                        <div class="q-content">
                            <div class="q-title">${q.titulo}</div>
                            <div class="q-points">+${q.puntos} Puntos</div>
                        </div>
                        <button class="q-check ${isDone ? 'active' : ''}" 
                                onclick="window.GoHappyQuestsPage.handleCompletar('${q.id}', ${q.puntos})"
                                ${isDone ? 'disabled' : ''}>
                            ${isDone ? '✓' : ''}
                        </button>
                    </div>
                `;
            }).join('');

        } catch (e) {
            console.error(e);
            listContainer.innerHTML = '<p class="center-text">Error al cargar misiones</p>';
        }
    },

    handleCompletar: async (questId, puntos) => {
        const user = window.GoHappyAuth.checkAuth();
        if (!user) return;

        window.GoHappyToast.info("¡Completando misión! 🚀");
        
        const res = await window.GoHappyQuests.completarQuest(user.uid, user.familyId, questId, puntos);
        if (res.ok) {
            window.GoHappyToast.success(`¡Misión cumplida! +${puntos} pts`);
            
            // --- INTEGRACIÓN INVISIBLE: RECUPERAR MEMORIA ---
            setTimeout(() => {
                const wantsMemory = confirm("🌟 ¿Quieres guardar una foto de este momento en tu historia familiar?");
                if (wantsMemory) {
                    window.GoHappyToast.info("📸 Abre la cámara para tu recuerdo...");
                    // Aquí se dispararía el input file de Capacitor o Web
                }
            }, 1500);

            window.GoHappyQuestsPage.loadQuests();
        } else {
            window.GoHappyToast.error(res.error || "No se pudo completar");
        }
    },

    setupFilters: () => {
        document.querySelectorAll('.q-filter-btn').forEach(btn => {
            btn.onclick = (e) => {
                document.querySelectorAll('.q-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                window.GoHappyQuestsPage.loadQuests(btn.dataset.filter);
            };
        });
    }
};
