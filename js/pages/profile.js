window.GoHappyProfile = {
    render: async (container) => {
        container.innerHTML = `<div class="p-20 center-text"><div class="typing-dots"><span></span><span></span><span></span></div><p>Sincronizando con la nube...</p></div>`;

        const user = window.GoHappyAuth.checkAuth();

        if (!user) {
            container.innerHTML = `
                <div class="p-20 center-text entry-anim">
                    <div style="font-size: 5rem; margin-bottom: 30px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));">🕶️</div>
                    <h3 style="color: var(--primary-cobalt); font-size: 20px; font-weight: 800;">¿Quién eres?</h3>
                    <p style="color: #666; margin-top: 10px;">Identifícate para desbloquear tu nivel, puntos y premios exclusivos.</p>
                    <button id="login-from-profile" class="btn-primary" style="margin-top: 30px; padding: 15px 40px; font-size: 16px;">Entrar a GoHappy</button>
                    <p style="font-size: 12px; color: #aaa; margin-top: 20px;">Únete a miles de familias 🌍</p>
                </div>
            `;
            document.getElementById('login-from-profile').addEventListener('click', () => {
                window.GoHappyAuth.renderAuthModal();
            });
            return;
        }

        const levelInfo = window.GoHappyPoints.getLevelInfo(user.points);

        container.innerHTML = `
            <div class="profile-page entry-anim">
                <div class="profile-hero-premium">
                    <div class="profile-avatar-wrapper">
                        <div class="profile-avatar-large profile-glow">${user.photo || '👤'}</div>
                        <div class="level-label-bubble">Nivel ${user.level}</div>
                    </div>
                    <div class="profile-info-header">
                        <h2 class="profile-name-premium">${user.nickname || 'Explorador GoHappy'}</h2>
                        <div class="profile-badge-row">
                            <span class="p-badge"><i class="icon">💎</i> Premium</span>
                            <span class="p-badge"><i class="icon">📍</i> ${user.city || 'España'}</span>
                        </div>
                    </div>
                </div>

                <div class="gamification-dashboard premium-glass">
                    <div class="dashboard-header">
                        <div class="points-circle">
                            <span class="big-pts">${user.points}</span>
                            <span class="pts-label">PUNTOS</span>
                        </div>
                        <div class="level-status">
                            <h3 style="margin:0; font-size: 18px;">${levelInfo.icon} ${levelInfo.name}</h3>
                            <p style="font-size: 12px; opacity: 0.8; margin-top: 5px;">
                                ${levelInfo.nextPoints ? `Próximo: ${levelInfo.nextPoints} pts` : '¡Máximo Nivel!'}
                            </p>
                        </div>
                    </div>
                    
                    <div class="premium-progress-container">
                        <div class="premium-progress-bar" style="width: ${levelInfo.progress}%">
                            <div class="progress-glow"></div>
                        </div>
                    </div>
                    <p class="progress-flavor-text">${levelInfo.progress === 100 ? '¡Eres una leyenda!' : `Estás al ${Math.floor(levelInfo.progress)}% de tu siguiente reto.`}</p>
                </div>

                <div class="quick-grid">
                    <div class="quick-card card-anim" data-goto="memories">
                        <span class="q-icon">📸</span>
                        <h4>Recuerdos</h4>
                        <p>Mis fotos</p>
                    </div>
                    <div class="quick-card card-anim" id="share-app-btn">
                        <span class="q-icon">🎁</span>
                        <h4>Invitar</h4>
                        <p>+100 pts</p>
                    </div>
                </div>

                <div class="referral-premium-box premium-glass">
                    <div class="ref-header">
                        <div class="ref-texts">
                            <h3>Tu Código Mágico</h3>
                            <p>Cópialo y envíalo a tus grupos de WhatsApp</p>
                        </div>
                        <div id="ref-code-display" class="ref-code-big">${user.referralCode || 'AMIGOS2025'}</div>
                    </div>
                    <button id="copy-ref-link" class="btn-primary-gradient full-width">Copiar Enlace de Invitación</button>
                    <div id="referral-qr" class="qr-preview"></div>
                </div>

                <div class="account-actions-list">
                    <button id="terms-link" class="action-list-item">
                        <span>📜 Términos y Soporte</span>
                        <span class="arrow">→</span>
                    </button>
                    <button id="logout-btn" class="action-list-item danger">
                        <span>🚪 Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        `;

        // Interaction logic
        document.getElementById('logout-btn').onclick = () => window.GoHappyAuth.logout();

        document.getElementById('copy-ref-link').onclick = (e) => {
            const link = `https://GoHappy.app/invite/${user.referralCode}`;
            navigator.clipboard.writeText(link);
            e.target.innerText = "¡Copiado! ✅";
            window.GoHappySound.play('success');
            setTimeout(() => e.target.innerText = "Copiar Enlace de Invitación", 2000);
        };

        document.getElementById('share-app-btn').onclick = () => {
            const shareData = {
                title: 'Únete a GoHappy',
                text: `¡Hola! Únete a GoHappy y explora planes increíbles en familia. Usa mi código: ${user.referralCode}`,
                url: `https://GoHappy.app/invite/${user.referralCode}`
            };
            if (navigator.share) {
                navigator.share(shareData).catch(() => {
                    document.getElementById('copy-ref-link').click();
                });
            } else {
                document.getElementById('copy-ref-link').click();
            }
        };

        document.getElementById('terms-link').onclick = () => {
            window.GoHappyApp.loadPage('legal');
        };

        container.querySelectorAll('.quick-card[data-goto]').forEach(card => {
            card.onclick = () => {
                const target = card.dataset.goto;
                if (target) {
                    window.GoHappySound.play('click');
                    window.GoHappyApp.loadPage(target);
                }
            };
        });

        // Generate QR
        setTimeout(() => {
            const qrContainer = document.getElementById('referral-qr');
            if (qrContainer && window.QRCode) {
                new QRCode(qrContainer, {
                    text: `https://GoHappy.app/invite/${user.referralCode}`,
                    width: 100,
                    height: 100,
                    colorDark: "#0B71FC",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.M
                });
            }
        }, 300);
    }
};

