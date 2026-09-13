import { createClient } from '@/utils/supabase/server';
import WishlistClient from './WishlistClient';
import Link from 'next/link';

// Fallback seed items if table is brand new or not yet populated
const DEFAULT_FALLBACK_ITEMS = [
  {
    id: 'f1',
    title: 'Organic Potting Soil & Compost (2 cu ft bags)',
    description: 'OMRI organic certified mix for classroom seedling starts and bed revitalization.',
    category: 'Soil & Compost',
    quantity_needed: 6,
    quantity_claimed: 2,
    urgency: 'urgent'
  },
  {
    id: 'f2',
    title: 'Kid-Sized Garden Gloves (Small / Medium)',
    description: 'Washable nitrile-coated gardening gloves for K-5 hands.',
    category: 'Tools & Gear',
    quantity_needed: 15,
    quantity_claimed: 5,
    urgency: 'needed_soon'
  },
  {
    id: 'f3',
    title: 'Heirloom Winter Squash & Fall Seed Packets',
    description: 'Seeds for October planting units and cold-season cover crops.',
    category: 'Seeds & Starts',
    quantity_needed: 4,
    quantity_claimed: 1,
    urgency: 'normal'
  },
  {
    id: 'f4',
    title: 'Long-Stem Compost Dial Thermometer',
    description: 'Compost thermometer for students to measure heat in our 3-bin redwood composting system.',
    category: 'Tools & Gear',
    quantity_needed: 2,
    quantity_claimed: 0,
    urgency: 'needed_soon'
  },
  {
    id: 'f5',
    title: 'Cedar Bed Placard Stakes & Weatherproof Markers',
    description: 'Durable stakes and markers for Bed 1-12 identification.',
    category: 'Building Materials',
    quantity_needed: 12,
    quantity_claimed: 4,
    urgency: 'normal'
  },
  {
    id: 'f6',
    title: 'Child Watering Cans (1-Gallon with Rose Spout)',
    description: 'Gentle-flow watering cans for student watering rotations.',
    category: 'Tools & Gear',
    quantity_needed: 5,
    quantity_claimed: 2,
    urgency: 'needed_soon'
  }
];

export default async function WishlistPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  let currentUserProfile = null;
  if (user) {
    const { data: prof } = await supabase.from('profiles').select('name, email').eq('id', user.id).single();
    currentUserProfile = prof;
  }

  // Fetch wishlist items from Supabase
  let items = [];
  const { data: dbItems, error } = await supabase
    .from('wishlist_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !dbItems || dbItems.length === 0) {
    items = DEFAULT_FALLBACK_ITEMS;
  } else {
    items = dbItems;
  }

  // Fetch claims if available
  const { data: claims } = await supabase.from('wishlist_claims').select('*');

  return (
    <div className="container mt-8 animate-fade-in-down mb-12">
      <div className="text-center mb-8">
        <h1 className="mb-2">🎁 Garden Wishlist & Supply Drive</h1>
        <p className="text-muted" style={{ maxWidth: '650px', margin: '0 auto' }}>
          Help our living classroom flourish! Support Loma Prieta students by pledging needed tools, organic soil, seeds, or building supplies.
        </p>
      </div>

      <WishlistClient 
        initialItems={items} 
        claims={claims || []} 
        currentUserProfile={currentUserProfile} 
      />
    </div>
  );
}
