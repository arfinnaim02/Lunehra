type ProductFormValues = {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  collection: string;
  basePrice: string;
  salePrice: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  isFeatured: boolean;
  isHotDeal: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
};

type ProductFormProps = {
  action: string;
  categories: { id: string; name: string }[];
  initialValues: ProductFormValues;
  submitLabel: string;
};

export function ProductForm({
  action,
  categories,
  initialValues,
  submitLabel,
}: ProductFormProps) {
  return (
    <form
      action={action}
      method="POST"
      style={{
        display: "grid",
        gap: 16,
        maxWidth: 760,
      }}
    >
      <div style={{ display: "grid", gap: 8 }}>
        <label>Product Name</label>
        <input
          name="name"
          defaultValue={initialValues.name}
          placeholder="Premium Embroidered Three Piece"
          required
        />
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <label>Slug</label>
        <input
          name="slug"
          defaultValue={initialValues.slug}
          placeholder="premium-embroidered-three-piece"
          required
        />
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <label>Description</label>
        <textarea
          name="description"
          rows={6}
          defaultValue={initialValues.description}
          placeholder="Write the full product description..."
          required
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <label>Category</label>
          <select
            name="categoryId"
            required
            defaultValue={initialValues.categoryId}
          >
            <option value="" disabled>
              Select category
            </option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label>Collection</label>
          <input
            name="collection"
            defaultValue={initialValues.collection}
            placeholder="Eid Collection"
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <label>Regular Price (৳)</label>
          <input
            name="basePrice"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initialValues.basePrice}
            placeholder="2850"
            required
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label>Sale Price (৳)</label>
          <input
            name="salePrice"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initialValues.salePrice}
            placeholder="2490"
          />
        </div>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <label>Status</label>
        <select name="status" defaultValue={initialValues.status}>
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <label>
          <input
            type="checkbox"
            name="isFeatured"
            value="true"
            defaultChecked={initialValues.isFeatured}
          />{" "}
          Featured
        </label>

        <label>
          <input
            type="checkbox"
            name="isHotDeal"
            value="true"
            defaultChecked={initialValues.isHotDeal}
          />{" "}
          Hot Deal
        </label>

        <label>
          <input
            type="checkbox"
            name="isNewArrival"
            value="true"
            defaultChecked={initialValues.isNewArrival}
          />{" "}
          New Arrival
        </label>

        <label>
          <input
            type="checkbox"
            name="isBestSeller"
            value="true"
            defaultChecked={initialValues.isBestSeller}
          />{" "}
          Best Seller
        </label>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>

        <a href="/admin/products" className="btn-secondary">
          Cancel
        </a>
      </div>
    </form>
  );
}