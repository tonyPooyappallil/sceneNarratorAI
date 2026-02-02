import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Service & Component Imports
import { CameraViewfinder } from "@/src/components/CameraViewfinder";
import { ControlButtons } from "@/src/components/ControlButtons";
import { InstructionModal } from "@/src/components/InstructionModal";
import { analyzeImage } from "@/src/services/aiService";
import { isSpeaking, speak } from "@/src/services/speechService";

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();

  // State Management
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [flash, setFlash] = useState<"on" | "off">("off");
  const [zoom, setZoom] = useState(0);

  const cameraRef = useRef<CameraView>(null);

  // Auto-clear preview when speech finishes
  useEffect(() => {
    const interval = setInterval(async () => {
      const speaking = await isSpeaking();
      if (!speaking && !isAnalyzing && capturedImage) {
        setCapturedImage(null);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isAnalyzing, capturedImage]);

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

  // --- RENDER LOGIC ---

  // 1. Permission Guard UI
  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Setup",
            headerStyle: { backgroundColor: "#000" },
            headerTintColor: "#fff",
          }}
        />

        <InstructionModal
          visible={showInstructions}
          onClose={() => setShowInstructions(false)}
        />

        <View style={styles.centeredContent}>
          <Text style={styles.titleText}>Camera Access Required</Text>
          <Text style={styles.infoText}>
            To narrate your world, the app needs permission to use your camera.
          </Text>
          <TouchableOpacity
            style={styles.permissionBtn}
            onPress={requestPermission}
          >
            <Text style={styles.btnText}>ENABLE CAMERA</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 2. Main App UI
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <InstructionModal
        visible={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      <CameraView
        style={StyleSheet.absoluteFillObject}
        ref={cameraRef}
        facing="back"
        enableTorch={flash === "on"}
        zoom={zoom}
      />

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
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  titleText: {
    color: "#6200EE",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoText: {
    color: "#CCC",
    textAlign: "center",
    marginBottom: 30,
    fontSize: 16,
    lineHeight: 24,
  },
  permissionBtn: {
    backgroundColor: "#6200EE",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
