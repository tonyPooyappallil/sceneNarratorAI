import * as Speech from "expo-speech";

export const speak = (text: string, onDone?: () => void) => {
  Speech.speak(text, {
    rate: 0.9,
    onDone: onDone,
  });
};

export const isSpeaking = async () => await Speech.isSpeakingAsync();
