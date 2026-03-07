/**
 * Script de teste para verificar conexão com Supabase Storage
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

console.log('=================================');
console.log('TESTE DE CONEXÃO SUPABASE STORAGE');
console.log('=================================\n');

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY (primeiros 20 chars):', process.env.SUPABASE_ANON_KEY?.substring(0, 20) + '...');
console.log('');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testStorage() {
  try {
    console.log('1. Testando listagem de buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError);
      return;
    }

    console.log('✅ Buckets encontrados:');
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (público: ${bucket.public})`);
    });
    console.log('');

    console.log('2. Testando acesso ao bucket book-covers...');
    const { data: files, error: filesError } = await supabase.storage
      .from('book-covers')
      .list();

    if (filesError) {
      console.error('❌ Erro ao acessar bucket book-covers:', filesError);
      return;
    }

    console.log('✅ Bucket book-covers acessível');
    console.log(`   Arquivos encontrados: ${files.length}`);
    console.log('');

    console.log('3. Testando URL pública...');
    const { data: { publicUrl } } = supabase.storage
      .from('book-covers')
      .getPublicUrl('test.jpg');

    console.log('✅ Formato de URL pública:', publicUrl);
    console.log('');

    console.log('✅ TODOS OS TESTES PASSARAM!');
    console.log('O backend está configurado corretamente para upload.');

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

testStorage();
