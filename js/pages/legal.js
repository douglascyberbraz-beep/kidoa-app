window.GoHappyLegal = {
    render: async (container) => {
        container.innerHTML = `
            <div class="legal-page p-20 entry-anim">
                <header class="page-header">
                    <h2 style="color: var(--primary-navy); font-weight: 800;">LEGAL</h2>
                </header>
                
                <div class="premium-glass p-20" style="border-radius: 20px;">
                    <h3 style="color: var(--primary-blue);">Términos y Condiciones</h3>
                    <p style="font-size: 0.9rem; color: #555; line-height: 1.6;">
                        Bienvenido a GoHappy. Al usar nuestra aplicación, aceptas que somos una plataforma informativa para familias.
                        Respetamos tu privacidad y tus datos están protegidos según el RGPD.
                    </p>
                    
                    <h3 style="color: var(--primary-blue); margin-top:20px;">Soporte</h3>
                    <p style="font-size: 0.9rem; color: #555;">
                        ¿Tienes dudas? Escríbenos a <a href="mailto:hola@GoHappy.app" style="color: var(--primary-blue); font-weight: 700;">hola@GoHappy.app</a>
                    </p>
                </div>
                
                <button class="btn-text full-width" style="margin-top: 30px;" onclick="window.GoHappyApp.loadPage('profile')">← Volver al Perfil</button>
            </div>
        `;
    }
};

