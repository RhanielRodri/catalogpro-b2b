import prisma from "../lib/prisma.js";

export async function listCategories(request, response) {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  return response.json(categories);
}
