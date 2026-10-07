import { Prisma } from "@prisma/client";
import { db } from "./db";

export type HomepageSectionKey =
  | "featured_categories"
  | "new_arrivals"
  | "featured_products"
  | "best_sellers"
  | "hot_deals"
  | "trust"
  | "reviews"
  | "newsletter";

export type HomepageSectionConfig = {
  eyebrow: string;
  linkLabel: string;
  linkUrl: string;
};

export type HomepageSectionView = {
  key: HomepageSectionKey;
  title: string;
  subtitle: string;
  isActive: boolean;
  sortOrder: number;
  config: HomepageSectionConfig;
};

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionView[] = [
  {
    key: "featured_categories",
    title: "Beautiful collections, curated for you.",
    subtitle: "",
    isActive: true,
    sortOrder: 10,
    config: {
      eyebrow: "Shop by Category",
      linkLabel: "Shop all →",
      linkUrl: "/shop",
    },
  },
  {
    key: "new_arrivals",
    title: "Fresh arrivals for every occasion",
    subtitle:
      "Discover the latest pieces added to the Lunehra collection.",
    isActive: true,
    sortOrder: 20,
    config: {
      eyebrow: "New Arrivals",
      linkLabel: "See all arrivals →",
      linkUrl: "/collections/new-arrivals",
    },
  },
  {
    key: "featured_products",
    title: "Featured pieces we love",
    subtitle:
      "Carefully selected styles from our current collection.",
    isActive: true,
    sortOrder: 30,
    config: {
      eyebrow: "Lunehra Edit",
      linkLabel: "Explore collection →",
      linkUrl: "/shop",
    },
  },
  {
    key: "best_sellers",
    title: "Lunehra best sellers",
    subtitle:
      "Customer favourites chosen again and again.",
    isActive: true,
    sortOrder: 40,
    config: {
      eyebrow: "Most Loved",
      linkLabel: "Shop best sellers →",
      linkUrl: "/collections/best-sellers",
    },
  },
  {
    key: "hot_deals",
    title: "Selected styles at special prices",
    subtitle: "",
    isActive: true,
    sortOrder: 50,
    config: {
      eyebrow: "Special Offers",
      linkLabel: "View offers →",
      linkUrl: "/collections/hot-deals",
    },
  },
  {
    key: "trust",
    title: "Designed around a safer shopping experience",
    subtitle: "",
    isActive: true,
    sortOrder: 60,
    config: {
      eyebrow: "Shop with Confidence",
      linkLabel: "",
      linkUrl: "",
    },
  },
  {
    key: "reviews",
    title: "Why customers choose Lunehra",
    subtitle: "",
    isActive: true,
    sortOrder: 70,
    config: {
      eyebrow: "What Customers Say",
      linkLabel: "",
      linkUrl: "",
    },
  },
  {
    key: "newsletter",
    title: "Be first to discover new Lunehra collections",
    subtitle:
      "Get updates on new arrivals, special collections, exclusive offers and upcoming launches.",
    isActive: true,
    sortOrder: 80,
    config: {
      eyebrow: "Stay Connected",
      linkLabel: "",
      linkUrl: "",
    },
  },
];

function normalizeConfig(
  value: Prisma.JsonValue | null | undefined,
  fallback: HomepageSectionConfig
): HomepageSectionConfig {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return fallback;
  }

  const record = value as Record<string, unknown>;

  return {
    eyebrow:
      typeof record.eyebrow === "string"
        ? record.eyebrow
        : fallback.eyebrow,

    linkLabel:
      typeof record.linkLabel === "string"
        ? record.linkLabel
        : fallback.linkLabel,

    linkUrl:
      typeof record.linkUrl === "string"
        ? record.linkUrl
        : fallback.linkUrl,
  };
}

export async function getHomepageSections() {
  const keys = DEFAULT_HOMEPAGE_SECTIONS.map(
    (section) => section.key
  );

  const saved = await db.homepageSection.findMany({
    where: {
      key: {
        in: keys,
      },
    },
  });

  const savedMap = new Map(
    saved.map((section) => [
      section.key,
      section,
    ])
  );

  return DEFAULT_HOMEPAGE_SECTIONS.map(
    (fallback) => {
      const section = savedMap.get(fallback.key);

      if (!section) {
        return fallback;
      }

      return {
        key: fallback.key,
        title:
          section.title ??
          fallback.title,
        subtitle:
          section.subtitle ??
          fallback.subtitle,
        isActive:
          section.isActive,
        sortOrder:
          section.sortOrder,
        config: normalizeConfig(
          section.config,
          fallback.config
        ),
      };
    }
  ).sort(
    (a, b) =>
      a.sortOrder - b.sortOrder
  );
}