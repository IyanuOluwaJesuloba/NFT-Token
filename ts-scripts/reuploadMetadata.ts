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

async function reuploadMetadata() {
  console.log('Re-uploading NFT metadata to Pinata...\n');

  const isAuthenticated = await testConnection();
  if (!isAuthenticated) {
    return;
  }

  const assetsDir = path.join(__dirname, '..', 'nft-assets');
  const metadataDir = path.join(assetsDir, 'metadata');

  // Read existing hashes to preserve image hashes
  const existingHashesPath = path.join(assetsDir, 'ipfs-hashes.json');
  const existingHashes = JSON.parse(fs.readFileSync(existingHashesPath, 'utf8'));

  const results: UploadResult[] = [];

  console.log(`\nRe-uploading metadata for ${existingHashes.length} NFTs\n`);

  // Upload each metadata file
  for (const existing of existingHashes) {
    const tokenId = existing.tokenId;
    const metadataPath = path.join(metadataDir, `${tokenId}.json`);

    console.log(`\nProcessing NFT #${tokenId}...`);

    try {
      // Read metadata
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

      // Upload metadata
      const metadataHash = await uploadMetadataToPinata(metadata, tokenId);

      results.push({
        tokenId,
        imageHash: existing.imageHash, // Keep existing image hash
        metadataHash, // New metadata hash
      });

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to process NFT #${tokenId}`);
    }
  }

  // Save updated results
  const outputPath = path.join(assetsDir, 'ipfs-hashes.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log('\n' + '='.repeat(50));
  console.log('Re-upload Complete!');
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

// Run the re-upload
reuploadMetadata()
  .then(() => {
    console.log('All metadata re-uploaded successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Re-upload failed:', error);
    process.exit(1);
  });
