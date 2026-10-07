import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "../../../../lib/db";
import { getCurrentAdmin } from "../../../../lib/admin-auth";

type ChartColumn = {
  key: string;
  label: string;
};

type ChartRow =
  Record<string, string>;

function validateChart(
  body: unknown
) {
  if (
    !body ||
    typeof body !== "object"
  ) {
    return null;
  }

  const value =
    body as Record<
      string,
      unknown
    >;

  const name =
    String(
      value.name ?? ""
    ).trim();

  const description =
    String(
      value.description ?? ""
    ).trim();

  const unit =
    String(
      value.unit ?? "INCH"
    ).trim();

  const note =
    String(
      value.note ?? ""
    ).trim();

  const isActive =
    value.isActive !== false;

  const columns =
    Array.isArray(
      value.columns
    )
      ? (value.columns as ChartColumn[])
      : [];

  const rows =
    Array.isArray(value.rows)
      ? (value.rows as ChartRow[])
      : [];

  if (!name) return null;

  if (
    unit !== "INCH" &&
    unit !== "CM"
  ) {
    return null;
  }

  if (columns.length === 0) {
    return null;
  }

  if (
    !columns.some(
      (column) =>
        column.key === "size"
    )
  ) {
    return null;
  }

  if (
    columns.some(
      (column) =>
        !column.key ||
        !column.label?.trim()
    )
  ) {
    return null;
  }

  if (rows.length === 0) {
    return null;
  }

  if (
    rows.some(
      (row) =>
        !String(
          row.size ?? ""
        ).trim()
    )
  ) {
    return null;
  }

  return {
    name,
    description:
      description || null,
    unit,
    columns,
    rows,
    note: note || null,
    isActive,
  };
}

export async function POST(
  request: Request
) {
  try {
    const admin =
      await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const data =
      validateChart(body);

    if (!data) {
      return NextResponse.json(
        {
          error:
            "Invalid size chart data.",
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await db.sizeChart.findUnique({
        where: {
          name: data.name,
        },

        select: {
          id: true,
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "A size chart with this name already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const chart =
      await db.sizeChart.create({
        data: {
          name: data.name,
          description:
            data.description,
          unit: data.unit,
          columns:
            data.columns,
          rows: data.rows,
          note: data.note,
          isActive:
            data.isActive,
        },

        select: {
          id: true,
          name: true,
        },
      });

    revalidatePath(
      "/admin/size-charts"
    );

    revalidatePath(
      "/admin/products"
    );

    return NextResponse.json({
      success: true,
      chart,
    });
  } catch (error) {
    console.error(
      "Create size chart error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create size chart.",
      },
      {
        status: 500,
      }
    );
  }
}