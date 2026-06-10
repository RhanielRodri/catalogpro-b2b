import prisma from "../src/lib/prisma.js";

const categories = [
  { name: "Papelaria", slug: "papelaria" },
  { name: "EPIs", slug: "epis" },
  { name: "Limpeza", slug: "limpeza" },
  { name: "Descartáveis", slug: "descartaveis" },
  { name: "Móveis", slug: "moveis" },
  { name: "Tecnologia", slug: "tecnologia" }
];

const brands = [
  { name: "OfficeMax Pro", slug: "officemax-pro" },
  { name: "SafeWork", slug: "safework" },
  { name: "CleanCorp", slug: "cleancorp" },
  { name: "PackLine", slug: "packline" },
  { name: "ErgoFlex", slug: "ergoflex" },
  { name: "TechSupply", slug: "techsupply" }
];

const products = [
  ["Papel Sulfite A4 75g", "PAP-A4-001", "Papelaria", "OfficeMax Pro", "Papel branco para impressões corporativas de alto volume.", "Papel sulfite A4 75g com ótimo acabamento para documentos, relatórios, contratos e rotinas administrativas.", "PAP", ["Formato A4", "Gramatura 75g", "Alta brancura", "Uso em impressoras laser e jato de tinta"], "Caixa com 10 resmas", "Disponível para cotação"],
  ["Caneta Esferográfica Azul", "PAP-CAN-002", "Papelaria", "OfficeMax Pro", "Caneta azul de escrita macia para uso diário.", "Caneta esferográfica com corpo transparente, ponta média e tinta de secagem rápida para escritórios e recepções.", "CAN", ["Tinta azul", "Ponta 1.0 mm", "Corpo transparente", "Tampa ventilada"], "Caixa com 50 unidades", "Disponível para cotação"],
  ["Pasta Registradora A-Z", "PAP-AZ-003", "Papelaria", "OfficeMax Pro", "Pasta resistente para arquivamento fiscal e administrativo.", "Pasta A-Z com ferragem reforçada, visor de identificação e revestimento durável para arquivos corporativos.", "A-Z", ["Lombo largo", "Ferragem niquelada", "Visor lateral", "Capa rígida"], "Pacote com 20 unidades", "Sob consulta"],
  ["Bloco Adesivo Reposicionável", "PAP-BLO-004", "Papelaria", "OfficeMax Pro", "Blocos adesivos para avisos, reuniões e organização visual.", "Blocos adesivos coloridos com cola reposicionável, ideais para equipes administrativas, salas de reunião e planejamento.", "NOT", ["76 x 76 mm", "Cores sortidas", "100 folhas por bloco", "Cola reposicionável"], "Pacote com 12 blocos", "Disponível para cotação"],
  ["Luva de Segurança Nitrílica", "EPI-LUV-005", "EPIs", "SafeWork", "Luva nitrílica para proteção em rotinas operacionais.", "Luva de segurança nitrílica sem pó, indicada para manuseio, limpeza técnica e atividades que exigem proteção das mãos.", "EPI", ["Sem pó", "Textura antiderrapante", "Ambidestra", "Tamanhos P, M, G e GG"], "Caixa com 100 unidades", "Disponível para cotação"],
  ["Óculos de Proteção Transparente", "EPI-OCU-006", "EPIs", "SafeWork", "Óculos leve para proteção contra partículas.", "Óculos de segurança com lente transparente, hastes ajustáveis e proteção lateral para ambientes industriais e manutenção.", "OCL", ["Lente em policarbonato", "Proteção lateral", "Hastes ajustáveis", "Tratamento antirrisco"], "Pacote com 25 unidades", "Disponível para cotação"],
  ["Protetor Auricular Plug", "EPI-AUR-007", "EPIs", "SafeWork", "Proteção auditiva para áreas com ruído moderado.", "Protetor auricular tipo plug em silicone, com cordão e estojo individual para controle e higiene.", "AUD", ["Silicone flexível", "Com cordão", "Estojo individual", "Reutilizável"], "Pacote com 50 unidades", "Sob consulta"],
  ["Capacete de Segurança Branco", "EPI-CAP-008", "EPIs", "SafeWork", "Capacete com ajuste para equipes técnicas e operação.", "Capacete de segurança com carneira ajustável, aba frontal e estrutura leve para uso prolongado.", "CAP", ["Classe B", "Carneira ajustável", "Aba frontal", "Cor branca"], "Unidade", "Disponível para cotação"],
  ["Detergente Neutro Profissional", "LIM-DET-009", "Limpeza", "CleanCorp", "Detergente concentrado para copas e áreas comuns.", "Detergente neutro profissional com alto rendimento para limpeza de utensílios, bancadas e superfícies laváveis.", "DET", ["pH neutro", "Alto rendimento", "Fragrância suave", "Uso profissional"], "Galão de 5 litros", "Disponível para cotação"],
  ["Desinfetante Lavanda", "LIM-DES-010", "Limpeza", "CleanCorp", "Desinfetante para pisos e áreas de circulação.", "Desinfetante com fragrância lavanda, indicado para limpeza recorrente de escritórios, recepções e banheiros.", "DES", ["Fragrância lavanda", "Ação bactericida", "Uso em pisos", "Rendimento profissional"], "Caixa com 4 galões de 5 litros", "Disponível para cotação"],
  ["Pano Multiuso", "LIM-PAN-011", "Limpeza", "CleanCorp", "Pano descartável para limpeza rápida e higiênica.", "Pano multiuso com boa absorção, indicado para higienização de superfícies em ambientes corporativos.", "PAN", ["Picotado", "Alta absorção", "Baixo desprendimento de fibras", "Uso geral"], "Rolo com 300 metros", "Sob consulta"],
  ["Lixeira Coleta Seletiva", "LIM-LIX-012", "Limpeza", "CleanCorp", "Conjunto para organização de resíduos em empresas.", "Lixeira para coleta seletiva com identificação por cores, ideal para escritórios, escolas e áreas comuns.", "LIX", ["Capacidade 50 litros", "Tampa vai e vem", "Cores padronizadas", "Material resistente"], "Conjunto com 4 unidades", "Disponível para cotação"],
  ["Copo Descartável 180 ml", "DES-COP-013", "Descartáveis", "PackLine", "Copo para água em copas, eventos e recepções.", "Copo descartável branco de 180 ml para consumo de água em ambientes corporativos de grande circulação.", "COP", ["180 ml", "Material PP", "Cor branca", "Empilhável"], "Caixa com 2.500 unidades", "Disponível para cotação"],
  ["Prato Descartável Reforçado", "DES-PRA-014", "Descartáveis", "PackLine", "Prato descartável para refeitórios e eventos internos.", "Prato descartável reforçado com boa rigidez, indicado para ações corporativas, treinamentos e coffee breaks.", "PRA", ["21 cm", "Branco", "Reforçado", "Uso alimentício"], "Pacote com 500 unidades", "Sob consulta"],
  ["Talher Descartável Premium", "DES-TAL-015", "Descartáveis", "PackLine", "Talheres descartáveis resistentes para uso corporativo.", "Kit de talheres descartáveis com garfo, faca e colher, adequado para refeições em eventos e rotinas internas.", "TAL", ["Material reforçado", "Cor cristal", "Garfo, faca e colher", "Uso alimentício"], "Caixa com 1.000 peças", "Disponível para cotação"],
  ["Embalagem Kraft para Lanche", "DES-KRA-016", "Descartáveis", "PackLine", "Embalagem prática para lanches e kits corporativos.", "Embalagem kraft com fechamento seguro, usada em eventos, treinamentos e ações de endomarketing.", "KFT", ["Papel kraft", "Fechamento prático", "Contato alimentício", "Visual neutro"], "Pacote com 200 unidades", "Disponível para cotação"],
  ["Cadeira Operacional Ergonômica", "MOV-CAD-017", "Móveis", "ErgoFlex", "Cadeira ergonômica para estações de trabalho.", "Cadeira operacional com regulagem de altura, apoio lombar e rodízios para uso diário em escritórios.", "CAD", ["Regulagem de altura", "Apoio lombar", "Base com rodízios", "Assento estofado"], "Unidade", "Disponível para cotação"],
  ["Mesa Corporativa 120 cm", "MOV-MES-018", "Móveis", "ErgoFlex", "Mesa reta para escritórios e salas administrativas.", "Mesa corporativa com tampo resistente, estrutura metálica e dimensões adequadas para estações individuais.", "MES", ["120 x 60 cm", "Tampo BP", "Estrutura metálica", "Passagem para cabos"], "Unidade", "Sob consulta"],
  ["Armário Baixo Escritório", "MOV-ARM-019", "Móveis", "ErgoFlex", "Armário para documentos, materiais e apoio administrativo.", "Armário baixo com portas, prateleira interna e acabamento corporativo para organização de setores.", "ARM", ["2 portas", "Prateleira interna", "Fechadura", "Acabamento cinza"], "Unidade", "Disponível para cotação"],
  ["Gaveteiro Volante", "MOV-GAV-020", "Móveis", "ErgoFlex", "Gaveteiro móvel para estações administrativas.", "Gaveteiro volante com rodízios, três gavetas e fechamento por chave para documentos e itens pessoais.", "GAV", ["3 gavetas", "Com chave", "Rodízios", "Acabamento corporativo"], "Unidade", "Disponível para cotação"],
  ["Mouse Sem Fio Corporativo", "TEC-MOU-021", "Tecnologia", "TechSupply", "Mouse sem fio para estações de trabalho.", "Mouse sem fio com conexão USB, boa autonomia e design confortável para equipes administrativas.", "MOU", ["Conexão 2.4 GHz", "Receptor USB", "Sensor óptico", "Design ambidestro"], "Unidade", "Disponível para cotação"],
  ["Teclado USB Padrão ABNT2", "TEC-TEC-022", "Tecnologia", "TechSupply", "Teclado com layout brasileiro para uso corporativo.", "Teclado USB ABNT2 com teclas silenciosas, estrutura resistente e instalação plug and play.", "KEY", ["Layout ABNT2", "Conexão USB", "Teclas silenciosas", "Plug and play"], "Unidade", "Disponível para cotação"],
  ["Headset Atendimento USB", "TEC-HEA-023", "Tecnologia", "TechSupply", "Headset para atendimento, reuniões e suporte.", "Headset USB com microfone ajustável e controle no cabo, indicado para atendimento comercial e reuniões online.", "HDS", ["Conexão USB", "Microfone ajustável", "Controle no cabo", "Espuma confortável"], "Unidade", "Sob consulta"],
  ["Filtro de Linha 6 Tomadas", "TEC-FIL-024", "Tecnologia", "TechSupply", "Filtro de linha para organização elétrica em escritórios.", "Filtro de linha com seis tomadas, chave liga/desliga e proteção básica para estações corporativas.", "FLT", ["6 tomadas", "Cabo 1,5 m", "Chave liga/desliga", "Bivolt"], "Unidade", "Disponível para cotação"]
];

async function main() {
  await prisma.quoteItem.deleteMany();
  await prisma.quoteRequest.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.$executeRawUnsafe("DELETE FROM sqlite_sequence");

  const categoryMap = new Map();
  const brandMap = new Map();

  for (const category of categories) {
    const createdCategory = await prisma.category.create({ data: category });
    categoryMap.set(createdCategory.name, createdCategory);
  }

  for (const brand of brands) {
    const createdBrand = await prisma.brand.create({ data: brand });
    brandMap.set(createdBrand.name, createdBrand);
  }

  for (const product of products) {
    const [
      name,
      sku,
      categoryName,
      brandName,
      shortDescription,
      fullDescription,
      image,
      specifications,
      unit,
      availability
    ] = product;

    await prisma.product.create({
      data: {
        name,
        sku,
        shortDescription,
        fullDescription,
        image,
        specifications: JSON.stringify(specifications),
        unit,
        availability,
        categoryId: categoryMap.get(categoryName).id,
        brandId: brandMap.get(brandName).id
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
