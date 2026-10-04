'use client'

import { useEffect } from 'react'

export function IdentifyOwner() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get('identify') === 'me') {
      localStorage.setItem('portfolio-owner', 'true')

      // Remove ?identify=me from the address bar
      window.history.replaceState({}, '', window.location.pathname)
    }

    if (localStorage.getItem('portfolio-owner') === 'true') {
      window.umami?.identify('me')
    }
  }, [])

  return null
}
