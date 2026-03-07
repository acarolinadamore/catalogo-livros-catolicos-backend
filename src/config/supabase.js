/**
 * Configuração do cliente Supabase
 * Conecta ao banco de dados PostgreSQL hospedado no Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Validar variáveis de ambiente obrigatórias
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error(
    'Faltam variáveis de ambiente: SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórias'
  );
}

// Criar cliente Supabase
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false // Backend não precisa persistir sessão
    }
  }
);

// Testar conexão
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('catalogs')
      .select('count')
      .limit(1);

    if (error) throw error;

    console.log('✓ Conexão com Supabase estabelecida');
    return true;
  } catch (error) {
    console.error('✗ Erro ao conectar com Supabase:', error.message);
    return false;
  }
}
