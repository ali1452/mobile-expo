import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeStore } from "@/store/useThemeStore";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "expo-router";

export default function Header() {
  const insets = useSafeAreaInsets();
  const { isDark, toggle } = useThemeStore();
  const router = useRouter();
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <View
      style={{ paddingTop: insets.top }}
      className={`flex-row items-center justify-between px-4 pb-3 border-b ${
        isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <TouchableOpacity>
        <Ionicons name="menu" size={28} color={isDark ? "#fff" : "#000"} />
      </TouchableOpacity>

      <Text
        className={`text-lg font-bold ${isDark ? "text-white" : "text-black"}`}
      >
        M&B Fashion
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <TouchableOpacity onPress={toggle}>
          <Ionicons
            name={isDark ? "sunny-outline" : "moon-outline"}
            size={26}
            color={isDark ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/cart")}
          style={{ position: "relative" }}
        >
          <Ionicons
            name="bag-outline"
            size={26}
            color={isDark ? "#fff" : "#000"}
          />
          {cartCount > 0 && (
            <View
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: "#ec4899",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 4,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: "800",
                  lineHeight: 12,
                }}
              >
                {cartCount > 99 ? "99+" : cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
