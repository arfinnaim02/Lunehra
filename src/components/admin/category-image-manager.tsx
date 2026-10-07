"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

type Props = {
  categoryId: string;
  categoryName: string;
  image: string | null;
  folder: string;
};

type UploadResultInfo = {
  secure_url?: string;
  public_id?: string;
};

export function CategoryImageManager({
  categoryId,
  categoryName,
  image,
  folder,
}: Props) {
  const router = useRouter();

  const [isSaving, setIsSaving] =
    useState(false);

  const [isRemoving, setIsRemoving] =
    useState(false);

  async function saveImage(
    info: UploadResultInfo
  ) {
    if (
      !info.secure_url ||
      !info.public_id
    ) {
      alert(
        "Cloudinary did not return a valid image."
      );
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/admin/categories/${categoryId}/image`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            image: info.secure_url,
            imagePublicId:
              info.public_id,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Failed to save category image"
        );
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save category image"
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function removeImage() {
    const confirmed =
      window.confirm(
        `Remove the image for "${categoryName}"?`
      );

    if (!confirmed) return;

    setIsRemoving(true);

    try {
      const response = await fetch(
        `/api/admin/categories/${categoryId}/image`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Failed to remove category image"
        );
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to remove category image"
      );
    } finally {
      setIsRemoving(false);
    }
  }

  const busy =
    isSaving || isRemoving;

  return (
    <div
      className="dashboard-card"
      style={{
        marginTop: 20,
      }}
    >
      <div className="dashboard-card-header">
        <div>
          <div className="dashboard-card-title">
            Category Image
          </div>

          <p
            className="text-muted"
            style={{
              marginTop: 6,
              fontSize: 13,
            }}
          >
            This image is used on the
            storefront category cards and
            category page.
          </p>
        </div>
      </div>

      <div
        className="dashboard-card-body"
        style={{
          display: "grid",
          gap: 20,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            aspectRatio: "4 / 5",
            borderRadius: 20,
            overflow: "hidden",
            background:
              "var(--surface-2)",
            border:
              "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {image ? (
            <img
              src={image}
              alt={categoryName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                padding: 24,
                textAlign: "center",
                color: "var(--muted)",
              }}
            >
              No category image uploaded
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <CldUploadWidget
            signatureEndpoint="/api/cloudinary/sign"
            options={{
              resourceType: "image",
              folder,
              sources: [
                "local",
                "url",
                "camera",
              ],
              multiple: false,
              maxFiles: 1,
              clientAllowedFormats: [
                "jpg",
                "jpeg",
                "png",
                "webp",
                "avif",
              ],
            }}
            onSuccess={(result) => {
              const info =
                result?.info as
                  | UploadResultInfo
                  | undefined;

              if (
                info?.secure_url &&
                info?.public_id
              ) {
                void saveImage(info);
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                className="btn-primary"
                disabled={busy}
                onClick={() => open()}
              >
                {isSaving
                  ? "Saving..."
                  : image
                    ? "Replace Image"
                    : "Upload Image"}
              </button>
            )}
          </CldUploadWidget>

          {image ? (
            <button
              type="button"
              className="btn-secondary"
              disabled={busy}
              onClick={removeImage}
              style={{
                color:
                  "var(--danger)",
                borderColor:
                  "rgba(255, 77, 79, 0.25)",
              }}
            >
              {isRemoving
                ? "Removing..."
                : "Remove Image"}
            </button>
          ) : null}
        </div>

        <div
          className="text-muted"
          style={{
            fontSize: 12,
            lineHeight: 1.7,
          }}
        >
          Recommended: use a clean
          portrait/lifestyle image with enough
          crop space. The storefront may crop
          the image depending on screen size.
        </div>
      </div>
    </div>
  );
}