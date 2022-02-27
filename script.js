const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainButton = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');

// Figure parts
const figureParts = document.querySelectorAll('.figure-part');

const numWordsToFetch = 20;

//URL to fetch a single word from random word API, with swear words not allowed
const apiUrl = `https://random-word-api.herokuapp.com/word?number=${numWordsToFetch}&swear=0`;

// The max number of characters for a valid word
const maxWordLength = 8;

let potentialWords = [];
let selectedWord = '';
let correctLetters = [];
let wrongLetters = [];

// Pull 20 random word from API, show one that is less than [maxWordLength] long
// Re-fetch from API if none of the words satisfy character limit
const getWord = async () => {
    const result = await fetch(apiUrl);
    potentialWords = await result.json();

    // Filter out words that are too long
    validWords = potentialWords.filter((word) => word.length <= maxWordLength);

    if (!validWords) {
        getWord(); //if all 10 words were too long, reccur fetch again
    } else {
        selectedWord =
            validWords[Math.floor(Math.random()) * validWords.length];
    }
    //Alter DOM to show correct letter guesses
    displayWord();
};

// Add elements to DOM to show correct letter guesses in their position
const displayWord = () => {
    wordEl.innerHTML = `
    ${selectedWord
        .split('')
        .map(
            (letter) => `
            <span class="letter">
                ${correctLetters.includes(letter) ? letter : ''}
            </span>
        `
        )
        .join('')}`;
    const innerWord = wordEl.innerText.replace(/\n/g, '');
    // Check if the word is fully revealed..
    if (innerWord === selectedWord) {
        // if so, display vicory message in popup
        const descriptor = potentialWords[Math.floor(Math.random() * 20)];
        finalMessage.innerText = `Congrats! You won! 🏆\n ${selectedWord}!!!`;
        popup.style.display = 'flex'; //instead of none...
    }
};

// Show brief popup when user repeats a letter entry
const showNotification = () => {
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
};

// On wrong guess, update DOM elements showing wrong letters
// AND add a body part to the stick figure SVG for each new wrong letter
const updateWrongLettersEl = () => {
    // Display wrong letter guesses
    wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? `<p>Wrong</P>` : ''}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}`;

    figureParts.forEach((part, index) => {
        const errors = wrongLetters.length;
        if (index < errors) {
            // change from 'none' to 'block' to show pert
            part.style.display = 'block';
        } else {
            part.style.display = 'none';
        }
    });

    // Check if user has lost..
    if (wrongLetters.length === figureParts.length) {
        // Display loser message
        finalMessage.innerText = `You lost! \nThe word was: ${selectedWord} 😞`;
        popup.style.display = 'flex';
    }
};

// User keydown event in window
window.addEventListener('keydown', (e) => {
    if (e.key.match(/[A-Za-z]/g) && e.key.length === 1) {
        const letter = e.key.toLocaleLowerCase();

        if (selectedWord.includes(letter)) {
            if (!correctLetters.includes(letter)) {
                correctLetters.push(letter);
                displayWord(); // Update DOM to show occurences of new letter
            } else {
                showNotification();
            }
        } else {
            if (!wrongLetters.includes(letter)) {
                wrongLetters.push(letter);
                updateWrongLettersEl();
            } else {
                showNotification();
            }
        }
    }
});

// Restart Game
playAgainButton.addEventListener('click', () => {
    correctLetters.splice(0);
    wrongLetters.splice(0);
    getWord();

    displayWord();
    updateWrongLettersEl();
    popup.style.display = 'none';
});

//On load - get first word
getWord();
