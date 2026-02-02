import { InstructionModal } from "@/src/components/InstructionModal"; // Import the new modal
import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

// 1. Service & Component Imports (Using modern aliases)
import { CameraViewfinder } from "@/src/components/CameraViewfinder";
import { ControlButtons } from "@/src/components/ControlButtons";
import { analyzeImage } from "@/src/services/aiService";
import { isSpeaking, speak } from "@/src/services/speechService";

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [showInstructions, setShowInstructions] = useState(true); // Default to true

  // --- STATE MANAGEMENT ---
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // 🔥 FIXED: Added missing state for Flash and Zoom
  const [flash, setFlash] = useState<"on" | "off">("off");
  const [zoom, setZoom] = useState(0);

  const cameraRef = useRef<CameraView>(null);

  // 2. Narration Watcher
  useEffect(() => {
    const interval = setInterval(async () => {
      const speaking = await isSpeaking();
      if (!speaking && !isAnalyzing && capturedImage) {
        setCapturedImage(null);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isAnalyzing, capturedImage]);

  // 3. Logic Handler
  const handleScan = async () => {
    if (!cameraRef.current || isAnalyzing) return;
    try {
      setIsAnalyzing(true);
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.5,
      });

      if (!photo) return;

      setCapturedImage(photo.uri);
      const description = await analyzeImage(photo.base64!);
      speak(description);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Check Connection or API Key");
      setCapturedImage(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 4. Permissions Guard
  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Permissions" }} />
        {/* You could add a 'Request Permission' button here */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <InstructionModal
        visible={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      {/* CAMERA ENGINE */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        ref={cameraRef}
        facing="back"
        enableTorch={flash === "on"} // Controlled by state
        zoom={zoom} // Controlled by state
      />

      {/* UI OVERLAYS */}
      <CameraViewfinder capturedImage={capturedImage} />

      <ControlButtons
        onScan={handleScan}
        isAnalyzing={isAnalyzing}
        flash={flash}
        setFlash={setFlash}
        zoom={zoom}
        setZoom={setZoom}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
});
