import * as Speech from "expo-speech";
import { Platform } from "react-native";

/**
 * iOS Fix: This function MUST be called inside the onPress event
 * of your button to "unlock" the audio hardware.
 */
export const initAudio = () => {
  if (Platform.OS === "web") {
    // We play a 0-volume silent 'blip' to satisfy the browser's
    // user-gesture requirement for audio.
    Speech.speak("", { volume: 0 });
    console.log("Audio engine primed for iOS");
  }
};

export const speak = (text: string) => {
  if (!text) return;

  Speech.speak(text, {
    language: "en-US",
    pitch: 1.0,
    rate: 0.9,
    onStart: () => console.log("Speaking..."),
    onError: (e) => console.error("Speech error:", e),
  });
};
