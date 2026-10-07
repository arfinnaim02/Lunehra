import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "../../../../../../lib/db";
import { cloudinary } from "../../../../../../lib/cloudinary";
import { getCurrentAdmin } from "../../../../../../lib/admin-auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function isAllowedCloudinaryUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      url.hostname === "res.cloudinary.com"
    );
  } catch {
    return false;
  }
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const image = String(body?.image || "").trim();
    const imagePublicId = String(
      body?.imagePublicId || ""
    ).trim();

    if (!image || !imagePublicId) {
      return NextResponse.json(
        {
          error:
            "Image URL and Cloudinary public ID are required.",
        },
        { status: 400 }
      );
    }

    if (!isAllowedCloudinaryUrl(image)) {
      return NextResponse.json(
        {
          error: "Invalid Cloudinary image URL.",
        },
        { status: 400 }
      );
    }

    const category = await db.category.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        slug: true,
        image: true,
        imagePublicId: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const oldPublicId = category.imagePublicId;

    await db.category.update({
      where: {
        id,
      },
      data: {
        image,
        imagePublicId,
      },
    });

    if (
      oldPublicId &&
      oldPublicId !== imagePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(
          oldPublicId,
          {
            resource_type: "image",
            invalidate: true,
          }
        );
      } catch (cloudinaryError) {
        console.error(
          "Failed to remove old category image from Cloudinary:",
          cloudinaryError
        );
      }
    }

    revalidatePath("/admin/categories");
    revalidatePath(`/admin/categories/${id}`);
    revalidatePath(`/category/${category.slug}`);
    revalidatePath("/shop");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      image,
      imagePublicId,
    });
  } catch (error) {
    console.error(
      "Update category image error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update category image",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const category = await db.category.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        slug: true,
        image: true,
        imagePublicId: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const oldPublicId = category.imagePublicId;

    await db.category.update({
      where: {
        id,
      },
      data: {
        image: null,
        imagePublicId: null,
      },
    });

    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(
          oldPublicId,
          {
            resource_type: "image",
            invalidate: true,
          }
        );
      } catch (cloudinaryError) {
        console.error(
          "Failed to remove category image from Cloudinary:",
          cloudinaryError
        );
      }
    }

    revalidatePath("/admin/categories");
    revalidatePath(`/admin/categories/${id}`);
    revalidatePath(`/category/${category.slug}`);
    revalidatePath("/shop");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Delete category image error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to remove category image",
      },
      { status: 500 }
    );
  }
}