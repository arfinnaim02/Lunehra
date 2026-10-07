"use client";

import { useMemo, useState } from "react";
import { HomeHeroShowcase } from "./home-hero-showcase";

type HeroBanner = {
  id: string;
  title: string | null;
  subtitle: string | null;
  image: string;
  mobileImage: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
};

type Props = {
  banners: HeroBanner[];
};

function splitHeroTitle(title: string | null) {
  const fallback = {
    top: "ELEGANCE",
    bottom: "MADE YOURS",
  };

  if (!title || !title.trim()) return fallback;

  const normalized = title.replace(/\r/g, "").trim();

  if (normalized.includes("\n")) {
    const parts = normalized
      .split("\n")
      .map((part) => part.trim())
      .filter(Boolean);

    return {
      top: parts[0] || fallback.top,
      bottom: parts[1] || fallback.bottom,
    };
  }

  const words = normalized.split(" ");

  if (words.length <= 2) {
    return {
      top: normalized,
      bottom: "",
    };
  }

  const mid = Math.ceil(words.length / 2);

  return {
    top: words.slice(0, mid).join(" "),
    bottom: words.slice(mid).join(" "),
  };
}

export function HomeHeroSection({ banners }: Props) {
  const fallbackBanner: HeroBanner = {
    id: "fallback",
    title: "ELEGANCE\nMADE YOURS",
    subtitle:
      "Discover beautifully curated ladies fashion designed for modern everyday elegance, special occasions and timeless confidence.",
    image: "/home/hero-main.png",
    mobileImage: "/home/hero-main.png",
    ctaText: "Shop New Arrivals",
    ctaUrl: "/collections/new-arrivals",
  };

  const safeBanners = banners.length > 0 ? banners : [fallbackBanner];

  const [activeBanner, setActiveBanner] =
    useState<HeroBanner>(safeBanners[0]);

  const titleParts = useMemo(() => {
    return splitHeroTitle(activeBanner.title);
  }, [activeBanner.title]);

  return (
    <section className="lux-hero">
      <HomeHeroShowcase
        banners={safeBanners}
        onSlideChange={(banner) => {
          setActiveBanner((current) => {
            if (current.id === banner.id) return current;
            return banner;
          });
        }}
      />

      <div className="container">
        <div className="lux-hero-grid">
          <div className="lux-hero-copy">
            <h1 className="lux-hero-title">
              {titleParts.top}

              {titleParts.bottom ? (
                <>
                  <br />
                  <span>{titleParts.bottom}</span>
                </>
              ) : null}
            </h1>

            <p className="lux-hero-text">
              {activeBanner.subtitle ||
                "Discover beautifully curated ladies fashion designed for modern everyday elegance, special occasions and timeless confidence."}
            </p>

            <div className="lux-hero-actions">
              <a
                href={activeBanner.ctaUrl || "/collections/new-arrivals"}
                className="btn-primary"
              >
                {activeBanner.ctaText || "Shop New Arrivals"}
              </a>

              <a href="/shop" className="btn-secondary">
                Explore Collection
              </a>

              <a href="/help/contact" className="lux-hero-support-btn">
                Customer Support
              </a>
            </div>

            <div className="lux-hero-metrics">
              <div className="lux-metric">
                <div className="lux-metric-value">COD</div>
                <div className="lux-metric-label">
                  Cash on Delivery
                </div>
              </div>

              <div className="lux-metric">
                <div className="lux-metric-value">3 Days</div>
                <div className="lux-metric-label">
                  Exchange Window
                </div>
              </div>

              <div className="lux-metric">
                <div className="lux-metric-value">BD</div>
                <div className="lux-metric-label">
                  Nationwide Delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}