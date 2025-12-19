"use client";

import { CartScreen } from "@/components/cart-screen";
import { useCart } from "@/components/cart-context";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    updateQuantity,
    totals,
    selectedHostel,
    setSelectedHostel,
    roomNumber,
    setRoomNumber,
  } = useCart();

  const updateAddress = async (hostel: string, room: string) => {
    // Persist logic duplicated here or lifted to context? Lifted to context is better but let's keep it simple.
    // Since context doesn't expose the setter directly that saves API, we can just do it here.
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: hostel,
          roomNumber: room,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    // import dynamically or at top. Using dynamic import for action if needed but top level is fine.
    // We need to pass the cart items.
    const { createOrderAction } = await import("./actions");
    const res = await createOrderAction(cartItems, []); // deliveryItems not strictly needed if we just use IDs
    if (res.ok) {
      // Clear cart (we need to expose clearCart from context or just update all to 0)
      // For now, reload or redirect which clears if state is not persisted or manually clear.
      // The useCart hook might not expose clearCart, let's check.
      // It exposes updateQuantity. We can loop and set to 0 or just redirect.
      alert("Order placed successfully!");
      // Naive clear:
      Object.keys(cartItems).forEach((id) =>
        updateQuantity(id, -cartItems[id])
      );
      router.push("/restaurant");
    } else {
      alert("Failed to place order: " + res.error);
    }
  };

  return (
    <CartScreen
      cartItems={cartItems}
      onUpdateQuantity={updateQuantity}
      totals={totals}
      onGoToDelivery={() => router.push("/restaurant")}
      selectedHostel={selectedHostel}
      setSelectedHostel={setSelectedHostel}
      roomNumber={roomNumber}
      setRoomNumber={setRoomNumber}
      onSaveAddress={updateAddress}
      onCheckout={handleCheckout}
    />
  );
}
