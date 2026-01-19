
import fs from 'fs';
import path from 'path';

async function main() {
    const formData = new FormData();
    // Create a dummy file
    const file = new Blob(['dummy content'], { type: 'image/jpeg' });
    formData.append('file', file, 'test.jpg');
    formData.append('platform', 'Shopee');

    try {
        console.log('Sending request to API...');
        const response = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            console.error('API Error:', await response.text());
            return;
        }

        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));

        if (data.title && data.title.includes('[MOCK]')) {
            console.log('✅ Mock response received correctly.');
        } else {
            console.log('⚠️ Warning: Response does not look like mock data.');
        }

    } catch (error) {
        console.error('Failed to call API:', error);
    }
}

main();
