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
            <div class="profile-page entry-anim" style="padding-bottom: 120px;">
                <div class="profile-hero-premium" style="background: linear-gradient(180deg, var(--primary-cobalt) 0%, #1e293b 100%); padding-top: 40px; border-radius: 0 0 40px 40px; margin-bottom: -30px;">
                    <div class="profile-avatar-wrapper" id="open-avatar-editor" style="cursor: pointer;">
                        <div class="profile-avatar-large profile-glow" style="font-size: 60px; background: white; border: 4px solid var(--accent-pink);">${user.photo || '👤'}</div>
                        <div class="level-label-bubble" style="background: var(--accent-pink); font-weight: 800; padding: 4px 15px; border-radius: 20px; bottom: -10px;">Nivel ${user.level || '1'}</div>
                    </div>
                    <div class="profile-info-header" style="margin-top: 15px;">
                        <h2 class="profile-name-premium" style="color: white; font-weight: 900; font-size: 1.8rem; margin: 0;">${user.nickname || 'Explorador'}</h2>
                        <div class="profile-badge-row" style="justify-content: center; margin-top: 5px;">
                            <span class="p-badge" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2);">💎 Miembro Oro</span>
                            <span class="p-badge" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2);">📍 ${user.city || 'Comunidad'}</span>
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

                <div class="referral-premium-box premium-glass" style="margin: 20px 0; padding: 25px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.4);">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h3 style="color: var(--primary-cobalt); font-weight: 900; margin: 0;">¡Invita y Gana! 🎁</h3>
                        <p style="font-size: 13px; color: #64748b; margin-top: 5px;">Gana 500 puntos por cada amigo que se una.</p>
                    </div>
                    
                    <div style="display: flex; gap: 20px; align-items: center; background: white; padding: 15px; border-radius: 20px; box-shadow: var(--shadow-soft);">
                        <div id="referral-qr" style="width: 100px; height: 100px; background: #f8fafc; border-radius: 12px; display: flex; align-items: center; justify-content: center;"></div>
                        <div style="flex: 1;">
                            <div style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Tu código personal</div>
                            <div id="ref-code-display" style="font-size: 1.5rem; font-weight: 900; color: var(--primary-cobalt); letter-spacing: 1px;">${user.referralCode || 'GH-123'}</div>
                            <button id="copy-ref-link" style="margin-top: 10px; background: var(--primary-cobalt); color: white; border: none; padding: 8px 15px; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer;">Copiar Enlace</button>
                        </div>
                    </div>
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

        document.getElementById('open-avatar-editor').onclick = () => {
            const modal = document.createElement('div');
            modal.className = 'modal entry-anim';
            modal.innerHTML = `
                <div class="auth-container" style="padding: 20px;">
                    <div class="auth-card premium-glass" style="padding: 30px; border-radius: 35px;">
                        <h3 style="color:var(--primary-cobalt); text-align:center; font-weight:900; margin-bottom:20px;">Cambiar Avatar</h3>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
                            ${['👤', '🦁', '🐼', '🦄', '🦊', '🤖', '👩‍🚀', '🦒'].map(emoji => `
                                <div class="avatar-option" data-emoji="${emoji}" style="font-size: 35px; background: white; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 50%; cursor: pointer; border: 2px solid transparent; ${user.photo === emoji ? 'border-color: var(--primary-cobalt); background: rgba(11, 113, 252, 0.1);' : ''}">${emoji}</div>
                            `).join('')}
                        </div>
                        <button id="save-avatar-btn" class="btn-primary-gradient full-width" style="height: 55px; font-weight: 800;">Guardar Cambios</button>
                        <button class="btn-text full-width" style="margin-top:15px;" onclick="this.closest('.modal').remove()">Cancelar</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            let selected = user.photo;
            modal.querySelectorAll('.avatar-option').forEach(opt => {
                opt.onclick = () => {
                    modal.querySelectorAll('.avatar-option').forEach(o => {
                        o.style.borderColor = 'transparent';
                        o.style.background = 'white';
                    });
                    opt.style.borderColor = 'var(--primary-cobalt)';
                    opt.style.background = 'rgba(11, 113, 252, 0.1)';
                    selected = opt.dataset.emoji;
                };
            });

            document.getElementById('save-avatar-btn').onclick = async () => {
                try {
                    await window.GoHappyDB.collection('users').doc(user.uid).update({ photo: selected });
                    user.photo = selected;
                    localStorage.setItem('GoHappy_local_user', JSON.stringify(user));
                    modal.remove();
                    window.GoHappyProfile.render(container);
                    window.GoHappySound.play('success');
                } catch (e) {
                    alert("Error al guardar el avatar.");
                }
            };
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

