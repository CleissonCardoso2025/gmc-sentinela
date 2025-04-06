
import React, { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

const OccurrenceMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // We'll use a dummy loader to simulate map loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    const loadMap = async () => {
      try {
        if (typeof window !== 'undefined' && mapRef.current) {
          // In a real implementation, we would use the actual echarts library
          // Since we don't have it installed, this is a placeholder
          console.log("Map would be initialized here");

          // Visualization would be created here
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading map:", error);
        setIsLoading(false);
      }
    };
    loadMap();
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Card className="w-full overflow-hidden shadow-md relative animate-fade-up">
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-lg font-semibold text-gray-800">Mapa de Ocorrências</h2>
      </div>
      
      {isLoading ? (
        <div className="w-full h-[300px] md:h-[400px] p-4 flex items-center justify-center">
          <div className="space-y-4 w-full">
            <Skeleton className="h-[250px] md:h-[350px] w-full rounded-md" />
          </div>
        </div>
      ) : (
        <div 
          id="occurrenceMap" 
          ref={mapRef} 
          className="w-full h-[300px] md:h-[400px] bg-gray-50" 
          style={{
            backgroundImage: "url('https://raw.githubusercontent.com/apache/echarts/master/map/json/brazil.json')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(30%)"
          }}
        >
          {/* This is a placeholder - in real implementation this would be rendered by echarts */}
          <div className="w-full h-full relative p-4 pt-12">
            <div className="absolute top-1/4 left-1/3 h-6 w-6 bg-gcm-500 rounded-full opacity-80 animate-pulse"></div>
            <div className="absolute top-1/2 right-1/3 h-5 w-5 bg-gcm-600 rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 h-4 w-4 bg-gcm-700 rounded-full opacity-60 animate-pulse"></div>
            
            <div className="absolute w-full h-full flex items-center justify-center text-gray-400 font-light italic">
              <p>{isMobile ? "Mapa de ocorrências" : "Mapa com localizações das ocorrências"}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default OccurrenceMap;
