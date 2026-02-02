import React from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const InstructionModal = ({ visible, onClose }: Props) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Scene Narrator AI</Text>

          <View style={styles.list}>
            <Text style={styles.item}>• Allow camera access</Text>
            <Text style={styles.item}>• Point at your surroundings</Text>
            <Text style={styles.item}>• Tap NARRATE for audio</Text>
            <Text style={styles.item}>• Turn up your volume 🔊</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>GET STARTED</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
    // @ts-ignore
    zIndex: Platform.OS === "web" ? 9999 : 1,
  },
  modalView: {
    width: "85%",
    maxWidth: 400,
    backgroundColor: "#121212",
    borderRadius: 25,
    padding: 35,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
    elevation: 5,
  },
  title: {
    color: "#6200EE",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 20,
  },
  list: { marginBottom: 30, width: "100%" },
  item: { color: "#E0E0E0", fontSize: 17, marginVertical: 8 },
  button: {
    backgroundColor: "#6200EE",
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  buttonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
