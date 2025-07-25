// Main JavaScript for AI Predictions 7
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeContactForm();
    initializeNewsletterForm();
    loadDailyPicks();
    updateLastUpdateTime();
    loadTipsterStats();
    loadOddsRealtime();
    loadSportmonksFixtures();
    loadFlashscoreFixtures();
    loadSofascoreStats();
    loadBetexplorerStats();
    loadApifootballFixtures();
    loadFootballdataLaliga();
    loadWhoscoredLaliga();
    
    // Update time every minute
    setInterval(updateLastUpdateTime, 60000);
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.querySelector(`#${sectionId}`);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Initialize animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.stat-card, .tipster-card, .pick-card');
    animateElements.forEach(el => observer.observe(el));
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                showNotification('¡Mensaje enviado con éxito! Te responderemos pronto.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Newsletter form functionality
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const submitBtn = this.querySelector('button');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Simulate subscription (replace with actual API call)
            setTimeout(() => {
                showNotification('¡Te has suscrito exitosamente! Recibirás nuestras mejores predicciones.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Load daily picks
function loadDailyPicks() {
    const picksContainer = document.getElementById('picksContainer');
    const picksCount = document.getElementById('picksCount');
    
    if (!picksContainer) return;
    
    // Show loading state
    picksContainer.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando pronósticos...</p>
        </div>
    `;
    
    // Fetch picks from API
    fetch('https://myfootballpredictions.onrender.com/api/daily-picks')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.picks && data.picks.length > 0) {
                displayPicks(data.picks);
                if (picksCount) picksCount.textContent = data.picks.length;
            } else {
                showNoPicks();
                if (picksCount) picksCount.textContent = '0';
            }
        })
        .catch(error => {
            console.error('Error loading picks:', error);
            showNoPicks();
            if (picksCount) picksCount.textContent = '0';
        });
}

// Display picks
function displayPicks(picks) {
    const picksContainer = document.getElementById('picksContainer');
    
    const picksHTML = picks.map(pick => `
        <div class="pick-card fade-in">
            <div class="pick-header">
                <div class="pick-competition ${pick.competition?.toLowerCase().includes('euro') ? 'womens-euro' : 'la-liga'}">
                    ${pick.competition || 'Liga Española'}
                </div>
                <div class="pick-confidence">
                    ${Math.round(pick.confidence * 100)}% Confianza
                </div>
            </div>
            
            <div class="pick-match">
                ${pick.home_team} vs ${pick.away_team}
            </div>
            
            <div class="pick-time">
                <i class="fas fa-clock"></i>
                ${formatMatchTime(pick.match_time)}
            </div>
            
            <div class="pick-details">
                <div class="pick-detail">
                    <div class="pick-detail-label">Predicción</div>
                    <div class="pick-detail-value">${pick.prediction}</div>
                </div>
                <div class="pick-detail">
                    <div class="pick-detail-label">Tipo</div>
                    <div class="pick-detail-value">${formatPredictionType(pick.prediction_type)}</div>
                </div>
                <div class="pick-detail">
                    <div class="pick-detail-label">Cuota</div>
                    <div class="pick-detail-value">${pick.odds ? pick.odds.toFixed(2) : 'N/A'}</div>
                </div>
            </div>
            
            ${pick.reasoning ? `
                <div class="pick-reasoning">
                    <h4><i class="fas fa-lightbulb"></i> Análisis</h4>
                    <p>${pick.reasoning}</p>
                </div>
            ` : ''}
            
            <div class="pick-footer">
                <div class="pick-tipster">
                    <i class="fas fa-user-tie"></i>
                    ${pick.tipster || 'AI Predictions 7'}
                </div>
                ${pick.result_status ? `
                    <div class="pick-result ${pick.result_status}">
                        <i class="fas fa-${pick.result_status === 'correct' ? 'check-circle' : 'times-circle'}"></i>
                        ${pick.result_status === 'correct' ? 'Correcto' : 'Incorrecto'}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    picksContainer.innerHTML = picksHTML;
}

// Show no picks message
function showNoPicks() {
    const picksContainer = document.getElementById('picksContainer');
    
    picksContainer.innerHTML = `
        <div class="no-picks">
            <i class="fas fa-calendar-times"></i>
            <h3>No hay picks disponibles</h3>
            <p>No hay pronósticos disponibles para hoy. Vuelve más tarde o suscríbete para recibir picks premium.</p>
            <button class="cta-btn primary" onclick="openSubscriptionModal()">
                <i class="fas fa-crown"></i>
                Suscribirse para Picks Premium
            </button>
        </div>
    `;
}

// Format match time
function formatMatchTime(timeString) {
    if (!timeString) return 'Hora por confirmar';
    
    try {
        const date = new Date(timeString);
        return date.toLocaleString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return timeString;
    }
}

// Format prediction type
function formatPredictionType(type) {
    const types = {
        'match_winner': 'Ganador del Partido',
        'over_under': 'Más/Menos Goles',
        'both_teams_score': 'Ambos Marcan',
        'correct_score': 'Resultado Exacto',
        'first_goalscorer': 'Primer Goleador',
        'half_time_result': 'Resultado al Descanso',
        'double_chance': 'Doble Oportunidad'
    };
    
    return types[type] || type;
}

// Update last update time
function updateLastUpdateTime() {
    const lastUpdate = document.getElementById('lastUpdate');
    const lastPicksUpdate = document.getElementById('lastPicksUpdate');
    
    if (lastUpdate) {
        lastUpdate.textContent = 'hace 2 min';
    }
    
    if (lastPicksUpdate) {
        lastPicksUpdate.textContent = 'hace 5 min';
    }
}

// Modal functions
function openSubscriptionModal() {
    const modal = document.getElementById('subscriptionModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeSubscriptionModal() {
    const modal = document.getElementById('subscriptionModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function openSinglePickModal() {
    const modal = document.getElementById('singlePickModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeSinglePickModal() {
    const modal = document.getElementById('singlePickModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Process subscription
function processSubscription() {
    // This will be handled by the Stripe integration
    console.log('Processing subscription...');
    // For now, show a notification
    showNotification('Redirigiendo a Stripe para completar la suscripción...', 'info');
}

// Process single pick
function processSinglePick() {
    openSinglePickModal();
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const subscriptionModal = document.getElementById('subscriptionModal');
    const singlePickModal = document.getElementById('singlePickModal');
    
    if (event.target === subscriptionModal) {
        closeSubscriptionModal();
    }
    
    if (event.target === singlePickModal) {
        closeSinglePickModal();
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeSubscriptionModal();
        closeSinglePickModal();
    }
});

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-content button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
    
    .notification-content i:first-child {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(notificationStyles);

// Telegram link handler
function openTelegram(username) {
    try {
        // Handle group links (starting with +)
        if (username.startsWith('+')) {
            const telegramUrl = `https://t.me/${username}`;
            
            // Check if we're on mobile
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                // For groups, we need to use the invite link directly
                window.open(telegramUrl, '_blank');
            } else {
                // Desktop: open in new tab
                window.open(telegramUrl, '_blank');
            }
        } else {
            // Handle user/channel links
            const telegramUrl = `https://t.me/${username}`;
            
            // Check if we're on mobile
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                // Try to open Telegram app first
                window.location.href = `tg://resolve?domain=${username}`;
                
                // Fallback to web after a short delay
                setTimeout(() => {
                    window.open(telegramUrl, '_blank');
                }, 1000);
            } else {
                // Desktop: open in new tab
                window.open(telegramUrl, '_blank');
            }
        }
    } catch (error) {
        console.error('Error opening Telegram:', error);
        // Fallback: show message to user
        alert('Para unirte a nuestro grupo de Telegram, usa el enlace: https://t.me/+101AkcLj0SYxOTZk');
    }
}

function loadTipsterStats() {
    const statsMap = {
        'unidades_ganadas': document.querySelector('.stat-value-unidades'),
        'yield': document.querySelector('.stat-value-yield'),
        'picks': document.querySelector('.stat-value-picks'),
        'cuota_media': document.querySelector('.stat-value-cuota'),
        'win_rate': document.querySelector('.stat-value-winrate'),
        'stake_medio': document.querySelector('.stat-value-stake'),
        'seguidores': document.querySelector('.stat-value-seguidores')
    };
    fetch('https://myfootballpredictions.onrender.com/api/tipster-stats')
        .then(res => res.json())
        .then(data => {
            if (data.success && data.stats) {
                for (const key in statsMap) {
                    if (statsMap[key] && data.stats[key]) {
                        statsMap[key].textContent = data.stats[key];
                    }
                }
            }
        })
        .catch(() => {
            for (const key in statsMap) {
                if (statsMap[key]) {
                    statsMap[key].textContent = '-';
                }
            }
        });
}

function renderDataToSection(sectionId, data) {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
}

function loadOddsRealtime() {
    fetch('https://myfootballpredictions.onrender.com/api/odds-realtime')
        .then(res => res.json())
        .then(json => renderDataToSection('odds-realtime', json.data || json))
        .catch(() => renderDataToSection('odds-realtime', {error: 'No disponible'}));
}

function loadSportmonksFixtures() {
    fetch('https://myfootballpredictions.onrender.com/api/sportmonks-fixtures')
        .then(res => res.json())
        .then(json => renderDataToSection('sportmonks-fixtures', json.data || json))
        .catch(() => renderDataToSection('sportmonks-fixtures', {error: 'No disponible'}));
}

function loadFlashscoreFixtures() {
    fetch('https://myfootballpredictions.onrender.com/api/flashscore-fixtures')
        .then(res => res.json())
        .then(json => renderDataToSection('flashscore-fixtures', json.data || json))
        .catch(() => renderDataToSection('flashscore-fixtures', {error: 'No disponible'}));
}

function loadSofascoreStats() {
    fetch('https://myfootballpredictions.onrender.com/api/sofascore-stats')
        .then(res => res.json())
        .then(json => renderDataToSection('sofascore-stats', json.data || json))
        .catch(() => renderDataToSection('sofascore-stats', {error: 'No disponible'}));
}

function loadBetexplorerStats() {
    fetch('https://myfootballpredictions.onrender.com/api/betexplorer-stats')
        .then(res => res.json())
        .then(json => renderDataToSection('betexplorer-stats', json.data || json))
        .catch(() => renderDataToSection('betexplorer-stats', {error: 'No disponible'}));
}

function loadApifootballFixtures() {
    fetch('https://myfootballpredictions.onrender.com/api/apifootball-fixtures')
        .then(res => res.json())
        .then(json => renderDataToSection('apifootball-fixtures', json.data || json))
        .catch(() => renderDataToSection('apifootball-fixtures', {error: 'No disponible'}));
}

function loadFootballdataLaliga() {
    fetch('https://myfootballpredictions.onrender.com/api/footballdata-laliga')
        .then(res => res.json())
        .then(json => renderDataToSection('footballdata-laliga', json.data || json))
        .catch(() => renderDataToSection('footballdata-laliga', {error: 'No disponible'}));
}

function loadWhoscoredLaliga() {
    fetch('https://myfootballpredictions.onrender.com/api/whoscored-laliga')
        .then(res => res.json())
        .then(json => renderDataToSection('whoscored-laliga', json.data || json))
        .catch(() => renderDataToSection('whoscored-laliga', {error: 'No disponible'}));
}

// --- Transfermarkt: Market Values ---
async function fetchMarketValues(season = '2024', leagueId = 'ES1') {
    try {
        const res = await fetch(`/api/transfermarkt/market-values?season=${season}&league_id=${leagueId}`);
        const data = await res.json();
        if (data.success) {
            console.log('Valores de mercado (Transfermarkt):', data.market_values);
        } else {
            console.error('Error al obtener valores de mercado:', data);
        }
    } catch (err) {
        console.error('Error al llamar a /api/transfermarkt/market-values:', err);
    }
}

// --- Transfermarkt: Squads ---
async function fetchSquads(season = '2024', leagueId = 'ES1') {
    try {
        const res = await fetch(`/api/transfermarkt/squads?season=${season}&league_id=${leagueId}`);
        const data = await res.json();
        if (data.success) {
            console.log('Plantillas de equipos (Transfermarkt):', data.squads);
        } else {
            console.error('Error al obtener plantillas:', data);
        }
    } catch (err) {
        console.error('Error al llamar a /api/transfermarkt/squads:', err);
    }
}

// Ejemplo: llamar al cargar la página (puedes mover esto a un botón o sección específica)
window.addEventListener('DOMContentLoaded', () => {
    fetchMarketValues();
    fetchSquads();
});

// Cargar estadísticas de fut5tips dinámicamente
document.addEventListener('DOMContentLoaded', function() {
  fetch('/api/tipster-stats/fut5tips')
    .then(res => res.json())
    .then(data => {
      if (data.success && data.stats) {
        const s = data.stats;
        const set = (cls, val) => {
          const el = document.querySelector('.stat-value-' + cls);
          if (el) el.textContent = val;
        };
        set('unidades', s.unidades_ganadas);
        set('yield', s.yield);
        set('picks', s.picks);
        set('cuota', s.cuota_media);
        set('winrate', s.win_rate);
        set('stake', s.stake_medio);
        set('seguidores', s.seguidores);
      }
    });
});

// Tabla interactiva de estadísticas IA (ordenable)
document.addEventListener('DOMContentLoaded', function() {
  const table = document.getElementById('iaStatsTable');
  if (!table) return;
  const ths = table.querySelectorAll('th');
  let sortDir = 1;
  let lastSorted = -1;

  ths.forEach((th, idx) => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      sortTableByColumn(table, idx, lastSorted === idx ? -sortDir : 1);
      sortDir = lastSorted === idx ? -sortDir : 1;
      lastSorted = idx;
    });
  });

  function sortTableByColumn(table, column, dir) {
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.querySelectorAll('tr'));
    rows.sort((a, b) => {
      let aText = a.children[column].textContent.trim();
      let bText = b.children[column].textContent.trim();
      // Si es porcentaje, quitar % y convertir a número
      if (aText.endsWith('%') && bText.endsWith('%')) {
        aText = parseFloat(aText);
        bText = parseFloat(bText);
      } else if (!isNaN(aText) && !isNaN(bText)) {
        aText = parseFloat(aText);
        bText = parseFloat(bText);
      }
      if (aText < bText) return -dir;
      if (aText > bText) return dir;
      return 0;
    });
    rows.forEach(row => tbody.appendChild(row));
  }

  // Código listo para automatizar actualización mensual desde agosto
  // function updateStatsTableWithRealData(data) { ... }
});

// PayPal Button integration para el modal de pago de bots
function renderPayPalButton(email, bot) {
  const paypalContainer = document.getElementById('paypal-bot-container');
  if (!paypalContainer) return;
  paypalContainer.innerHTML = '';
  if (!window.paypal) {
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AR9zfWfiS2VWDSwiD0LJjmb5sVFi8fYTs8jeaMF3mnoXN9joD8FVmLc31ivLD0OgK2sDJzGYnClpmbs8&currency=EUR'; // Client ID real
    script.onload = () => renderPayPalButton(email, bot);
    document.body.appendChild(script);
    return;
  }
  window.paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: { value: '19.99', currency_code: 'EUR' },
          description: `Suscripción Bot IA: ${bot}`
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        document.getElementById('payment-message').textContent = '¡Pago realizado con éxito! Recibirás acceso al bot en tu email.';
        // Registrar en Google Sheets
        fetch('/api/paypal-payment-success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, bot: bot })
        });
      });
    },
    onError: function(err) {
      document.getElementById('payment-message').textContent = 'Error procesando el pago con PayPal.';
    }
  }).render('#paypal-bot-container');
}

// Mostrar PayPal solo si email válido
function setupBotPaymentModal() {
  const emailInput = document.getElementById('bot-payment-email');
  const botSelect = document.getElementById('bot-payment-bot');
  if (!emailInput || !botSelect) return;
  emailInput.addEventListener('input', function() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      renderPayPalButton(email, botSelect.value);
    } else {
      const paypalContainer = document.getElementById('paypal-bot-container');
      if (paypalContainer) paypalContainer.innerHTML = '';
    }
  });
  botSelect.addEventListener('change', function() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      renderPayPalButton(email, botSelect.value);
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  setupBotPaymentModal();
});
