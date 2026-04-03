import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/store/useThemeStore";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 44) / 2;

const CATEGORIES = ["All", "Tops", "Bottoms", "Dresses", "Accessories"];

const COLLECTIONS = [
  { id: "1", name: "Summer Vibes",  items: "42 Items", bg: "#f9a8d4" },
  { id: "2", name: "Street Style",  items: "31 Items", bg: "#93c5fd" },
  { id: "3", name: "Formal Wear",   items: "28 Items", bg: "#6ee7b7" },
  { id: "4", name: "Evening Look",  items: "19 Items", bg: "#c4b5fd" },
];

const ARRIVALS = [
  { id: "1", name: "Floral Dress",  price: "$89",  tag: "New",  bg: "#fde68a" },
  { id: "2", name: "Slim Fit Suit", price: "$199", tag: "Hot",  bg: "#bfdbfe" },
  { id: "3", name: "Boho Top",      price: "$45",  tag: "New",  bg: "#fbcfe8" },
  { id: "4", name: "Cargo Pants",   price: "$75",  tag: "Sale", bg: "#d1fae5" },
];

const TAG_COLORS: Record<string, string> = {
  New:  "#10b981",
  Hot:  "#f97316",
  Sale: "#ef4444",
};

export default function HomeScreen() {
  const { isDark } = useThemeStore();
  const [gender, setGender]     = useState<"Women" | "Men">("Women");
  const [category, setCategory] = useState("All");

  const accent   = gender === "Women" ? "#ec4899" : "#3b82f6";
  const textMain = isDark ? "#ffffff" : "#111827";
  const textSub  = isDark ? "#9ca3af" : "#6b7280";
  const cardBg   = isDark ? "#1f2937" : "#f9fafb";
  const pillBg   = isDark ? "#1f2937" : "#f3f4f6";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? "#111827" : "#ffffff" }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero Banner ── */}
      <View
        style={{
          height: 340,
          marginHorizontal: 16,
          marginTop: 16,
          borderRadius: 28,
          overflow: "hidden",
          backgroundColor: isDark ? "#1f1f2e" : "#1a1a2e",
          justifyContent: "flex-end",
          padding: 24,
        }}
      >
        {/* Decorative blobs */}
        <View style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: `${accent}55` }} />
        <View style={{ position: "absolute", top: 70, right: 40, width: 110, height: 110, borderRadius: 55, backgroundColor: "#8b5cf655" }} />
        <View style={{ position: "absolute", top: 30, left: 30, width: 70, height: 70, borderRadius: 35, backgroundColor: `${accent}33` }} />
        <View style={{ position: "absolute", bottom: 80, right: 20, width: 50, height: 50, borderRadius: 25, backgroundColor: "#ffffff22" }} />

        <Text style={{ color: accent, fontSize: 11, letterSpacing: 3, fontWeight: "700" }}>
          NEW SEASON
        </Text>
        <Text style={{ color: "#ffffff", fontSize: 34, fontWeight: "800", lineHeight: 40, marginTop: 6 }}>
          Spring &{"\n"}Summer 2025
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginTop: 8, marginBottom: 22, lineHeight: 20 }}>
          Discover the latest trends{"\n"}curated for you
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: accent,
            paddingHorizontal: 28,
            paddingVertical: 14,
            borderRadius: 30,
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text style={{ color: "#ffffff", fontWeight: "700", fontSize: 15 }}>Shop Now</Text>
          <Ionicons name="arrow-forward" size={15} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* ── Gender Toggle ── */}
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 16,
          marginTop: 24,
          padding: 4,
          borderRadius: 18,
          backgroundColor: isDark ? "#1f2937" : "#f3f4f6",
        }}
      >
        {(["Women", "Men"] as const).map((g) => (
          <TouchableOpacity
            key={g}
            onPress={() => setGender(g)}
            style={{
              flex: 1,
              paddingVertical: 13,
              borderRadius: 14,
              alignItems: "center",
              backgroundColor:
                gender === g
                  ? g === "Women" ? "#ec4899" : "#3b82f6"
                  : "transparent",
            }}
          >
            <Text style={{ fontWeight: "700", fontSize: 15, color: gender === g ? "#ffffff" : textSub }}>
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Category Chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 20 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategory(cat)}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 9,
              borderRadius: 30,
              borderWidth: 1.5,
              borderColor: category === cat ? accent : isDark ? "#374151" : "#e5e7eb",
              backgroundColor: category === cat ? accent : "transparent",
            }}
          >
            <Text style={{ fontWeight: "600", fontSize: 13, color: category === cat ? "#ffffff" : textSub }}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Collections ── */}
      <View style={{ marginTop: 28 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: textMain }}>Collections</Text>
          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text style={{ color: accent, fontWeight: "600", fontSize: 13 }}>See All</Text>
            <Ionicons name="chevron-forward" size={14} color={accent} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
        >
          {COLLECTIONS.map((col) => (
            <TouchableOpacity
              key={col.id}
              style={{ width: 155, height: 195, borderRadius: 22, overflow: "hidden", backgroundColor: col.bg }}
            >
              <View style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: 45, backgroundColor: "rgba(255,255,255,0.25)" }} />
              <View style={{ position: "absolute", bottom: 50, left: -15, width: 60, height: 60, borderRadius: 30, backgroundColor: "rgba(255,255,255,0.15)" }} />
              <View style={{ flex: 1, padding: 16, justifyContent: "flex-end" }}>
                <Text style={{ fontWeight: "800", fontSize: 15, color: "#1f2937" }}>{col.name}</Text>
                <Text style={{ fontSize: 12, color: "#374151", marginTop: 3 }}>{col.items}</Text>
                <View style={{ marginTop: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(0,0,0,0.15)", justifyContent: "center", alignItems: "center" }}>
                  <Ionicons name="arrow-forward" size={16} color="#1f2937" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Flash Sale Banner ── */}
      <View
        style={{
          marginHorizontal: 16,
          marginTop: 28,
          borderRadius: 24,
          backgroundColor: isDark ? "#1f2937" : "#0f172a",
          padding: 22,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <View style={{ position: "absolute", top: -30, left: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: "#fbbf2422" }} />
        <View>
          <Text style={{ color: "#fbbf24", fontSize: 10, fontWeight: "700", letterSpacing: 2.5 }}>
            LIMITED OFFER
          </Text>
          <Text style={{ color: "#ffffff", fontSize: 26, fontWeight: "900", marginTop: 4 }}>
            Flash Sale
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 2 }}>
            Today only — don't miss it
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#fbbf24", fontSize: 44, fontWeight: "900", lineHeight: 48 }}>50%</Text>
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>OFF</Text>
          <TouchableOpacity
            style={{ backgroundColor: "#fbbf24", paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20, marginTop: 8 }}
          >
            <Text style={{ fontWeight: "800", fontSize: 12, color: "#0f172a" }}>Grab Deal</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── New Arrivals ── */}
      <View style={{ marginTop: 28, paddingHorizontal: 16, paddingBottom: 32 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: textMain }}>New Arrivals</Text>
          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text style={{ color: accent, fontWeight: "600", fontSize: 13 }}>See All</Text>
            <Ionicons name="chevron-forward" size={14} color={accent} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {ARRIVALS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{ width: CARD_WIDTH, borderRadius: 22, overflow: "hidden", backgroundColor: cardBg }}
            >
              {/* Product image placeholder */}
              <View style={{ height: 185, backgroundColor: item.bg, justifyContent: "flex-end", padding: 10 }}>
                <View style={{ position: "absolute", top: -15, right: -15, width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.25)" }} />
                {/* Wishlist */}
                <TouchableOpacity
                  style={{ position: "absolute", top: 12, right: 12, width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.8)", justifyContent: "center", alignItems: "center" }}
                >
                  <Ionicons name="heart-outline" size={17} color="#374151" />
                </TouchableOpacity>
                {/* Tag */}
                <View style={{ backgroundColor: TAG_COLORS[item.tag], paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: "flex-start" }}>
                  <Text style={{ color: "#ffffff", fontSize: 10, fontWeight: "700" }}>{item.tag}</Text>
                </View>
              </View>
              <View style={{ padding: 12 }}>
                <Text style={{ fontWeight: "700", fontSize: 14, color: textMain }}>{item.name}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <Text style={{ color: accent, fontWeight: "800", fontSize: 17 }}>{item.price}</Text>
                  <TouchableOpacity
                    style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: accent, justifyContent: "center", alignItems: "center" }}
                  >
                    <Ionicons name="add" size={18} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
