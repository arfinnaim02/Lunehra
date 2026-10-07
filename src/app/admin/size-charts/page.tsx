import Link from "next/link";
import { getAdminSizeCharts } from "../../../lib/size-charts";

export default async function AdminSizeChartsPage() {
  const charts =
    await getAdminSizeCharts();

  return (
    <main>
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <div>
          <h1 className="section-title">
            Size Charts
          </h1>

          <p
            className="text-muted"
            style={{
              marginTop: 8,
            }}
          >
            Create reusable size guides
            for Lunehra products.
          </p>
        </div>

        <Link
          href="/admin/size-charts/new"
          className="btn-primary"
        >
          + Add Size Chart
        </Link>
      </div>

      <div className="dashboard-card">
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table className="order-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Unit</th>
                <th>Sizes</th>
                <th>Products</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {charts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: 28,
                      color:
                        "var(--muted)",
                    }}
                  >
                    No size charts
                    created yet.
                  </td>
                </tr>
              ) : (
                charts.map(
                  (chart) => {
                    const rows =
                      Array.isArray(
                        chart.rows
                      )
                        ? chart.rows
                        : [];

                    return (
                      <tr
                        key={
                          chart.id
                        }
                      >
                        <td>
                          <strong>
                            {
                              chart.name
                            }
                          </strong>
                        </td>

                        <td>
                          {chart.unit ===
                          "CM"
                            ? "CM"
                            : "Inches"}
                        </td>

                        <td>
                          {
                            rows.length
                          }
                        </td>

                        <td>
                          {
                            chart
                              ._count
                              .products
                          }
                        </td>

                        <td>
                          <span
                            className={
                              chart.isActive
                                ? "status-pill status-delivered"
                                : "status-pill status-cancelled"
                            }
                          >
                            {chart.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        <td>
                          {new Intl.DateTimeFormat(
                            "en-BD",
                            {
                              year:
                                "numeric",
                              month:
                                "short",
                              day:
                                "2-digit",
                            }
                          ).format(
                            chart.updatedAt
                          )}
                        </td>

                        <td>
                          <Link
                            href={`/admin/size-charts/${chart.id}`}
                            className="btn-secondary"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}