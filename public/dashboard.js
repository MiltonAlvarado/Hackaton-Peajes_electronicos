
document.addEventListener('DOMContentLoaded', () => {
  const greetingEl = document.getElementById('greeting');
  const platesContainer = document.getElementById('platesContainer');
  const toggleDark = document.getElementById('toggleDarkDashboard');

  // Aplicar tema guardado en localStorage
  function applyTheme() {
    const prefersDark = localStorage.getItem('darkMode') === 'true';
    document.documentElement.classList.toggle('dark', prefersDark);
  }
  toggleDark.addEventListener('click', () => {
    const current = localStorage.getItem('darkMode') === 'true';
    localStorage.setItem('darkMode', !current);
    applyTheme();
  });
  applyTheme();

  // Recuperar usuario de sessionStorage
  const userJson = sessionStorage.getItem('peajeUser');
  
  // redirigir al inicio de sesión.
  if (!userJson) {
    window.location.href = 'index.html';
    return;
  }
  const user = JSON.parse(userJson);
  // Saludo
  greetingEl.textContent = `Hola, ${user.name}`;

  // Moneda
  const currencyFormatter = new Intl.NumberFormat('es-HN', {
    style: 'currency',
    currency: 'HNL',
    minimumFractionDigits: 2,
  });

  //Historial de peajes
function createHistoryList(history, fallbackPaid) {
  if (!history || history.length === 0) {
    const p = document.createElement('p');
    p.className = 'text-sm italic text-gray-500 dark:text-gray-400';
    p.textContent = 'No hay registros de peaje';
    return p;
  }
  const ul = document.createElement('ul');
  ul.className = 'text-sm list-disc list-inside space-y-1';

  history.forEach((item) => {
    const li = document.createElement('li');
    const amountStr = currencyFormatter.format(item.amount);

    const isPaid = (typeof item.paid === 'boolean') ? item.paid : fallbackPaid;
    const statusText = isPaid ? 'pagado' : 'pendiente';
    const statusClass = isPaid ? 'text-accent' : 'text-danger';

    li.innerHTML = `${item.date} – ${amountStr} <span class="${statusClass} font-semibold">(${statusText})</span>`;
    ul.appendChild(li);
  });
  return ul;
}

  // Crear tarjetas para cada placa
  user.plates.forEach((plate) => {
    const card = document.createElement('div');
    card.className =
      'p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md shadow-slate-200/50 dark:shadow-black/30 border border-gray-200 dark:border-gray-700 flex flex-col text-slate-800 dark:text-slate-100';
    const title = document.createElement('h3');
    title.className = 'text-lg font-semibold text-primary dark:text-gray-50 mb-2';
    title.textContent = `Placa: ${plate.plateNumber}`;
    card.appendChild(title);

    // Monto adeudado
    const amountPara = document.createElement('p');
    amountPara.className = 'mb-1';
    const amountLabel = document.createElement('span');
    amountLabel.className = 'font-medium';
    amountLabel.textContent = 'Monto adeudado: ';
    const amountValue = document.createElement('span');
    amountValue.className = plate.dueAmount > 0 ? 'text-danger font-semibold' : 'text-accent font-semibold';
    amountValue.textContent = currencyFormatter.format(plate.dueAmount);
    amountPara.appendChild(amountLabel);
    amountPara.appendChild(amountValue);
    card.appendChild(amountPara);

    // Fecha de pago
    const datePara = document.createElement('p');
    datePara.className = 'mb-2';
    const dateLabel = document.createElement('span');
    dateLabel.className = 'font-medium';
    dateLabel.textContent = 'Fecha de pago de matrícula: ';
    const dateValue = document.createElement('span');
    dateValue.className = 'font-semibold';
    dateValue.textContent = plate.dueDate;
    datePara.appendChild(dateLabel);
    datePara.appendChild(dateValue);
    card.appendChild(datePara);

    // Historial
    const historyTitle = document.createElement('h4');
    historyTitle.className = 'font-semibold text-sm mb-1';
    historyTitle.textContent = 'Historial de peajes:';
    card.appendChild(historyTitle);
    const isPaid = plate.dueAmount <= 0;
    card.appendChild(createHistoryList(plate.history, isPaid));
    
    // Botón para pagar (no funcional)
    const payBtn = document.createElement('button');
    payBtn.type = 'button';
    payBtn.className =
      'mt-4 py-2 px-4 rounded-lg bg-secondary text-white hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/50 cursor-pointer';
    payBtn.textContent = 'Pagar';
    card.appendChild(payBtn);
    platesContainer.appendChild(card);
  });
});