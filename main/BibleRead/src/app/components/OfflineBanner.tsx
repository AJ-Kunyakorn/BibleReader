import { WifiOff } from 'lucide-react';
import { useBible } from '../contexts/BibleContext';

export function OfflineBanner() {
  const { isOnline } = useBible();

  if (isOnline) return null;

  return (
    <div className="bg-amber-500 text-white px-4 py-2 text-sm flex items-center justify-center gap-2">
      <WifiOff className="w-4 h-4" />
      <span>You're offline. Some features may be limited.</span>
    </div>
  );
}
