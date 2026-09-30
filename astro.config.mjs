import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://amazon-hike.com',
  base: '/chapter21',
  trailingSlash: 'always',
  output: 'static',
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: 'root-redirect-dev',
        configureServer(server) {
          return () => {
            server.middlewares.stack.unshift({
              route: '',
              handle(req, res, next) {
                if (req.__redirect_checked) {
                  return next();
                }
                req.__redirect_checked = true;

                const url = (req.originalUrl || req.url || '').split('?')[0];
                if (url === '/' || url === '/index.html' || url === '') {
                  res.writeHead(302, {
                    Location: '/chapter21/',
                    'Content-Type': 'text/html; charset=utf-8',
                  });
                  res.end(
                    '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/chapter21/"><script>window.location.replace("/chapter21/");</script></head><body><p>Redirecting to <a href="/chapter21/">/chapter21/</a>...</p></body></html>'
                  );
                  return;
                }
                next();
              },
            });
          };
        },
      },
    ],
  },
});
