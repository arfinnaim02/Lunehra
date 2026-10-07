"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { AddToCartButton } from "./add-to-cart-button";

type Variant = {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  priceOffset: number;
  stockQty: number;
  lowStockAt: number;
};

type Props = {
  productId: string;
  slug: string;
  name: string;
  basePrice: number;
  salePrice: number | null;
  image?: string | null;
  variants: Variant[];
};

function uniqueValues(
  values: Array<string | null | undefined>
) {
  return [
    ...new Set(values.filter(Boolean)),
  ] as string[];
}

function sortSizes(sizes: string[]) {
  const order = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "3XL",
    "4XL",
    "5XL",
    "FREE SIZE",
  ];

  return [...sizes].sort((a, b) => {
    const ai = order.indexOf(
      a.toUpperCase()
    );

    const bi = order.indexOf(
      b.toUpperCase()
    );

    if (ai === -1 && bi === -1)
      return a.localeCompare(b);

    if (ai === -1) return 1;
    if (bi === -1) return -1;

    return ai - bi;
  });
}

export function ProductVariantSelector({
  productId,
  slug,
  name,
  basePrice,
  salePrice,
  image,
  variants,
}: Props) {
  const colors = useMemo(
    () =>
      uniqueValues(
        variants.map((variant) =>
          variant.color?.trim()
            ? variant.color
            : "Standard"
        )
      ),
    [variants]
  );

  const [color, setColor] =
    useState<string | null>(
      colors[0] ?? null
    );

  const colorVariants = useMemo(() => {
    if (!color) return variants;

    return variants.filter(
      (variant) =>
        (variant.color?.trim()
          ? variant.color
          : "Standard") === color
    );
  }, [variants, color]);

  const sizes = useMemo(
    () =>
      sortSizes(
        uniqueValues(
          colorVariants.map(
            (variant) => variant.size
          )
        )
      ),
    [colorVariants]
  );

  const [size, setSize] =
    useState<string | null>(
      sizes[0] ?? null
    );

  useEffect(() => {
    setSize(sizes[0] ?? null);
  }, [color, sizes]);

  const selectedVariant = useMemo(() => {
    if (size) {
      const match = colorVariants.find(
        (variant) =>
          variant.size === size
      );

      if (match) return match;
    }

    return (
      colorVariants[0] ??
      variants[0] ??
      null
    );
  }, [
    colorVariants,
    variants,
    size,
  ]);

  const finalPrice =
    (salePrice ?? basePrice) +
    (selectedVariant?.priceOffset ?? 0);

  return (
    <div
      style={{
        display: "grid",
        gap: 18,
        marginTop: 24,
      }}
    >
      {colors.length > 1 ||
      (colors.length === 1 &&
        colors[0] !== "Standard") ? (
        <div
          className="surface-card"
          style={{
            padding: 20,
            borderRadius: 22,
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: 17,
              marginBottom: 14,
            }}
          >
            Select Color
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {colors.map((item) => {
              const isSelected =
                color === item;

              const colorStock = variants
                .filter(
                  (variant) =>
                    (variant.color?.trim()
                      ? variant.color
                      : "Standard") ===
                    item
                )
                .reduce(
                  (sum, variant) =>
                    sum +
                    variant.stockQty,
                  0
                );

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setColor(item)
                  }
                  disabled={
                    colorStock <= 0
                  }
                  className="btn-secondary"
                  style={{
                    border: isSelected
                      ? "1px solid rgba(212,175,55,0.42)"
                      : undefined,

                    background:
                      isSelected
                        ? "var(--accent-soft)"
                        : undefined,

                    color: isSelected
                      ? "var(--accent)"
                      : undefined,

                    opacity:
                      colorStock <= 0
                        ? 0.4
                        : 1,
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {sizes.length > 0 ? (
        <div
          className="surface-card"
          style={{
            padding: 20,
            borderRadius: 22,
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: 17,
              marginBottom: 14,
            }}
          >
            Select Size
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(74px, 1fr))",
              gap: 10,
            }}
          >
            {sizes.map((item) => {
              const sizeVariant =
                colorVariants.find(
                  (variant) =>
                    variant.size ===
                    item
                );

              const isSelected =
                size === item;

              const isOutOfStock =
                (sizeVariant?.stockQty ??
                  0) <= 0;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setSize(item)
                  }
                  disabled={isOutOfStock}
                  className="btn-secondary"
                  style={{
                    minHeight: 58,

                    border:
                      isSelected
                        ? "1px solid rgba(212,175,55,0.42)"
                        : undefined,

                    background:
                      isSelected
                        ? "var(--accent-soft)"
                        : undefined,

                    color:
                      isSelected
                        ? "var(--accent)"
                        : undefined,

                    opacity:
                      isOutOfStock
                        ? 0.38
                        : 1,
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div
        className="surface-card"
        style={{
          padding: 18,
          borderRadius: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "end",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                color: "var(--muted)",
              }}
            >
              Selected
            </div>

            <div
              style={{
                fontWeight: 900,
                fontSize: 19,
              }}
            >
              {selectedVariant?.size ||
                "Standard"}

              {selectedVariant?.color
                ? ` / ${selectedVariant.color}`
                : ""}
            </div>
          </div>

          <div
            style={{
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "var(--muted)",
              }}
            >
              Price
            </div>

            <div
              style={{
                fontWeight: 900,
                fontSize: 28,
                color: "var(--accent)",
                fontFamily:
                  "var(--font-heading)",
              }}
            >
              ৳
              {finalPrice.toLocaleString(
                "en-BD"
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedVariant &&
      selectedVariant.stockQty > 0 ? (
        <AddToCartButton
          id={productId}
          variantId={
            selectedVariant.id
          }
          slug={slug}
          name={name}
          price={finalPrice}
          image={image}
          size={
            selectedVariant.size
          }
          color={
            selectedVariant.color
          }
        />
      ) : (
        <button
          className="btn-secondary"
          type="button"
          disabled
        >
          Selected Option Out of Stock
        </button>
      )}
    </div>
  );
}