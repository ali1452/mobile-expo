import { createOrder } from "@/lib/orders";
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
  first_name: string;
  last_name: string;
  email: string;
  shippingAddress: string;
  country: string;
  province: string;
  city: string;
  area: string;
  zip_code: string;
  mobile_num: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};
  if (!fields.first_name.trim()) errors.first_name = "First name is required";
  if (!fields.last_name.trim()) errors.last_name = "Last name is required";
  if (!fields.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Enter a valid email";
  }
  if (!fields.shippingAddress.trim()) errors.shippingAddress = "Street address is required";
  if (!fields.country.trim()) errors.country = "Country is required";
  if (!fields.province.trim()) errors.province = "Province is required";
  if (!fields.city.trim()) errors.city = "City is required";
  if (!fields.area.trim()) errors.area = "Area is required";
  if (!fields.zip_code.trim()) errors.zip_code = "Zip code is required";
  if (!fields.mobile_num.trim()) {
    errors.mobile_num = "Mobile number is required";
  } else if (!/^\+?[\d\s\-()]{7,15}$/.test(fields.mobile_num)) {
    errors.mobile_num = "Enter a valid mobile number";
  }
  return errors;
}

const FIELD_CONFIG: {
  key: keyof FormFields;
  label: string;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  autoCapitalize?: "none" | "words" | "sentences";
  section?: string;
}[] = [
  // Personal
  { key: "first_name", label: "First Name", placeholder: "John", autoCapitalize: "words", section: "Personal Information" },
  { key: "last_name", label: "Last Name", placeholder: "Doe", autoCapitalize: "words" },
  { key: "email", label: "Email", placeholder: "john@example.com", keyboardType: "email-address", autoCapitalize: "none" },
  { key: "mobile_num", label: "Mobile Number", placeholder: "+1 234 567 8900", keyboardType: "phone-pad" },
  // Shipping
  { key: "shippingAddress", label: "Street Address", placeholder: "123 Main Street, Apt 4B", autoCapitalize: "words", section: "Shipping Address" },
  { key: "country", label: "Country", placeholder: "United States", autoCapitalize: "words" },
  { key: "province", label: "Province / State", placeholder: "California", autoCapitalize: "words" },
  { key: "city", label: "City", placeholder: "Los Angeles", autoCapitalize: "words" },
  { key: "area", label: "Area / District", placeholder: "Downtown", autoCapitalize: "words" },
  { key: "zip_code", label: "Zip / Postal Code", placeholder: "90001", keyboardType: "numeric" },
];

export default function CheckoutScreen() {
  const { isDark } = useThemeStore();
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState<FormFields>({
    first_name: "",
    last_name: "",
    email: "",
    shippingAddress: "",
    country: "",
    province: "",
    city: "",
    area: "",
    zip_code: "",
    mobile_num: "",
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

  async function handleSubmit() {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await createOrder({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        shopping_address: {
          street_address: form.shippingAddress,
          country: form.country,
          province: form.province,
          city: form.city,
          area: form.area,
          zip_code: form.zip_code,
        },
        mobile_number: form.mobile_num,
        mode_of_payment: "cash",
        amount: total,
        items: items.map((item) => {
          const price =
            item.product.discount_price &&
            item.product.discount_price !== "0" &&
            item.product.discount_price !== item.product.price
              ? item.product.discount_price
              : item.product.price;
          return {
            product_id: item.product.product_id,
            name: item.product.name,
            quantity: item.quantity,
            price,
            shipping_amount: 200,
          };
        }),
      });

      clearCart();
      Alert.alert(
        "Order Placed!",
        `Thank you, ${form.first_name}! Your order has been placed successfully. A confirmation will be sent to ${form.email}.`,
        [
          {
            text: "Continue Shopping",
            onPress: () => router.replace("/(tabs)/products"),
          },
        ],
      );
    } catch {
      Alert.alert(
        "Couldn't place your order",
        "Something went wrong on our end. Please try again, or contact support if the issue continues.",
        [{ text: "Try Again" }],
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Group fields by section header
  const sections: { title: string; fields: typeof FIELD_CONFIG }[] = [];
  for (const field of FIELD_CONFIG) {
    if (field.section) {
      sections.push({ title: field.section, fields: [field] });
    } else {
      sections[sections.length - 1].fields.push(field);
    }
  }

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
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: "900" }}>
                ${total.toFixed(2)}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                Items
              </Text>
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
                {items.reduce((s, i) => s + i.quantity, 0)}
              </Text>
            </View>
          </View>

          {/* Form sections */}
          {sections.map((section) => (
            <View
              key={section.title}
              style={{
                backgroundColor: cardBg,
                borderRadius: 20,
                padding: 20,
                gap: 16,
              }}
            >
              <Text
                style={{ fontSize: 15, fontWeight: "800", color: textMain }}
              >
                {section.title}
              </Text>

              {section.fields.map((field) => (
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
          ))}

          {/* Payment method (static) */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 20,
              padding: 20,
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "800", color: textMain }}>
              Payment Method
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                backgroundColor: isDark ? "#374151" : "#f3f4f6",
                borderRadius: 14,
                padding: 14,
                borderWidth: 1.5,
                borderColor: accent,
              }}
            >
              <Ionicons name="cash-outline" size={22} color={accent} />
              <Text style={{ fontSize: 14, fontWeight: "700", color: textMain }}>
                Cash on Delivery
              </Text>
              <View style={{ marginLeft: "auto" }}>
                <Ionicons name="checkmark-circle" size={20} color={accent} />
              </View>
            </View>
          </View>

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
                Placing your order…
              </Text>
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#fff"
                />
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
