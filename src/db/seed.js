/**
 * Seed data - Dados iniciais do banco
 * Popula o banco com catálogo do Pe. Carlos e livros católicos de exemplo
 */

import { supabase } from '../config/supabase.js';

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  try {
    // =====================
    // 1. CRIAR CATÁLOGO
    // =====================

    console.log('📚 Criando catálogo do Pe. Carlos...');

    const { data: catalog, error: catalogError } = await supabase
      .from('catalogs')
      .upsert({
        name: 'Acervo Pe. Carlos Alberto Pereira',
        slug: 'pe-carlos-pereira',
        description: 'Acervo pessoal de livros religiosos do Pe. Carlos Alberto Pereira, da Arquidiocese de Campo Grande – MS. Atuação pastoral na Paróquia Pessoal Nossa Senhora da Saúde (Capelania Hospitalar) e Paróquia Imaculado Coração de Maria.',
        is_public: true
      }, {
        onConflict: 'slug',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (catalogError) throw catalogError;

    console.log('✓ Catálogo criado:', catalog.name);

    // =====================
    // 2. CRIAR LIVROS
    // =====================

    console.log('\n📖 Criando livros...\n');

    const books = [
      {
        catalog_id: catalog.id,
        title: 'Bíblia Sagrada - Edição Pastoral',
        author: 'CNBB',
        publisher: 'Paulus',
        year: 2014,
        content_type: 'Bíblia',
        intercessors: ['Jesus Cristo'],
        pastoral_uses: ['Uso pessoal', 'Catequese adulta', 'Liturgia'],
        index_text: 'Antigo Testamento: Gênesis, Êxodo, Levítico, Números, Deuteronômio, Josué, Juízes, Rut, 1 Samuel, 2 Samuel, 1 Reis, 2 Reis, 1 Crônicas, 2 Crônicas, Esdras, Neemias, Tobias, Judite, Ester, 1 Macabeus, 2 Macabeus, Jó, Salmos, Provérbios, Eclesiastes, Cântico dos Cânticos, Sabedoria, Eclesiástico, Isaías, Jeremias, Lamentações, Baruc, Ezequiel, Daniel, Oseias, Joel, Amós, Abdias, Jonas, Miqueias, Naum, Habacuc, Sofonias, Ageu, Zacarias, Malaquias. Novo Testamento: Mateus, Marcos, Lucas, João, Atos dos Apóstolos, Romanos, 1 Coríntios, 2 Coríntios, Gálatas, Efésios, Filipenses, Colossenses, 1 Tessalonicenses, 2 Tessalonicenses, 1 Timóteo, 2 Timóteo, Tito, Filêmon, Hebreus, Tiago, 1 Pedro, 2 Pedro, 1 João, 2 João, 3 João, Judas, Apocalipse.',
        description: 'A Bíblia de Jerusalém é uma tradução católica da Bíblia feita pela Escola Bíblica de Jerusalém. Edição pastoral com notas e comentários para facilitar a compreensão e aplicação pastoral.',
        cover_image_url: null
      },
      {
        catalog_id: catalog.id,
        title: 'Introdução à Vida Devota',
        author: 'São Francisco de Sales',
        publisher: 'Vozes',
        year: 2019,
        content_type: 'Espiritualidade',
        intercessors: ['Jesus Cristo', 'Maria Santíssima'],
        pastoral_uses: ['Uso pessoal', 'Formação de adultos'],
        index_text: 'Primeira Parte: Conselhos e exercícios necessários para conduzir a alma desde o primeiro desejo da vida devota até a firme resolução de abraçá-la. Segunda Parte: Diversos conselhos para a elevação da alma a Deus pela oração e pelos sacramentos. Terceira Parte: Exercício de diversas virtudes. Quarta Parte: Remédios necessários contra as tentações mais ordinárias. Quinta Parte: Exercícios e conselhos necessários para renovar a alma e confirmá-la na devoção.',
        description: 'Clássico da espiritualidade católica escrito por São Francisco de Sales. Guia prático para viver uma vida cristã devota no meio do mundo, com conselhos sobre oração, virtudes e combate às tentações. Obra fundamental para a vida espiritual de leigos e religiosos.',
        cover_image_url: null
      },
      {
        catalog_id: catalog.id,
        title: 'Tratado da Verdadeira Devoção à Santíssima Virgem',
        author: 'São Luís Maria Grignion de Montfort',
        publisher: 'Editora Vozes',
        year: 2017,
        content_type: 'Espiritualidade',
        intercessors: ['Maria Santíssima'],
        pastoral_uses: ['Uso pessoal', 'Formação de adultos'],
        index_text: 'Necessidade da devoção a Maria Santíssima. Falsa devoção a Maria. Verdadeira devoção a Maria. Prática da verdadeira devoção: a consagração perfeita a Jesus Cristo pelas mãos de Maria. Motivos da verdadeira devoção. Efeitos admiráveis da verdadeira devoção.',
        description: 'Obra-prima de São Luís de Montfort sobre a devoção mariana. Ensina o caminho da consagração total a Jesus Cristo por Maria, apresentando a Virgem Maria como meio seguro para chegar a Cristo. Inspirou inúmeros santos e papas, incluindo São João Paulo II.',
        cover_image_url: null
      },
      {
        catalog_id: catalog.id,
        title: 'História de uma Alma',
        author: 'Santa Teresinha do Menino Jesus',
        publisher: 'Paulus',
        year: 2018,
        content_type: 'Vida de Santos',
        intercessors: ['Santa Teresinha'],
        pastoral_uses: ['Uso pessoal', 'Formação de adultos'],
        index_text: 'Manuscrito A: Os anos da infância. Manuscrito B: Minha vocação é o amor. Manuscrito C: Os últimos anos no Carmelo. Cartas. Poesias.',
        description: 'Autobiografia espiritual de Santa Teresinha do Menino Jesus, Doutora da Igreja. Apresenta o "pequeno caminho" de infância espiritual e confiança total em Deus. Obra que influenciou profundamente a espiritualidade católica do século XX.',
        cover_image_url: null
      },
      {
        catalog_id: catalog.id,
        title: 'Confissões',
        author: 'Santo Agostinho',
        publisher: 'Paulus',
        year: 2020,
        content_type: 'Teologia',
        intercessors: ['Jesus Cristo'],
        pastoral_uses: ['Uso pessoal', 'Formação de adultos', 'Formação sacerdotal'],
        index_text: 'Livro I: Infância. Livro II: Adolescência. Livro III: Estudos em Cartago. Livro IV: Os nove anos de erro. Livro V: Em Roma e Milão. Livro VI: Preparação para o batismo. Livro VII: Conversão filosófica. Livro VIII: Conversão cristã. Livro IX: Batismo e morte de Mônica. Livro X: Análise da alma. Livro XI: O tempo. Livro XII: O céu e a terra. Livro XIII: A criação.',
        description: 'Obra autobiográfica e teológica de Santo Agostinho, considerada uma das mais importantes da literatura cristã. Narra sua conversão e apresenta profundas reflexões sobre Deus, o tempo, a memória e a criação. Texto fundamental da teologia e filosofia cristã.',
        cover_image_url: null
      },
      {
        catalog_id: catalog.id,
        title: 'Imitação de Cristo',
        author: 'Tomás de Kempis',
        publisher: 'Vozes',
        year: 2015,
        content_type: 'Espiritualidade',
        intercessors: ['Jesus Cristo'],
        pastoral_uses: ['Uso pessoal', 'Formação de adultos', 'Formação sacerdotal'],
        index_text: 'Livro I: Advertências úteis para a vida espiritual. Livro II: Exortações à vida interior. Livro III: Da consolação interior. Livro IV: Do Sacramento do Altar.',
        description: 'Um dos maiores clássicos da espiritualidade cristã, escrito no século XV. Guia para a vida interior centrada em Cristo, com reflexões sobre humildade, paz interior, abandono à vontade divina e amor a Deus. Leitura meditativa para crescimento espiritual.',
        cover_image_url: null
      },
      {
        catalog_id: catalog.id,
        title: 'Catecismo da Igreja Católica',
        author: 'Igreja Católica',
        publisher: 'Loyola',
        year: 2000,
        content_type: 'Documentos da Igreja',
        intercessors: ['Jesus Cristo'],
        pastoral_uses: ['Catequese adulta', 'Formação de adultos', 'Formação sacerdotal'],
        index_text: 'Primeira Parte: A profissão da fé (Creio - Cremos). Segunda Parte: A celebração do mistério cristão (Sacramentos). Terceira Parte: A vida em Cristo (Mandamentos e moral). Quarta Parte: A oração cristã (Pai Nosso).',
        description: 'Exposição oficial e completa da fé católica. Publicado após o Concílio Vaticano II, apresenta de forma sistemática a doutrina da Igreja em seus quatro pilares: Credo, Sacramentos, Moral e Oração. Referência fundamental para catequese e formação.',
        cover_image_url: null
      },
      {
        catalog_id: catalog.id,
        title: 'Suma Teológica',
        author: 'São Tomás de Aquino',
        publisher: 'Loyola',
        year: 2016,
        content_type: 'Teologia',
        intercessors: ['Jesus Cristo'],
        pastoral_uses: ['Formação sacerdotal', 'Formação de adultos'],
        index_text: 'Primeira Parte: Deus e a Criação. Segunda Parte (Primeira Seção): O fim último do homem, os atos humanos, as paixões, os hábitos, as virtudes e os vícios. Segunda Parte (Segunda Seção): As virtudes teologais e cardeais. Terceira Parte: Cristo e os Sacramentos.',
        description: 'Obra-prima de São Tomás de Aquino, Doutor da Igreja. Tratado completo de teologia que apresenta de forma sistemática toda a doutrina católica. Considerada uma das maiores realizações intelectuais da humanidade e base da teologia escolástica.',
        cover_image_url: null
      },
      {
        catalog_id: catalog.id,
        title: 'Exercícios Espirituais',
        author: 'Santo Inácio de Loyola',
        publisher: 'Loyola',
        year: 2000,
        content_type: 'Espiritualidade',
        intercessors: ['Jesus Cristo'],
        pastoral_uses: ['Uso pessoal', 'Formação de adultos', 'Formação sacerdotal'],
        index_text: 'Anotações. Primeira Semana: Pecado e misericórdia. Segunda Semana: Reino de Cristo e contemplação da vida de Cristo. Terceira Semana: Paixão e morte de Cristo. Quarta Semana: Ressurreição e amor de Deus. Contemplação para alcançar amor.',
        description: 'Método de oração e discernimento espiritual criado por Santo Inácio de Loyola. Roteiro de retiro espiritual de 30 dias (ou adaptações) para encontro profundo com Cristo, discernimento vocacional e renovação da vida cristã. Base da espiritualidade inaciana.',
        cover_image_url: null
      },
      {
        catalog_id: catalog.id,
        title: 'O Pequeno Príncipe da Paz',
        author: 'Irmã Maria do Espírito Santo',
        publisher: 'Canção Nova',
        year: 2012,
        content_type: 'Espiritualidade',
        intercessors: ['Jesus Cristo', 'Maria Santíssima'],
        pastoral_uses: ['Catequese infantil', 'Uso pessoal'],
        index_text: 'O nascimento do pequeno príncipe. A visita dos pastores. Os reis magos. A fuga para o Egito. Jesus no templo. A vida em Nazaré.',
        description: 'Livro infantil sobre a infância de Jesus, escrito de forma poética e acessível para crianças. Apresenta os mistérios da infância de Cristo de maneira cativante, ajudando as crianças a conhecerem e amarem Jesus desde pequenas.',
        cover_image_url: null
      },
      {
        catalog_id: catalog.id,
        title: 'Manual de Capelania Hospitalar',
        author: 'Pe. Leo Pessini',
        publisher: 'Paulus',
        year: 2018,
        content_type: 'Doutrina Social',
        intercessors: ['Jesus Cristo'],
        pastoral_uses: ['Capelania Hospitalar', 'Formação de adultos'],
        index_text: 'Fundamentos teológicos da capelania. Dimensão pastoral do cuidado. Sacramentos aos enfermos. Ética e bioética. Acompanhamento ao paciente terminal. Apoio à família. Espiritualidade do cuidador.',
        description: 'Guia prático e teológico para o exercício da capelania hospitalar. Aborda aspectos pastorais, sacramentais, éticos e psicológicos do acompanhamento aos enfermos. Essencial para capelães e agentes de pastoral da saúde.',
        cover_image_url: null
      },
      {
        catalog_id: catalog.id,
        title: 'Compêndio da Doutrina Social da Igreja',
        author: 'Pontifício Conselho Justiça e Paz',
        publisher: 'Paulinas',
        year: 2005,
        content_type: 'Doutrina Social',
        intercessors: ['Jesus Cristo'],
        pastoral_uses: ['Formação de adultos', 'Formação sacerdotal'],
        index_text: 'Desígnio de amor de Deus para a humanidade. Missão da Igreja e doutrina social. Pessoa humana e direitos humanos. Princípios da doutrina social. Família. Trabalho. Vida econômica. Comunidade política. Comunidade internacional. Meio ambiente. Paz.',
        description: 'Síntese oficial da Doutrina Social da Igreja Católica. Apresenta os princípios éticos e sociais do cristianismo aplicados às questões contemporâneas: economia, política, trabalho, família, meio ambiente e paz. Referência para ação social cristã.',
        cover_image_url: null
      }
    ];

    // Inserir livros
    for (const book of books) {
      const { error: bookError } = await supabase
        .from('books')
        .insert(book);

      if (bookError) {
        console.error('Erro ao inserir livro:', book.title);
        console.error(bookError);
      } else {
        console.log('✓', book.title);
      }
    }

    console.log(`\n✅ Seed concluído! ${books.length} livros criados.\n`);

  } catch (error) {
    console.error('\n❌ Erro no seed:', error);
    process.exit(1);
  }
}

// Executar seed
seed();
