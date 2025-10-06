import pinataSDK from '@pinata/sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY!,
  process.env.PINATA_SECRET_API_KEY!
);

interface UploadResult {
  tokenId: number;
  imageHash: string;
  metadataHash: string;
}

async function testConnection() {
  try {
    const result = await pinata.testAuthentication();
    console.log('✓ Pinata authentication successful');
    return true;
  } catch (error) {
    console.error('✗ Pinata authentication failed:', error);
    return false;
  }
}

async function uploadImageToPinata(filePath: string, tokenId: number): Promise<string> {
  try {
    const readableStream = fs.createReadStream(filePath);
    const options = {
      pinataMetadata: {
        name: `NFT-${tokenId}-Image`,
      },
      pinataOptions: {
        cidVersion: 0 as const,
      },
    };

    const result = await pinata.pinFileToIPFS(readableStream, options);
    console.log(`✓ Uploaded image #${tokenId}: ipfs://${result.IpfsHash}`);
    return result.IpfsHash;
  } catch (error) {
    console.error(`✗ Failed to upload image #${tokenId}:`, error);
    throw error;
  }
}

async function uploadMetadataToPinata(
  metadata: any,
  tokenId: number
): Promise<string> {
  try {
    const options = {
      pinataMetadata: {
        name: `NFT-${tokenId}-Metadata`,
      },
      pinataOptions: {
        cidVersion: 0 as const,
      },
    };

    const result = await pinata.pinJSONToIPFS(metadata, options);
    console.log(`✓ Uploaded metadata #${tokenId}: ipfs://${result.IpfsHash}`);
    return result.IpfsHash;
  } catch (error) {
    console.error(`✗ Failed to upload metadata #${tokenId}:`, error);
    throw error;
  }
}

async function uploadNFTCollection() {
  console.log('Starting NFT upload to Pinata...\n');

  const isAuthenticated = await testConnection();
  if (!isAuthenticated) {
    return;
  }

  const assetsDir = path.join(__dirname, '..', 'nft-assets');
  const imagesDir = path.join(assetsDir, 'images');
  const metadataDir = path.join(assetsDir, 'metadata');

  // Check if directories exist
  if (!fs.existsSync(imagesDir) || !fs.existsSync(metadataDir)) {
    console.error('✗ NFT assets not found. Run generateNFT.ts first.');
  }

  const imageFiles = fs.readdirSync(imagesDir).filter(f => f.endsWith('.svg'));
  const results: UploadResult[] = [];

  console.log(`\nFound ${imageFiles.length} images to upload\n`);

  // Upload each NFT
  for (const imageFile of imageFiles) {
    const tokenId = parseInt(path.basename(imageFile, '.svg'));
    const imagePath = path.join(imagesDir, imageFile);
    const metadataPath = path.join(metadataDir, `${tokenId}.json`);

    console.log(`\nProcessing NFT #${tokenId}...`);

    try {
      // Upload image first
      const imageHash = await uploadImageToPinata(imagePath, tokenId);

      // Read and update metadata with IPFS image URI
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      metadata.image = `ipfs://${imageHash}`;

      // Upload metadata
      const metadataHash = await uploadMetadataToPinata(metadata, tokenId);

      results.push({
        tokenId,
        imageHash,
        metadataHash,
      });

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to process NFT #${tokenId}`);
    }
  }

  // Save results
  const outputPath = path.join(assetsDir, 'ipfs-hashes.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log('\n' + '='.repeat(50));
  console.log('Upload Complete!');
  console.log('='.repeat(50));
  console.log(`\nResults saved to: ${outputPath}\n`);

  // Display summary
  results.forEach(result => {
    console.log(`NFT #${result.tokenId}:`);
    console.log(`  Image: ipfs://${result.imageHash}`);
    console.log(`  Metadata: ipfs://${result.metadataHash}`);
    console.log(`  Gateway: https://gateway.pinata.cloud/ipfs/${result.metadataHash}\n`);
  });

  return results;
}

// Run the upload
uploadNFTCollection()
  .then(() => {
    console.log('All uploads completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Upload failed:', error);
    process.exit(1);
  });