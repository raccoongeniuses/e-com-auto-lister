import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '@/lib/prisma';
import { ProjectPlatform } from '@prisma/client';


export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const platform = formData.get('platform') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        console.log('API Key configured:', !!apiKey);
        if (!apiKey) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is not configured in server environment' }, { status: 500 });
        }

        const useMockFlag = formData.get('useMock');
        // If flag is present, respect it. Otherwise fallback to env/dev check.
        const useMock = useMockFlag !== null
            ? useMockFlag === 'true'
            : (process.env.MOCK_AI === 'true' || process.env.NODE_ENV === 'development');

        if (useMock) {

            const mockResponse = {
                title: `[MOCK] Amazing Product for ${platform}`,
                description: `[MOCK] This is a simulated high-quality description for the product on ${platform}. It highlights key features and benefits in a persuasive manner, suitable for the Indonesian market.\n\n- Feature 1: Great quality\n- Feature 2: Affordable`,
                hashtags: ['#mock', '#test', '#ecommerce', '#indonesia', '#quality']
            };

            // Auto-save removed in favor of manual save


            return NextResponse.json(mockResponse);
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using the latest stable flash version (002) to attempt to bypass quota/404 issues
        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');

        const prompt = `
      Act as an expert e-commerce copywriter for the Indonesian market.
      Analyze this product image and generate a listing for ${platform}.
      
      Return the response in strictly valid JSON format with the following keys:
      - title: A catchy, SEO-friendly title in Bahasa Indonesia.
      - description: A persuasive description in Bahasa Indonesia, including features and benefits, formatted with newlines.
      - hashtags: An array of 5-10 relevant hashtags.
    `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: file.type,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Improved JSON extraction
        let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // Attempt to find the first '{' and last '}' to extract valid JSON if there is extra text
        const firstOpen = cleanText.indexOf('{');
        const lastClose = cleanText.lastIndexOf('}');
        if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
            cleanText = cleanText.substring(firstOpen, lastClose + 1);
        }

        try {
            const jsonResponse = JSON.parse(cleanText);

            // Auto-save removed in favor of manual save

            return NextResponse.json(jsonResponse);

        } catch (e) {
            console.error('Failed to parse JSON. Raw text:', text);
            console.error('Cleaned text:', cleanText);
            return NextResponse.json({
                error: 'Failed to parse AI response. Check server logs for raw output.',
                raw: text
            }, { status: 500 });
        }

    } catch (error) {
        console.error('Error generating listing:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });

    }
}
