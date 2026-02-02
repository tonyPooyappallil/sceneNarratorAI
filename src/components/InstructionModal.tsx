import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const InstructionModal = ({ visible, onClose }: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Welcome to Scene Narrator</Text>

          <View style={styles.list}>
            <Text style={styles.item}>
              1. Grant camera access when prompted.
            </Text>
            <Text style={styles.item}>
              2. Point your device at an object or scene.
            </Text>
            <Text style={styles.item}>
              3. Tap `NARRATE` to hear the AI description.
            </Text>
            <Text style={styles.item}>
              4. Ensure your volume is turned up! 🔊
            </Text>
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
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  title: {
    color: "#6200EE",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 20,
    textAlign: "center",
  },
  list: {
    marginBottom: 30,
  },
  item: {
    color: "#CCC",
    fontSize: 16,
    marginVertical: 8,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#6200EE",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
