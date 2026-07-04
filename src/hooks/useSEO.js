import { useEffect } from 'react'
import { storeConfig } from '@/config/storeConfig'

export function useSEO({ title, description, image, url }) {
  useEffect(() => {
    // 1. Title
    const siteTitle = title ? `${title} | ${storeConfig.storeName}` : `${storeConfig.storeName} | Marketplace au Sénégal`
    document.title = siteTitle
    
    // 2. Meta Description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description || storeConfig.tagline)
    }

    // 3. Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', siteTitle)

    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.setAttribute('content', description || storeConfig.tagline)
    
    const ogImage = document.querySelector('meta[property="og:image"]')
    if (ogImage && image) ogImage.setAttribute('content', image)

    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) ogUrl.setAttribute('content', url || window.location.href)
    
    // 4. Canonical
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url || window.location.href)

  }, [title, description, image, url])
}
