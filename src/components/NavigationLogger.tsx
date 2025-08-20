
      'use client'
      
      import { usePathname, useSearchParams } from 'next/navigation'
      import { useEffect } from 'react'
      
      export default function NavigationLogger() {
        const pathname = usePathname()
        const searchParams = useSearchParams()
      
        useEffect(() => {
          const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')

          // post a message to the iframe owner
          window.parent.postMessage({
            type: 'navigation',
            path: url
          }, '*')
        }, [pathname, searchParams])
      
        return null // This component doesn't render anything
      }
            
            