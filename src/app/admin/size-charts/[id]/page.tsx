import { notFound } from "next/navigation";
import { getAdminSizeChartById } from "../../../../lib/size-charts";
import { SizeChartForm } from "../../../../components/admin/size-chart-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ChartColumn = {
  key: string;
  label: string;
};

type ChartRow =
  Record<string, string>;

export default async function EditSizeChartPage({
  params,
}: PageProps) {
  const { id } = await params;

  const chart =
    await getAdminSizeChartById(
      id
    );

  if (!chart) {
    notFound();
  }

  const columns =
    Array.isArray(
      chart.columns
    )
      ? (chart.columns as unknown as ChartColumn[])
      : [];

  const rows =
    Array.isArray(chart.rows)
      ? (chart.rows as unknown as ChartRow[])
      : [];

  return (
    <main>
      <div
        style={{
          marginBottom: 20,
        }}
      >
        <h1 className="section-title">
          Edit Size Chart
        </h1>

        <p
          className="text-muted"
          style={{
            marginTop: 8,
          }}
        >
          Used by{" "}
          {chart._count.products}{" "}
          product(s).
        </p>
      </div>

      <SizeChartForm
        mode="edit"
        chartId={chart.id}
        initialValues={{
          name: chart.name,
          description:
            chart.description ??
            "",
          unit: chart.unit,
          columns,
          rows,
          note:
            chart.note ?? "",
          isActive:
            chart.isActive,
        }}
      />
    </main>
  );
}