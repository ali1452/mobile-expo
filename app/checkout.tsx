import { useCartStore } from "@/store/useCartStore";
import { useThemeStore } from "@/store/useThemeStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FormFields = {
  name: string;
  address: string;
  city: string;
  email: string;
  mobile: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};
  if (!fields.name.trim()) errors.name = "Name is required";
  if (!fields.address.trim()) errors.address = "Address is required";
  if (!fields.city.trim()) errors.city = "City is required";
  if (!fields.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Enter a valid email";
  }
  if (!fields.mobile.trim()) {
    errors.mobile = "Mobile number is required";
  } else if (!/^\+?[\d\s\-()]{7,15}$/.test(fields.mobile)) {
    errors.mobile = "Enter a valid mobile number";
  }
  return errors;
}

export default function CheckoutScreen() {
  const { isDark } = useThemeStore();
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState<FormFields>({
    name: "",
    address: "",
    city: "",
    email: "",
    mobile: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const accent = "#ec4899";
  const bg = isDark ? "#111827" : "#f9fafb";
  const cardBg = isDark ? "#1f2937" : "#ffffff";
  const textMain = isDark ? "#f9fafb" : "#111827";
  const textSub = isDark ? "#9ca3af" : "#6b7280";
  const divider = isDark ? "#374151" : "#f3f4f6";
  const inputBg = isDark ? "#374151" : "#f3f4f6";
  const inputBorder = isDark ? "#4b5563" : "#e5e7eb";

  const total = items.reduce((sum, item) => {
    const price =
      item.product.discount_price &&
      item.product.discount_price !== "0" &&
      item.product.discount_price !== item.product.price
        ? Number(item.product.discount_price)
        : Number(item.product.price);
    return sum + price * item.quantity;
  }, 0);

  function handleChange(field: keyof FormFields, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleSubmit() {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    // Simulate order placement
    setTimeout(() => {
      setSubmitting(false);
      clearCart();
      Alert.alert(
        "Order Placed!",
        `Thank you, ${form.name}! Your order has been placed successfully. A confirmation will be sent to ${form.email}.`,
        [
          {
            text: "Continue Shopping",
            onPress: () => router.replace("/(tabs)/products"),
          },
        ],
      );
    }, 1200);
  }

  const fields: {
    key: keyof FormFields;
    label: string;
    placeholder: string;
    keyboardType?: "default" | "email-address" | "phone-pad";
    autoCapitalize?: "none" | "words" | "sentences";
  }[] = [
    {
      key: "name",
      label: "Full Name",
      placeholder: "John Doe",
      autoCapitalize: "words",
    },
    {
      key: "address",
      label: "Address",
      placeholder: "123 Main Street, Apt 4B",
      autoCapitalize: "words",
    },
    {
      key: "city",
      label: "City",
      placeholder: "New York",
      autoCapitalize: "words",
    },
    {
      key: "email",
      label: "Email",
      placeholder: "john@example.com",
      keyboardType: "email-address",
      autoCapitalize: "none",
    },
    {
      key: "mobile",
      label: "Mobile Number",
      placeholder: "+1 234 567 8900",
      keyboardType: "phone-pad",
    },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1, backgroundColor: bg }}>
        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 8,
            paddingBottom: 12,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
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
            Checkout
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Order summary pill */}
          <View
            style={{
              backgroundColor: accent,
              borderRadius: 16,
              padding: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                Order Total
              </Text>
              <Text
                style={{ color: "#fff", fontSize: 22, fontWeight: "900" }}
              >
                ${total.toFixed(2)}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                Items
              </Text>
              <Text
                style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}
              >
                {items.reduce((s, i) => s + i.quantity, 0)}
              </Text>
            </View>
          </View>

          {/* Form card */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 20,
              padding: 20,
              gap: 16,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "800", color: textMain }}>
              Delivery Information
            </Text>

            {fields.map((field) => (
              <View key={field.key} style={{ gap: 6 }}>
                <Text
                  style={{ fontSize: 13, fontWeight: "600", color: textSub }}
                >
                  {field.label}
                </Text>
                <TextInput
                  value={form[field.key]}
                  onChangeText={(val) => handleChange(field.key, val)}
                  placeholder={field.placeholder}
                  placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                  keyboardType={field.keyboardType ?? "default"}
                  autoCapitalize={field.autoCapitalize ?? "sentences"}
                  style={{
                    backgroundColor: inputBg,
                    borderWidth: 1.5,
                    borderColor: errors[field.key] ? "#ef4444" : inputBorder,
                    borderRadius: 14,
                    paddingHorizontal: 14,
                    paddingVertical: 13,
                    fontSize: 14,
                    color: textMain,
                  }}
                />
                {errors[field.key] && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Ionicons
                      name="alert-circle-outline"
                      size={13}
                      color="#ef4444"
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#ef4444",
                        fontWeight: "500",
                      }}
                    >
                      {errors[field.key]}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Spacer for CTA */}
          <View style={{ height: 80 }} />
        </ScrollView>

        {/* Submit CTA */}
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
            onPress={handleSubmit}
            disabled={submitting}
            style={{
              backgroundColor: submitting
                ? isDark
                  ? "#374151"
                  : "#e5e7eb"
                : accent,
              paddingVertical: 16,
              borderRadius: 18,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
            }}
          >
            {submitting ? (
              <Text
                style={{
                  color: isDark ? "#9ca3af" : "#6b7280",
                  fontWeight: "700",
                  fontSize: 16,
                }}
              >
                Placing Order…
              </Text>
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text
                  style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}
                >
                  Place Order · ${total.toFixed(2)}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
