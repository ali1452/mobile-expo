import { useCartStore } from "@/store/useCartStore";
import { useThemeStore } from "@/store/useThemeStore";
import { EXPO_PUBLIC_CLOUDINARY_URL } from "@env";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CartScreen() {
  const { isDark } = useThemeStore();
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const accent = "#ec4899";
  const bg = isDark ? "#111827" : "#f9fafb";
  const cardBg = isDark ? "#1f2937" : "#ffffff";
  const textMain = isDark ? "#f9fafb" : "#111827";
  const textSub = isDark ? "#9ca3af" : "#6b7280";
  const divider = isDark ? "#374151" : "#f3f4f6";

  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discount_price &&
      item.product.discount_price !== "0" &&
      item.product.discount_price !== item.product.price
      ? Number(item.product.discount_price)
      : Number(item.product.price);
    return sum + price * item.quantity;
  }, 0);

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: 12,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          borderBottomWidth: 1,
          borderBottomColor: divider,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="chevron-back"
            size={26}
            color={isDark ? "#fff" : "#111827"}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "800", color: textMain }}>
          My Bag
        </Text>
        {items.length > 0 ? (
          <TouchableOpacity onPress={clearCart}>
            <Text style={{ fontSize: 13, color: accent, fontWeight: "600" }}>
              Clear
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {items.length === 0 ? (
        /* Empty state */
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
            padding: 32,
          }}
        >
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: isDark ? "#374151" : "#f3f4f6",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="bag-outline" size={44} color={textSub} />
          </View>
          <Text style={{ fontSize: 20, fontWeight: "800", color: textMain }}>
            Your bag is empty
          </Text>
          <Text
            style={{ fontSize: 14, color: textSub, textAlign: "center", lineHeight: 20 }}
          >
            Add products to your bag and they will appear here.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/products")}
            style={{
              backgroundColor: accent,
              paddingHorizontal: 32,
              paddingVertical: 14,
              borderRadius: 16,
              marginTop: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
              Shop Now
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.product_id}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const hasDiscount =
                item.product.discount_price &&
                item.product.discount_price !== "0" &&
                item.product.discount_price !== item.product.price;
              const displayPrice = hasDiscount
                ? item.product.discount_price
                : item.product.price;

              return (
                <View
                  style={{
                    backgroundColor: cardBg,
                    borderRadius: 20,
                    padding: 12,
                    flexDirection: "row",
                    gap: 12,
                    shadowColor: "#000",
                    shadowOpacity: isDark ? 0.2 : 0.06,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 2,
                  }}
                >
                  {/* Product image */}
                  <Image
                    source={{
                      uri: `${EXPO_PUBLIC_CLOUDINARY_URL}${item.product.url}`,
                    }}
                    style={{ width: 90, height: 90, borderRadius: 14 }}
                    contentFit="cover"
                    transition={200}
                  />

                  {/* Info */}
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "700",
                        color: accent,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                      }}
                    >
                      {item.product.brand}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: textMain,
                        lineHeight: 18,
                      }}
                    >
                      {item.product.name}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "800",
                          color: accent,
                        }}
                      >
                        ${displayPrice}
                      </Text>

                      {/* Quantity controls */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                          backgroundColor: isDark ? "#374151" : "#f3f4f6",
                          borderRadius: 12,
                          paddingHorizontal: 6,
                          paddingVertical: 4,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            updateQuantity(
                              item.product.product_id,
                              item.quantity - 1,
                            )
                          }
                        >
                          <Ionicons
                            name={item.quantity === 1 ? "trash-outline" : "remove"}
                            size={16}
                            color={item.quantity === 1 ? "#ef4444" : textMain}
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "700",
                            color: textMain,
                            minWidth: 18,
                            textAlign: "center",
                          }}
                        >
                          {item.quantity}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            updateQuantity(
                              item.product.product_id,
                              item.quantity + 1,
                            )
                          }
                        >
                          <Ionicons name="add" size={16} color={accent} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* Remove */}
                  <TouchableOpacity
                    onPress={() => removeFromCart(item.product.product_id)}
                    style={{ padding: 4 }}
                  >
                    <Ionicons name="close" size={18} color={textSub} />
                  </TouchableOpacity>
                </View>
              );
            }}
            ListFooterComponent={
              <View style={{ marginTop: 8, gap: 10 }}>
                <View
                  style={{
                    backgroundColor: cardBg,
                    borderRadius: 20,
                    padding: 16,
                    gap: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      color: textMain,
                      marginBottom: 4,
                    }}
                  >
                    Order Summary
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: textSub, fontSize: 14 }}>
                      Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                    </Text>
                    <Text
                      style={{
                        color: textMain,
                        fontSize: 14,
                        fontWeight: "600",
                      }}
                    >
                      ${subtotal.toFixed(2)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: textSub, fontSize: 14 }}>
                      Shipping
                    </Text>
                    <Text
                      style={{ color: "#10b981", fontSize: 14, fontWeight: "600" }}
                    >
                      Free
                    </Text>
                  </View>
                  <View
                    style={{ height: 1, backgroundColor: divider, marginVertical: 4 }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: textMain,
                        fontSize: 16,
                        fontWeight: "800",
                      }}
                    >
                      Total
                    </Text>
                    <Text
                      style={{
                        color: accent,
                        fontSize: 18,
                        fontWeight: "900",
                      }}
                    >
                      ${subtotal.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            }
          />

          {/* Checkout CTA */}
          <View
            style={{
              padding: 16,
              paddingBottom: insets.bottom + 12,
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              borderTopWidth: 1,
              borderTopColor: divider,
            }}
          >
            <TouchableOpacity
              onPress={() => router.push("/checkout")}
              style={{
                backgroundColor: accent,
                paddingVertical: 16,
                borderRadius: 18,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
                Proceed to Checkout
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
