import { createClient } from '@/utils/supabase/server';
import QRCode from 'qrcode';
import BedPlacards from './BedPlacards';
import Link from 'next/link';

export default async function BedQRPlacardsPage() {
  const supabase = await createClient();
  
  const { data: bedsData } = await supabase.from('garden_beds').select('*');
  
  // Sort beds 1 to 12
  const sortedBeds = (bedsData || []).sort((a, b) => {
    const numA = parseInt(a.bed_number.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.bed_number.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  // Ensure we have 12 beds represented
  const all12Beds = [];
  for (let i = 1; i <= 12; i++) {
    const existing = sortedBeds.find(b => {
      const num = parseInt(b.bed_number.replace(/\D/g, ''), 10);
      return num === i;
    });
    if (existing) {
      all12Beds.push(existing);
    } else {
      all12Beds.push({
        id: `virtual-bed-${i}`,
        bed_number: `Bed ${i}`,
        plant_name: 'Mixed Garden Crops',
        description: 'Standard 10x3 raised bed.',
        grid_data: Array(30).fill('')
      });
    }
  }

  // Generate QR Code data URLs for each bed
  const bedsWithQR = await Promise.all(
    all12Beds.map(async (bed) => {
      const bedNumOnly = bed.bed_number.replace(/\D/g, '') || '1';
      // URL that scanning the QR will open
      const destinationUrl = `https://loma-garden.vercel.app/growing?bed=${bedNumOnly}`;
      
      const qrDataUrl = await QRCode.toDataURL(destinationUrl, {
        width: 320,
        margin: 1,
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        }
      });

      // Extract non-empty plants from 10x3 grid
      const grid = Array.isArray(bed.grid_data) ? bed.grid_data : [];
      const distinctCrops = Array.from(new Set(grid.filter(c => c && c.trim() !== '')));

      return {
        ...bed,
        bedNumberOnly: bedNumOnly,
        destinationUrl,
        qrDataUrl,
        distinctCrops
      };
    })
  );

  return (
    <div className="container mt-8 mb-12">
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <Link href="/growing" style={{ fontSize: '0.875rem', color: 'var(--sapphire-blue)', textDecoration: 'underline' }}>
            &larr; Back to What's Growing
          </Link>
          <h1 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>Garden Bed QR Placards</h1>
          <p className="text-muted">Printable weather-resistant signs for Beds 1–12. Stake them in physical garden beds for visitors & students to scan!</p>
        </div>
        <div>
          <Link href="/growing" className="btn btn-secondary" style={{ marginRight: '0.5rem' }}>
            View Digital Beds
          </Link>
        </div>
      </div>

      <BedPlacards beds={bedsWithQR} />
    </div>
  );
}
