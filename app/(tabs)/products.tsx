import { View, Text } from "react-native";
import { useThemeStore } from "@/store/useThemeStore";

export default function ProductsScreen() {
  const { isDark } = useThemeStore();
  return (
    <View className={`flex-1 items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <Text className={`text-xl font-semibold ${isDark ? "text-white" : "text-black"}`}>
        Products
      </Text>
    </View>
  );
}
