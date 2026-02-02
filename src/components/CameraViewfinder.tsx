import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface Props {
  capturedImage: string | null;
}

export const CameraViewfinder = ({ capturedImage }: Props) => {
  return (
    <>
      {capturedImage && (
        <Image
          source={{ uri: capturedImage }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      )}
      <View style={styles.overlay} />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.05)", // Subtle tint
  },
});
