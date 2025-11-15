import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
}

/**
 * SEO Component
 * 
 * Usage:
 * <SEO 
 *   title="Product Name - StreetMarket"
 *   description="Product description"
 *   image="https://example.com/product.jpg"
 * />
 */
export default function SEO({
  title = 'StreetMarket - ตลาดออนไลน์ ซื้อขายสินค้าออนไลน์',
  description = 'ตลาดออนไลน์ที่ใหญ่ที่สุดในประเทศไทย ซื้อขายสินค้าออนไลน์ปลอดภัย มีสินค้าหลากหลายหมวดหมู่',
  keywords = 'ตลาดออนไลน์, ซื้อขายออนไลน์, สินค้าออนไลน์, marketplace, e-commerce',
  image = '/og-image.jpg',
  url,
  type = 'website',
}: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:type', type, true);
    if (url) {
      updateMetaTag('og:url', url, true);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Additional SEO tags
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('language', 'Thai');
    updateMetaTag('revisit-after', '7 days');
    updateMetaTag('author', 'StreetMarket');
  }, [title, description, keywords, image, url, type]);

  return null;
}
