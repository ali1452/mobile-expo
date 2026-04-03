import "../global.css";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[product_id]" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
    </SafeAreaProvider>
  );
}
