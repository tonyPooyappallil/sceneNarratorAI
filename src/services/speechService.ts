import * as Speech from "expo-speech";
import { Platform } from "react-native";

export const speak = (text: string) => {
  if (!text) return;

  // iOS Web Fix: "Prime" the audio engine immediately on user interaction
  if (Platform.OS === "web") {
    Speech.speak("", { volume: 0 });
  }

  Speech.speak(text, {
    language: "en-US",
    pitch: 1.0,
    rate: 0.9, // Slightly slower is better for accessibility
    onStart: () => console.log("Narration started"),
    onDone: () => console.log("Narration finished"),
    onError: (error) => console.error("Speech error:", error),
  });
};
