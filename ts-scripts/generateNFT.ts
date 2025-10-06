import * as fs from 'fs';
import * as path from 'path';

// Enhanced traits with more sophisticated variety
const TRAITS = {
  backgrounds: [
    { name: 'Deep Space', gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', rarity: 'Common' },
    { name: 'Cyber Violet', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', rarity: 'Common' },
    { name: 'Neon Sunset', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', rarity: 'Rare' },
    { name: 'Arctic Teal', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', rarity: 'Rare' },
    { name: 'Molten Gold', gradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)', rarity: 'Epic' },
    { name: 'Emerald Matrix', gradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)', rarity: 'Epic' },
    { name: 'Royal Amethyst', gradient: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)', rarity: 'Legendary' },
  ],
  
  shapes: [
    { type: 'Hexagon', name: 'Hex Grid' },
    { type: 'Circle', name: 'Orbital' },
    { type: 'Square', name: 'Cubic' },
    { type: 'Triangle', name: 'Prismatic' },
    { type: 'Pentagon', name: 'Penta' },
  ],
  
  patterns: [
    { name: 'Particles', type: 'particles' },
    { name: 'Waves', type: 'waves' },
    { name: 'Grid', type: 'grid' },
    { name: 'Rings', type: 'rings' },
    { name: 'Geometric', type: 'geometric' },
  ],
  
  effects: [
    { name: 'Glow', type: 'glow' },
    { name: 'Halo', type: 'halo' },
    { name: 'Pulse', type: 'pulse' },
    { name: 'Shimmer', type: 'shimmer' },
  ]
};

function generatePattern(patternType: string, tokenId: number): string {
  const seed = tokenId;
  
  switch (patternType) {
    case 'particles':
      let particles = '';
      for (let i = 0; i < 30; i++) {
        const x = (seed * 37 + i * 47) % 480 + 10;
        const y = (seed * 53 + i * 71) % 480 + 10;
        const r = (seed + i * 13) % 3 + 1;
        const opacity = ((seed + i * 7) % 30 + 20) / 100;
        particles += `<circle cx="${x}" cy="${y}" r="${r}" fill="white" opacity="${opacity}"/>`;
      }
      return particles;
      
    case 'waves':
      let waves = '';
      for (let i = 0; i < 3; i++) {
        const offset = i * 80;
        const opacity = (30 - i * 5) / 100;
        waves += `<path d="M0,${250 + offset} Q125,${200 + offset} 250,${250 + offset} T500,${250 + offset}" 
                  stroke="white" fill="none" opacity="${opacity}" stroke-width="2"/>`;
      }
      return waves;
      
    case 'grid':
      let grid = '';
      for (let i = 1; i < 10; i++) {
        const opacity = 0.08;
        grid += `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="500" stroke="white" opacity="${opacity}" stroke-width="1"/>`;
        grid += `<line x1="0" y1="${i * 50}" x2="500" y2="${i * 50}" stroke="white" opacity="${opacity}" stroke-width="1"/>`;
      }
      return grid;
      
    case 'rings':
      let rings = '';
      for (let i = 1; i <= 4; i++) {
        const r = i * 60;
        const opacity = (25 - i * 4) / 100;
        rings += `<circle cx="250" cy="250" r="${r}" fill="none" stroke="white" opacity="${opacity}" stroke-width="2"/>`;
      }
      return rings;
      
    case 'geometric':
      let geo = '';
      const positions = [[100, 100], [400, 100], [100, 400], [400, 400], [250, 250]];
      positions.forEach((pos, i) => {
        const size = 40;
        const opacity = 0.15;
        geo += `<rect x="${pos[0] - size/2}" y="${pos[1] - size/2}" width="${size}" height="${size}" 
                fill="none" stroke="white" opacity="${opacity}" stroke-width="2" transform="rotate(${45 + i * 15} ${pos[0]} ${pos[1]})"/>`;
      });
      return geo;
      
    default:
      return '';
  }
}

function generateShape(shapeType: string, x: number, y: number, size: number): string {
  switch (shapeType) {
    case 'Hexagon':
      const points: string[] = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        points.push(`${x + size * Math.cos(angle)},${y + size * Math.sin(angle)}`);
      }
      return `<polygon points="${points.join(' ')}" fill="white" opacity="0.9" filter="url(#glow)"/>`;
      
    case 'Circle':
      return `<circle cx="${x}" cy="${y}" r="${size}" fill="white" opacity="0.9" filter="url(#glow)"/>`;
      
    case 'Square':
      return `<rect x="${x - size}" y="${y - size}" width="${size * 2}" height="${size * 2}" 
              fill="white" opacity="0.9" filter="url(#glow)" rx="10"/>`;
      
    case 'Triangle':
      return `<polygon points="${x},${y - size} ${x + size * 0.866},${y + size * 0.5} ${x - size * 0.866},${y + size * 0.5}" 
              fill="white" opacity="0.9" filter="url(#glow)"/>`;
      
    case 'Pentagon':
      const pentaPoints: string[] = [];
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
        pentaPoints.push(`${x + size * Math.cos(angle)},${y + size * Math.sin(angle)}`);
      }
      return `<polygon points="${pentaPoints.join(' ')}" fill="white" opacity="0.9" filter="url(#glow)"/>`;
      
    default:
      return '';
  }
}

function generateAdvancedNFT(tokenId: number) {
  const background = TRAITS.backgrounds[tokenId % TRAITS.backgrounds.length];
  const shape = TRAITS.shapes[tokenId % TRAITS.shapes.length];
  const pattern = TRAITS.patterns[tokenId % TRAITS.patterns.length];
  const effect = TRAITS.effects[tokenId % TRAITS.effects.length];
  
  const patternSVG = generatePattern(pattern.type, tokenId);
  const shapeSVG = generateShape(shape.type, 250, 250, 80);
  
  // Generate accent color based on background
  const accentColors = ['#00f2fe', '#f5576c', '#fee140', '#43e97b', '#fa709a', '#a6c1ee', '#fbc2eb'];
  const accentColor = accentColors[tokenId % accentColors.length];
  
  const svg = `
<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg${tokenId}" x1="0%" y1="0%" x2="100%" y2="100%">
      ${background.gradient.match(/linear-gradient\(.*?,\s*(.*)\)/)?.[1].split(',').map((color, i, arr) => {
        const percent = (i / (arr.length - 1)) * 100;
        return `<stop offset="${percent}%" style="stop-color:${color.trim().split(' ')[0]};stop-opacity:1" />`;
      }).join('\n      ')}
    </linearGradient>
    
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <filter id="softGlow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <radialGradient id="centerGlow${tokenId}">
      <stop offset="0%" style="stop-color:${accentColor};stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <!-- Background Gradient -->
  <rect width="500" height="500" fill="url(#bg${tokenId})"/>
  
  <!-- Pattern Overlay -->
  ${patternSVG}
  
  <!-- Center Glow Effect -->
  <circle cx="250" cy="250" r="150" fill="url(#centerGlow${tokenId})"/>
  
  <!-- Outer Ring -->
  <circle cx="250" cy="250" r="120" fill="none" stroke="white" stroke-width="2" opacity="0.15"/>
  
  <!-- Main Shape -->
  ${shapeSVG}
  
  <!-- Inner Accent -->
  <circle cx="250" cy="250" r="50" fill="${accentColor}" opacity="0.2" filter="url(#softGlow)"/>
  
  <!-- Minimal Badge -->
  <g opacity="0.9">
    <rect x="15" y="455" width="80" height="30" fill="black" opacity="0.5" rx="15"/>
    <text x="55" y="475" font-family="Arial, sans-serif" font-size="14" fill="white" 
          text-anchor="middle" font-weight="600" opacity="0.9">
      #${String(tokenId).padStart(4, '0')}
    </text>
  </g>
</svg>`;

  return {
    svg: svg.trim(),
    traits: {
      background: background.name,
      shape: shape.name,
      pattern: pattern.name,
      effect: effect.name,
      rarity: background.rarity
    }
  };
}

function generateMetadata(tokenId: number, imageUri: string, traits: any) {
  return {
    name: `Genesis #${tokenId}`,
    description: `A unique generative artwork featuring ${traits.shape} geometry with ${traits.pattern} pattern on ${traits.background} backdrop. Part of the Genesis Collection.`,
    image: imageUri,
    attributes: [
      {
        trait_type: 'Shape',
        value: traits.shape
      },
      {
        trait_type: 'Background',
        value: traits.background
      },
      {
        trait_type: 'Pattern',
        value: traits.pattern
      },
      {
        trait_type: 'Effect',
        value: traits.effect
      },
      {
        trait_type: 'Rarity',
        value: traits.rarity
      },
      {
        trait_type: 'Token ID',
        value: tokenId,
        display_type: 'number'
      },
      {
        trait_type: 'Generation',
        value: 1,
        display_type: 'number'
      }
    ],
    external_url: 'https://your-website.com',
  };
}

async function generateCollection(startId: number, count: number) {
  const outputDir = path.join(process.cwd(), 'nft-assets');
  const imagesDir = path.join(outputDir, 'images');
  const metadataDir = path.join(outputDir, 'metadata');
  
  [outputDir, imagesDir, metadataDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  console.log('\n✨ Generating Genesis NFT Collection...\n');
  console.log('━'.repeat(60));
  
  for (let i = 0; i < count; i++) {
    const tokenId = startId + i;
    const { svg, traits } = generateAdvancedNFT(tokenId);
    
    const imagePath = path.join(imagesDir, `${tokenId}.svg`);
    fs.writeFileSync(imagePath, svg);
    
    const metadata = generateMetadata(tokenId, `${tokenId}.svg`, traits);
    const metadataPath = path.join(metadataDir, `${tokenId}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    
    console.log(`✓ Genesis #${String(tokenId).padStart(4, '0')} | ${traits.shape} | ${traits.background} | ${traits.rarity}`);
  }
  
  console.log('━'.repeat(60));
  console.log(`\n✨ Generated ${count} NFTs successfully!\n`);
  console.log(`📁 Images: ${imagesDir}`);
  console.log(`📄 Metadata: ${metadataDir}\n`);
  console.log('Next steps:');
  console.log('  1. Review your NFTs in the nft-assets folder');
  console.log('  2. Upload to Pinata');
  console.log('  3. Deploy and mint with Foundry\n');
}

const START_TOKEN_ID = 0;
const COLLECTION_SIZE = 10;

generateCollection(START_TOKEN_ID, COLLECTION_SIZE)
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });