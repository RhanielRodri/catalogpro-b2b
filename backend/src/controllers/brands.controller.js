import prisma from "../lib/prisma.js";

export async function listBrands(request, response) {
  const brands = await prisma.brand.findMany({
    orderBy: {
      name: "asc"
    }
  });

  return response.json(brands);
}
