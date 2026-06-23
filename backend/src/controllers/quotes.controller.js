import prisma from "../lib/prisma.js";

const allowedStatuses = ["NEW", "IN_REVIEW", "ANSWERED", "CLOSED"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rateMap = new Map();
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX_PER_WINDOW = 5;

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  return forwarded ? forwarded.split(",")[0].trim() : (req.ip || "unknown");
}

function isRateLimited(ip) {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;
  const timestamps = (rateMap.get(ip) || []).filter((ts) => ts > cutoff);

  if (timestamps.length >= RATE_MAX_PER_WINDOW) {
    rateMap.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  rateMap.set(ip, timestamps);
  return false;
}

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
  const { name, company, phone, email, notes, items } = payload;

  if (!name?.trim() || !company?.trim() || !phone?.trim() || !email?.trim()) {
    return "Campos obrigatórios ausentes: nome, empresa, telefone e e-mail.";
  }

  if (name.trim().length > 100) return "Nome muito longo (máx. 100 caracteres).";
  if (company.trim().length > 100) return "Empresa muito longa (máx. 100 caracteres).";
  if (phone.trim().length > 30) return "Telefone inválido.";
  if (email.trim().length > 150) return "E-mail inválido.";
  if (!EMAIL_REGEX.test(email.trim())) return "Formato de e-mail inválido.";
  if (notes && notes.trim().length > 500) return "Observação muito longa (máx. 500 caracteres).";

  if (!Array.isArray(items) || items.length === 0) {
    return "A cotação precisa ter pelo menos um item.";
  }

  if (items.length > 50) {
    return "Número máximo de itens por cotação é 50.";
  }

  const hasInvalidItem = items.some((item) => {
    const qty = Number(item.quantity);
    return !Number.isInteger(Number(item.productId)) || !Number.isInteger(qty) || qty < 1 || qty > 9999;
  });

  if (hasInvalidItem) {
    return "Itens precisam ter productId válido e quantidade entre 1 e 9999.";
  }

  return null;
}

export async function createQuote(request, response) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return response.status(429).json({
      message: "Muitas solicitações. Aguarde um minuto antes de tentar novamente."
    });
  }

  const validationError = validateQuotePayload(request.body);

  if (validationError) {
    return response.status(400).json({ message: validationError });
  }

  const productIds = request.body.items.map((item) => Number(item.productId));
  const existingProducts = await prisma.product.findMany({
    where: { id: { in: productIds } }
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

export async function listQuotes(_request, response) {
  const quotes = await prisma.quoteRequest.findMany({
    include: includeQuoteRelations(),
    orderBy: { createdAt: "desc" }
  });

  return response.json(quotes);
}

export async function getQuoteById(request, response) {
  const quoteId = Number(request.params.id);

  if (!Number.isInteger(quoteId) || quoteId < 1) {
    return response.status(400).json({ message: "ID de cotação inválido." });
  }

  const quote = await prisma.quoteRequest.findUnique({
    where: { id: quoteId },
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

  if (!Number.isInteger(quoteId) || quoteId < 1) {
    return response.status(400).json({ message: "ID de cotação inválido." });
  }

  if (!allowedStatuses.includes(status)) {
    return response.status(400).json({
      message: `Status inválido. Use: ${allowedStatuses.join(", ")}.`
    });
  }

  try {
    const quote = await prisma.quoteRequest.update({
      where: { id: quoteId },
      data: { status },
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
