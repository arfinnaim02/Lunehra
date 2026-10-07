"use client";

import { useMemo, useState } from "react";

type ChartColumn = {
  key: string;
  label: string;
};

type ChartRow =
  Record<string, string>;

type ProductVariant = {
  size: string | null;
  color: string | null;
  stockQty: number;
};

type SizeChart = {
  id: string;
  name: string;
  description: string | null;
  unit: string;
  columns: unknown;
  rows: unknown;
  note: string | null;
};

type SizeChartModalProps = {
  productName: string;
  sizeChart: SizeChart | null;
  variants: ProductVariant[];
};

function normalizeColumns(
  value: unknown
): ChartColumn[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (
      item
    ): item is ChartColumn => {
      if (
        !item ||
        typeof item !== "object"
      ) {
        return false;
      }

      const record =
        item as Record<
          string,
          unknown
        >;

      return (
        typeof record.key ===
          "string" &&
        typeof record.label ===
          "string"
      );
    }
  );
}

function normalizeRows(
  value: unknown
): ChartRow[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (
      item
    ): item is ChartRow =>
      Boolean(
        item &&
          typeof item ===
            "object" &&
          !Array.isArray(item)
      )
  );
}

export function SizeChartModal({
  productName,
  sizeChart,
  variants,
}: SizeChartModalProps) {
  const [open, setOpen] =
    useState(false);

  const columns =
    useMemo(
      () =>
        normalizeColumns(
          sizeChart?.columns
        ),
      [sizeChart]
    );

  const rows =
    useMemo(
      () =>
        normalizeRows(
          sizeChart?.rows
        ),
      [sizeChart]
    );

  const sizeStock =
    useMemo(() => {
      const map =
        new Map<
          string,
          number
        >();

      variants.forEach(
        (variant) => {
          const size =
            variant.size?.trim();

          if (!size) return;

          map.set(
            size.toLowerCase(),
            (map.get(
              size.toLowerCase()
            ) ?? 0) +
              variant.stockQty
          );
        }
      );

      return map;
    }, [variants]);

  if (
    !sizeChart ||
    columns.length === 0 ||
    rows.length === 0
  ) {
    return null;
  }

  const unitLabel =
    sizeChart.unit === "CM"
      ? "cm"
      : "inches";

  return (
    <>
      <button
        type="button"
        className="btn-secondary"
        onClick={() =>
          setOpen(true)
        }
        style={{
          minWidth: 170,
        }}
      >
        View Size Guide
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} size guide`}
          onClick={() =>
            setOpen(false)
          }
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background:
              "rgba(0,0,0,0.72)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding: 20,
          }}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              width: "100%",
              maxWidth: 920,
              maxHeight:
                "90vh",
              overflowY:
                "auto",
              borderRadius: 24,
              border:
                "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(180deg, rgba(18,20,30,0.99), rgba(11,12,18,0.99))",
              boxShadow:
                "0 30px 80px rgba(0,0,0,0.45)",
            }}
          >
            <div
              style={{
                padding:
                  "20px 22px",
                borderBottom:
                  "1px solid rgba(255,255,255,0.08)",
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    fontFamily:
                      "var(--font-heading)",
                  }}
                >
                  {sizeChart.name}
                </div>

                <div
                  style={{
                    color:
                      "var(--muted)",
                    marginTop: 5,
                    fontSize: 14,
                  }}
                >
                  {sizeChart.description ||
                    `Size guide for ${productName}`}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                aria-label="Close size guide"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius:
                    999,
                  border:
                    "1px solid rgba(255,255,255,0.12)",
                  background:
                    "rgba(255,255,255,0.04)",
                  color: "#fff",
                  fontSize: 20,
                  cursor:
                    "pointer",
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                padding: 22,
                display:
                  "grid",
                gap: 18,
              }}
            >
              <div
                style={{
                  display:
                    "flex",
                  gap: 8,
                  flexWrap:
                    "wrap",
                  alignItems:
                    "center",
                }}
              >
                <span className="status-pill status-confirmed">
                  Measurements in{" "}
                  {unitLabel}
                </span>

                <a
                  href="/help/size-guide"
                  target="_blank"
                  className="btn-secondary"
                  style={{
                    fontSize: 12,
                  }}
                >
                  How to Measure
                </a>
              </div>

              <div
                style={{
                  overflowX:
                    "auto",
                  borderRadius:
                    16,
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse",
                    minWidth: 600,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background:
                          "rgba(255,255,255,0.04)",
                        textAlign:
                          "left",
                      }}
                    >
                      {columns.map(
                        (
                          column
                        ) => (
                          <th
                            key={
                              column.key
                            }
                            style={{
                              padding:
                                14,
                            }}
                          >
                            {
                              column.label
                            }
                          </th>
                        )
                      )}

                      <th
                        style={{
                          padding: 14,
                        }}
                      >
                        Availability
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map(
                      (
                        row,
                        index
                      ) => {
                        const size =
                          String(
                            row.size ??
                              ""
                          ).trim();

                        const stock =
                          size
                            ? sizeStock.get(
                                size.toLowerCase()
                              ) ??
                              0
                            : 0;

                        return (
                          <tr
                            key={`${size}-${index}`}
                            style={{
                              borderTop:
                                "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            {columns.map(
                              (
                                column
                              ) => (
                                <td
                                  key={
                                    column.key
                                  }
                                  style={{
                                    padding:
                                      14,
                                    fontWeight:
                                      column.key ===
                                      "size"
                                        ? 800
                                        : 400,
                                  }}
                                >
                                  {String(
                                    row[
                                      column
                                        .key
                                    ] ??
                                      "-"
                                  )}
                                </td>
                              )
                            )}

                            <td
                              style={{
                                padding:
                                  14,
                              }}
                            >
                              <span
                                className={
                                  stock >
                                  0
                                    ? "status-pill status-delivered"
                                    : "status-pill status-cancelled"
                                }
                              >
                                {stock >
                                0
                                  ? "Available"
                                  : "Not available"}
                              </span>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  color:
                    "var(--muted)",
                  fontSize: 13,
                  lineHeight:
                    1.7,
                }}
              >
                {sizeChart.note ||
                  "Measurements may vary slightly due to manual measurement. Compare the measurements with a similar garment that fits you well."}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}