import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Londrinet: DataHub',
    short_name: 'DataHub',
    description: 'Sistema londrinet',
    start_url: '/',
    display: 'standalone',
    background_color: '#353a6e',
    theme_color: '#353a6e',
    icons: [
      {
        src: '/images/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
