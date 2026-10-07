import Link from "next/link";
import { SiteHeader } from "../../../components/layout/site-header";
import { SiteFooter } from "../../../components/layout/site-footer";

export default function SizeGuidePage() {
  return (
    <>
      <SiteHeader />

      <main
        className="container"
        style={{
          paddingTop: 56,
          paddingBottom: 80,
        }}
      >
        <Link
          href="/"
          className="text-muted"
        >
          ← Back to Home
        </Link>

        <div
          style={{
            marginTop: 32,
            marginBottom: 34,
          }}
        >
          <div className="lux-eyebrow">
            Lunehra Fit Guide
          </div>

          <h1 className="section-title">
            How to Measure
          </h1>

          <p
            className="text-muted"
            style={{
              marginTop: 16,
              maxWidth: 820,
              lineHeight: 1.8,
              fontSize: 16,
            }}
          >
            Lunehra products can have
            different fits and measurements.
            Always use the size guide shown
            on the individual product page
            before ordering.
          </p>
        </div>

        <section
          className="dashboard-card"
          style={{
            maxWidth: 1040,
            padding: 22,
            display: "grid",
            gap: 32,
          }}
        >
          <GuideBlock title="Bust">
            Measure around the fullest part
            of your bust while keeping the
            measuring tape level.
          </GuideBlock>

          <GuideBlock title="Waist">
            Measure around your natural
            waistline without pulling the
            tape too tightly.
          </GuideBlock>

          <GuideBlock title="Hip">
            Measure around the fullest part
            of your hips while standing
            naturally.
          </GuideBlock>

          <GuideBlock title="Shoulder">
            Measure straight from one
            shoulder point to the other
            across the back.
          </GuideBlock>

          <GuideBlock title="Sleeve">
            Measure from the shoulder point
            down the arm to the required
            sleeve length.
          </GuideBlock>

          <GuideBlock title="Garment Length">
            Measure from the top of the
            shoulder vertically down to the
            garment hem.
          </GuideBlock>

          <GuideBlock title="Pant Waist">
            Measure around the waistband
            area where you normally wear
            your trousers or pants.
          </GuideBlock>

          <GuideBlock title="Pant Length">
            Measure from the waistband down
            to the bottom hem.
          </GuideBlock>

          <GuideBlock title="Important">
            Product measurements may vary
            slightly because of fabric,
            design and manual measurement.
            For the best comparison, measure
            a similar garment that already
            fits you well.
          </GuideBlock>

          <GuideBlock title="Exchange">
            If the selected size does not
            fit, exchange eligibility is
            subject to Lunehra's current
            exchange policy and stock
            availability.
          </GuideBlock>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

function GuideBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 8,
      }}
    >
      <h2
        className="heading-font"
        style={{
          fontSize: 20,
          fontWeight: 900,
        }}
      >
        {title}
      </h2>

      <p
        className="text-muted"
        style={{
          fontSize: 15,
          lineHeight: 1.75,
        }}
      >
        {children}
      </p>
    </div>
  );
}