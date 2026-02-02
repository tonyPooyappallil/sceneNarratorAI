import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* This ensures your index.tsx has a title bar */}
      <Stack.Screen name="index" options={{ title: "Scene Narrator" }} />
    </Stack>
  );
}
