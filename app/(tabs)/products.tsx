import { useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/store/useCartStore";
import { useThemeStore } from "@/store/useThemeStore";
import type { Product } from "@/types/product";
import { EXPO_PUBLIC_CLOUDINARY_URL } from "@env";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 44) / 2;

// ── Skeleton Card ────────────────────────────────────────────────
function SkeletonCard({ isDark }: { isDark: boolean }) {
  return (
    <View
      style={{
        width: CARD_WIDTH,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: isDark ? "#1f2937" : "#f3f4f6",
      }}
    >
      <View
        style={{ height: 190, backgroundColor: isDark ? "#374151" : "#e5e7eb" }}
      />
      <View style={{ padding: 12, gap: 8 }}>
        <View
          style={{
            height: 10,
            width: "50%",
            borderRadius: 6,
            backgroundColor: isDark ? "#374151" : "#e5e7eb",
          }}
        />
        <View
          style={{
            height: 13,
            width: "80%",
            borderRadius: 6,
            backgroundColor: isDark ? "#374151" : "#e5e7eb",
          }}
        />
        <View
          style={{
            height: 13,
            width: "40%",
            borderRadius: 6,
            backgroundColor: isDark ? "#374151" : "#e5e7eb",
          }}
        />
      </View>
    </View>
  );
}

// ── Product Card ─────────────────────────────────────────────────
function ProductCard({
  item,
  isDark,
  accent,
}: {
  item: Product;
  isDark: boolean;
  accent: string;
}) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const [liked, setLiked] = useState(item.is_favourite);

  const hasDiscount =
    item.discount_price &&
    item.discount_price !== "0" &&
    item.discount_price !== item.price;

  const discountPct = hasDiscount
    ? Math.round(
        ((Number(item.price) - Number(item.discount_price)) /
          Number(item.price)) *
          100,
      )
    : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/product/${item.product_id}`)}
      style={{
        width: CARD_WIDTH,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
        shadowColor: "#000",
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      {/* Image */}
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: `${EXPO_PUBLIC_CLOUDINARY_URL}${item.url}` }}
          style={{ width: "100%", height: 190 }}
          contentFit="cover"
          transition={300}
        />

        {/* Wishlist */}
        <TouchableOpacity
          onPress={() => setLiked((p) => !p)}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: "rgba(255,255,255,0.85)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={17}
            color={liked ? "#ef4444" : "#374151"}
          />
        </TouchableOpacity>

        {/* Discount badge */}
        {hasDiscount && (
          <View
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              backgroundColor: "#ef4444",
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
              -{discountPct}%
            </Text>
          </View>
        )}

        {/* Out of stock overlay */}
        {item.qty === 0 && (
          <View
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.45)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
              Out of Stock
            </Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={{ padding: 12 }}>
        <Text
          style={{
            fontSize: 10,
            color: accent,
            fontWeight: "700",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {item.brand}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: isDark ? "#f9fafb" : "#111827",
            marginTop: 3,
          }}
        >
          {item.name}
        </Text>

        {/* Price row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 6,
            gap: 6,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "800", color: accent }}>
            ${hasDiscount ? item.discount_price : item.price}
          </Text>
          {hasDiscount && (
            <Text
              style={{
                fontSize: 12,
                color: isDark ? "#6b7280" : "#9ca3af",
                textDecorationLine: "line-through",
              }}
            >
              ${item.price}
            </Text>
          )}
        </View>

        {/* Add to cart */}
        <TouchableOpacity
          disabled={item.qty === 0}
          onPress={() => addToCart(item)}
          style={{
            marginTop: 10,
            backgroundColor:
              item.qty === 0 ? (isDark ? "#374151" : "#e5e7eb") : accent,
            paddingVertical: 9,
            borderRadius: 12,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Ionicons
            name="bag-add-outline"
            size={15}
            color={item.qty === 0 ? (isDark ? "#6b7280" : "#9ca3af") : "#fff"}
          />
          <Text
            style={{
              color: item.qty === 0 ? (isDark ? "#6b7280" : "#9ca3af") : "#fff",
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.qty === 0 ? "Unavailable" : "Add to Bag"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ── Screen ────────────────────────────────────────────────────────
export default function ProductsScreen() {
  const { isDark } = useThemeStore();
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useProducts();

  const [search, setSearch] = useState("");
  const [activeCategory, setCategory] = useState("All");

  const accent = "#ec4899";

  const categories = useMemo(() => {
    if (!products) return ["All"];
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ["All", ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  const textMain = isDark ? "#f9fafb" : "#111827";
  const textSub = isDark ? "#9ca3af" : "#6b7280";
  const bgInput = isDark ? "#1f2937" : "#f3f4f6";

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#111827" : "#f9fafb" }}>
      {/* ── Search bar ── */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: bgInput,
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 11,
            gap: 10,
          }}
        >
          <Ionicons name="search-outline" size={19} color={textSub} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search products, brands…"
            placeholderTextColor={textSub}
            style={{ flex: 1, fontSize: 14, color: textMain }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={textSub} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Category chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 14, height: 48 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 10,
          alignItems: "center",
        }}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategory(cat)}
            style={{
              paddingHorizontal: 28,
              paddingVertical: 8,
              borderRadius: 30,
              borderWidth: 1.5,
              borderColor:
                activeCategory === cat
                  ? accent
                  : isDark
                    ? "#374151"
                    : "#e5e7eb",
              backgroundColor: activeCategory === cat ? accent : "transparent",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: activeCategory === cat ? "#fff" : textSub,
              }}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Results count ── */}
      {!isLoading && !isError && (
        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 14,
            marginBottom: 4,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 13, color: textSub }}>
            <Text style={{ fontWeight: "700", color: textMain }}>
              {filtered.length}
            </Text>{" "}
            items found
          </Text>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            <Ionicons name="filter-outline" size={15} color={textSub} />
            <Text style={{ fontSize: 13, color: textSub }}>Filter</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── States ── */}
      {isLoading ? (
        <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 12 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} isDark={isDark} />
            ))}
          </View>
        </ScrollView>
      ) : isError ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Ionicons name="cloud-offline-outline" size={52} color={textSub} />
          <Text style={{ color: textMain, fontSize: 16, fontWeight: "700" }}>
            Failed to load
          </Text>
          <Text style={{ color: textSub, fontSize: 13 }}>{error?.message}</Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={{
              backgroundColor: accent,
              paddingHorizontal: 24,
              paddingVertical: 11,
              borderRadius: 20,
              marginTop: 4,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={{ padding: 16, paddingTop: 12, gap: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              tintColor={accent}
              colors={[accent]}
            />
          }
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 60, gap: 12 }}>
              <Ionicons name="search-outline" size={48} color={textSub} />
              <Text
                style={{ color: textMain, fontSize: 16, fontWeight: "700" }}
              >
                No products found
              </Text>
              <Text style={{ color: textSub, fontSize: 13 }}>
                Try a different search or category
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ProductCard item={item} isDark={isDark} accent={accent} />
          )}
        />
      )}
    </View>
  );
}
