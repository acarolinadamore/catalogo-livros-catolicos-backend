/**
 * Controlador de OCR com Claude API Vision
 * Analisa capas de livros e transcreve índices usando Claude Vision
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

/**
 * Processar OCR de capa de livro usando Claude API Vision
 * Extrai informações estruturadas (título, autor, editora, ano)
 */
export async function processBookCoverOCR(req, res) {
  try {
    // Verificar se arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhuma imagem foi enviada'
      });
    }

    // Verificar se a chave da API está configurada
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY não configurada');
      return res.status(500).json({
        success: false,
        error: 'Serviço de OCR não configurado'
      });
    }

    // Ler arquivo e converter para base64
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString('base64');

    // Detectar tipo MIME da imagem
    let mediaType = 'image/jpeg';
    if (req.file.mimetype === 'image/png') {
      mediaType = 'image/png';
    } else if (req.file.mimetype === 'image/webp') {
      mediaType = 'image/webp';
    } else if (req.file.mimetype === 'image/gif') {
      mediaType = 'image/gif';
    }

    console.log('Processando imagem com Claude Vision:', {
      filename: req.file.filename,
      size: req.file.size,
      mediaType
    });

    // Inicializar cliente Anthropic
    const anthropic = new Anthropic({
      apiKey: apiKey
    });

    // Prompt otimizado para extração de informações de capas de livros
    const prompt = `Analise esta imagem de capa de livro e extraia as seguintes informações em português:

1. TÍTULO: O título completo do livro (geralmente o texto maior ou mais destacado)
2. AUTOR: Nome do autor ou autores (procure por "por", "de", "autor:", ou nomes próprios)
3. EDITORA: Nome da editora (procure por "editora", "ed.", "publicações", ou logos de editoras conhecidas)
4. ANO: Ano de publicação se visível (formato YYYY)

IMPORTANTE:
- Retorne APENAS um objeto JSON válido, sem texto adicional
- Use exatamente estas chaves: "titulo", "autor", "editora", "ano"
- Se não encontrar alguma informação, use string vazia ""
- Seja preciso e extraia apenas o que está claramente visível
- Para o título, pegue o texto principal da capa, ignorando subtítulos se não forem parte integral
- Para autor, se houver múltiplos autores, separe com vírgula

Formato de resposta esperado:
{
  "titulo": "Título Completo do Livro",
  "autor": "Nome do Autor",
  "editora": "Nome da Editora",
  "ano": "2023"
}`;

    // Chamar Claude API com Vision
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6', // Claude Sonnet 4.6 - melhor balanço velocidade/inteligência
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Image
              }
            },
            {
              type: 'text',
              text: prompt
            }
          ]
        }
      ]
    });

    // Extrair resposta
    const responseText = message.content[0].text;
    console.log('Resposta do Claude:', responseText);

    // Parsear JSON da resposta
    let bookInfo;
    try {
      // Tentar extrair JSON da resposta (Claude pode incluir texto adicional)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        bookInfo = JSON.parse(jsonMatch[0]);
      } else {
        bookInfo = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('Erro ao parsear resposta do Claude:', parseError);
      console.error('Resposta original:', responseText);

      // Tentar extrair manualmente
      bookInfo = {
        titulo: '',
        autor: '',
        editora: '',
        ano: ''
      };
    }

    // Limpar arquivo temporário
    try {
      fs.unlinkSync(req.file.path);
    } catch (unlinkError) {
      console.error('Erro ao deletar arquivo temporário:', unlinkError);
    }

    // Validar se encontrou pelo menos título ou autor
    if (!bookInfo.titulo && !bookInfo.autor) {
      return res.status(200).json({
        success: false,
        error: 'Não foi possível identificar informações do livro na imagem. Tente uma foto mais nítida.',
        data: null
      });
    }

    // Retornar informações extraídas
    res.json({
      success: true,
      data: {
        titulo: bookInfo.titulo || '',
        autor: bookInfo.autor || '',
        editora: bookInfo.editora || '',
        ano: bookInfo.ano || ''
      }
    });

  } catch (error) {
    console.error('Erro ao processar OCR com Claude:', error);

    // Limpar arquivo temporário em caso de erro
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        // Ignorar erro de cleanup
      }
    }

    res.status(500).json({
      success: false,
      error: 'Erro ao analisar imagem. Por favor, tente novamente.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Processar OCR de índice/sumário usando Claude API Vision
 * Transcreve LITERALMENTE todo o texto visível na imagem
 */
export async function processIndexOCR(req, res) {
  try {
    // Verificar se arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhuma imagem foi enviada'
      });
    }

    // Verificar se a chave da API está configurada
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY não configurada');
      return res.status(500).json({
        success: false,
        error: 'Serviço de OCR não configurado'
      });
    }

    // Ler arquivo e converter para base64
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString('base64');

    // Detectar tipo MIME da imagem
    let mediaType = 'image/jpeg';
    if (req.file.mimetype === 'image/png') {
      mediaType = 'image/png';
    } else if (req.file.mimetype === 'image/webp') {
      mediaType = 'image/webp';
    } else if (req.file.mimetype === 'image/gif') {
      mediaType = 'image/gif';
    }

    console.log('Processando transcrição de índice com Claude Vision:', {
      filename: req.file.filename,
      size: req.file.size,
      mediaType
    });

    // Inicializar cliente Anthropic
    const anthropic = new Anthropic({
      apiKey: apiKey
    });

    // Prompt otimizado para TRANSCRIÇÃO LITERAL de texto
    const prompt = `Você deve transcrever EXATAMENTE todo o texto visível nesta imagem de índice/sumário de livro.

INSTRUÇÕES IMPORTANTES:
- Transcreva TODO o texto que você vê, palavra por palavra
- Mantenha a formatação original (quebras de linha, pontos, travessões, etc)
- Mantenha os números de página exatamente como aparecem
- NÃO analise, NÃO interprete, NÃO resuma - apenas COPIE o texto
- Se houver "Sumário", "Índice", "Capítulo", "Parte", etc, copie exatamente
- Copie os títulos dos capítulos/seções exatamente como estão escritos
- Copie os números de página com os pontos/travessões/espaços originais
- Se algo não estiver legível, indique com [ilegível]

Exemplo do que você DEVE fazer:
Se a imagem mostra:
"Sumário
Capítulo 1 - Introdução ........................ 5
Capítulo 2 - Desenvolvimento ................... 12"

Você deve retornar EXATAMENTE:
"Sumário
Capítulo 1 - Introdução ........................ 5
Capítulo 2 - Desenvolvimento ................... 12"

IMPORTANTE: Retorne APENAS o texto transcrito, sem nenhum comentário adicional, sem blocos de código markdown, sem explicações. Apenas o texto puro.`;

    // Chamar Claude API com Vision
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096, // Aumentado para permitir transcrições longas
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Image
              }
            },
            {
              type: 'text',
              text: prompt
            }
          ]
        }
      ]
    });

    // Extrair resposta (texto transcrito)
    const transcribedText = message.content[0].text.trim();
    console.log('Texto transcrito do índice:', transcribedText);

    // Limpar arquivo temporário
    try {
      fs.unlinkSync(req.file.path);
    } catch (unlinkError) {
      console.error('Erro ao deletar arquivo temporário:', unlinkError);
    }

    // Validar se encontrou algum texto
    if (!transcribedText || transcribedText.length < 5) {
      return res.status(200).json({
        success: false,
        error: 'Não foi possível transcrever o texto da imagem. Tente uma foto mais nítida.',
        data: null
      });
    }

    // Retornar texto transcrito
    res.json({
      success: true,
      data: {
        text: transcribedText
      }
    });

  } catch (error) {
    console.error('Erro ao processar transcrição de índice:', error);

    // Limpar arquivo temporário em caso de erro
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        // Ignorar erro de cleanup
      }
    }

    res.status(500).json({
      success: false,
      error: 'Erro ao transcrever texto. Por favor, tente novamente.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
