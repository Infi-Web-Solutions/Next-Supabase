
'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function OAuthInsert() {
  useEffect(() => {
    const insertOAuthUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: exists } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (!exists) {
        await supabase.from('users').insert([
          {
            id: user.id,
            email: user.email,
            name: user.user_metadata.full_name || '',
            contact: '',
          },
        ])
      }
    }
    insertOAuthUser()
  }, [])

  return null
}
