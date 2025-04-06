
/**
 * Formats a date string to the Brazilian locale format
 */
export const formatDateBR = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Calculates the center point from a list of occurrences with coordinates
 */
export const calculateMapCenter = (
  items: Array<{ latitude?: number; longitude?: number }>
): [number, number] => {
  const validItems = items.filter(item => item.latitude && item.longitude);
  
  if (validItems.length === 0) {
    // Default to São Paulo if no valid coordinates
    return [-23.550520, -46.633308];
  }
  
  const sumLat = validItems.reduce((sum, item) => sum + (item.latitude || 0), 0);
  const sumLng = validItems.reduce((sum, item) => sum + (item.longitude || 0), 0);
  
  return [
    sumLat / validItems.length,
    sumLng / validItems.length
  ];
};

/**
 * Determines the appropriate zoom level based on the number of items
 */
export const determineZoomLevel = (itemCount: number): number => {
  if (itemCount === 0) return 12;
  if (itemCount === 1) return 15;
  if (itemCount <= 3) return 13;
  return 12;
};
