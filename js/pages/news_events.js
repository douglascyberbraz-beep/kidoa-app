window.GoHappyNewsEvents = {
    render: async (container) => {
        container.innerHTML = `
            <div class="page-header sticky-header" style="flex-direction: column; align-items: stretch; gap: 15px; padding-bottom: 5px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="color: var(--primary-navy); font-weight: 800; letter-spacing: 1px;">NEWS</h2>
                    <span id="loc-status" style="font-size: 10px; color: #888; background: #eee; padding: 4px 8px; border-radius: 10px;">📍 Detectando ubicación...</span>
                </div>
                
                <div class="tab-scroller">
                    <button class="tab-btn active" data-tab="news">Noticias Locales</button>
                    <button class="tab-btn" data-tab="events">Eventos Próximos</button>
                    <button class="tab-btn" data-tab="becas">Becas y Ayudas</button>
                </div>
            </div>
            
            <div id="news-events-content" class="content-list stagger-group" style="padding-bottom: 100px; width: 100%; display: flex; flex-direction: column; align-items: center;">
                <div class="center-text p-20"><div class="typing-dots"><span></span><span></span><span></span></div></div>
            </div>
        `;

        const content = document.getElementById('news-events-content');
        const locStatus = document.getElementById('loc-status');

        // Reactive Sync
        window.addEventListener('GoHappy-location-sync', (e) => {
            if (window.GoHappyApp.currentPage === 'news_events') {
                locStatus.innerText = "📍 Información de tu zona sincronizada";
                loadContent(currentTab || 'news');
            }
        });

        const loadContent = async (tab) => {
            currentTab = tab;
            content.innerHTML = '<div class="center-text p-20"><div class="typing-dots"><span></span><span></span><span></span></div><p>Cargando información personalizada...</p></div>';

            let coords = window.lastKnownCoords || "41.6520, -4.7286";

            if (!window.lastKnownCoords && navigator.geolocation) {
                try {
                    const pos = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4000 });
                    });
                    if (pos) {
                        window.lastKnownCoords = `${pos.coords.latitude}, ${pos.coords.longitude}`;
                        coords = window.lastKnownCoords;
                        locStatus.innerText = "📍 Información de tu zona";
                    }
                } catch (e) {
                    locStatus.innerText = "📍 Información Regional (Predeterminada)";
                }
            } else if (window.lastKnownCoords) {
                locStatus.innerText = "📍 Información de tu zona";
            }

            try {
                if (tab === 'news') {
                    const news = await window.GoHappyData.getNews(coords);
                    if (news && news.length > 0) renderNews(news);
                    else content.innerHTML = '<div class="p-40 center-text text-light">No hemos encontrado noticias en tu zona hoy. 🏜️</div>';
                } else if (tab === 'events') {
                    const events = await window.GoHappyData.getEvents(coords);
                    if (events && events.length > 0) renderEvents(events);
                    else content.innerHTML = '<div class="p-40 center-text text-light">No hay eventos próximos registrados cerca de ti. 🎭</div>';
                } else if (tab === 'becas') {
                    const becas = await window.GoHappyData.getBecas(coords);
                    if (becas && becas.length > 0) renderBecas(becas);
                    else content.innerHTML = '<div class="p-40 center-text text-light">No hay becas activas en este momento. 💎</div>';
                }
            } catch (e) {
                console.error("Error loading news content:", e);
                content.innerHTML = '<div class="p-40 center-text text-light" style="color:red;">Error al cargar información personalizada.</div>';
            }
        };

        const renderNews = (items) => {
            content.innerHTML = '';
            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'news-card entry-anim';
                card.style.width = '92%';
                card.style.maxWidth = '500px';
                card.style.background = 'white';
                card.style.padding = '18px';
                card.style.borderRadius = '24px';
                card.style.marginBottom = '12px';
                card.style.boxShadow = 'var(--shadow-soft)';

                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <span style="font-size: 10px; color: var(--primary-cobalt); font-weight: 800; text-transform: uppercase; background: rgba(11, 113, 252, 0.1); padding: 4px 10px; border-radius: 20px;">📰 Noticia Local</span>
                        <span style="font-size: 10px; color: #94a3b8; font-weight: 600;">${item.date || 'Hoy'}</span>
                    </div>
                    <h3 style="color: var(--primary-cobalt); margin: 0 0 12px 0; font-size: 1.25rem; line-height: 1.3; font-weight: 800;">${item.title}</h3>
                    <p style="font-size: 0.95rem; color: #475569; line-height: 1.5; margin-bottom: 18px;">${item.summary}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 15px;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-size: 12px;">🔗</span>
                            <small style="color: #64748b; font-weight: 600;">Fuente: ${item.sourceName || 'Oficial'}</small>
                        </div>
                        <a href="${item.link && item.link !== '#' ? item.link : 'javascript:void(0)'}" target="_blank" class="btn-text" style="color: var(--primary-cobalt); font-weight: 700; text-decoration: none; font-size: 13px;">Leer más →</a>
                    </div>
                `;
                content.appendChild(card);
            });
        };

        const renderEvents = (items) => {
            content.innerHTML = '';
            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'event-card-premium entry-anim';
                card.style.width = '92%';
                card.style.maxWidth = '500px';
                card.style.background = 'white';
                card.style.padding = '20px';
                card.style.borderRadius = '24px';
                card.style.marginBottom = '15px';
                card.style.boxShadow = 'var(--shadow-soft)';

                card.innerHTML = `
                    <div style="font-size: 11px; font-weight: 800; color: #F28C28; margin-bottom: 5px;">📍 ${item.location}</div>
                    <h3 style="color: var(--primary-navy); margin: 0 0 10px 0;">${item.title}</h3>
                    <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                        <span style="font-size: 12px; color: #666;">🕒 ${item.date}</span>
                        <span style="font-size: 12px; color: #666;">💰 ${item.price}</span>
                    </div>
                `;
                content.appendChild(card);
            });
        };

        const renderBecas = (items) => {
            content.innerHTML = '<div class="becas-list" style="width: 92%; max-width: 500px;"></div>';
            const listContainer = content.querySelector('.becas-list');

            items.forEach((item, idx) => {
                const card = document.createElement('div');
                card.className = 'beca-item premium-glass entry-anim';
                card.style.padding = '20px';
                card.style.borderRadius = '20px';
                card.style.marginBottom = '15px';
                card.style.border = '1px solid #eee';

                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="color: ${item.statusColor === 'green' ? '#27AE60' : '#E67E22'}; font-weight: 800; font-size: 10px; background: ${item.statusColor === 'green' ? 'rgba(39,174,96,0.1)' : 'rgba(230,126,34,0.1)'}; padding: 4px 10px; border-radius: 20px;">
                            ${item.status || 'PLAZO ABIERTO'}
                        </span>
                        <span style="font-size: 11px; color: #94a3b8; font-weight: 600;">⏳ ${item.deadline || 'Consultar'}</span>
                    </div>
                    <h4 style="color: var(--primary-cobalt); margin: 0 0 8px 0; font-size: 1.1rem; font-weight: 800;">${item.title}</h4>
                    <p style="font-size: 13px; color: #475569; margin-bottom: 15px; line-height: 1.4;">${item.description}</p>
                    
                    <div class="beca-details" style="background: rgba(255,255,255,0.5); border-radius: 12px; padding: 12px; margin-bottom: 15px; font-size: 12px; border: 1px solid rgba(0,0,0,0.03);">
                        <div style="margin-bottom: 8px;"><strong style="color: var(--primary-cobalt);">📋 Requisitos:</strong> ${item.requirements || 'Consultar bases oficiales.'}</div>
                        <div><strong style="color: var(--primary-cobalt);">🚀 Cómo pedirla:</strong> ${item.howToApply || 'A través de la sede electrónica.'}</div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <button id="beca-btn-${idx}" class="btn-primary-gradient" style="padding: 10px 20px; border-radius: 12px; font-size: 12px; font-weight: 700; border: none; width: 100%; box-shadow: 0 4px 10px rgba(11, 113, 252, 0.1);">
                            ${item.linkText || 'Ver Detalles y Web Oficial'}
                        </button>
                    </div>
                `;
                listContainer.appendChild(card);

                const becaBtn = document.getElementById(`beca-btn-${idx}`);
                if (becaBtn) {
                    becaBtn.onclick = () => {
                        if (item.link && item.link !== "") {
                            window.open(item.link, '_blank');
                        } else {
                            alert(`ℹ️ Información sobre: ${item.title}\n\nPuedes consultar las bases oficiales y los requisitos completos de esta ayuda familiar buscando en la sede electrónica de tu ayuntamiento o comunidad autónoma.`);
                        }
                    };
                }
            });
        };

        // Tab Logic
        container.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                loadContent(btn.dataset.tab);
            });
        });

        // Init news
        loadContent('news');
    }
};

