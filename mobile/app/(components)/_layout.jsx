import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ComponetsLayout() {
    return (
        <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: true }} />
            <Stack.Screen name="(components)" />
        </SafeAreaProvider>
    );
}
