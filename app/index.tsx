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
import { speak } from "@/src/services/speechService";

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [flash, setFlash] = useState<"on" | "off">("off");
  const [zoom, setZoom] = useState(0);

  // New: A key to force the camera to restart if it freezes
  const [cameraKey, setCameraKey] = useState(0);

  const cameraRef = useRef<CameraView>(null);

  // Manual Torch Fix for Web
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
          console.log("Torch toggle failed:", err);
        }
      }
    }
    applyTorch();
  }, [flash]);

  const handleScan = async () => {
    if (!cameraRef.current || isAnalyzing) return;
    try {
      setIsAnalyzing(true);

      // On Web, sometimes pausing then taking the picture helps avoid freezes
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.5,
      });

      if (photo) {
        setCapturedImage(photo.uri);
        const description = await analyzeImage(photo.base64!);

        // Speak the description
        speak(description);

        // --- THE FIX: RESUME LIVE VIEW ---
        // We wait a moment for the photo to process, then "nudge" the camera
        setTimeout(() => {
          setCapturedImage(null);
          // Incrementing the key forces React to re-draw the camera component
          setCameraKey((prev) => prev + 1);
        }, 3000);
      }
    } catch (e) {
      console.error(e);
      setCameraKey((prev) => prev + 1); // Reset on error too
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

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <InstructionModal
        visible={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      <CameraView
        key={cameraKey} // This is the magic key that resets the live view
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
  centeredContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  permissionBtn: { backgroundColor: "#6200EE", padding: 20, borderRadius: 10 },
  btnText: { color: "#FFF", fontWeight: "bold" },
});
