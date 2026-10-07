import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "../../../../../lib/db";
import { getCurrentAdmin } from "../../../../../lib/admin-auth";

type RouteContext = {
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

function normalizeBody(
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

  if (
    columns.length === 0 ||
    rows.length === 0
  ) {
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
  request: Request,
  context: RouteContext
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

    const { id } =
      await context.params;

    const body =
      await request.json();

    const data =
      normalizeBody(body);

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

    const chart =
      await db.sizeChart.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
        },
      });

    if (!chart) {
      return NextResponse.json(
        {
          error:
            "Size chart not found.",
        },
        {
          status: 404,
        }
      );
    }

    const duplicate =
      await db.sizeChart.findFirst({
        where: {
          name: data.name,

          NOT: {
            id,
          },
        },

        select: {
          id: true,
        },
      });

    if (duplicate) {
      return NextResponse.json(
        {
          error:
            "Another size chart already uses this name.",
        },
        {
          status: 409,
        }
      );
    }

    await db.sizeChart.update({
      where: {
        id,
      },

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
    });

    revalidatePath(
      "/admin/size-charts"
    );

    revalidatePath(
      `/admin/size-charts/${id}`
    );

    revalidatePath(
      "/admin/products"
    );

    revalidatePath("/shop");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Update size chart error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update size chart.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
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

    const { id } =
      await context.params;

    const chart =
      await db.sizeChart.findUnique({
        where: {
          id,
        },

        select: {
          id: true,

          _count: {
            select: {
              products: true,
            },
          },
        },
      });

    if (!chart) {
      return NextResponse.json(
        {
          error:
            "Size chart not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      chart._count.products > 0
    ) {
      return NextResponse.json(
        {
          error:
            `This chart is used by ${chart._count.products} product(s). Remove those assignments before deleting it.`,
        },
        {
          status: 409,
        }
      );
    }

    await db.sizeChart.delete({
      where: {
        id,
      },
    });

    revalidatePath(
      "/admin/size-charts"
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Delete size chart error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete size chart.",
      },
      {
        status: 500,
      }
    );
  }
}