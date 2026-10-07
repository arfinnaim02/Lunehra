import { SizeChartForm } from "../../../../components/admin/size-chart-form";

export default function NewSizeChartPage() {
  return (
    <main>
      <div
        style={{
          marginBottom: 20,
        }}
      >
        <h1 className="section-title">
          Add Size Chart
        </h1>

        <p
          className="text-muted"
          style={{
            marginTop: 8,
          }}
        >
          Create a reusable product
          measurement guide.
        </p>
      </div>

      <SizeChartForm mode="create" />
    </main>
  );
}