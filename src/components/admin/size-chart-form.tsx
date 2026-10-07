"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ChartColumn = {
  key: string;
  label: string;
};

type ChartRow = Record<string, string>;

type SizeChartFormProps = {
  mode: "create" | "edit";
  chartId?: string;

  initialValues?: {
    name: string;
    description: string;
    unit: string;
    columns: ChartColumn[];
    rows: ChartRow[];
    note: string;
    isActive: boolean;
  };
};

const defaultColumns: ChartColumn[] = [
  {
    key: "size",
    label: "Size",
  },
  {
    key: "bust",
    label: "Bust",
  },
  {
    key: "length",
    label: "Length",
  },
];

const defaultRows: ChartRow[] = [
  {
    size: "S",
    bust: "",
    length: "",
  },
];

function makeColumnKey() {
  return `field_${Date.now()}`;
}

export function SizeChartForm({
  mode,
  chartId,
  initialValues,
}: SizeChartFormProps) {
  const router = useRouter();

  const [name, setName] = useState(
    initialValues?.name ?? ""
  );

  const [description, setDescription] =
    useState(
      initialValues?.description ?? ""
    );

  const [unit, setUnit] = useState(
    initialValues?.unit ?? "INCH"
  );

  const [columns, setColumns] = useState<
    ChartColumn[]
  >(
    initialValues?.columns?.length
      ? initialValues.columns
      : defaultColumns
  );

  const [rows, setRows] = useState<
    ChartRow[]
  >(
    initialValues?.rows?.length
      ? initialValues.rows
      : defaultRows
  );

  const [note, setNote] = useState(
    initialValues?.note ?? ""
  );

  const [isActive, setIsActive] =
    useState(
      initialValues?.isActive ?? true
    );

  const [isSaving, setIsSaving] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  function addColumn() {
    const key = makeColumnKey();

    setColumns((current) => [
      ...current,
      {
        key,
        label: "New Measurement",
      },
    ]);

    setRows((current) =>
      current.map((row) => ({
        ...row,
        [key]: "",
      }))
    );
  }

  function updateColumnLabel(
    index: number,
    label: string
  ) {
    setColumns((current) =>
      current.map((column, columnIndex) =>
        columnIndex === index
          ? {
              ...column,
              label,
            }
          : column
      )
    );
  }

  function removeColumn(index: number) {
    const column = columns[index];

    if (!column) return;

    if (column.key === "size") {
      alert(
        "The Size column cannot be removed."
      );

      return;
    }

    setColumns((current) =>
      current.filter(
        (_, columnIndex) =>
          columnIndex !== index
      )
    );

    setRows((current) =>
      current.map((row) => {
        const next = {
          ...row,
        };

        delete next[column.key];

        return next;
      })
    );
  }

  function addRow() {
    const row: ChartRow = {};

    columns.forEach((column) => {
      row[column.key] = "";
    });

    setRows((current) => [
      ...current,
      row,
    ]);
  }

  function removeRow(index: number) {
    setRows((current) =>
      current.filter(
        (_, rowIndex) =>
          rowIndex !== index
      )
    );
  }

  function updateCell(
    rowIndex: number,
    key: string,
    value: string
  ) {
    setRows((current) =>
      current.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              [key]: value,
            }
          : row
      )
    );
  }

  async function submit() {
    if (!name.trim()) {
      alert("Chart name is required.");
      return;
    }

    if (columns.length === 0) {
      alert(
        "Add at least one column."
      );

      return;
    }

    if (rows.length === 0) {
      alert(
        "Add at least one size row."
      );

      return;
    }

    const emptyLabel =
      columns.some(
        (column) =>
          !column.label.trim()
      );

    if (emptyLabel) {
      alert(
        "Every column needs a name."
      );

      return;
    }

    const missingSize =
      rows.some(
        (row) =>
          !String(
            row.size ?? ""
          ).trim()
      );

    if (missingSize) {
      alert(
        "Every row needs a size value."
      );

      return;
    }

    setIsSaving(true);

    try {
      const url =
        mode === "create"
          ? "/api/admin/size-charts"
          : `/api/admin/size-charts/${chartId}`;

      const response =
        await fetch(url, {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            description:
              description.trim(),
            unit,
            columns,
            rows,
            note: note.trim(),
            isActive,
          }),
        });

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Failed to save size chart"
        );
      }

      router.push(
        "/admin/size-charts"
      );

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save size chart"
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteChart() {
    if (
      mode !== "edit" ||
      !chartId
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Delete this size chart? This cannot be undone."
      );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response =
        await fetch(
          `/api/admin/size-charts/${chartId}`,
          {
            method: "DELETE",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Failed to delete size chart"
        );
      }

      router.push(
        "/admin/size-charts"
      );

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete size chart"
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div
      style={{
        display: "grid",
        gap: 22,
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 16,
          maxWidth: 900,
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 8,
          }}
        >
          <label>
            Chart Name
          </label>

          <input
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            placeholder="Kurti Regular Fit"
          />
        </div>

        <div
          style={{
            display: "grid",
            gap: 8,
          }}
        >
          <label>
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            rows={3}
            placeholder="Regular fit women's kurti measurements."
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "grid",
              gap: 8,
            }}
          >
            <label>
              Measurement Unit
            </label>

            <select
              value={unit}
              onChange={(event) =>
                setUnit(
                  event.target.value
                )
              }
            >
              <option value="INCH">
                Inches
              </option>

              <option value="CM">
                Centimeters
              </option>
            </select>
          </div>

          <div
            style={{
              display: "flex",
              alignItems:
                "flex-end",
              paddingBottom: 8,
            }}
          >
            <label>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) =>
                  setIsActive(
                    event.target
                      .checked
                  )
                }
              />{" "}
              Active
            </label>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div>
            <div className="dashboard-card-title">
              Measurement Columns
            </div>

            <p
              className="text-muted"
              style={{
                marginTop: 5,
              }}
            >
              Add only the measurements
              required by this garment.
            </p>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={addColumn}
          >
            + Add Column
          </button>
        </div>

        <div
          className="dashboard-card-body"
          style={{
            display: "grid",
            gap: 10,
          }}
        >
          {columns.map(
            (column, index) => (
              <div
                key={column.key}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr auto",
                  gap: 10,
                }}
              >
                <input
                  value={column.label}
                  disabled={
                    column.key ===
                    "size"
                  }
                  onChange={(event) =>
                    updateColumnLabel(
                      index,
                      event.target
                        .value
                    )
                  }
                />

                <button
                  type="button"
                  className="btn-secondary"
                  disabled={
                    column.key ===
                    "size"
                  }
                  onClick={() =>
                    removeColumn(
                      index
                    )
                  }
                >
                  Remove
                </button>
              </div>
            )
          )}
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div>
            <div className="dashboard-card-title">
              Size Measurements
            </div>

            <p
              className="text-muted"
              style={{
                marginTop: 5,
              }}
            >
              One row represents one
              customer-selectable size.
            </p>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={addRow}
          >
            + Add Size
          </button>
        </div>

        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table className="order-table">
            <thead>
              <tr>
                {columns.map(
                  (column) => (
                    <th
                      key={
                        column.key
                      }
                    >
                      {column.label}
                    </th>
                  )
                )}

                <th>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map(
                (row, rowIndex) => (
                  <tr
                    key={rowIndex}
                  >
                    {columns.map(
                      (column) => (
                        <td
                          key={
                            column.key
                          }
                        >
                          <input
                            value={
                              row[
                                column
                                  .key
                              ] ?? ""
                            }
                            onChange={(
                              event
                            ) =>
                              updateCell(
                                rowIndex,
                                column.key,
                                event
                                  .target
                                  .value
                              )
                            }
                            placeholder={
                              column.key ===
                              "size"
                                ? "M"
                                : "38"
                            }
                            style={{
                              minWidth:
                                110,
                            }}
                          />
                        </td>
                      )
                    )}

                    <td>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() =>
                          removeRow(
                            rowIndex
                          )
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: 8,
          maxWidth: 900,
        }}
      >
        <label>
          Customer Note
        </label>

        <textarea
          value={note}
          onChange={(event) =>
            setNote(
              event.target.value
            )
          }
          rows={3}
          placeholder="Measurements may vary by 0.5–1 inch due to manual measurement."
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          className="btn-primary"
          disabled={isSaving}
          onClick={submit}
        >
          {isSaving
            ? "Saving..."
            : mode === "create"
              ? "Create Size Chart"
              : "Update Size Chart"}
        </button>

        <a
          href="/admin/size-charts"
          className="btn-secondary"
        >
          Cancel
        </a>

        {mode === "edit" ? (
          <button
            type="button"
            className="btn-secondary"
            disabled={
              isDeleting
            }
            onClick={
              deleteChart
            }
            style={{
              color:
                "var(--danger)",
              borderColor:
                "rgba(255,77,79,0.28)",
            }}
          >
            {isDeleting
              ? "Deleting..."
              : "Delete Chart"}
          </button>
        ) : null}
      </div>
    </div>
  );
}