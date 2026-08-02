import { NextResponse } from 'next/server';

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Sohan Tamang', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', wpm: 142, accuracy: 99.4, coins: 18400, streak: 42, isPremium: true, country: 'Nepal' },
  { rank: 2, name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80', wpm: 138, accuracy: 98.8, coins: 16200, streak: 28, isPremium: true, country: 'USA' },
  { rank: 3, name: 'Aarav Sharma', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', wpm: 112, accuracy: 98.2, coins: 1420, streak: 7, isPremium: true, country: 'Nepal' },
  { rank: 4, name: 'Bipul Thapa', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', wpm: 108, accuracy: 97.5, coins: 9400, streak: 19, isPremium: false, country: 'Nepal' },
  { rank: 5, name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', wpm: 105, accuracy: 96.9, coins: 8100, streak: 14, isPremium: true, country: 'Estonia' },
  { rank: 6, name: 'Rohan Bhattarai', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', wpm: 99, accuracy: 96.0, coins: 6500, streak: 11, isPremium: false, country: 'Nepal' },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get('region');
  const onlyPremium = searchParams.get('premium') === 'true';

  let data = [...MOCK_LEADERBOARD];
  if (region === 'nepal') {
    data = data.filter((u) => u.country === 'Nepal');
  }
  if (onlyPremium) {
    data = data.filter((u) => u.isPremium);
  }

  return NextResponse.json({ leaderboard: data });
}
