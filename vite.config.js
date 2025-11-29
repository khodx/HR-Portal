import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                addCompany: resolve(__dirname, 'pages/company/add-company.html'),
                editCompany: resolve(__dirname, 'pages/company/edit-company.html'),
                viewCompany: resolve(__dirname, 'pages/company/view-company.html'),
                deletedItems: resolve(__dirname, 'pages/company/deleted-items.html'),
            },
        },
    },
})