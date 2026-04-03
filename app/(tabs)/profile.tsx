import { View, Text } from "react-native";
import { useThemeStore } from "@/store/useThemeStore";

export default function ProfileScreen() {
  const { isDark } = useThemeStore();
  return (
    <View className={`flex-1 items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <Text className={`text-xl font-semibold ${isDark ? "text-white" : "text-black"}`}>
        Profile
      </Text>
    </View>
  );
}
