// Configuration
const DISABLE_TIME_LOCK = false; // Mettre à false pour activer le système de temps
// Utilisation de Date(year, monthIndex, day) pour s'assurer de 00h locale et éviter les problèmes UTC
const START_DATE = new Date(2025, 7, 2); // 2 août 2025
const END_DATE = new Date(2025, 7, 28); // 28 août 2025
const UNLOCK_HOUR = 10; // 10h du matin

const hints = {
    1: "Ce n’est pas un voyage… et pourtant, d’une certaine manière, ça y ressemble.",
    2: "Ce n’est pas juste une surprise. C’est une expérience, pensée pour être partagée à deux.",
    3: "Ce cadeau c'est l'équilibre parfait entre le raffinement, l'élégance et surtout l'amour.",
    4: "La beauté se trouve dans les petits détails...",
    5: "Rien n'a été fait au hasard, j’ai simplement écouté ce que tu aimes, et tout est parti de là.\nJOYEUX 2 MOIS MON AMOUR !!",
    6: "Ce que je te réserve n’a pas besoin de mots, juste ton sourire !",
    7: "Tes sens ne vont pas rester indifférents à ce qui t’attend...",
    8: "Ce genre d’expérience ne se vit pas tous les jours… et c’est pour très bientôt !",
    9: "L'art de sublimer l'ordinaire en extraordinaire est un don rare.",
    10: "Tu sais combien les petites attentions romantiques me tiennent à cœur…",
    11: "Il y a des cadeaux qui font sourire… celui-ci devrait faire un peu plus.",
    12: "Ce que j'ai prévu pour toi, c'est une véritable immersion dans un univers de raffinement...",
    13: "Laisse-toi porter… tes sens sauront te guider !",
    14: "Les moments les plus précieux de la vie se savourent lentement, ensemble.",
    15: "Ce que je vais t’offrir touche à la fois les sens et le cœur !",
    16: "Il y a des instants créés sur mesure, juste pour toi.",
    17: "Dans le jardin secret de l'amour, chaque pétale a sa place.",
    18: "Je sais que tu as fait beaucoup de latin au lycée... alors j'ai voulu y faire un petit clin d'œil !",
    19: "Une expérience, un détail, un souvenir : tout est réuni.",
    20: "Ce cadeau ne parle pas fort, mais il en dit long...",
    21: "Tu comprendras très bientôt que tout se passe en deux temps. Littéralement.",
    22: "Tu crois deviner, et pourtant, tu n’es pas encore au bout de tes surprises.",
    23: "Chaque détail de ce cadeau a été choisi avec toi en tête.",
    24: "Dans l'écrin de la nuit parisienne, tout devient possible.",
    25: "J'ai pensé à tout, pour marquer ton cadeau d’une saveur particulière...",
    26: "Deux univers te font une promesse demain : l’un éveille les sens, l’autre touche le cœur.",
    27: "Ce soir, tout a été choisi pour faire scintiller ce que tu es !"
};

// Icônes pour chaque jour
const dayIcons = [
    '🌟', '✨', '🥂', '💎', '🏙️', '👨‍🍳', '⭐', '🌹', '🎭', '💕',
    '🌺', '🚪', '🎨', '⏰', '🌸', '✨', '🌻', '🤲', '🌱', '💃',
    '💖', '🌿', '🌷', '🌙', '☀️', '🌺', '💫'
];

let openedDays = JSON.parse(localStorage.getItem('openedDays') || '[]');

function initCalendar() {
    const calendarGrid = document.querySelector('.calendar-grid');
    const totalDays = 27; // Du 2 au 28 août = 27 jours
    
    for (let day = 1; day <= totalDays; day++) {
        const dayElement = createDayElement(day);
        calendarGrid.appendChild(dayElement);
    }
}

function createDayElement(day) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    dayDiv.dataset.day = day;
    
    const currentDate = new Date();
    // Calcul du moment de déverrouillage
    const baseDate = new Date(START_DATE);
    baseDate.setDate(START_DATE.getDate() + day - 1);
    const unlockHour = day === 1 ? 0 : UNLOCK_HOUR;
    const unlockDate = new Date(baseDate);
    unlockDate.setHours(unlockHour, 0, 0, 0);
    // Date de verrouillage désactivée ou dépassement du moment de déverrouillage
    const isUnlocked = DISABLE_TIME_LOCK || currentDate >= unlockDate;
    
    const isOpened = openedDays.includes(day);
    
    if (isOpened) {
        dayDiv.classList.add('opened');
    } else if (isUnlocked) {
        dayDiv.classList.add('unlocked');
    } else {
        dayDiv.classList.add('locked');
    }
    
    // Calculer le temps restant pour les jours verrouillés
    let statusText = '';
    if (isOpened) {
        statusText = 'Ouvert ✅';
    } else if (isUnlocked) {
        statusText = 'Disponible';
    } else {
        const timeUntilUnlock = getTimeUntilUnlock(day);
        statusText = timeUntilUnlock;
    }
    
    dayDiv.innerHTML = `
        <div class="day-number">
            <div style="font-size: 0.7rem; font-weight: 300; margin-bottom: 5px;">août</div>
            <div style="font-size: 2rem; font-weight: 600;">${day + 1}</div>
        </div>
        <div class="day-status">${statusText}</div>
        ${!isUnlocked ? '<div class="lock-icon">🔒</div>' : ''}
    `;
    
    if (isUnlocked) {
        dayDiv.addEventListener('click', () => openDay(day));
        
        // Ajouter un effet de scintillement aléatoire pour les jours déverrouillés
        if (!isOpened) {
            setTimeout(() => {
                dayDiv.style.animation = 'pulse 2s ease-in-out infinite';
            }, Math.random() * 2000);
        }
    }
    
    return dayDiv;
}

function getTimeUntilUnlock(day) {
    const now = new Date();
    const unlockDate = new Date(START_DATE);
    unlockDate.setDate(START_DATE.getDate() + day - 1);
    
    // Le premier jour (2 août) se déverrouille à 00h, les autres à 10h
    const unlockHour = day === 1 ? 0 : UNLOCK_HOUR;
    unlockDate.setHours(unlockHour, 0, 0, 0);
    
    const timeDiff = unlockDate - now;
    
    if (timeDiff <= 0) {
        return 'Disponible';
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
        return `${days}j ${hours}h`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

function getTimeUntilNextUnlock(currentDay) {
    if (currentDay >= 27) {
        return null; // Dernier jour ou au-delà
    }
    
    const now = new Date();
    const nextDay = currentDay + 1;
    const nextUnlockDate = new Date(START_DATE);
    nextUnlockDate.setDate(START_DATE.getDate() + nextDay - 1);
    
    // Le premier jour (2 août) se déverrouille à 00h, les autres à 10h
    const unlockHour = nextDay === 1 ? 0 : UNLOCK_HOUR;
    nextUnlockDate.setHours(unlockHour, 0, 0, 0);
    
    const timeDiff = nextUnlockDate - now;
    
    if (timeDiff <= 0) {
        return null; // Déjà déverrouillé
    }
    
    const hours = Math.ceil(timeDiff / (1000 * 60 * 60));
    return hours;
}

function getFooterMessage(day) {
    if (day === 27) {
        return "✨ Aujourd'hui est le grand jour hihi ! ✨";
    }
    
    const hoursUntilNext = getTimeUntilNextUnlock(day);
    if (hoursUntilNext === null) {
        return 'Le prochain jour est déjà déverrouillé ! 🎉';
    }
    if (hoursUntilNext === 1) {
        return 'Plus qu\'1 heure avant le prochain indice ! 💕';
    } else {
        return `Plus que ${hoursUntilNext} heures avant le prochain indice ! 💕`;
    }
}

function openDay(day) {
    const modal = document.getElementById('modal');
    const modalDay = document.getElementById('modal-day');
    const hintContent = document.getElementById('hint-content');
    
    modalDay.textContent = `${day + 1} août`;
    hintContent.innerHTML = `
        <p>${hints[day]}</p>
        <div style="margin-top: 20px; font-style: italic; color: #d63384;">
            ${getFooterMessage(day)}
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Marquer le jour comme ouvert
    if (!openedDays.includes(day)) {
        openedDays.push(day);
        localStorage.setItem('openedDays', JSON.stringify(openedDays));
        
        // Mettre à jour l'apparence du jour
        const dayElement = document.querySelector(`[data-day="${day}"]`);
        dayElement.classList.remove('unlocked');
        dayElement.classList.add('opened');
        dayElement.querySelector('.day-status').textContent = 'Ouvert ✅';
        
        // ...existing code...
    }
    // Lancer des confettis de cœurs à chaque clic, même si déjà ouvert
    launchHeartConfetti();
    launchHeartConfetti();
    // Pour le jour 1 (2 août), lancer l'animation de confettis et le bandeau à chaque clic
    if (day === 1) {
        launchConfetti();
        showBirthdayBanner();
    }
    // Pour le 6 août (2 mois), afficher bannière et confettis personnalisés
    if (day === 5) {
        launchConfetti();
        showTwoMonthsBanner();
    }
}

function launchConfetti() {
    const container = document.getElementById('confetti-container');
    const confettiCount = 500; // Encore plus de confetti !
    const colors = ['#ff69b4', '#ffb6c1', '#d63384', '#ffd700', '#ffffff', '#ff1493', '#ffc0cb', '#da70d6', '#ff6347', '#00ff7f'];
    const shapes = ['square', 'circle', 'triangle', 'heart'];

    // Nettoyer les confetti précédents
    container.innerHTML = '';

    // Première vague de confetti (plus dense)
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            createConfetti(container, colors, shapes);
        }, i * 15); // Intervalle encore plus réduit
    }

    // Deuxième vague après 1.5 secondes
    setTimeout(() => {
        for (let i = 0; i < confettiCount / 2; i++) {
            setTimeout(() => {
                createConfetti(container, colors, shapes);
            }, i * 20);
        }
    }, 1500);

    // Troisième vague après 3 secondes
    setTimeout(() => {
        for (let i = 0; i < confettiCount / 3; i++) {
            setTimeout(() => {
                createConfetti(container, colors, shapes);
            }, i * 25);
        }
    }, 3000);
}

function showBirthdayBanner() {
    let banner = document.getElementById('birthday-banner');
    
    if (!banner) {
        // Créer le bandeau s'il n'existe pas
        banner = document.createElement('div');
        banner.className = 'birthday-banner';
        banner.id = 'birthday-banner';
        
        const text = document.createElement('h1');
        text.className = 'birthday-text';
        text.textContent = '❤️ Joyeux anniversaire mon amour ❤️';
        
        banner.appendChild(text);
        document.body.appendChild(banner);
    }
    
    // Relancer l'animation
    banner.classList.remove('show', 'restart');
    
    // Forcer le reflow pour redémarrer l'animation
    banner.offsetHeight;
    
    setTimeout(() => {
        banner.classList.add('show');
        if (banner.classList.contains('show')) {
            banner.classList.add('restart');
        }
    }, 50);
    
    // Supprimer la classe restart après l'animation
    setTimeout(() => {
        banner.classList.remove('restart');
    }, 1500);
}
// Bannière spéciale 2 mois
function showTwoMonthsBanner() {
    let banner = document.getElementById('two-months-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.className = 'birthday-banner';
        banner.id = 'two-months-banner';
        const text = document.createElement('h1');
        text.className = 'birthday-text';
        text.textContent = 'JOYEUX 2 MOIS ! ❤️';
        banner.appendChild(text);
        document.body.appendChild(banner);
    }
    banner.classList.remove('show', 'restart');
    banner.offsetHeight; // reflow
    setTimeout(() => {
        banner.classList.add('show');
        if (banner.classList.contains('show')) banner.classList.add('restart');
    }, 50);
    setTimeout(() => {
        banner.classList.remove('restart');
    }, 1500);
}

function createConfetti(container, colors, shapes) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // Forme aléatoire
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    confetti.classList.add(shape);
    
    // Couleur aléatoire (sauf pour les cœurs)
    if (shape !== 'heart') {
        const color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.backgroundColor = color;
        
        if (shape === 'triangle') {
            confetti.style.borderBottomColor = color;
        }
    }
    
    // Position horizontale aléatoire
    confetti.style.left = Math.random() * 100 + '%';
    
    // Commencer au-dessus de l'écran pour qu'ils ne soient pas visibles avant de tomber
    confetti.style.top = '-20px';
    
    // Animation personnalisée pour chaque confetti
    const animationDuration = (Math.random() * 2 + 2) + 's';
    const rotationSpeed = Math.random() * 360 + 180;
    confetti.style.animationDuration = animationDuration;
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    
    // Ajout d'un mouvement de balancement
    const swayAnimation = `
        @keyframes sway-${Math.random().toString(36).substr(2, 9)} {
            0% { transform: translateY(-20px) translateX(0px) rotateZ(0deg); }
            25% { transform: translateY(25vh) translateX(${Math.random() * 40 - 20}px) rotateZ(${rotationSpeed/4}deg); }
            50% { transform: translateY(50vh) translateX(${Math.random() * 40 - 20}px) rotateZ(${rotationSpeed/2}deg); }
            75% { transform: translateY(75vh) translateX(${Math.random() * 40 - 20}px) rotateZ(${-rotationSpeed/4}deg); }
            100% { transform: translateY(110vh) translateX(0px) rotateZ(${rotationSpeed}deg); }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = swayAnimation;
    document.head.appendChild(style);
    
    container.appendChild(confetti);
    
    // Ajouter un fondu en douceur avant la suppression
    setTimeout(() => {
        confetti.classList.add('fade-out');
    }, 3500);
    
    // Supprimer le confetti après le fondu
    setTimeout(() => {
        if (container.contains(confetti)) {
            container.removeChild(confetti);
        }
        if (document.head.contains(style)) {
            document.head.removeChild(style);
        }
    }, 4000);
}

function launchHeartConfetti() {
    const hearts = ['💖', '💕', '💗', '💝', '🌸'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createFloatingHeart(hearts[Math.floor(Math.random() * hearts.length)]);
        }, i * 100);
    }
}

function createFloatingHeart(heartEmoji) {
    const heart = document.createElement('div');
    heart.textContent = heartEmoji;
    heart.style.cssText = `
        position: fixed;
        font-size: 2rem;
        pointer-events: none;
        z-index: 1000;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight}px;
        animation: floatUp 3s ease-out forwards;
    `;
    
    document.body.appendChild(heart);
    
    // Créer l'animation CSS dynamiquement
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-${window.innerHeight + 100}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Nettoyer après l'animation
    setTimeout(() => {
        document.body.removeChild(heart);
        document.head.removeChild(style);
    }, 3000);
}

// Gestion du modal
function setupModal() {
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        hideBirthdayBanner(); // Cacher le bandeau quand on ferme le modal
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            hideBirthdayBanner(); // Cacher le bandeau quand on ferme le modal
        }
    });
}

function hideBirthdayBanner() {
    const banner = document.getElementById('birthday-banner');
    if (banner) banner.classList.remove('show', 'restart');
    const twoBanner = document.getElementById('two-months-banner');
    if (twoBanner) twoBanner.classList.remove('show', 'restart');
}

// Animation de bienvenue
function welcomeAnimation() {
    const title = document.querySelector('.main-title');
    const subtitle = document.querySelector('.subtitle');
    
    title.style.opacity = '0';
    subtitle.style.opacity = '0';
    
    setTimeout(() => {
        title.style.transition = 'opacity 2s ease, transform 2s ease';
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
    }, 500);
    
    setTimeout(() => {
        subtitle.style.transition = 'opacity 1.5s ease';
        subtitle.style.opacity = '1';
    }, 1500);
    
    // Faire apparaître les jours un par un
    const days = document.querySelectorAll('.calendar-day');
    days.forEach((day, index) => {
        day.style.opacity = '0';
        day.style.transform = 'scale(0.5) rotateY(180deg)';
        
        setTimeout(() => {
            day.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            day.style.opacity = '1';
            day.style.transform = 'scale(1) rotateY(0deg)';
        }, 2000 + index * 100);
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Le localStorage est conservé pour maintenir la progression
    // localStorage.removeItem('openedDays'); // Ligne désactivée pour conserver la progression
    // openedDays = []; // Ligne désactivée pour conserver la progression
    
    initCalendar();
    setupModal();
    welcomeAnimation();
    
    // Ajouter un message spécial pour le dernier jour
    const today = new Date();
    const birthday = new Date('2025-08-28');
    
    if (today.toDateString() === birthday.toDateString()) {
        setTimeout(() => {
            alert("C'est le jour J, j'ai tellement hâte de t'offrir ce que j'ai à t'offrir !");
        }, 3000);
    }
});

function resetCalendar() {
    localStorage.removeItem('openedDays');
    location.reload();
}

function testUnlockSystem() {
    console.log('🧪 Test du système de verrouillage automatique');
    console.log('================================================');
    
    const now = new Date();
    console.log(`📅 Date actuelle : ${now.toLocaleString('fr-FR')}`);
    console.log(`🕐 Heure de déverrouillage standard : ${UNLOCK_HOUR}h00`);
    console.log(`🌅 Heure de déverrouillage du premier jour : 00h00`);
    console.log('');
    
    // Tester les 5 premiers jours
    for (let day = 1; day <= 5; day++) {
        const targetDate = new Date(START_DATE);
        targetDate.setDate(START_DATE.getDate() + day - 1);
        
        const unlockHour = day === 1 ? 0 : UNLOCK_HOUR;
        const unlockDate = new Date(targetDate);
        unlockDate.setHours(unlockHour, 0, 0, 0);
        
        const isUnlocked = now >= unlockDate;
        const timeUntilUnlock = getTimeUntilUnlock(day);
        
        console.log(`📦 Jour ${day} (${day + 1} août 2025)`);
        console.log(`   📍 Date de déverrouillage : ${unlockDate.toLocaleString('fr-FR')}`);
        console.log(`   🔓 État : ${isUnlocked ? '✅ DÉVERROUILLÉ' : '🔒 VERROUILLÉ'}`);
        console.log(`   ⏱️  Temps restant : ${timeUntilUnlock}`);
        console.log('');
    }
    
    // Test spécifique pour le premier jour
    const firstDayUnlock = new Date(START_DATE);
    firstDayUnlock.setHours(0, 0, 0, 0);
    console.log(`🎯 Test spécial premier jour :`);
    console.log(`   Le 2 août 2025 à 00h00 : ${now >= firstDayUnlock ? '✅ ACCESSIBLE' : '❌ PAS ENCORE'}`);
    
    // Test pour le jour suivant
    const secondDayUnlock = new Date(START_DATE);
    secondDayUnlock.setDate(START_DATE.getDate() + 1);
    secondDayUnlock.setHours(UNLOCK_HOUR, 0, 0, 0);
    console.log(`   Le 3 août 2025 à ${UNLOCK_HOUR}h00 : ${now >= secondDayUnlock ? '✅ ACCESSIBLE' : '❌ PAS ENCORE'}`);
    
    console.log('================================================');
    console.log('✨ Test terminé ! Vérifiez les résultats ci-dessus.');
}

// Console Easter Egg
console.log(`
💖 Petit calendrier pour te faire patienter avant ton cadeau ! 💖
================================
SI TU VOIS CE MESSAGE, C'EST QUE TU AS ACCÉDÉ AU CODE ET C'EST PAS BIEN DU TOUT !!!! 😜

Commandes de développement :
- resetCalendar() : Réinitialise le calendrier
- testUnlockSystem() : Teste le système de verrouillage
- DISABLE_TIME_LOCK : ${DISABLE_TIME_LOCK ? 'Activé' : 'Désactivé'}

Horaires de déverrouillage :
- 2 août 2025 : 00h00 (première case spéciale)
- 3-28 août 2025 : ${UNLOCK_HOUR}h00 (cases suivantes)

Bonne exploration ! 🌟
`);
