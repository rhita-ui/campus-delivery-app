import { getStoresAction, getVendingMachinesAction } from "./actions";
import RestaurantClient from "./restaurant-client";

export const dynamic = "force-dynamic";

export default async function RestaurantHome() {
  const [storesData, vendingData] = await Promise.all([
    getStoresAction(Date.now()),
    getVendingMachinesAction(Date.now()),
  ]);

  const formattedStores = [
    ...storesData.map((s: any) => ({ ...s, isVending: false })),
    ...vendingData.map((v: any) => ({
      ...v,
      name: v.names, // Map names to name
      description: `Vending Machine at ${v.location}, ${v.building || ""}`,
      type: "veg", // Vending mostly veg? or derive from items?
      isVending: true,
    })),
  ];

  return <RestaurantClient initialStores={formattedStores} />;
}
