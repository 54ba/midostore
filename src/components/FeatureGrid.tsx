'use client'

import { useId } from 'react'

interface Feature {
  title: string
  description: string
  icon: string
}

interface FeatureGridProps {
  id?: string
  features: Feature[]
}

export default function FeatureGrid({ id, features = [] }: FeatureGridProps) {
  const defaultId = useId()
  const componentId = id || defaultId

  if (!features || features.length === 0) {
    return (
      <section id="feature-grid-empty-state" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 id="feature-grid-empty-title" className="text-2xl font-bold text-gray-800 mb-4">
            No Features Available
          </h2>
          <p id="feature-grid-empty-description" className="text-gray-600">
            Features will be displayed here once they are added.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="feature-grid-section" className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 id="feature-grid-main-title" className="text-3xl font-bold text-gray-800 mb-4">
            Why Choose MidoHub?
          </h2>
          <p id="feature-grid-main-description" className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect directly to Alibaba suppliers and access premium toys and cosmetics at unbeatable prices
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={`feature-card-${index}`}
              id={`feature-grid-card-${index}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 p-6 group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-teal-100 rounded-lg mb-6 mx-auto group-hover:bg-teal-200 transition-colors duration-300">
                <span 
                  id={`feature-grid-icon-${index}`}
                  className="text-3xl text-teal-600"
                  role="img"
                  aria-label={`${feature.title} icon`}
                >
                  {feature.icon}
                </span>
              </div>
              
              <h3 
                id={`feature-grid-title-${index}`}
                className="text-xl font-bold text-gray-800 mb-3 text-center group-hover:text-teal-700 transition-colors duration-300"
              >
                {feature.title}
              </h3>
              
              <p 
                id={`feature-grid-description-${index}`}
                className="text-gray-600 text-center leading-relaxed"
              >
                {feature.description}
              </p>
              
              <div className="mt-6 flex justify-center">
                <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button
            id="feature-grid-cta-button"
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Start Dropshipping Today
          </button>
        </div>
      </div>
    </section>
  )
}