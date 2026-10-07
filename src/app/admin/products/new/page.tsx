import * as CategoryLib from "../../../../lib/categories";
import { getSizeChartOptions } from "../../../../lib/size-charts";
import { ProductForm } from "../../../../components/admin/product-form";

export default async function NewProductPage() {
  const [
    categories,
    sizeCharts,
  ] = await Promise.all([
    CategoryLib.getCategories(),
    getSizeChartOptions(),
  ]);

  return (
    <main>
      <div
        style={{
          marginBottom: 20,
        }}
      >
        <h1 className="section-title">
          Add Product
        </h1>

        <p
          className="text-muted"
          style={{
            marginTop: 8,
          }}
        >
          Create a new product for
          Lunehra.
        </p>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-body">
          <ProductForm
            action="/api/admin/products"
            categories={
              categories
            }
            sizeCharts={
              sizeCharts
            }
            submitLabel="Save Product"
            initialValues={{
              name: "",
              slug: "",
              description: "",
              categoryId: "",
              collection: "",
              sizeChartId: "",
              basePrice: "",
              salePrice: "",
              status: "DRAFT",
              isFeatured: false,
              isHotDeal: false,
              isNewArrival: false,
              isBestSeller: false,
            }}
          />
        </div>
      </div>
    </main>
  );
}