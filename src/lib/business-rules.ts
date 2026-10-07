export const STORE_CONFIG = {
  name: "Lunehra",
  currency: "BDT",
  currencySymbol: "৳",

  delivery: {
    insideDhaka: 80,
    outsideDhaka: 150,
  },

  exchange: {
    insideDhaka: 100,
    outsideDhaka: 180,
    windowDays: 3,
  },

  payments: {
    codEnabled: true,
    bkashEnabled: false,
  },
} as const;

export type DeliveryZoneType = "INSIDE_DHAKA" | "OUTSIDE_DHAKA";

export function getDeliveryCharge(zone: DeliveryZoneType) {
  return zone === "INSIDE_DHAKA"
    ? STORE_CONFIG.delivery.insideDhaka
    : STORE_CONFIG.delivery.outsideDhaka;
}

export function getExchangeFee(zone: DeliveryZoneType) {
  return zone === "INSIDE_DHAKA"
    ? STORE_CONFIG.exchange.insideDhaka
    : STORE_CONFIG.exchange.outsideDhaka;
}

export function formatBDT(value: number) {
  return `${STORE_CONFIG.currencySymbol}${value.toLocaleString("en-BD")}`;
}