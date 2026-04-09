import { useProduct } from "@/hooks/useProduct";
import { useCartStore } from "@/store/useCartStore";
import { useThemeStore } from "@/store/useThemeStore";
import { EXPO_PUBLIC_CLOUDINARY_URL } from "@env";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { product_id } = useLocalSearchParams<{ product_id: string }>();
  const router = useRouter();
  const { isDark } = useThemeStore();
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError, error, refetch } = useProduct(product_id);

  const product = data?.[0];

  const addToCart = useCartStore((state) => state.addToCart);

  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [liked, setLiked] = useState(product?.is_favourite ?? false);
  const [qty, setQty] = useState(1);

  const accent = "#ec4899";
  const bg = isDark ? "#111827" : "#ffffff";
  const cardBg = isDark ? "#1f2937" : "#f9fafb";
  const textMain = isDark ? "#f9fafb" : "#111827";
  const textSub = isDark ? "#9ca3af" : "#6b7280";
  const divider = isDark ? "#374151" : "#f3f4f6";

  const hasDiscount =
    product?.discount_price &&
    product.discount_price !== "0" &&
    product.discount_price !== product.price;

  const discountPct =
    hasDiscount && product
      ? Math.round(
          ((Number(product.price) - Number(product.discount_price)) /
            Number(product.price)) *
            100,
        )
      : 0;

  // ── Loading ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: bg,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={accent} />
      </View>
    );
  }

  // ── Error ────────────────────────────────────────────────────────
  if (isError || !product) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: bg,
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          padding: 24,
        }}
      >
        <Ionicons name="cloud-offline-outline" size={52} color={textSub} />
        <Text style={{ color: textMain, fontSize: 16, fontWeight: "700" }}>
          Failed to load product
        </Text>
        <Text style={{ color: textSub, fontSize: 13, textAlign: "center" }}>
          {error?.message}
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          style={{
            backgroundColor: accent,
            paddingHorizontal: 24,
            paddingVertical: 11,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Detail ───────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* ── Hero Image ── */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: `${EXPO_PUBLIC_CLOUDINARY_URL}${product.url}` }}
            style={{ width, height: width * 1.1 }}
            contentFit="cover"
            transition={300}
          />

          {/* Gradient overlay top */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 100,
              backgroundColor: "rgba(0,0,0,0.25)",
            }}
          />

          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              position: "absolute",
              top: insets.top + 12,
              left: 16,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.9)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </TouchableOpacity>

          {/* Wishlist button */}
          <TouchableOpacity
            onPress={() => setLiked((p) => !p)}
            style={{
              position: "absolute",
              top: insets.top + 12,
              right: 16,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.9)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={20}
              color={liked ? "#ef4444" : "#111827"}
            />
          </TouchableOpacity>

          {/* Discount badge */}
          {hasDiscount && (
            <View
              style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                backgroundColor: "#ef4444",
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
                -{discountPct}% OFF
              </Text>
            </View>
          )}

          {/* Out of stock overlay */}
          {product.qty === 0 && (
            <View
              style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                backgroundColor: "rgba(0,0,0,0.7)",
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
                Out of Stock
              </Text>
            </View>
          )}
        </View>

        {/* ── Info Card ── */}
        <View
          style={{
            backgroundColor: bg,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            marginTop: -24,
            padding: 24,
          }}
        >
          {/* Brand & Category */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: accent,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              {product.brand}
            </Text>
            <View
              style={{
                backgroundColor: isDark ? "#374151" : "#f3f4f6",
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 20,
              }}
            >
              <Text style={{ fontSize: 11, color: textSub, fontWeight: "600" }}>
                {product.category}
              </Text>
            </View>
          </View>

          {/* Name */}
          <Text
            style={{
              fontSize: 22,
              fontWeight: "800",
              color: textMain,
              marginTop: 8,
              lineHeight: 28,
            }}
          >
            {product.name}
          </Text>

          {/* Price */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 26, fontWeight: "900", color: accent }}>
              ${hasDiscount ? product.discount_price : product.price}
            </Text>
            {hasDiscount && (
              <Text
                style={{
                  fontSize: 16,
                  color: textSub,
                  textDecorationLine: "line-through",
                }}
              >
                ${product.price}
              </Text>
            )}
          </View>

          {/* Divider */}
          <View
            style={{ height: 1, backgroundColor: divider, marginVertical: 20 }}
          />

          {/* SKU selector */}
          {product.sku.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: textMain,
                  }}
                >
                  Size / SKU
                </Text>
                {!selectedSku && (
                  <View
                    style={{
                      backgroundColor: "#fef3c7",
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#d97706",
                        fontWeight: "600",
                      }}
                    >
                      Required
                    </Text>
                  </View>
                )}
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
              >
                {product.sku.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setSelectedSku(s === selectedSku ? null : s)}
                    style={{
                      minWidth: 52,
                      height: 52,
                      borderRadius: 14,
                      borderWidth: 2,
                      borderColor:
                        selectedSku === s
                          ? accent
                          : isDark
                            ? "#374151"
                            : "#e5e7eb",
                      backgroundColor:
                        selectedSku === s ? accent : "transparent",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 13,
                        color: selectedSku === s ? "#fff" : textSub,
                      }}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Quantity selector */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "700", color: textMain }}>
              Quantity
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
            >
              <TouchableOpacity
                onPress={() => setQty((q) => Math.max(1, q - 1))}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: cardBg,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="remove" size={18} color={textMain} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: textMain,
                  minWidth: 20,
                  textAlign: "center",
                }}
              >
                {qty}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setQty((q) => Math.min(product.qty || 99, q + 1))
                }
                disabled={product.qty === 0}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: accent,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="add" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stock */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: product.qty > 0 ? "#10b981" : "#ef4444",
              }}
            />
            <Text style={{ fontSize: 13, color: textSub, fontWeight: "500" }}>
              {product.qty > 0
                ? `${product.qty} items in stock`
                : "Out of stock"}
            </Text>
          </View>

          {/* Divider */}
          <View
            style={{ height: 1, backgroundColor: divider, marginBottom: 20 }}
          />

          {/* Description */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: textMain,
              marginBottom: 8,
            }}
          >
            Description
          </Text>
          <Text style={{ fontSize: 14, color: textSub, lineHeight: 22 }}>
            {product.description}
          </Text>

          {/* Bottom spacing for CTA */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* ── Sticky CTA ── */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: bg,
          borderTopWidth: 1,
          borderTopColor: divider,
          padding: 16,
          paddingBottom: insets.bottom + 12,
          flexDirection: "row",
          gap: 12,
        }}
      >
        <TouchableOpacity
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: isDark ? "#374151" : "#e5e7eb",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="share-social-outline" size={22} color={textMain} />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={product.qty === 0}
          onPress={() => {
            if (product.sku.length > 0 && !selectedSku) {
              Alert.alert("Select a Size", "Please select a size before adding to your bag.");
              return;
            }
            addToCart(product, qty);
            Alert.alert("Added to Bag", `${product.name} has been added to your bag.`);
          }}
          style={{
            flex: 1,
            height: 52,
            borderRadius: 16,
            backgroundColor:
              product.qty === 0 ? (isDark ? "#374151" : "#e5e7eb") : accent,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Ionicons
            name="bag-add-outline"
            size={20}
            color={
              product.qty === 0 ? (isDark ? "#6b7280" : "#9ca3af") : "#fff"
            }
          />
          <Text
            style={{
              fontWeight: "800",
              fontSize: 16,
              color:
                product.qty === 0 ? (isDark ? "#6b7280" : "#9ca3af") : "#fff",
            }}
          >
            {product.qty === 0
              ? "Unavailable"
              : product.sku.length > 0 && !selectedSku
              ? "Select a Size"
              : "Add to Bag"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
