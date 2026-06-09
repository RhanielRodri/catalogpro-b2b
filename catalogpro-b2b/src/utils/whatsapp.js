const WHATSAPP_NUMBER = "5527999999999";

export function buildWhatsAppMessage(formData, quoteItems) {
  const itemsText = quoteItems
    .map(
      (item) =>
        `${item.quantity}x ${item.nome} — SKU: ${item.sku} — ${item.unidade}`
    )
    .join("\n");

  return `Olá! Gostaria de solicitar um orçamento:

Nome: ${formData.nome}
Empresa: ${formData.empresa}
Telefone: ${formData.telefone}
E-mail: ${formData.email}

Itens:
${itemsText}

Observação:
${formData.observacao || "Sem observações."}`;
}

export function buildWhatsAppUrl(formData, quoteItems) {
  const message = buildWhatsAppMessage(formData, quoteItems);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
