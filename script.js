let quotes = [];
const fonts = [
    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Raleway', 'Oswald', 'Merriweather',
    'Playfair Display', 'Quicksand', 'Comfortaa', 'Josefin Sans', 'Cormorant Garamond',
    'Crimson Text', 'Archivo', 'Bebas Neue', 'Titillium Web', 'Nunito', 'Fira Sans',
    'Bangers', 'Permanent Marker', 'Caveat', 'Shadows Into Light', 'Dancing Script',
    'Pacifico', 'Amatic SC', 'Righteous', 'Indie Flower', 'Lobster'
];


let quoteChangeInterval;

function loadFonts() {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=' + fonts.join('&family=').replace(/ /g, '+');
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
}

loadFonts();

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

function displayRandomQuote() {
    const quoteElement = document.getElementById('quote');
    if (quotes.length > 0) {
        quoteElement.style.opacity = 0;
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            quoteElement.textContent = quotes[randomIndex];
            quoteElement.style.opacity = 1;
        }, 500);
    }
    resetQuoteChangeTimer();
    updateFavoriteButton();
}

function changeFont() {
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    document.body.style.fontFamily = `'${randomFont}', sans-serif`;
    document.getElementById('font-name').textContent = randomFont;
}

function resetQuoteChangeTimer() {
    const randomChangeTimeMS = 25000
    clearInterval(quoteChangeInterval);
    quoteChangeInterval = setInterval(displayRandomQuote, randomChangeTimeMS);
}

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
}

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

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
// Change font when button is clicked
document.getElementById('change-font').addEventListener('click', changeFont);

document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

document.getElementById('favorite-button').addEventListener('click', toggleFavorite);

document.body.addEventListener('click', (event) => {
    if (event.target.id !== 'change-font' && event.target.id !== 'theme-toggle' && event.target.id !== 'favorite-button' && quotes.length > 0) {
        displayRandomQuote();
    }
});

// Set initial theme
if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
}
// Initial font change and start the timer
changeFont();
resetQuoteChangeTimer();