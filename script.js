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
}

function changeFont() {
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    document.body.style.fontFamily = `'${randomFont}', sans-serif`;
    document.getElementById('font-name').textContent = randomFont;
}

function resetQuoteChangeTimer() {
    clearInterval(quoteChangeInterval);
    quoteChangeInterval = setInterval(displayRandomQuote, 10000);
}

// Change quote on click/tap
document.body.addEventListener('click', (event) => {
    if (event.target.id !== 'change-font' && quotes.length > 0) {
        displayRandomQuote();
    }
});

// Change font when button is clicked
document.getElementById('change-font').addEventListener('click', changeFont);

// Initial font change and start the timer
changeFont();
resetQuoteChangeTimer();