import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <Link href="/" className="site-logo">
              LUNEHRA
            </Link>

            <p className="site-footer-text">
              A premium Bangladesh-based destination for women&apos;s fashion,
              thoughtfully curated clothing and timeless everyday style.
            </p>
          </div>

          <FooterColumn
            title="Shop"
            links={[
              ["Shop All", "/shop"],
              ["New Arrivals", "/collections/new-arrivals"],
              ["Collections", "/collections"],
              ["Best Sellers", "/collections/best-sellers"],
            ]}
          />

          <FooterColumn
            title="Help"
            links={[
              ["Track Order", "/track-order"],
              ["Size Guide", "/help/size-guide"],
              ["FAQ", "/help/faq"],
              ["Contact Us", "/help/contact"],
            ]}
          />

          <FooterColumn
            title="Policies"
            links={[
              ["Delivery Policy", "/policies/shipping"],
              ["Return Policy", "/policies/returns"],
              ["Exchange Policy", "/policies/exchange"],
              ["Privacy Policy", "/policies/privacy"],
              ["Terms & Conditions", "/policies/terms"],
            ]}
          />

          <FooterColumn
            title="Contact"
            links={[
              ["Customer Support", "/help/contact"],
              ["WhatsApp Support", "/help/contact"],
              ["Dhaka, Bangladesh", "/help/contact"],
            ]}
          />
        </div>

        <div className="site-footer-bottom">
          <p>© 2026 Lunehra. All rights reserved.</p>

          <div className="site-footer-payments">
            {["Cash on Delivery", "bKash Coming Soon"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div className="site-footer-column">
      <h4>{title}</h4>

      <div className="site-footer-links">
        {links.map(([label, href]) => (
          <Link key={label} href={href}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}