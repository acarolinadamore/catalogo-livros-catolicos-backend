/**
 * Controlador de Upload
 * Gerencia upload de imagens para o Supabase Storage
 */

import { supabase } from '../config/supabase.js';
import { randomUUID } from 'crypto';

/**
 * Upload de capa de livro
 */
export async function uploadCover(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo foi enviado'
      });
    }

    const file = req.file;

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: 'Tipo de arquivo não permitido. Use JPG ou PNG.'
      });
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: 'Arquivo muito grande. Máximo 5MB.'
      });
    }

    // Gerar nome único para o arquivo
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${randomUUID()}.${fileExtension}`;
    const filePath = `covers/${fileName}`;

    // Upload para Supabase Storage
    console.log('Tentando upload para Supabase Storage...');
    console.log('Bucket: book-covers');
    console.log('FilePath:', filePath);
    console.log('File size:', file.size);
    console.log('Content type:', file.mimetype);

    const { data, error } = await supabase.storage
      .from('book-covers')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Erro detalhado no upload para Supabase:', {
        message: error.message,
        statusCode: error.statusCode,
        error: error
      });
      return res.status(500).json({
        success: false,
        error: 'Erro ao fazer upload da imagem',
        details: error.message
      });
    }

    console.log('Upload realizado com sucesso:', data);

    // Obter URL pública da imagem
    const { data: { publicUrl } } = supabase.storage
      .from('book-covers')
      .getPublicUrl(filePath);

    res.status(200).json({
      success: true,
      url: publicUrl,
      fileName: fileName
    });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao fazer upload da imagem'
    });
  }
}
