import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        middlewares: [
            (req, res, next) => {
                // Force the method to be GET
                req.method = 'GET';

                // Your logic to generate and send the HTML page
                next();
            },
        ],
    }
});
