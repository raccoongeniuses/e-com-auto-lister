
import fs from 'fs';

async function testGeneration(useMock: boolean) {
    const formData = new FormData();
    const file = new Blob(['dummy content'], { type: 'image/jpeg' });
    formData.append('file', file, 'test.jpg');
    formData.append('platform', 'Shopee');
    formData.append('useMock', useMock.toString());

    console.log(`Testing Generation with useMock=${useMock}...`);
    try {
        const response = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            console.error('API Error:', await response.text());
            return;
        }

        const data = await response.json();
        const isMockResponse = data.title && data.title.includes('[MOCK]');

        if (useMock) {
            if (isMockResponse) console.log('✅ Mock mode: SUCCESS (Received mock response)');
            else console.log('❌ Mock mode: FAIL (Received real/unexpected response)');
        } else {
            // For real mode, we might fail due to lack of API key or network, but checking if it *tried* to be real
            // If we get an error about API key, that counts as success for "switching to real mode logic"
            // if we get mock response, that's a fail.
            if (isMockResponse) console.log('❌ Real mode: FAIL (Received mock response when asking for real)');
            else {
                // It might return valid data or error, both mean it bypassed the mock block.
                console.log('✅ Real mode: SUCCESS (Did NOT receive mock response, likely hit real API logic)');
            }
        }

    } catch (error) {
        console.error('Failed to call API:', error);
    }
}

async function main() {
    await testGeneration(true);
    await testGeneration(false);
}

main();
