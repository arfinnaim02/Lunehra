import { HomepageManager } from "../../../components/admin/homepage-manager";
import { getHomepageSections } from "../../../lib/homepage-sections";

export default async function AdminHomepagePage() {
  const sections =
    await getHomepageSections();

  return (
    <main>
      <div
        style={{
          marginBottom: 20,
        }}
      >
        <h1 className="section-title">
          Homepage Management
        </h1>

        <p
          className="text-muted"
          style={{
            marginTop: 8,
            maxWidth: 760,
            lineHeight: 1.7,
          }}
        >
          Control homepage sections,
          titles, visibility and order.
          Product and category content is
          managed from its dedicated admin
          pages.
        </p>
      </div>

      <HomepageManager
        initialSections={
          sections
        }
      />
    </main>
  );
}