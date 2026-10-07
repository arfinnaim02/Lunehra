import { getHomepageData } from "../../lib/homepage";
import { HomeHeroSection } from "../../components/store/home-hero-section";
import { HomepageManagedSections } from "../../components/store/homepage-managed-sections";

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

export default async function HomePage() {
  const homepage =
    await getHomepageData();

  const heroBanners =
    homepage.heroBanners.map(
      (banner) => ({
        id: banner.id,
        title: banner.title,
        subtitle:
          banner.subtitle,
        image: banner.image,
        mobileImage:
          banner.mobileImage,
        ctaText:
          banner.ctaText,
        ctaUrl:
          banner.ctaUrl,
      })
    );

  return (
    <main className="lux-home">
      <HomeHeroSection
        banners={heroBanners}
      />

      <section className="lux-marquee-strip">
        <div className="lux-marquee-track">
          <span>
            Premium Ladies Fashion
          </span>

          <span>
            Elegant Everyday Style
          </span>

          <span>
            Cash on Delivery Across
            Bangladesh
          </span>

          <span>
            Curated New Collections
          </span>

          <span>
            Fast Delivery & Exchange
            Support
          </span>

          <span>
            Premium Ladies Fashion
          </span>

          <span>
            Elegant Everyday Style
          </span>

          <span>
            Cash on Delivery Across
            Bangladesh
          </span>
        </div>
      </section>

      <HomepageManagedSections
        sections={
          homepage.sections
        }
        featuredCategories={
          homepage.featuredCategories
        }
        newArrivals={
          homepage.newArrivals
        }
        featuredProducts={
          homepage.featuredProducts
        }
        bestSellers={
          homepage.bestSellers
        }
        hotDeals={
          homepage.hotDeals
        }
      />
    </main>
  );
}