import { supabase } from '@/lib/supabase/client'

/**
 * Ponto único de chamada à Edge Function `gemini` (supabase/functions/gemini),
 * que segura a GEMINI_API_KEY no servidor — o bundle do frontend nunca a vê.
 */
export async function callGemini<TOutput>(action: string, input: Record<string, unknown>): Promise<TOutput> {
  const { data, error } = await supabase.functions.invoke('gemini', { body: { action, ...input } })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data as TOutput
}
