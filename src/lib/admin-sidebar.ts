import { db } from "./db";

export async function getAdminSidebarCounts() {
  const [
    ordersCount,
    inventoryCount,
  ] = await Promise.all([
    db.order.count({
      where: {
        status: {
          in: [
            "PENDING",
            "CONFIRMED",
            "PROCESSING",
            "PACKED",
          ],
        },
      },
    }),

    db.productVariant.count({
      where: {
        isActive: true,
        stockQty: {
          lte: 5,
        },
      },
    }),
  ]);

  return {
    ordersCount,
    inventoryCount,
  };
}