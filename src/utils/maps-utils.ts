
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
) => {
  const validItems = items.filter(item => item.latitude && item.longitude);
  
  if (validItems.length === 0) {
    // Default to São Paulo if no valid coordinates
    return { lat: -23.550520, lng: -46.633308 };
  }
  
  const sumLat = validItems.reduce((sum, item) => sum + (item.latitude || 0), 0);
  const sumLng = validItems.reduce((sum, item) => sum + (item.longitude || 0), 0);
  
  return { 
    lat: sumLat / validItems.length, 
    lng: sumLng / validItems.length 
  };
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

/**
 * Creates the HTML content for map info windows
 */
export const createInfoWindowContent = (
  title: string,
  location: string,
  date: string
): string => {
  const formattedDate = formatDateBR(date);
  
  return `
    <div style="padding: 10px; max-width: 200px;">
      <h3 style="margin-top: 0; font-weight: bold;">${title}</h3>
      <p>${location}</p>
      <p>Data: ${formattedDate}</p>
    </div>
  `;
};
