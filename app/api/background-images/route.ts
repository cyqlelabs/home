import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const files = fs.readdirSync(publicDir);

    // Match patterns: bg-1.png, bg-2.png, bg1.png, bg2.png, etc.
    const desktopPattern = /^bg-?\d+\.png$/;
    const mobilePattern = /^bg-?\d+-m\.png$/;

    // Get all background images
    const desktopImages = files
      .filter((file) => desktopPattern.test(file) && !file.includes('-m'))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      })
      .map((file) => `/${file}`);

    const mobileImages = files
      .filter((file) => mobilePattern.test(file))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      })
      .map((file) => `/${file}`);

    // Fallback to desktop images if no mobile versions exist
    const finalMobileImages = mobileImages.length > 0 ? mobileImages : desktopImages;

    return NextResponse.json({
      desktop: desktopImages,
      mobile: finalMobileImages,
      count: {
        desktop: desktopImages.length,
        mobile: finalMobileImages.length,
      },
    });
  } catch (error) {
    console.error('Error reading background images:', error);
    return NextResponse.json(
      {
        desktop: ['/bg1.png', '/bg2.png'],
        mobile: ['/bg1-m.png', '/bg2-m.png'],
      },
      { status: 500 },
    );
  }
}
