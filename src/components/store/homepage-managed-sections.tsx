import { StoreProductCard } from "./store-product-card";
import { HomeReviewSlider } from "./home-review-slider";
import { ScrollReveal } from "./scroll-reveal";

type Product = {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice: number | null;
  totalSold: number;
  collection: string | null;
  categoryName: string;
  image: string | null;
  imageAlt: string;
  totalStock: number;
  isNewArrival?: boolean;
  isHotDeal?: boolean;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
};

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
  sections: Section[];

  featuredCategories: Category[];

  newArrivals: Product[];
  featuredProducts: Product[];
  bestSellers: Product[];
  hotDeals: Product[];
};

export function HomepageManagedSections({
  sections,
  featuredCategories,
  newArrivals,
  featuredProducts,
  bestSellers,
  hotDeals,
}: Props) {
  return (
    <>
      {sections
        .filter(
          (section) =>
            section.isActive
        )
        .map((section) => {
          switch (section.key) {
            case "featured_categories":
              if (
                featuredCategories.length ===
                0
              ) {
                return null;
              }

              return (
                <ScrollReveal
                  key={
                    section.key
                  }
                >
                  <section className="lux-section">
                    <div className="container">
                      <SectionHead
                        section={
                          section
                        }
                      />

                      <div className="lux-collection-grid lux-collection-grid-visual">
                        {featuredCategories.map(
                          (
                            category
                          ) => (
                            <a
                              key={
                                category.id
                              }
                              href={`/category/${category.slug}`}
                              className="lux-collection-card lux-collection-card-photo"
                            >
                              <div className="lux-collection-card-bg">
                                {category.image ? (
                                  <img
                                    src={
                                      category.image
                                    }
                                    alt={
                                      category.name
                                    }
                                    style={{
                                      width:
                                        "100%",
                                      height:
                                        "100%",
                                      objectFit:
                                        "cover",
                                    }}
                                  />
                                ) : (
                                  <div className="lux-collection-fallback">
                                    LUNEHRA
                                  </div>
                                )}
                              </div>

                              <div className="lux-collection-photo-overlay" />

                              <div className="lux-collection-content lux-collection-content-photo">
                                <div className="lux-collection-kicker">
                                  Shop
                                  Category
                                </div>

                                <div className="lux-collection-title">
                                  {
                                    category.name
                                  }
                                </div>
                              </div>
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  </section>
                </ScrollReveal>
              );

            case "new_arrivals":
              return (
                <ProductSection
                  key={
                    section.key
                  }
                  section={
                    section
                  }
                  products={
                    newArrivals
                  }
                />
              );

            case "featured_products":
              return (
                <ProductSection
                  key={
                    section.key
                  }
                  section={
                    section
                  }
                  products={
                    featuredProducts
                  }
                />
              );

            case "best_sellers":
              return (
                <ProductSection
                  key={
                    section.key
                  }
                  section={
                    section
                  }
                  products={
                    bestSellers
                  }
                />
              );

            case "hot_deals":
              return (
                <ProductSection
                  key={
                    section.key
                  }
                  section={
                    section
                  }
                  products={
                    hotDeals
                  }
                />
              );

            case "trust":
              return (
                <ScrollReveal
                  key={
                    section.key
                  }
                >
                  <section className="lux-section">
                    <div className="container">
                      <SectionHead
                        section={
                          section
                        }
                      />

                      <div className="lux-value-grid">
                        <TrustCard
                          icon="৳"
                          title="Cash on Delivery"
                          text="Order online and pay when your Lunehra parcel reaches you."
                        />

                        <TrustCard
                          icon="✓"
                          title="Check Before Accepting"
                          text="Check your product while the delivery person is still with you before accepting the parcel."
                        />

                        <TrustCard
                          icon="3"
                          title="3-Day Exchange"
                          text="Eligible delivered products can be exchanged within three days under our exchange policy."
                        />

                        <TrustCard
                          icon="BD"
                          title="Delivery Across Bangladesh"
                          text="Inside Dhaka delivery is ৳80 and outside Dhaka delivery is ৳150."
                        />
                      </div>
                    </div>
                  </section>
                </ScrollReveal>
              );

            case "reviews":
              return (
                <ScrollReveal
                  key={
                    section.key
                  }
                >
                  <section className="lux-section">
                    <div className="container">
                      <SectionHead
                        section={
                          section
                        }
                      />

                      <HomeReviewSlider />
                    </div>
                  </section>
                </ScrollReveal>
              );

            case "newsletter":
              return (
                <ScrollReveal
                  key={
                    section.key
                  }
                >
                  <section className="lux-section lux-section-last">
                    <div className="container">
                      <div className="lux-newsletter-block">
                        <div className="lux-newsletter-copy">
                          <div className="lux-eyebrow">
                            {
                              section
                                .config
                                .eyebrow
                            }
                          </div>

                          <h2 className="lux-newsletter-title">
                            {
                              section.title
                            }
                          </h2>

                          {section.subtitle ? (
                            <p className="lux-newsletter-text">
                              {
                                section.subtitle
                              }
                            </p>
                          ) : null}
                        </div>

                        <form className="lux-newsletter-form">
                          <input
                            type="email"
                            placeholder="Enter your email address"
                          />

                          <button
                            type="button"
                            className="btn-primary"
                          >
                            Join Now
                          </button>
                        </form>
                      </div>
                    </div>
                  </section>
                </ScrollReveal>
              );

            default:
              return null;
          }
        })}
    </>
  );
}

function ProductSection({
  section,
  products,
}: {
  section: Section;
  products: Product[];
}) {
  if (products.length === 0) {
    return null;
  }

  return (
    <ScrollReveal>
      <section className="lux-section">
        <div className="container">
          <SectionHead
            section={section}
          />

          <div className="premium-product-grid">
            {products
              .slice(0, 4)
              .map((product) => (
                <StoreProductCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                />
              ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

function SectionHead({
  section,
}: {
  section: Section;
}) {
  return (
    <div className="lux-section-head">
      <div>
        {section.config.eyebrow ? (
          <div className="lux-eyebrow">
            {
              section.config
                .eyebrow
            }
          </div>
        ) : null}

        <h2 className="lux-section-title">
          {section.title}
        </h2>

        {section.subtitle ? (
          <p className="lux-section-text">
            {
              section.subtitle
            }
          </p>
        ) : null}
      </div>

      {section.config
        .linkLabel &&
      section.config.linkUrl ? (
        <a
          href={
            section.config
              .linkUrl
          }
          className="lux-link-arrow"
        >
          {
            section.config
              .linkLabel
          }
        </a>
      ) : null}
    </div>
  );
}

function TrustCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="surface-card">
      <div className="lux-value-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}