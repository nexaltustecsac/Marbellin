// La validación local es heredada del proyecto estático. Para seguridad real debe migrarse a autenticación de servidor.
const ADMIN_EMAIL='marbellinLenceria@gmail.com'.toLowerCase();
const ADMIN_PASSWORD='Marbellin2026@05';
const ADMIN_SESSION_MINUTES=5;
const form=document.getElementById('loginForm');
const emailInput=document.getElementById('adminEmail');
const passwordInput=document.getElementById('password');
const error=document.getElementById('loginError');
const togglePassword=document.getElementById('togglePassword');
togglePassword?.addEventListener('click',()=>{const showing=passwordInput.type==='text';passwordInput.type=showing?'password':'text';togglePassword.setAttribute('aria-label',showing?'Mostrar contraseña':'Ocultar contraseña');togglePassword.setAttribute('aria-pressed',String(!showing));});
form?.addEventListener('submit',(event)=>{event.preventDefault();const email=(emailInput?.value||'').trim().toLowerCase();const password=passwordInput?.value||'';if(!email||!password){error.textContent='Ingresa el correo y la contraseña del administrador.';return;}if(email!==ADMIN_EMAIL||password!==ADMIN_PASSWORD){error.textContent='Correo o contraseña incorrectos. Verifica tus datos e inténtalo nuevamente.';passwordInput?.focus();return;}const now=Date.now();sessionStorage.setItem('accesoAdmin','true');sessionStorage.setItem('adminSession',JSON.stringify({rol:'admin',email:ADMIN_EMAIL,nombre:'Administrador',issuedAt:now,lastActivity:now,expiresAt:now+ADMIN_SESSION_MINUTES*60*1000}));sessionStorage.removeItem('adminReturnUrl');window.location.replace('Panelproducto/Panel_dashboard.html');});