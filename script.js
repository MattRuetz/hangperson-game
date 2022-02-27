const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainButton = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');

// Figure parts
const figureParts = document.querySelectorAll('.figure-part');

//URL to fetch a single word from random word API, with swear words not allowed
const apiUrl = `https://random-word-api.herokuapp.com/word?number=20&swear=0`;

const maxWordLength = 8;

let potentialWords = [];
let selectedWord = '';

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

    displayWord();
};

let correctLetters = [];
let wrongLetters = [];

const displayWord = () => {
    console.log(selectedWord);
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
    console.log('does ' + innerWord + '===' + selectedWord);
    if (innerWord === selectedWord) {
        const descriptor = potentialWords[Math.floor(Math.random() * 20)];
        finalMessage.innerText = `Congrats! You won! 🏆\n ${descriptor.toUpperCase()}!!!`;
        popup.style.display = 'flex'; //instead of none...
    }
    // console.log(wordEl.textContent, innerWord);
};

const showNotification = () => {
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
};

const updateWrongLettersEl = () => {
    // Display wrong letter guesses
    wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? `<p>Wrong</P>` : ''}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}`;

    figureParts.forEach((part, index) => {
        const errors = wrongLetters.length;

        if (index < errors) {
            part.style.display = 'block';
        } else {
            part.style.display = 'none';
        }
    });

    // Check if user has lost..
    if (wrongLetters.length === figureParts.length) {
        // Display loser message
        const descriptor = potentialWords[Math.floor(Math.random() * 20)];
        finalMessage.innerText = `You lost! \n...${descriptor} 😞`;
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

getWord();
