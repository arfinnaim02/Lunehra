import { db } from "./db";

export async function getSizeChartOptions() {
  return db.sizeChart.findMany({
    orderBy: [
      { isActive: "desc" },
      { name: "asc" },
    ],
    select: {
      id: true,
      name: true,
      unit: true,
      isActive: true,
    },
  });
}

export async function getAdminSizeCharts() {
  return db.sizeChart.findMany({
    orderBy: [
      { updatedAt: "desc" },
      { name: "asc" },
    ],
    select: {
      id: true,
      name: true,
      description: true,
      unit: true,
      columns: true,
      rows: true,
      note: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,

      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}

export async function getAdminSizeChartById(id: string) {
  return db.sizeChart.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      name: true,
      description: true,
      unit: true,
      columns: true,
      rows: true,
      note: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,

      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}