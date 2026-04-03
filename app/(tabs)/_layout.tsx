import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { useThemeStore } from "@/store/useThemeStore";

export default function TabLayout() {
  const { isDark } = useThemeStore();

  return (
    <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarStyle: {
          backgroundColor: isDark ? "#111827" : "#ffffff",
          borderTopColor: isDark ? "#374151" : "#e5e7eb",
        },
        tabBarActiveTintColor: isDark ? "#60a5fa" : "#2563eb",
        tabBarInactiveTintColor: isDark ? "#9ca3af" : "#6b7280",
        sceneStyle: { backgroundColor: isDark ? "#111827" : "#f9fafb" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
