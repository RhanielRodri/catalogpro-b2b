import prisma from "../lib/prisma.js";

function formatProduct(product) {
  return {
    ...product,
    specifications: JSON.parse(product.specifications)
  };
}

export async function listProducts(_request, response) {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      brand: true
    },
    orderBy: {
      name: "asc"
    }
  });

  return response.json(products.map(formatProduct));
}

export async function getProductById(request, response) {
  const productId = Number(request.params.id);

  if (!Number.isInteger(productId)) {
    return response.status(400).json({ message: "ID de produto inválido." });
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId
    },
    include: {
      category: true,
      brand: true
    }
  });

  if (!product) {
    return response.status(404).json({ message: "Produto não encontrado." });
  }

  return response.json(formatProduct(product));
}
