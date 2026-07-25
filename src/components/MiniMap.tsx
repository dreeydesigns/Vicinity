import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Match, VenueOption } from '../types';

interface MiniMapProps {
  matches: Match[];
  venues?: VenueOption[];
}

export function MiniMap({ matches, venues = [] }: MiniMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 300;
    const height = 300;
    const maxRadius = 2000; // max distance to represent (meters) (venue max)
    const center = { x: width / 2, y: height / 2 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Draw radar rings
    const rings = [33, 66, 100];
    rings.forEach((r) => {
      svg.append('circle')
        .attr('cx', center.x)
        .attr('cy', center.y)
        .attr('r', (r / 100) * (width / 2 - 20))
        .attr('fill', 'none')
        .attr('stroke', '#E2E8F0')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4');
    });

    // Draw crosshairs
    svg.append('line')
      .attr('x1', center.x)
      .attr('y1', 20)
      .attr('x2', center.x)
      .attr('y2', height - 20)
      .attr('stroke', '#E2E8F0')
      .attr('stroke-width', 1);

    svg.append('line')
      .attr('x1', 20)
      .attr('y1', center.y)
      .attr('x2', width - 20)
      .attr('y2', center.y)
      .attr('stroke', '#E2E8F0')
      .attr('stroke-width', 1);

    // Draw me (center)
    svg.append('circle')
      .attr('cx', center.x)
      .attr('cy', center.y)
      .attr('r', 8)
      .attr('fill', '#7C3AED')
      .attr('stroke', '#FFF')
      .attr('stroke-width', 2);
    
    // Draw me pulse
    const pulseMe = () => {
      svg.append('circle')
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
      // Return a simple character for the marker
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

      const group = svg.append('g')
        .attr('transform', `translate(${x},${y})`);

      group.append('circle')
        .attr('r', 10)
        .attr('fill', '#FFF')
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
      // Use a smaller max radius for matches so they appear closer
      const matchMaxRadius = 100;
      const distancePx = Math.min((match.triggerDistance / matchMaxRadius) * (width / 2 - 20), width / 2 - 20);
      
      const angle = Math.random() * Math.PI * 2;
      
      const x = center.x + Math.cos(angle) * distancePx;
      const y = center.y + Math.sin(angle) * distancePx;

      const group = svg.append('g')
        .attr('transform', `translate(${x},${y})`);

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
        .attr('fill', '#64748B');
    });

  }, [matches, venues]);

  return (
    <div className="flex flex-col items-center bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 self-start w-full text-center">Live Radar</h3>
      <svg 
        ref={svgRef} 
        width={300} 
        height={300} 
        viewBox="0 0 300 300"
        className="max-w-full"
      />
    </div>
  );
}
