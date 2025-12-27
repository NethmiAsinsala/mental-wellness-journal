// Quotes array
const quotes = [
    "Take a deep breath. You're doing the best you can.",
    "Your mental health matters more than productivity.",
    "It's okay to rest. You are not lazy.",
    "Small steps every day lead to big changes.",
    "You don't have to have it all figured out.",
    "Be kind to yourself today.",
    "Healing is not linear. Keep going.",
    "Your feelings are valid."
];

// Get elements
const quoteText = document.getElementById("quoteText");
const newQuoteBtn = document.getElementById("newQuoteBtn");

// Function to get random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteText.textContent = quotes[randomIndex];
}

// Show quote on page load
showRandomQuote();

// Change quote on button click
newQuoteBtn.addEventListener("click", showRandomQuote);
