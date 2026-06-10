import prisma from "../lib/prisma.js";

const allowedStatuses = ["NEW", "IN_REVIEW", "ANSWERED", "CLOSED"];

function includeQuoteRelations() {
  return {
    items: {
      include: {
        product: {
          include: {
            category: true,
            brand: true
          }
        }
      }
    }
  };
}

function validateQuotePayload(payload) {
  const requiredFields = ["name", "company", "phone", "email"];
  const missingFields = requiredFields.filter((field) => !payload[field]?.trim());

  if (missingFields.length > 0) {
    return `Campos obrigatórios ausentes: ${missingFields.join(", ")}.`;
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return "A cotação precisa ter pelo menos um item.";
  }

  const hasInvalidItem = payload.items.some((item) => {
    return !Number.isInteger(Number(item.productId)) || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1;
  });

  if (hasInvalidItem) {
    return "Itens da cotação precisam ter productId e quantity válidos.";
  }

  return null;
}

export async function createQuote(request, response) {
  const validationError = validateQuotePayload(request.body);

  if (validationError) {
    return response.status(400).json({ message: validationError });
  }

  const productIds = request.body.items.map((item) => Number(item.productId));
  const existingProducts = await prisma.product.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  });

  if (existingProducts.length !== new Set(productIds).size) {
    return response.status(400).json({ message: "Um ou mais produtos não existem." });
  }

  const quote = await prisma.quoteRequest.create({
    data: {
      name: request.body.name.trim(),
      company: request.body.company.trim(),
      phone: request.body.phone.trim(),
      email: request.body.email.trim(),
      notes: request.body.notes?.trim() || null,
      status: "NEW",
      items: {
        create: request.body.items.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity)
        }))
      }
    },
    include: includeQuoteRelations()
  });

  return response.status(201).json(quote);
}

export async function listQuotes(request, response) {
  const quotes = await prisma.quoteRequest.findMany({
    include: includeQuoteRelations(),
    orderBy: {
      createdAt: "desc"
    }
  });

  return response.json(quotes);
}

export async function getQuoteById(request, response) {
  const quoteId = Number(request.params.id);

  if (!Number.isInteger(quoteId)) {
    return response.status(400).json({ message: "ID de cotação inválido." });
  }

  const quote = await prisma.quoteRequest.findUnique({
    where: {
      id: quoteId
    },
    include: includeQuoteRelations()
  });

  if (!quote) {
    return response.status(404).json({ message: "Cotação não encontrada." });
  }

  return response.json(quote);
}

export async function updateQuoteStatus(request, response) {
  const quoteId = Number(request.params.id);
  const status = typeof request.body.status === "string" ? request.body.status.trim() : "";

  if (!Number.isInteger(quoteId)) {
    return response.status(400).json({ message: "ID de cotação inválido." });
  }

  if (!allowedStatuses.includes(status)) {
    return response.status(400).json({
      message: `Status inválido. Use: ${allowedStatuses.join(", ")}.`
    });
  }

  try {
    const quote = await prisma.quoteRequest.update({
      where: {
        id: quoteId
      },
      data: {
        status
      },
      include: includeQuoteRelations()
    });

    return response.json(quote);
  } catch (error) {
    if (error.code === "P2025") {
      return response.status(404).json({ message: "Cotação não encontrada." });
    }

    throw error;
  }
}
