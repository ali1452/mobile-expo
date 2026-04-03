import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeStore } from "@/store/useThemeStore";

export default function Header() {
  const insets = useSafeAreaInsets();
  const { isDark, toggle } = useThemeStore();

  return (
    <View
      style={{ paddingTop: insets.top }}
      className={`flex-row items-center justify-between px-4 pb-3 border-b ${
        isDark
          ? "bg-gray-900 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <TouchableOpacity>
        <Ionicons name="menu" size={28} color={isDark ? "#fff" : "#000"} />
      </TouchableOpacity>

      <Text className={`text-lg font-bold ${isDark ? "text-white" : "text-black"}`}>
        M&B Fashion
      </Text>

      <TouchableOpacity onPress={toggle}>
        <Ionicons
          name={isDark ? "sunny-outline" : "moon-outline"}
          size={26}
          color={isDark ? "#fff" : "#000"}
        />
      </TouchableOpacity>
    </View>
  );
}
