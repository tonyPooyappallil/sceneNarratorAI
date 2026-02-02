import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CameraViewfinder } from "@/src/components/CameraViewfinder";
import { ControlButtons } from "@/src/components/ControlButtons";
import { InstructionModal } from "@/src/components/InstructionModal";
import { analyzeImage } from "@/src/services/aiService";
import { initAudio, speak } from "@/src/services/speechService";

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [flash, setFlash] = useState<"on" | "off">("off");
  const [zoom, setZoom] = useState(0);
  const [cameraKey, setCameraKey] = useState(0); // For resetting live view

  const cameraRef = useRef<CameraView>(null);

  // Manual Torch Control for Web browsers
  useEffect(() => {
    async function applyTorch() {
      if (Platform.OS === "web" && flash) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
          const track = stream.getVideoTracks()[0];
          const caps = (track as any).getCapabilities?.() || {};
          if (caps.torch) {
            await (track as any).applyConstraints({
              advanced: [{ torch: flash === "on" }],
            });
          }
        } catch (err) {
          console.log("Web torch failed:", err);
        }
      }
    }
    applyTorch();
  }, [flash]);

  const handleScan = async () => {
    if (!cameraRef.current || isAnalyzing) return;

    // CRITICAL: Unlock iOS audio immediately upon user tap
    initAudio();

    try {
      setIsAnalyzing(true);
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.5,
      });

      if (photo) {
        setCapturedImage(photo.uri);

        // Call Gemini API
        const description = await analyzeImage(photo.base64!);

        // Narrate the result
        speak(description);

        // Reset the live view after 4 seconds
        setTimeout(() => {
          setCapturedImage(null);
          setCameraKey((prev) => prev + 1); // Re-mounts camera to unfreeze
        }, 4000);
      }
    } catch (e) {
      console.error(e);
      setCameraKey((prev) => prev + 1);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <InstructionModal
          visible={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
        <View style={styles.centeredContent}>
          <Text style={styles.statusText}>Camera Permission Required</Text>
          <TouchableOpacity
            style={styles.permissionBtn}
            onPress={requestPermission}
          >
            <Text style={styles.btnText}>ALLOW CAMERA</Text>
          </TouchableOpacity>
        </View>
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

      <CameraView
        key={cameraKey}
        style={StyleSheet.absoluteFillObject}
        ref={cameraRef}
        facing="back"
        // @ts-ignore
        props={{ playsInline: true }}
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
    padding: 20,
  },
  statusText: { color: "#fff", marginBottom: 20, textAlign: "center" },
  permissionBtn: { backgroundColor: "#6200EE", padding: 20, borderRadius: 12 },
  btnText: { color: "#FFF", fontWeight: "bold" },
});
