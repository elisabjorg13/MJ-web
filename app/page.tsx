import { createClient } from '@/prismicio';
import { PrismicNextImage } from '@prismicio/next';

export default async function Home() {
  const client = createClient();
  
  // Fetch the landing page image from Prismic
  const landingPage = await client.getSingle('landingpageimage');
  
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto">
        <h1>MJ WEBSITEWHATS UP</h1>
        {landingPage.data.image && (
          <PrismicNextImage 
            field={landingPage.data.image} 
            className="w-full h-auto"
          />
        )}
      </div>
    </main>
  )
}

