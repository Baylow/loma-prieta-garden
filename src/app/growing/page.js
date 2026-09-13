import { createClient } from '@/utils/supabase/server';
import GrowingViewer from './GrowingViewer';
import { Suspense } from 'react';

export default async function GrowingPage() {
  const supabase = await createClient();
  
  const { data: bedsData } = await supabase.from('garden_beds').select('*');
  
  // Sort beds 1 to 12
  const sortedBeds = (bedsData || []).sort((a, b) => {
    const numA = parseInt(a.bed_number.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.bed_number.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  // Ensure 12 beds are always present
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
        id: `bed-${i}`,
        bed_number: `Bed ${i}`,
        plant_name: 'Mixed Crops',
        description: 'Standard 10x3 redwood raised bed.',
        grid_data: Array(30).fill('')
      });
    }
  }

  return (
    <div className="container mt-8 animate-fade-in-down mb-12">
      <div className="text-center mb-8">
        <h1 className="mb-2">What's Growing</h1>
        <p className="text-muted" style={{ maxWidth: '650px', margin: '0 auto' }}>
          Explore the current vegetables, herbs, and flowers thriving across our 12 redwood raised beds.
          Scan any bed's placard in the physical garden to inspect its 10×3 planting grid!
        </p>
      </div>

      <Suspense fallback={<div className="text-center p-8 text-muted">Loading garden beds...</div>}>
        <GrowingViewer beds={all12Beds} />
      </Suspense>
    </div>
  );
}
