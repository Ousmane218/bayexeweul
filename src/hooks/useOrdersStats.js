import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useOrdersStats() {
  const [pendingCount, setPendingCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchPendingCount = async () => {
    try {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
      
      if (!error && count !== null) {
        setPendingCount(count)
      }
    } catch (err) {
      console.error("Erreur hook pending orders:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPendingCount()

    // S'abonner aux changements sur la table orders
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchPendingCount()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { pendingCount, loading, fetchPendingCount }
}
