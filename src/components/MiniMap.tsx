import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Map, Globe, Plus, Minus, X, Car, Info, Share2 } from 'lucide-react';
import { Match, VenueOption } from '../types';

interface MiniMapProps {
  matches: Match[];
  venues?: VenueOption[];
}

export function MiniMap({ matches, venues = [] }: MiniMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [mapView, setMapView] = useState<'street' | 'satellite'>('street');
  const [selectedVenue, setSelectedVenue] = useState<VenueOption | null>(null);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 300;
    const height = 300;
    const maxRadius = 2000; // max distance to represent (meters) (venue max)
    const center = { x: width / 2, y: height / 2 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    // Add background click to reset
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .on('click', () => {
        setPanOffset({ x: 0, y: 0 });
        setZoomLevel(1);
        setSelectedVenue(null);
      });

    const mainGroup = svg.append('g')
      .style('transition', 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)')
      .attr('transform', `translate(${center.x},${center.y}) scale(${zoomLevel}) translate(${-center.x - panOffset.x},${-center.y - panOffset.y})`);

    const strokeColor = mapView === 'satellite' ? '#475569' : '#E2E8F0';

    // Draw radar rings
    const rings = [33, 66, 100];
    rings.forEach((r) => {
      mainGroup.append('circle')
        .attr('cx', center.x)
        .attr('cy', center.y)
        .attr('r', (r / 100) * (width / 2 - 20))
        .attr('fill', 'none')
        .attr('stroke', strokeColor)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4');
    });

    // Draw crosshairs
    mainGroup.append('line')
      .attr('x1', center.x)
      .attr('y1', 20)
      .attr('x2', center.x)
      .attr('y2', height - 20)
      .attr('stroke', strokeColor)
      .attr('stroke-width', 1);

    mainGroup.append('line')
      .attr('x1', 20)
      .attr('y1', center.y)
      .attr('x2', width - 20)
      .attr('y2', center.y)
      .attr('stroke', strokeColor)
      .attr('stroke-width', 1);

    // Draw traffic layer
    if (showTraffic) {
      const trafficGroup = mainGroup.append('g').attr('class', 'traffic-layer');
      
      const drawTraffic = (r: number, color: string, dash: string, opacity: number) => {
        trafficGroup.append('circle')
          .attr('cx', center.x)
          .attr('cy', center.y)
          .attr('r', r)
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', 3)
          .attr('stroke-dasharray', dash)
          .attr('stroke-linecap', 'round')
          .attr('opacity', opacity);
      };
      
      drawTraffic((33 / 100) * (width / 2 - 20) + 5, '#EF4444', '15, 25, 35, 10', 0.7); // Red
      drawTraffic((66 / 100) * (width / 2 - 20) - 5, '#F59E0B', '20, 15, 50, 15', 0.6); // Orange
      drawTraffic((66 / 100) * (width / 2 - 20) + 15, '#10B981', '40, 10, 20, 10', 0.5); // Green
    }

    // Draw me (center)
    mainGroup.append('circle')
      .attr('cx', center.x)
      .attr('cy', center.y)
      .attr('r', 8)
      .attr('fill', '#7C3AED')
      .attr('stroke', '#FFF')
      .attr('stroke-width', 2);
    
    // Draw me pulse
    const pulseMe = () => {
      mainGroup.append('circle')
        .attr('cx', center.x)
        .attr('cy', center.y)
        .attr('r', 8)
        .attr('fill', 'none')
        .attr('stroke', '#7C3AED')
        .attr('stroke-width', 2)
        .attr('opacity', 0.5)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr('r', 24)
        .attr('opacity', 0)
        .on('end', function() {
          d3.select(this).remove();
          pulseMe();
        });
    };
    pulseMe();

    const getVenueColor = (category: string) => {
      if (category.includes('cafe')) return '#D97706'; // amber
      if (category.includes('bar')) return '#DB2777'; // pink
      if (category.includes('park')) return '#10B981'; // emerald
      return '#64748B'; // slate
    };

    const getVenueSymbol = (category: string) => {
      if (category.includes('cafe')) return '☕';
      if (category.includes('bar')) return '🍸';
      if (category.includes('park')) return '🌲';
      return '📍';
    };

    // Draw venues
    venues.forEach((venue, i) => {
      const distancePx = Math.min((venue.distanceMeters / maxRadius) * (width / 2 - 20), width / 2 - 20);
      const angle = (i * Math.PI * 2) / venues.length + Math.PI / 4;
      const x = center.x + Math.cos(angle) * distancePx;
      const y = center.y + Math.sin(angle) * distancePx;

      const group = mainGroup.append('g')
        .attr('transform', `translate(${x},${y})`)
        .style('cursor', 'pointer')
        .on('click', (e) => {
          e.stopPropagation();
          setSelectedVenue(venue);
          setPanOffset({ x: x - center.x, y: y - center.y });
          setZoomLevel(2.5);
        });

      group.append('circle')
        .attr('r', 10)
        .attr('fill', mapView === 'satellite' ? '#334155' : '#FFF')
        .attr('stroke', getVenueColor(venue.category))
        .attr('stroke-width', 1.5)
        .style('filter', 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))');

      group.append('text')
        .text(getVenueSymbol(venue.category))
        .attr('y', 4)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px');
    });

    // Draw matches
    matches.forEach(match => {
      const matchMaxRadius = 100;
      const distancePx = Math.min((match.triggerDistance / matchMaxRadius) * (width / 2 - 20), width / 2 - 20);
      
      const angle = Math.random() * Math.PI * 2;
      
      const x = center.x + Math.cos(angle) * distancePx;
      const y = center.y + Math.sin(angle) * distancePx;

      const group = mainGroup.append('g')
        .attr('transform', `translate(${x},${y})`)
        .style('cursor', 'pointer')
        .on('click', (e) => {
          e.stopPropagation();
          setPanOffset({ x: x - center.x, y: y - center.y });
          setZoomLevel(3);
        });

      // Pulse ring for match
      const pulseMatch = () => {
        group.append('circle')
          .attr('r', 6)
          .attr('fill', 'none')
          .attr('stroke', '#F59E0B')
          .attr('stroke-width', 1.5)
          .transition()
          .duration(1500)
          .ease(d3.easeLinear)
          .attr('r', 16)
          .attr('opacity', 0)
          .on('end', function() {
            d3.select(this).remove();
            pulseMatch();
          });
      };
      pulseMatch();

      group.append('circle')
        .attr('r', 6)
        .attr('fill', '#F59E0B')
        .attr('stroke', '#FFF')
        .attr('stroke-width', 2);

      group.append('text')
        .text(match.user.displayName.split(' ')[0])
        .attr('y', 16)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .attr('fill', mapView === 'satellite' ? '#CBD5E1' : '#64748B');
    });

  }, [matches, venues, zoomLevel, panOffset, mapView, showTraffic]);

  return (
    <div className={`relative flex flex-col items-center rounded-2xl p-4 shadow-sm border overflow-hidden transition-colors ${mapView === 'satellite' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
      <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${mapView === 'satellite' ? 'text-slate-300' : 'text-slate-400'}`}>
          Live Radar
        </h3>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setShowTraffic(t => !t)}
            className={`p-1.5 rounded-md backdrop-blur-md shadow-sm transition-colors ${showTraffic ? 'bg-amber-500 text-white hover:bg-amber-600' : mapView === 'satellite' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white/80 text-slate-700 hover:bg-slate-100'}`}
            title="Toggle Traffic"
          >
            <Car size={14} />
          </button>
          <button 
            onClick={() => setShowLegend(l => !l)}
            className={`p-1.5 rounded-md backdrop-blur-md shadow-sm transition-colors ${showLegend ? 'bg-violet-600 text-white hover:bg-violet-700' : mapView === 'satellite' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white/80 text-slate-700 hover:bg-slate-100'}`}
            title="Legend"
          >
            <Info size={14} />
          </button>
          <button 
            onClick={() => setMapView(v => v === 'street' ? 'satellite' : 'street')}
            className={`p-1.5 rounded-md backdrop-blur-md shadow-sm transition-colors ${mapView === 'satellite' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white/80 text-slate-700 hover:bg-slate-100'}`}
            title="Toggle Map View"
          >
            {mapView === 'street' ? <Globe size={14} /> : <Map size={14} />}
          </button>
        </div>
      </div>

      <svg 
        ref={svgRef} 
        width={300} 
        height={300} 
        viewBox="0 0 300 300"
        className="max-w-full z-0 mt-4 cursor-crosshair"
      />

      {/* Zoom controls */}
      <div className="absolute right-3 bottom-3 flex flex-col gap-1 z-10">
        <button 
          onClick={() => setZoomLevel(z => Math.min(z + 0.5, 3))}
          className={`p-1.5 rounded-t-md shadow-sm transition-colors backdrop-blur-md ${mapView === 'satellite' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white/80 text-slate-700 hover:bg-slate-100 border border-b-0 border-slate-200'}`}
        >
          <Plus size={16} />
        </button>
        <button 
          onClick={() => {
            setZoomLevel(z => Math.max(z - 0.5, 1));
            if (zoomLevel - 0.5 <= 1) setPanOffset({ x: 0, y: 0 }); // reset pan on full zoom out
          }}
          className={`p-1.5 rounded-b-md shadow-sm transition-colors backdrop-blur-md ${mapView === 'satellite' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white/80 text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
        >
          <Minus size={16} />
        </button>
      </div>

      {/* Legend Overlay */}
      {showLegend && (
        <div className="absolute top-12 left-3 right-3 z-20">
          <div className={`p-3 rounded-xl shadow-lg border flex flex-col gap-2 ${mapView === 'satellite' ? 'bg-slate-900/90 border-slate-700 text-slate-200' : 'bg-white/95 border-slate-100 text-slate-700'}`}>
            <h4 className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80">Map Legend</h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-[11px] font-medium">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-amber-600 bg-white flex items-center justify-center text-[10px]">☕</div>
                <span>Cafe / Coffee</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-pink-600 bg-white flex items-center justify-center text-[10px]">🍸</div>
                <span>Bar / Night</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-emerald-600 bg-white flex items-center justify-center text-[10px]">🌲</div>
                <span>Park / Outdoor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-slate-500 bg-white flex items-center justify-center text-[10px]">📍</div>
                <span>Other Venue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white bg-violet-600 shadow-sm ml-0.5"></div>
                <span className="ml-0.5">You</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white bg-amber-500 shadow-sm ml-0.5"></div>
                <span className="ml-0.5">Match</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Venue Info Overlay */}
      {selectedVenue && (
        <div className="absolute bottom-3 left-3 right-12 z-20">
          <div className={`p-3 rounded-xl shadow-lg relative flex flex-col gap-1 ${mapView === 'satellite' ? 'bg-slate-900/95 text-white border-slate-700 border' : 'bg-white text-slate-800 border-slate-100 border'}`}>
            <button 
              onClick={() => {
                setSelectedVenue(null);
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }} 
              className={`absolute top-2 right-2 p-1 rounded-full ${mapView === 'satellite' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}
            >
              <X size={14} />
            </button>
            <h4 className="text-sm font-bold pr-6 truncate">{selectedVenue.name}</h4>
            <p className={`text-xs truncate ${mapView === 'satellite' ? 'text-slate-400' : 'text-slate-500'}`}>{selectedVenue.address}</p>
            <p className={`text-xs font-semibold ${mapView === 'satellite' ? 'text-violet-400' : 'text-violet-600'}`}>
              Distance: {selectedVenue.distanceMeters < 1000 ? Math.round(selectedVenue.distanceMeters) + 'm' : (selectedVenue.distanceMeters / 1000).toFixed(1) + 'km'}
            </p>
            
            <div className="mt-1.5 flex">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`Check out this spot: ${selectedVenue.name} at ${selectedVenue.address}`);
                  alert('Location link copied to clipboard!');
                }}
                className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-colors ${mapView === 'satellite' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
              >
                <Share2 size={12} /> Share Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

