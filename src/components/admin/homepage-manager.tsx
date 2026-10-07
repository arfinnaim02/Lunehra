"use client";

import { useState } from "react";
import Link from "next/link";

type Section = {
  key: string;
  title: string;
  subtitle: string;
  isActive: boolean;
  sortOrder: number;
  config: {
    eyebrow: string;
    linkLabel: string;
    linkUrl: string;
  };
};

type Props = {
  initialSections: Section[];
};

function sourceLink(key: string) {
  switch (key) {
    case "featured_categories":
      return {
        label: "Manage Categories",
        href: "/admin/categories",
      };

    case "new_arrivals":
    case "featured_products":
    case "best_sellers":
    case "hot_deals":
      return {
        label: "Manage Products",
        href: "/admin/products",
      };

    default:
      return null;
  }
}

export function HomepageManager({
  initialSections,
}: Props) {
  const [sections, setSections] =
    useState(initialSections);

  const [saving, setSaving] =
    useState(false);

  function updateSection(
    index: number,
    changes: Partial<Section>
  ) {
    setSections((current) =>
      current.map((section, i) =>
        i === index
          ? {
              ...section,
              ...changes,
            }
          : section
      )
    );
  }

  function updateConfig(
    index: number,
    changes: Partial<
      Section["config"]
    >
  ) {
    setSections((current) =>
      current.map((section, i) =>
        i === index
          ? {
              ...section,
              config: {
                ...section.config,
                ...changes,
              },
            }
          : section
      )
    );
  }

  function move(
    index: number,
    direction: -1 | 1
  ) {
    const target =
      index + direction;

    if (
      target < 0 ||
      target >= sections.length
    ) {
      return;
    }

    setSections((current) => {
      const next = [...current];

      [next[index], next[target]] = [
        next[target],
        next[index],
      ];

      return next;
    });
  }

  async function save() {
    setSaving(true);

    try {
      const response = await fetch(
        "/api/admin/homepage",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            sections,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Failed to update homepage"
        );
      }

      alert(
        "Homepage settings updated successfully."
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update homepage"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        display: "grid",
        gap: 20,
      }}
    >
      <div
        className="dashboard-card"
        style={{
          padding: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/admin/banners"
            className="btn-primary"
          >
            Manage Hero Banners
          </Link>

          <Link
            href="/admin/categories"
            className="btn-secondary"
          >
            Manage Categories
          </Link>

          <Link
            href="/admin/products"
            className="btn-secondary"
          >
            Manage Products
          </Link>

          <a
            href="/"
            target="_blank"
            className="btn-secondary"
          >
            View Homepage
          </a>
        </div>
      </div>

      {sections.map(
        (section, index) => {
          const source =
            sourceLink(section.key);

          return (
            <div
              key={section.key}
              className="dashboard-card"
            >
              <div className="dashboard-card-header">
                <div>
                  <div className="dashboard-card-title">
                    {index + 1}.{" "}
                    {section.config
                      .eyebrow ||
                      section.key}
                  </div>

                  <div
                    className="text-muted"
                    style={{
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    {section.key}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={
                      index === 0
                    }
                    onClick={() =>
                      move(index, -1)
                    }
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={
                      index ===
                      sections.length -
                        1
                    }
                    onClick={() =>
                      move(index, 1)
                    }
                  >
                    ↓
                  </button>

                  {source ? (
                    <Link
                      href={
                        source.href
                      }
                      className="btn-secondary"
                    >
                      {
                        source.label
                      }
                    </Link>
                  ) : null}
                </div>
              </div>

              <div
                className="dashboard-card-body"
                style={{
                  display: "grid",
                  gap: 16,
                }}
              >
                <label
                  style={{
                    display:
                      "inline-flex",
                    alignItems:
                      "center",
                    gap: 10,
                    fontWeight: 700,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={
                      section.isActive
                    }
                    onChange={(
                      event
                    ) =>
                      updateSection(
                        index,
                        {
                          isActive:
                            event
                              .target
                              .checked,
                        }
                      )
                    }
                  />

                  Show this section
                </label>

                <div
                  style={{
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <label>
                    Eyebrow
                  </label>

                  <input
                    value={
                      section.config
                        .eyebrow
                    }
                    onChange={(
                      event
                    ) =>
                      updateConfig(
                        index,
                        {
                          eyebrow:
                            event
                              .target
                              .value,
                        }
                      )
                    }
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <label>
                    Section Title
                  </label>

                  <input
                    value={
                      section.title
                    }
                    onChange={(
                      event
                    ) =>
                      updateSection(
                        index,
                        {
                          title:
                            event
                              .target
                              .value,
                        }
                      )
                    }
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <label>
                    Subtitle
                  </label>

                  <textarea
                    value={
                      section.subtitle
                    }
                    rows={3}
                    onChange={(
                      event
                    ) =>
                      updateSection(
                        index,
                        {
                          subtitle:
                            event
                              .target
                              .value,
                        }
                      )
                    }
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                    }}
                  >
                    <label>
                      Link Text
                    </label>

                    <input
                      value={
                        section.config
                          .linkLabel
                      }
                      onChange={(
                        event
                      ) =>
                        updateConfig(
                          index,
                          {
                            linkLabel:
                              event
                                .target
                                .value,
                          }
                        )
                      }
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                    }}
                  >
                    <label>
                      Link URL
                    </label>

                    <input
                      value={
                        section.config
                          .linkUrl
                      }
                      onChange={(
                        event
                      ) =>
                        updateConfig(
                          index,
                          {
                            linkUrl:
                              event
                                .target
                                .value,
                          }
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        }
      )}

      <div
        style={{
          position: "sticky",
          bottom: 16,
          display: "flex",
          justifyContent:
            "flex-end",
          pointerEvents: "none",
        }}
      >
        <button
          type="button"
          className="btn-primary"
          disabled={saving}
          onClick={save}
          style={{
            pointerEvents: "auto",
            minWidth: 170,
          }}
        >
          {saving
            ? "Saving..."
            : "Save Homepage"}
        </button>
      </div>
    </div>
  );
}