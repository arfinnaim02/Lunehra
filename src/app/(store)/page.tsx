import { getHomepageData } from "../../lib/homepage";
import { StoreProductCard } from "../../components/store/store-product-card";
import { HomeReviewSlider } from "../../components/store/home-review-slider";
import { HomeHeroSection } from "../../components/store/home-hero-section";
import { ScrollReveal } from "../../components/store/scroll-reveal";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const homepage = await getHomepageData();

  const heroBanners = homepage.heroBanners.map((banner) => ({
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle,
    image: banner.image,
    mobileImage: banner.mobileImage,
    ctaText: banner.ctaText,
    ctaUrl: banner.ctaUrl,
  }));

  return (
    <main className="lux-home">
      <HomeHeroSection banners={heroBanners} />

      <section className="lux-marquee-strip">
        <div className="lux-marquee-track">
          <span>Premium Ladies Fashion</span>
          <span>Elegant Everyday Style</span>
          <span>Cash on Delivery Across Bangladesh</span>
          <span>Curated New Collections</span>
          <span>Fast Delivery & Exchange Support</span>

          <span>Premium Ladies Fashion</span>
          <span>Elegant Everyday Style</span>
          <span>Cash on Delivery Across Bangladesh</span>
        </div>
      </section>

      {homepage.featuredCategories.length > 0 ? (
        <ScrollReveal>
          <section className="lux-section">
            <div className="container">
              <div className="lux-section-head lux-section-head-tight">
                <div>
                  <div className="lux-eyebrow">Shop by Category</div>

                  <h2 className="lux-section-title">
                    Beautiful collections, curated for you.
                  </h2>
                </div>

                <a href="/shop" className="lux-link-arrow">
                  Shop all →
                </a>
              </div>

              <div className="lux-collection-grid lux-collection-grid-visual">
                {homepage.featuredCategories.map((category) => (
                  <a
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="lux-collection-card lux-collection-card-photo"
                  >
                    <div className="lux-collection-card-bg">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
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
                        Shop Category
                      </div>

                      <div className="lux-collection-title">
                        {category.name}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      ) : null}

      {homepage.newArrivals.length > 0 ? (
        <ScrollReveal>
          <section className="lux-section">
            <div className="container">
              <div className="lux-section-head">
                <div>
                  <div className="lux-eyebrow">New Arrivals</div>

                  <h2 className="lux-section-title">
                    Fresh arrivals for every occasion
                  </h2>

                  <p className="lux-section-text">
                    Discover the latest pieces added to the Lunehra collection.
                  </p>
                </div>

                <a
                  href="/collections/new-arrivals"
                  className="lux-link-arrow"
                >
                  See all arrivals →
                </a>
              </div>

              <div className="premium-product-grid">
                {homepage.newArrivals.slice(0, 4).map((product) => (
                  <StoreProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      ) : null}

      {homepage.featuredProducts.length > 0 ? (
        <ScrollReveal>
          <section className="lux-section">
            <div className="container">
              <div className="lux-section-head">
                <div>
                  <div className="lux-eyebrow">Lunehra Edit</div>

                  <h2 className="lux-section-title">
                    Featured pieces we love
                  </h2>

                  <p className="lux-section-text">
                    Carefully selected styles from our current collection.
                  </p>
                </div>

                <a href="/shop" className="lux-link-arrow">
                  Explore collection →
                </a>
              </div>

              <div className="premium-product-grid">
                {homepage.featuredProducts
                  .slice(0, 4)
                  .map((product) => (
                    <StoreProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      ) : null}

      {homepage.bestSellers.length > 0 ? (
        <ScrollReveal>
          <section className="lux-section">
            <div className="container">
              <div className="lux-section-head">
                <div>
                  <div className="lux-eyebrow">Most Loved</div>

                  <h2 className="lux-section-title">
                    Lunehra best sellers
                  </h2>

                  <p className="lux-section-text">
                    Customer favourites chosen again and again.
                  </p>
                </div>

                <a href="/shop" className="lux-link-arrow">
                  Shop best sellers →
                </a>
              </div>

              <div className="premium-product-grid">
                {homepage.bestSellers
                  .slice(0, 4)
                  .map((product) => (
                    <StoreProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      ) : null}

      {homepage.hotDeals.length > 0 ? (
        <ScrollReveal>
          <section className="lux-section">
            <div className="container">
              <div className="lux-section-head">
                <div>
                  <div className="lux-eyebrow">Special Offers</div>

                  <h2 className="lux-section-title">
                    Selected styles at special prices
                  </h2>
                </div>

                <a href="/shop" className="lux-link-arrow">
                  View offers →
                </a>
              </div>

              <div className="premium-product-grid">
                {homepage.hotDeals.slice(0, 4).map((product) => (
                  <StoreProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      ) : null}

      <ScrollReveal>
        <section className="lux-section">
          <div className="container">
            <div className="lux-section-head lux-section-head-tight">
              <div>
                <div className="lux-eyebrow">
                  Shop with Confidence
                </div>

                <h2 className="lux-section-title">
                  Designed around a safer shopping experience
                </h2>
              </div>
            </div>

            <div className="lux-value-grid">
              <div className="surface-card">
                <div className="lux-value-icon">৳</div>

                <h3>Cash on Delivery</h3>

                <p>
                  Order online and pay when your Lunehra parcel
                  reaches you.
                </p>
              </div>

              <div className="surface-card">
                <div className="lux-value-icon">✓</div>

                <h3>Check Before Accepting</h3>

                <p>
                  Check your product while the delivery person is
                  still with you before accepting the parcel.
                </p>
              </div>

              <div className="surface-card">
                <div className="lux-value-icon">3</div>

                <h3>3-Day Exchange</h3>

                <p>
                  Eligible delivered products can be exchanged
                  within three days under our exchange policy.
                </p>
              </div>

              <div className="surface-card">
                <div className="lux-value-icon">BD</div>

                <h3>Delivery Across Bangladesh</h3>

                <p>
                  Inside Dhaka delivery is ৳80 and outside Dhaka
                  delivery is ৳150.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="lux-section">
          <div className="container">
            <div className="lux-section-head lux-section-head-tight">
              <div>
                <div className="lux-eyebrow">
                  What Customers Say
                </div>

                <h2 className="lux-section-title">
                  Why customers choose Lunehra
                </h2>
              </div>
            </div>

            <HomeReviewSlider />
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="lux-section lux-section-last">
          <div className="container">
            <div className="lux-newsletter-block">
              <div className="lux-newsletter-copy">
                <div className="lux-eyebrow">
                  Stay Connected
                </div>

                <h2 className="lux-newsletter-title">
                  Be first to discover new Lunehra collections
                </h2>

                <p className="lux-newsletter-text">
                  Get updates on new arrivals, special collections,
                  exclusive offers and upcoming launches.
                </p>
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
    </main>
  );
}