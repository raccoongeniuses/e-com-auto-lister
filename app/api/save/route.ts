import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ProjectPlatform } from '@prisma/client';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, description, hashtags, platform } = body;

        // Basic validation
        if (!title || !description || !platform) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Map platform string to enum
        let dbPlatform: ProjectPlatform;
        switch (platform) {
            case 'Shopee': dbPlatform = ProjectPlatform.Shopee; break;
            case 'Tokopedia': dbPlatform = ProjectPlatform.Tokopedia; break;
            case 'TikTok': dbPlatform = ProjectPlatform.TikTok; break;
            default: dbPlatform = ProjectPlatform.Shopee;
        }

        const savedListing = await prisma.ecomDb.create({
            data: {
                imageUrl: 'manual-save-placeholder', // We don't have the image blob in this request, using placeholder
                generatedTitle: title,
                generatedDescription: description,
                hashtags: hashtags || [],
                platform: dbPlatform,
            },
        });

        console.log('Manually saved listing to ecom_db:', savedListing.id);
        return NextResponse.json(savedListing);

    } catch (error) {
        console.error('Error saving listing:', error);
        return NextResponse.json({ error: 'Failed to save listing' }, { status: 500 });
    }
}
