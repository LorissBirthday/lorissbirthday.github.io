// Configuration
const DISABLE_TIME_LOCK = true; // Mettre à false pour activer le système de temps
const START_DATE = new Date('2024-08-02');
const END_DATE = new Date('2024-08-28');
const UNLOCK_HOUR = 7; // 7h du matin

// Indices mystérieux pour chaque jour (très subtils pour ne pas révéler le cadeau)
const hints = {
    1: "Un voyage commence toujours par le premier pas... vers quelque chose d'exceptionnel. 🌟",
    2: "Les étoiles brillent plus fort quand on partage leur lumière avec quelqu'un de spécial. ✨",
    3: "Certains moments méritent d'être célébrés avec raffinement et élégance. 🥂",
    4: "La beauté se trouve dans les détails les plus précieux de la vie. 💎",
    5: "Un secret se cache dans la ville lumière, là où les rêves prennent vie. 🏙️",
    6: "Les plus belles choses naissent de la passion et de l'art culinaire. 👨‍🍳",
    7: "Quand l'excellence rencontre la tradition, la magie opère. ⭐",
    8: "Certaines expériences ne se vivent qu'une fois dans une vie... ou presque. 🌹",
    9: "L'art de sublimer l'ordinaire en extraordinaire est un don rare. 🎭",
    10: "Les mets les plus fins racontent des histoires d'amour et de dévotion. 💕",
    11: "Dans un écrin de sophistication, les sens s'éveillent pleinement. 🌺",
    12: "La perfection se cache parfois derrière des portes très sélectives. 🚪",
    13: "Un maître de son art sait transformer les ingrédients en poésie. 🎨",
    14: "Les moments les plus précieux se savourent lentement, ensemble. ⏰",
    15: "Quand la nature inspire l'artisan, naît quelque chose d'unique. 🌸",
    16: "L'or capture la lumière comme certains lieux capturent les cœurs. ✨",
    17: "Dans le jardin des délices, chaque pétale a sa place. 🌻",
    18: "Les créations les plus délicates demandent patience et savoir-faire. 🤲",
    19: "Un symbole éternel de beauté prend racine dans la terre des rêves. 🌱",
    20: "L'élégance danoise rencontre l'art français dans une danse subtile. 💃",
    21: "Certaines formes parlent le langage universel de l'amour. 💖",
    22: "Quand l'artisanat devient art, la magie s'épanouit littéralement. 🌿",
    23: "Les plus beaux bijoux de la nature inspirent les plus grands créateurs. 🌷",
    24: "Dans l'écrin de la nuit parisienne, tout devient possible. 🌙",
    25: "La beauté dorée illumine le chemin vers les plus doux souvenirs. ☀️",
    26: "Un pétale doré pour sceller un moment d'éternité. 🌺",
    27: "Demain, tous les mystères se révéleront dans la lumière de l'amour. 💫"
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
    const targetDate = new Date(START_DATE);
    targetDate.setDate(START_DATE.getDate() + day - 1);
    
    const isUnlocked = DISABLE_TIME_LOCK || (
        currentDate >= targetDate && 
        (currentDate.getDate() !== targetDate.getDate() || currentDate.getHours() >= UNLOCK_HOUR)
    );
    
    const isOpened = openedDays.includes(day);
    
    if (isOpened) {
        dayDiv.classList.add('opened');
    } else if (isUnlocked) {
        dayDiv.classList.add('unlocked');
    } else {
        dayDiv.classList.add('locked');
    }
    
    dayDiv.innerHTML = `
        <div class="day-number">${day}</div>
        <div class="day-icon">${dayIcons[day - 1]}</div>
        <div class="day-status">${isOpened ? 'Ouvert ✅' : isUnlocked ? 'Disponible' : 'Verrouillé'}</div>
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

function getTimeUntilNextUnlock(currentDay) {
    if (currentDay >= 27) {
        return null; // Dernier jour ou au-delà
    }
    
    const now = new Date();
    const nextDay = currentDay + 1;
    const nextUnlockDate = new Date(START_DATE);
    nextUnlockDate.setDate(START_DATE.getDate() + nextDay - 1);
    nextUnlockDate.setHours(UNLOCK_HOUR, 0, 0, 0);
    
    const timeDiff = nextUnlockDate - now;
    
    if (timeDiff <= 0) {
        return null; // Déjà déverrouillé
    }
    
    const hours = Math.ceil(timeDiff / (1000 * 60 * 60));
    return hours;
}

function getFooterMessage(day) {
    if (day === 27) {
        return '✨ Demain est le grand jour ! ✨';
    }
    
    const hoursUntilNext = getTimeUntilNextUnlock(day);
    
    if (hoursUntilNext === null) {
        // Vérifier si tous les jours suivants sont déjà ouverts
        const allOpened = Array.from({length: 27 - day}, (_, i) => day + 1 + i)
            .every(d => openedDays.includes(d));
        
        if (allOpened) {
            const messages = [
                '💖 Tu as découvert tous les indices ! Tu es une vraie détective de l\'amour ! 💖',
                '🌟 Félicitations ma chérie ! Tous les secrets sont révélés ! 🌟',
                '💕 Quelle aventure merveilleuse ! Tu as tout exploré ! 💕',
                '✨ Bravo mon cœur ! Tu as percé tous les mystères ! ✨'
            ];
            return messages[Math.floor(Math.random() * messages.length)];
        } else {
            return '💝 La suite t\'attend déjà ! Explore les autres jours ! 💝';
        }
    }
    
    if (hoursUntilNext === 1) {
        return '⏰ Plus qu\'1 heure avant le prochain indice ! 💕';
    } else {
        return `⏰ Plus que ${hoursUntilNext} heures avant le prochain indice ! 💕`;
    }
}

function openDay(day) {
    const modal = document.getElementById('modal');
    const modalDay = document.getElementById('modal-day');
    const hintContent = document.getElementById('hint-content');
    
    modalDay.textContent = day;
    hintContent.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 20px;">${dayIcons[day - 1]}</div>
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
        
        // Lancer des confettis de cœurs
        launchHeartConfetti();
        
        // Lancer l'effet de confetti pour le premier jour
        if (day === 1) {
            launchConfetti();
            showBirthdayBanner();
        }
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

    // Nettoyer après 10 secondes
    setTimeout(() => {
        container.innerHTML = '';
    }, 10000);
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
    if (banner) {
        banner.classList.remove('show', 'restart');
    }
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
    // Nettoyage du cache pour les tests - toutes les cases redeviennent fermées
    localStorage.removeItem('openedDays');
    openedDays = [];
    
    initCalendar();
    setupModal();
    welcomeAnimation();
    
    // Ajouter un message spécial pour le dernier jour
    const today = new Date();
    const birthday = new Date('2024-08-28');
    
    if (today.toDateString() === birthday.toDateString()) {
        setTimeout(() => {
            alert('🎉 JOYEUX ANNIVERSAIRE LORI ! 🎉\n\nTon cadeau t\'attend... ✨');
        }, 3000);
    }
});

// Fonction pour réinitialiser le calendrier (pour les tests)
function resetCalendar() {
    localStorage.removeItem('openedDays');
    location.reload();
}

// Console Easter Egg
console.log(`
💖 Calendrier Magique de Lori 💖
================================
Créé avec amour pour ton anniversaire ✨

Commandes de développement :
- resetCalendar() : Réinitialise le calendrier
- DISABLE_TIME_LOCK : ${DISABLE_TIME_LOCK ? 'Activé' : 'Désactivé'}

Bonne exploration ! 🌟
`);
