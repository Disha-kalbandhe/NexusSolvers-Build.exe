// Utility functions for admin components

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'text-red-500';
    case 'high':
      return 'text-orange-500';
    case 'medium':
      return 'text-yellow-500';
    case 'low':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
}

export function getSeverityBg(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'bg-red-500/10';
    case 'high':
      return 'bg-orange-500/10';
    case 'medium':
      return 'bg-yellow-500/10';
    case 'low':
      return 'bg-green-500/10';
    default:
      return 'bg-gray-500/10';
  }
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
