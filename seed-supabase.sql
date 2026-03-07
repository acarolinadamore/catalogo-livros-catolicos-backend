-- Seed data para Biblioteca Católica
-- Execute este SQL no SQL Editor do Supabase

-- Inserir catálogo
INSERT INTO catalogs (name, slug, description, is_public) VALUES
(
  'Acervo Pe. Carlos Alberto Pereira',
  'pe-carlos-pereira',
  'Acervo pessoal de livros religiosos do Pe. Carlos Alberto Pereira, da Arquidiocese de Campo Grande – MS. Atuação pastoral na Paróquia Pessoal Nossa Senhora da Saúde (Capelania Hospitalar) e Paróquia Imaculado Coração de Maria.',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Buscar ID do catálogo para usar nos livros
DO $$
DECLARE
  v_catalog_id UUID;
BEGIN
  SELECT id INTO v_catalog_id FROM catalogs WHERE slug = 'pe-carlos-pereira';

  -- Inserir livros
  INSERT INTO books (catalog_id, title, author, publisher, year, content_type, intercessors, pastoral_uses, index_text, description) VALUES

  (v_catalog_id, 'Bíblia Sagrada - Edição Pastoral', 'CNBB', 'Paulus', 2014, 'Bíblia',
   ARRAY['Jesus Cristo'],
   ARRAY['Uso pessoal', 'Catequese adulta', 'Liturgia'],
   'Antigo Testamento: Gênesis, Êxodo, Levítico, Números, Deuteronômio, Josué, Juízes, Rut, 1 Samuel, 2 Samuel, 1 Reis, 2 Reis, 1 Crônicas, 2 Crônicas, Esdras, Neemias, Tobias, Judite, Ester, 1 Macabeus, 2 Macabeus, Jó, Salmos, Provérbios, Eclesiastes, Cântico dos Cânticos, Sabedoria, Eclesiástico, Isaías, Jeremias, Lamentações, Baruc, Ezequiel, Daniel, Oseias, Joel, Amós, Abdias, Jonas, Miqueias, Naum, Habacuc, Sofonias, Ageu, Zacarias, Malaquias. Novo Testamento: Mateus, Marcos, Lucas, João, Atos dos Apóstolos, Romanos, 1 Coríntios, 2 Coríntios, Gálatas, Efésios, Filipenses, Colossenses, 1 Tessalonicenses, 2 Tessalonicenses, 1 Timóteo, 2 Timóteo, Tito, Filêmon, Hebreus, Tiago, 1 Pedro, 2 Pedro, 1 João, 2 João, 3 João, Judas, Apocalipse.',
   'A Bíblia de Jerusalém é uma tradução católica da Bíblia feita pela Escola Bíblica de Jerusalém. Edição pastoral com notas e comentários para facilitar a compreensão e aplicação pastoral.'),

  (v_catalog_id, 'Introdução à Vida Devota', 'São Francisco de Sales', 'Vozes', 2019, 'Espiritualidade',
   ARRAY['Jesus Cristo', 'Maria Santíssima'],
   ARRAY['Uso pessoal', 'Formação de adultos'],
   'Primeira Parte: Conselhos e exercícios necessários para conduzir a alma desde o primeiro desejo da vida devota até a firme resolução de abraçá-la. Segunda Parte: Diversos conselhos para a elevação da alma a Deus pela oração e pelos sacramentos. Terceira Parte: Exercício de diversas virtudes. Quarta Parte: Remédios necessários contra as tentações mais ordinárias. Quinta Parte: Exercícios e conselhos necessários para renovar a alma e confirmá-la na devoção.',
   'Clássico da espiritualidade católica escrito por São Francisco de Sales. Guia prático para viver uma vida cristã devota no meio do mundo, com conselhos sobre oração, virtudes e combate às tentações. Obra fundamental para a vida espiritual de leigos e religiosos.'),

  (v_catalog_id, 'Tratado da Verdadeira Devoção à Santíssima Virgem', 'São Luís Maria Grignion de Montfort', 'Editora Vozes', 2017, 'Espiritualidade',
   ARRAY['Maria Santíssima'],
   ARRAY['Uso pessoal', 'Formação de adultos'],
   'Necessidade da devoção a Maria Santíssima. Falsa devoção a Maria. Verdadeira devoção a Maria. Prática da verdadeira devoção: a consagração perfeita a Jesus Cristo pelas mãos de Maria. Motivos da verdadeira devoção. Efeitos admiráveis da verdadeira devoção.',
   'Obra-prima de São Luís de Montfort sobre a devoção mariana. Ensina o caminho da consagração total a Jesus Cristo por Maria, apresentando a Virgem Maria como meio seguro para chegar a Cristo. Inspirou inúmeros santos e papas, incluindo São João Paulo II.'),

  (v_catalog_id, 'História de uma Alma', 'Santa Teresinha do Menino Jesus', 'Paulus', 2018, 'Vida de Santos',
   ARRAY['Santa Teresinha'],
   ARRAY['Uso pessoal', 'Formação de adultos'],
   'Manuscrito A: Os anos da infância. Manuscrito B: Minha vocação é o amor. Manuscrito C: Os últimos anos no Carmelo. Cartas. Poesias.',
   'Autobiografia espiritual de Santa Teresinha do Menino Jesus, Doutora da Igreja. Apresenta o "pequeno caminho" de infância espiritual e confiança total em Deus. Obra que influenciou profundamente a espiritualidade católica do século XX.'),

  (v_catalog_id, 'Confissões', 'Santo Agostinho', 'Paulus', 2020, 'Teologia',
   ARRAY['Jesus Cristo'],
   ARRAY['Uso pessoal', 'Formação de adultos', 'Formação sacerdotal'],
   'Livro I: Infância. Livro II: Adolescência. Livro III: Estudos em Cartago. Livro IV: Os nove anos de erro. Livro V: Em Roma e Milão. Livro VI: Preparação para o batismo. Livro VII: Conversão filosófica. Livro VIII: Conversão cristã. Livro IX: Batismo e morte de Mônica. Livro X: Análise da alma. Livro XI: O tempo. Livro XII: O céu e a terra. Livro XIII: A criação.',
   'Obra autobiográfica e teológica de Santo Agostinho, considerada uma das mais importantes da literatura cristã. Narra sua conversão e apresenta profundas reflexões sobre Deus, o tempo, a memória e a criação. Texto fundamental da teologia e filosofia cristã.'),

  (v_catalog_id, 'Imitação de Cristo', 'Tomás de Kempis', 'Vozes', 2015, 'Espiritualidade',
   ARRAY['Jesus Cristo'],
   ARRAY['Uso pessoal', 'Formação de adultos', 'Formação sacerdotal'],
   'Livro I: Advertências úteis para a vida espiritual. Livro II: Exortações à vida interior. Livro III: Da consolação interior. Livro IV: Do Sacramento do Altar.',
   'Um dos maiores clássicos da espiritualidade cristã, escrito no século XV. Guia para a vida interior centrada em Cristo, com reflexões sobre humildade, paz interior, abandono à vontade divina e amor a Deus. Leitura meditativa para crescimento espiritual.'),

  (v_catalog_id, 'Catecismo da Igreja Católica', 'Igreja Católica', 'Loyola', 2000, 'Documentos da Igreja',
   ARRAY['Jesus Cristo'],
   ARRAY['Catequese adulta', 'Formação de adultos', 'Formação sacerdotal'],
   'Primeira Parte: A profissão da fé (Creio - Cremos). Segunda Parte: A celebração do mistério cristão (Sacramentos). Terceira Parte: A vida em Cristo (Mandamentos e moral). Quarta Parte: A oração cristã (Pai Nosso).',
   'Exposição oficial e completa da fé católica. Publicado após o Concílio Vaticano II, apresenta de forma sistemática a doutrina da Igreja em seus quatro pilares: Credo, Sacramentos, Moral e Oração. Referência fundamental para catequese e formação.'),

  (v_catalog_id, 'Suma Teológica', 'São Tomás de Aquino', 'Loyola', 2016, 'Teologia',
   ARRAY['Jesus Cristo'],
   ARRAY['Formação sacerdotal', 'Formação de adultos'],
   'Primeira Parte: Deus e a Criação. Segunda Parte (Primeira Seção): O fim último do homem, os atos humanos, as paixões, os hábitos, as virtudes e os vícios. Segunda Parte (Segunda Seção): As virtudes teologais e cardeais. Terceira Parte: Cristo e os Sacramentos.',
   'Obra-prima de São Tomás de Aquino, Doutor da Igreja. Tratado completo de teologia que apresenta de forma sistemática toda a doutrina católica. Considerada uma das maiores realizações intelectuais da humanidade e base da teologia escolástica.'),

  (v_catalog_id, 'Exercícios Espirituais', 'Santo Inácio de Loyola', 'Loyola', 2000, 'Espiritualidade',
   ARRAY['Jesus Cristo'],
   ARRAY['Uso pessoal', 'Formação de adultos', 'Formação sacerdotal'],
   'Anotações. Primeira Semana: Pecado e misericórdia. Segunda Semana: Reino de Cristo e contemplação da vida de Cristo. Terceira Semana: Paixão e morte de Cristo. Quarta Semana: Ressurreição e amor de Deus. Contemplação para alcançar amor.',
   'Método de oração e discernimento espiritual criado por Santo Inácio de Loyola. Roteiro de retiro espiritual de 30 dias (ou adaptações) para encontro profundo com Cristo, discernimento vocacional e renovação da vida cristã. Base da espiritualidade inaciana.'),

  (v_catalog_id, 'O Pequeno Príncipe da Paz', 'Irmã Maria do Espírito Santo', 'Canção Nova', 2012, 'Espiritualidade',
   ARRAY['Jesus Cristo', 'Maria Santíssima'],
   ARRAY['Catequese infantil', 'Uso pessoal'],
   'O nascimento do pequeno príncipe. A visita dos pastores. Os reis magos. A fuga para o Egito. Jesus no templo. A vida em Nazaré.',
   'Livro infantil sobre a infância de Jesus, escrito de forma poética e acessível para crianças. Apresenta os mistérios da infância de Cristo de maneira cativante, ajudando as crianças a conhecerem e amarem Jesus desde pequenas.'),

  (v_catalog_id, 'Manual de Capelania Hospitalar', 'Pe. Leo Pessini', 'Paulus', 2018, 'Doutrina Social',
   ARRAY['Jesus Cristo'],
   ARRAY['Capelania Hospitalar', 'Formação de adultos'],
   'Fundamentos teológicos da capelania. Dimensão pastoral do cuidado. Sacramentos aos enfermos. Ética e bioética. Acompanhamento ao paciente terminal. Apoio à família. Espiritualidade do cuidador.',
   'Guia prático e teológico para o exercício da capelania hospitalar. Aborda aspectos pastorais, sacramentais, éticos e psicológicos do acompanhamento aos enfermos. Essencial para capelães e agentes de pastoral da saúde.'),

  (v_catalog_id, 'Compêndio da Doutrina Social da Igreja', 'Pontifício Conselho Justiça e Paz', 'Paulinas', 2005, 'Doutrina Social',
   ARRAY['Jesus Cristo'],
   ARRAY['Formação de adultos', 'Formação sacerdotal'],
   'Desígnio de amor de Deus para a humanidade. Missão da Igreja e doutrina social. Pessoa humana e direitos humanos. Princípios da doutrina social. Família. Trabalho. Vida econômica. Comunidade política. Comunidade internacional. Meio ambiente. Paz.',
   'Síntese oficial da Doutrina Social da Igreja Católica. Apresenta os princípios éticos e sociais do cristianismo aplicados às questões contemporâneas: economia, política, trabalho, família, meio ambiente e paz. Referência para ação social cristã.');

END $$;
