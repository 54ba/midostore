import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ params: string[] }> }
) {
    try {
        const resolvedParams = await params;
        const [width, height, ...textParts] = resolvedParams.params;
        const text = textParts.length > 0 ? textParts.join('/') : 'Placeholder';

        // Parse dimensions
        const w = parseInt(width) || 400;
        const h = parseInt(height) || 300;

        // Create a simple SVG placeholder
        const svg = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16"
              fill="#6b7280" text-anchor="middle" dy=".3em">
          ${text}
        </text>
        <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="12"
              fill="#9ca3af" text-anchor="middle">
          ${w} × ${h}
        </text>
      </svg>
    `;

        return new NextResponse(svg, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error('Placeholder image generation error:', error);
        return new NextResponse('Error generating placeholder', { status: 500 });
    }
}