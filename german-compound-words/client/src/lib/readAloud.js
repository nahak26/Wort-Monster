export const readAloud = (text, slow = false) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE"; // Set German language
    utterance.rate = slow ? 0.7 : 1; // Adjust speed based on 'slow' parameter
    speechSynthesis.cancel(); // Cancel any ongoing speech
    speechSynthesis.speak(utterance); // Speak the text
  };
