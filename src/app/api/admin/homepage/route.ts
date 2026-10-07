import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { db } from "../../../../lib/db";
import { getCurrentAdmin } from "../../../../lib/admin-auth";
import {
  DEFAULT_HOMEPAGE_SECTIONS,
  HomepageSectionKey,
} from "../../../../lib/homepage-sections";

type IncomingSection = {
  key?: unknown;
  title?: unknown;
  subtitle?: unknown;
  isActive?: unknown;
  sortOrder?: unknown;
  config?: unknown;
};

const allowedKeys = new Set(
  DEFAULT_HOMEPAGE_SECTIONS.map(
    (section) => section.key
  )
);

function cleanText(
  value: unknown,
  maxLength = 300
) {
  return String(value ?? "")
    .trim()
    .slice(0, maxLength);
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
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const sections =
      Array.isArray(body?.sections)
        ? (body.sections as IncomingSection[])
        : [];

    if (sections.length === 0) {
      return NextResponse.json(
        {
          error:
            "No homepage sections supplied.",
        },
        {
          status: 400,
        }
      );
    }

    const normalized = sections.map(
      (section, index) => {
        const key = cleanText(
          section.key,
          100
        ) as HomepageSectionKey;

        if (!allowedKeys.has(key)) {
          throw new Error(
            `Invalid homepage section: ${key}`
          );
        }

        const configValue =
          section.config &&
          typeof section.config === "object" &&
          !Array.isArray(section.config)
            ? (section.config as Record<
                string,
                unknown
              >)
            : {};

        return {
          key,
          title: cleanText(
            section.title,
            250
          ),
          subtitle: cleanText(
            section.subtitle,
            500
          ),
          isActive:
            section.isActive !== false,
          sortOrder:
            (index + 1) * 10,

          config: {
            eyebrow: cleanText(
              configValue.eyebrow,
              120
            ),
            linkLabel: cleanText(
              configValue.linkLabel,
              120
            ),
            linkUrl: cleanText(
              configValue.linkUrl,
              300
            ),
          } satisfies Prisma.InputJsonObject,
        };
      }
    );

    await db.$transaction(
      normalized.map((section) =>
        db.homepageSection.upsert({
          where: {
            key: section.key,
          },

          create: {
            key: section.key,
            title:
              section.title || null,
            subtitle:
              section.subtitle || null,
            config:
              section.config,
            isActive:
              section.isActive,
            sortOrder:
              section.sortOrder,
          },

          update: {
            title:
              section.title || null,
            subtitle:
              section.subtitle || null,
            config:
              section.config,
            isActive:
              section.isActive,
            sortOrder:
              section.sortOrder,
          },
        })
      )
    );

    revalidatePath("/");
    revalidatePath(
      "/admin/homepage"
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Homepage settings update error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update homepage.",
      },
      {
        status: 500,
      }
    );
  }
}