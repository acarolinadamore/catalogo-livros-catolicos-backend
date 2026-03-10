/**
 * Controlador de OCR com Claude API Vision
 * Analisa capas de livros usando Claude Vision para extrair informações
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

/**
 * Processar OCR de capa de livro usando Claude API Vision
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
      model: 'claude-3-opus-20240229', // Claude 3 Opus - modelo mais poderoso com vision
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
