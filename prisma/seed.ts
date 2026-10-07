import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString,
});

const db = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Starting Lunehra seed...");

  const categories = [
    {
      name: "Three Piece",
      slug: "three-piece",
      description:
        "Elegant and versatile three-piece collections for everyday wear and special occasions.",
      sortOrder: 1,
      isFeatured: true,
    },
    {
      name: "Kurti",
      slug: "kurti",
      description:
        "Modern and comfortable kurtis curated for effortless everyday style.",
      sortOrder: 2,
      isFeatured: true,
    },
    {
      name: "Gown",
      slug: "gown",
      description:
        "Graceful gowns designed for occasions, celebrations and elevated style.",
      sortOrder: 3,
      isFeatured: true,
    },
    {
      name: "Ladies Pant",
      slug: "ladies-pant",
      description:
        "Comfortable and versatile ladies pants for everyday styling.",
      sortOrder: 4,
      isFeatured: true,
    },
    {
      name: "Others",
      slug: "others",
      description:
        "Additional Lunehra fashion pieces and curated seasonal items.",
      sortOrder: 5,
      isFeatured: false,
    },
  ];

  for (const category of categories) {
    await db.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
        isFeatured: category.isFeatured,
        isActive: true,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        sortOrder: category.sortOrder,
        isFeatured: category.isFeatured,
        isActive: true,
      },
    });
  }

  const insideDhakaZone = await db.deliveryZone.findFirst({
    where: {
      name: "Inside Dhaka",
    },
  });

  if (insideDhakaZone) {
    await db.deliveryZone.update({
      where: {
        id: insideDhakaZone.id,
      },
      data: {
        charge: "80",
        districts: ["Dhaka"],
        minDays: 1,
        maxDays: 3,
        isActive: true,
      },
    });
  } else {
    await db.deliveryZone.create({
      data: {
        name: "Inside Dhaka",
        districts: ["Dhaka"],
        charge: "80",
        minDays: 1,
        maxDays: 3,
        isActive: true,
      },
    });
  }

  const outsideDhakaZone = await db.deliveryZone.findFirst({
    where: {
      name: "Outside Dhaka",
    },
  });

  if (outsideDhakaZone) {
    await db.deliveryZone.update({
      where: {
        id: outsideDhakaZone.id,
      },
      data: {
        charge: "150",
        districts: [],
        minDays: 2,
        maxDays: 5,
        isActive: true,
      },
    });
  } else {
    await db.deliveryZone.create({
      data: {
        name: "Outside Dhaka",
        districts: [],
        charge: "150",
        minDays: 2,
        maxDays: 5,
        isActive: true,
      },
    });
  }

  await db.siteSetting.upsert({
    where: {
      key: "store_name",
    },
    update: {
      value: "Lunehra",
      label: "Store Name",
      group: "general",
    },
    create: {
      key: "store_name",
      value: "Lunehra",
      label: "Store Name",
      group: "general",
    },
  });

  await db.siteSetting.upsert({
    where: {
      key: "currency",
    },
    update: {
      value: "BDT",
      label: "Currency",
      group: "general",
    },
    create: {
      key: "currency",
      value: "BDT",
      label: "Currency",
      group: "general",
    },
  });

  await db.siteSetting.upsert({
    where: {
      key: "inside_dhaka_delivery_charge",
    },
    update: {
      value: "80",
      label: "Inside Dhaka Delivery Charge",
      group: "shipping",
    },
    create: {
      key: "inside_dhaka_delivery_charge",
      value: "80",
      label: "Inside Dhaka Delivery Charge",
      group: "shipping",
    },
  });

  await db.siteSetting.upsert({
    where: {
      key: "outside_dhaka_delivery_charge",
    },
    update: {
      value: "150",
      label: "Outside Dhaka Delivery Charge",
      group: "shipping",
    },
    create: {
      key: "outside_dhaka_delivery_charge",
      value: "150",
      label: "Outside Dhaka Delivery Charge",
      group: "shipping",
    },
  });

  await db.siteSetting.upsert({
    where: {
      key: "inside_dhaka_exchange_fee",
    },
    update: {
      value: "100",
      label: "Inside Dhaka Exchange Fee",
      group: "exchange",
    },
    create: {
      key: "inside_dhaka_exchange_fee",
      value: "100",
      label: "Inside Dhaka Exchange Fee",
      group: "exchange",
    },
  });

  await db.siteSetting.upsert({
    where: {
      key: "outside_dhaka_exchange_fee",
    },
    update: {
      value: "180",
      label: "Outside Dhaka Exchange Fee",
      group: "exchange",
    },
    create: {
      key: "outside_dhaka_exchange_fee",
      value: "180",
      label: "Outside Dhaka Exchange Fee",
      group: "exchange",
    },
  });

  await db.siteSetting.upsert({
    where: {
      key: "exchange_window_days",
    },
    update: {
      value: "3",
      label: "Exchange Window Days",
      group: "exchange",
    },
    create: {
      key: "exchange_window_days",
      value: "3",
      label: "Exchange Window Days",
      group: "exchange",
    },
  });

  await db.siteSetting.upsert({
    where: {
      key: "cod_enabled",
    },
    update: {
      value: "true",
      label: "Cash on Delivery",
      group: "payment",
    },
    create: {
      key: "cod_enabled",
      value: "true",
      label: "Cash on Delivery",
      group: "payment",
    },
  });

  await db.siteSetting.upsert({
    where: {
      key: "bkash_enabled",
    },
    update: {
      value: "false",
      label: "bKash",
      group: "payment",
    },
    create: {
      key: "bkash_enabled",
      value: "false",
      label: "bKash",
      group: "payment",
    },
  });

  const adminEmail = "admin@lunehra.com";
  const adminPassword = "Lunehra@123";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await db.user.upsert({
    where: {
      email: adminEmail,
    },
    update: {
      name: "Lunehra Admin",
      role: "SUPER_ADMIN",
      isActive: true,
      passwordHash,
    },
    create: {
      name: "Lunehra Admin",
      email: adminEmail,
      role: "SUPER_ADMIN",
      isActive: true,
      passwordHash,
    },
  });

  console.log("");
  console.log("Lunehra seed completed successfully.");
  console.log("");
  console.log("Admin login:");
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error("Lunehra seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });