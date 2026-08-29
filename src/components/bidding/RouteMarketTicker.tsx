
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { TrendingUp, TrendingDown, Flame, Clock, Users, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';

const RouteMarketTicker = ({ onRouteSelect }) => {
  const [routes, setRoutes] = useState([
    { id: 1, code: 'DAL→LAX', price: 3200, change: 5.2, timeLeft: 3600, bidders: 14, isHot: true },
    { id: 2, code: 'HOU→SAV', price: 2100, change: -2.3, timeLeft: 7200, bidders: 8, isHot: false },
    { id: 3, code: 'PHX→ATL', price: 3400, change: 7.1, timeLeft: 1500, bidders: 21, isHot: true },
    { id: 4, code: 'CHI→ATL', price: 2400, change: 3.4, timeLeft: 5400, bidders: 12, isHot: false },
    { id: 5, code: 'LAX→PHX', price: 1150, change: -1.8, timeLeft: 4800, bidders: 9, isHot: false },
    { id: 6, code: 'EWR→DAL', price: 3600, change: 4.7, timeLeft: 2700, bidders: 18, isHot: true },
    { id: 7, code: 'ATL→CHI', price: 2300, change: 2.1, timeLeft: 3900, bidders: 15, isHot: false },
    { id: 8, code: 'DEN→LAX', price: 2600, change: -0.9, timeLeft: 6600, bidders: 7, isHot: false }
  ]);

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Update route data every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRoutes(prev => prev.map(route => ({
        ...route,
        price: route.price + (Math.random() - 0.5) * 200,
        change: route.change + (Math.random() - 0.5) * 2,
        timeLeft: Math.max(0, route.timeLeft - 1),
        bidders: route.bidders + (Math.random() > 0.8 ? 1 : 0)
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      setDragOverIndex(null);
      return;
    }

    const newRoutes = [...routes];
    const draggedRoute = newRoutes[draggedItem];
    
    // Remove the dragged item
    newRoutes.splice(draggedItem, 1);
    
    // Insert at new position
    newRoutes.splice(dropIndex, 0, draggedRoute);
    
    setRoutes(newRoutes);
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="ov-board text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center space-x-4">
          <div className="ov-eyebrow" style={{ color: '#6E7CFF' }}>
            <span className="dot" />LIVE ROUTE MARKET
          </div>
          <div className="flex items-center space-x-2">
            <div className="ov-livedot"></div>
            <span className="text-white/60 text-xs uppercase tracking-wide">Real-time</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-white/40">
          <span className="text-xs">Drag cards to reorder</span>
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      {/* Carousel Content */}
      <div className="p-4">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {routes.map((route, index) => (
              <CarouselItem 
                key={`${route.id}-${index}`} 
                className="pl-4 basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
              >
                <Card
                  className={`bg-transparent transition-all duration-300 cursor-move h-full ${
                    dragOverIndex === index ? 'bg-white/[0.06]' : ''
                  } ${
                    draggedItem === index ? 'opacity-50' : ''
                  }`}
                  style={{ background: dragOverIndex === index ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14 }}
                  onClick={() => onRouteSelect(route.code)}
                >
                  <CardContent className="p-4 h-full flex flex-col justify-between">
                    {/* Drag Handle */}
                    <div className="flex items-center justify-between mb-2">
                      <GripVertical className="w-4 h-4 text-white/30 cursor-move" />
                      <div className="ov-num text-xs text-white/40">#{index + 1}</div>
                    </div>

                    {/* Route Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="ov-num text-lg font-semibold text-white">{route.code}</span>
                        {route.isHot && (
                          <Badge className="text-white text-xs px-2 py-1" style={{ background: '#A8412F' }}>
                            <Flame className="w-3 h-3 mr-1" />
                            HOT
                          </Badge>
                        )}
                      </div>

                      <div className={`flex items-center space-x-1 ${
                        route.change >= 0 ? 'text-[#22C55E]' : 'text-[#F26D5B]'
                      }`}>
                        {route.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="ov-num text-sm font-medium">
                          {route.change >= 0 ? '+' : ''}{route.change.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white/50 text-xs uppercase tracking-wide">Current Bid</span>
                        <span className="ov-num text-xl font-semibold text-white">${route.price.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center text-sm mb-3">
                      <div className="flex items-center space-x-1 text-[#E8A33D]">
                        <Clock className="w-3 h-3" />
                        <span className="ov-num">{formatTime(route.timeLeft)} left</span>
                      </div>
                      <div className="flex items-center space-x-1 text-[#6E7CFF]">
                        <Users className="w-3 h-3" />
                        <span className="ov-num">{route.bidders} bidders</span>
                      </div>
                    </div>

                    {/* Price Movement Indicator */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-3 rounded-full"
                            style={{ opacity: 0.3 + Math.random() * 0.7, background: Math.random() > 0.5 ? '#22C55E' : '#F26D5B' }}
                          />
                        ))}
                      </div>
                      <Badge variant="outline" className="text-xs text-white/50" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                        Live
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation Arrows */}
          <CarouselPrevious className="hidden md:flex -left-12 text-white" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.15)' }} />
          <CarouselNext className="hidden md:flex -right-12 text-white" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.15)' }} />
        </Carousel>
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-3" style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center space-x-4">
            <span><span className="ov-num">{routes.length}</span> Active Routes</span>
            <span><span className="ov-num">{routes.filter(r => r.isHot).length}</span> Hot Markets</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="ov-livedot"></div>
            <span className="uppercase tracking-wide">Market Open</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteMarketTicker;
