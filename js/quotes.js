// Quotes array
const quotes = [
    "Take a deep breath. You're doing the best you can.",
    "Your mental health matters more than productivity.",
    "It's okay to rest. You are not lazy.",
    "Small steps every day lead to big changes.",
    "You don't have to have it all figured out.",
    "Be kind to yourself today.",
    "Healing is not linear. Keep going.",
    "It is never too late to be what you might have been." ,
    "You don't have to see the whole staircase, just take the first step.",
    "Growth must be chosen again and again; fear must be overcome again and again.",
    "Success is stumbling from failure to failure with no loss of enthusiasm." ,
    "One small positive thought in the morning can change your whole day.",
    "Develop success from failures. Discouragement and failure are two of the surest stepping stones to success.",
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
