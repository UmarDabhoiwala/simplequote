let quotes = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let quoteChangeInterval;

const fonts = [
    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Raleway', 'Oswald', 'Merriweather',
    'Playfair Display', 'Quicksand', 'Comfortaa', 'Josefin Sans', 'Cormorant Garamond',
    'Crimson Text', 'Archivo', 'Bebas Neue', 'Titillium Web', 'Nunito', 'Fira Sans',
    'Bangers', 'Caveat', 'Shadows Into Light', 'Dancing Script',
    'Pacifico', 'Amatic SC', 'Righteous', 'Indie Flower', 'Lobster'
];

function loadFonts() {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=' + fonts.join('&family=').replace(/ /g, '+');
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
}

function fetchQuotes() {
    fetch('quotes.txt')
        .then(response => response.text())
        .then(data => {
            quotes = data.split('\n').filter(line => line.trim() !== '');
            displayRandomQuote();
        })
        .catch(error => {
            console.error('Error loading quotes:', error);
            document.getElementById('quote').textContent = 'Failed to load quotes. Please try again later.';
        });
}

function displayRandomQuote() {
    const quoteElement = document.getElementById('quote');
    if (quotes.length > 0) {
        quoteElement.style.opacity = 0;
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            quoteElement.textContent = quotes[randomIndex];
            quoteElement.style.opacity = 1;
            updateFavoriteButton();
        }, 500);
    }

    resetQuoteChangeTimer();
}

function changeFont() {
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    setFont(randomFont);
}

function setFont(font) {
    document.body.style.fontFamily = `'${font}', sans-serif`;
    document.getElementById('font-name').textContent = font;
    localStorage.setItem('lastFont', font);
}

function resetQuoteChangeTimer() {
    clearInterval(quoteChangeInterval);
    quoteChangeInterval = setInterval(displayRandomQuote, 25000);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
}

function toggleFavorite() {
    const currentQuote = document.getElementById('quote').textContent;
    const favoriteButton = document.getElementById('favorite-button');
    const index = favorites.indexOf(currentQuote);

    if (index === -1) {
        favorites.push(currentQuote);
        favoriteButton.classList.add('favorited');
        favoriteButton.textContent = '❤️';
    } else {
        favorites.splice(index, 1);
        favoriteButton.classList.remove('favorited');
        favoriteButton.textContent = '🤍';
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function updateFavoriteButton() {
    const currentQuote = document.getElementById('quote').textContent;
    const favoriteButton = document.getElementById('favorite-button');

    if (favorites.includes(currentQuote)) {
        favoriteButton.classList.add('favorited');
        favoriteButton.textContent = '❤️';
    } else {
        favoriteButton.classList.remove('favorited');
        favoriteButton.textContent = '🤍';
    }
}

function showFavoritesModal() {
    const modal = document.getElementById('favorites-modal');
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';

    favorites.forEach((quote, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="quote-text">${quote}</span>
            <button class="remove-favorite" data-index="${index}">×</button>
        `;
        favoritesList.appendChild(li);
    });

    modal.style.display = 'block';

    document.querySelectorAll('.remove-favorite').forEach(button => {
        button.addEventListener('click', removeFavorite);
    });
}

function removeFavorite(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavoritesModal();
    updateFavoriteButton();
}

function closeFavoritesModal() {
    document.getElementById('favorites-modal').style.display = 'none';
}

function isButton(element) {
    return element.tagName === 'BUTTON' || element.closest('button');
}

function initializeEventListeners() {
    document.body.addEventListener('click', (event) => {
        if (!isButton(event.target) && !event.target.closest('.modal-content') && quotes.length > 0) {
            displayRandomQuote();
        } else if (event.target.id === 'change-font') {
            changeFont();
        } else if (event.target.id === 'theme-toggle') {
            toggleTheme();
        } else if (event.target.id === 'favorite-button') {
            toggleFavorite();
        } else if (event.target.id === 'favorites-menu') {
            showFavoritesModal();
        }
    });

    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('favorites-modal')) {
            closeFavoritesModal();
        }
    });

    document.querySelector('.close').addEventListener('click', (event) => {
        event.stopPropagation();
        closeFavoritesModal();
    });
}

function initialize() {
    loadFonts();
    fetchQuotes();
    initializeEventListeners();
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    const lastFont = localStorage.getItem('lastFont') || 'Roboto';
    setFont(lastFont);
    resetQuoteChangeTimer();
}

initialize();