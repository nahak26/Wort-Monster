export const readAloud = (text, speechSpeed) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE"; // Set German language
    utterance.rate = speechSpeed; // Use the dynamic speech speed
    speechSynthesis.cancel(); // Cancel any ongoing speech
    speechSynthesis.speak(utterance); // Speak the text
  };
