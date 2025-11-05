
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const identityInput = document.getElementById('identity');
  const errorMessage = document.getElementById('errorMessage');
  const toggleDark = document.getElementById('toggleDark');

  // Alternado de modo oscuro y claro
  function applyTheme() {
    const prefersDark = localStorage.getItem('darkMode') === 'true';
    document.documentElement.classList.toggle('dark', prefersDark);
  }
  toggleDark.addEventListener('click', () => {
    const current = localStorage.getItem('darkMode') === 'true';
    localStorage.setItem('darkMode', !current);
    applyTheme();
  });

  // Aplicar el tema al cargar la página
  applyTheme();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.classList.add('hidden');
    const identity = identityInput.value.trim();
    if (!identity) {
      errorMessage.textContent = 'Por favor ingrese su número de identidad';
      errorMessage.classList.remove('hidden');
      return;
    }
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity }),
      });
      if (!response.ok) {
        const result = await response.json();
        errorMessage.textContent = result.error || 'Error en la autenticación';
        errorMessage.classList.remove('hidden');
        return;
      }
      const { user } = await response.json();

      // Guardar la información del usuario en sessionStorage
      sessionStorage.setItem('peajeUser', JSON.stringify(user));
      
      // Redirigir a la vista de información
      window.location.href = 'dashboard.html';
    } catch (err) {
      console.error('Error en la solicitud:', err);
      errorMessage.textContent = 'Ocurrió un error. Intente nuevamente.';
      errorMessage.classList.remove('hidden');
    }
  });
});