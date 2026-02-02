import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  onScan: () => void;
  isAnalyzing: boolean;
  flash: "on" | "off";
  setFlash: (val: "on" | "off") => void;
  zoom: number;
  setZoom: (val: number) => void;
}

export const ControlButtons = ({
  onScan,
  isAnalyzing,
  flash,
  setFlash,
  zoom,
  setZoom,
}: Props) => {
  return (
    <View style={styles.container}>
      {/* Top Controls: Flash & Zoom */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setFlash(flash === "on" ? "off" : "on")}
        >
          <Text style={styles.btnText}>
            {flash === "on" ? "🔦 ON" : "🔦 OFF"}
          </Text>
        </TouchableOpacity>

        <View style={styles.zoomGroup}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setZoom(Math.max(zoom - 0.1, 0))}
          >
            <Text style={styles.btnText}>🔍 -</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setZoom(Math.min(zoom + 0.1, 1))}
          >
            <Text style={styles.btnText}>🔍 +</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Main Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.mainBtn, isAnalyzing && styles.disabled]}
          onPress={onScan}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <ActivityIndicator color="#FFF" size="large" />
          ) : (
            <Text style={styles.mainBtnText}>Narrate</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: 30,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
  },
  zoomGroup: { flexDirection: "row", gap: 10 },
  iconBtn: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
    borderRadius: 20,
    minWidth: 70,
    alignItems: "center",
  },
  btnText: { color: "#FFF", fontWeight: "bold" },
  footer: { alignItems: "center", marginBottom: 40 },
  mainBtn: {
    backgroundColor: "#6200EE",
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderColor: "rgba(255,255,255,0.3)",
  },
  disabled: { backgroundColor: "#444" },
  mainBtnText: { color: "#FFF", fontSize: 20, fontWeight: "900" },
});
