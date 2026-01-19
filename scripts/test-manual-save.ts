
import { PrismaClient } from '@prisma/client';

async function main() {
    try {
        console.log('Testing manual save API...');
        const response = await fetch('http://localhost:3000/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: '[MANUAL SAVE TEST] Product Title',
                description: 'Description for manual save test.',
                hashtags: ['#manual', '#test'],
                platform: 'Tokopedia'
            }),
        });

        if (!response.ok) {
            console.error('API Error:', await response.text());
            return;
        }

        const data = await response.json();
        console.log('✅ Manual Save Response:', JSON.stringify(data, null, 2));

        if (data.id) {
            console.log('✅ Listing ID returned.');
        } else {
            console.log('⚠️ Warning: No ID returned.');
        }

    } catch (error) {
        console.error('Failed to call API:', error);
    }
}

main();
