import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Truck, 
  Package, 
  CheckCircle, 
  Clock, 
  Compass, 
  Info, 
  Navigation, 
  Layers, 
  Globe, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { Order } from '../../lib/mockData';

interface OrderTrackerProps {
  order: Order;
  shippingAddress?: string;
  shippingCity?: string;
}

export function OrderTracker({ order, shippingAddress = '742 Broadway, New York, NY 10003', shippingCity = 'New York' }: OrderTrackerProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isSimulationActive, setIsSimulationActive] = useState(true);
  const [mapLayer, setMapLayer] = useState<'cartography' | 'routes'>('cartography');

  // Parse destination city
  const destinationCity = shippingCity || 'New York';
  const isDomestic = !destinationCity.toLowerCase().includes('new york') && 
                     !destinationCity.toLowerCase().includes('broadway') &&
                     !destinationCity.toLowerCase().includes('us');

  // Stable coordinate nodes for map
  const originNode = { id: 'sto', name: 'Stockholm Hub (Origin)', x: 120, y: 150, info: 'Wooltown Primary Spinning & Storage Loom, Stockholm, SE' };
  const intermediateNode1 = isDomestic 
    ? { id: 'got', name: 'Gothenburg Terminal', x: 260, y: 180, info: 'Domestic Transit Sorting Node, West Sweden' }
    : { id: 'cph', name: 'Copenhagen Gateway', x: 240, y: 210, info: 'European Air Freight Distribution Node, Denmark' };

  const intermediateNode2 = isDomestic
    ? { id: 'mal', name: 'Malmö Distribution Spot', x: 380, y: 140, info: 'Local Delivery Fleet Hub, Skåne Region' }
    : { id: 'lon', name: 'London Dispatch Node', x: 400, y: 130, info: 'Trans-Atlantic Gateway & Custom Port, UK' };

  const destNode = {
    id: 'dest',
    name: `${destinationCity} Final Node`,
    x: 520,
    y: 160,
    info: `Deliverable destination terminal: ${shippingAddress}`
  };

  const mapNodes = [originNode, intermediateNode1, intermediateNode2, destNode];

  // Map progress calculation matching the order status
  let progressPercent = 0;
  let activeTruckCoords = { x: originNode.x, y: originNode.y };
  let routePathDescription = `M ${originNode.x} ${originNode.y} Q ${(originNode.x + intermediateNode1.x)/2} ${(originNode.y + intermediateNode1.y)/2 - 30} ${intermediateNode1.x} ${intermediateNode1.y} T ${intermediateNode2.x} ${intermediateNode2.y} T ${destNode.x} ${destNode.y}`;

  if (order.status === 'PENDING') {
    progressPercent = 0;
    activeTruckCoords = { x: originNode.x, y: originNode.y };
  } else if (order.status === 'PROCESSING') {
    progressPercent = 33;
    // Positioned along the first arch section
    activeTruckCoords = { x: (originNode.x + intermediateNode1.x) / 2 + 10, y: (originNode.y + intermediateNode1.y) / 2 - 12 };
  } else if (order.status === 'SHIPPED') {
    progressPercent = 66;
    // Positioned on the second section menuju intermediateNode2
    activeTruckCoords = { x: (intermediateNode1.x + intermediateNode2.x) / 2 + 15, y: (intermediateNode1.y + intermediateNode2.y) / 2 - 25 };
  } else if (order.status === 'DELIVERED') {
    progressPercent = 100;
    activeTruckCoords = { x: destNode.x, y: destNode.y };
  }

  // Stable virtual dates matching physical timestamps
  const getTimestamps = (createdAtStr: string, status: string) => {
    const baseDate = new Date(createdAtStr);
    
    const format = (date: Date) => {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    };

    // 1. Placed is always order.createdAt
    const placedTime = format(baseDate);

    // 2. Processing (usually 2.5 hours after placement)
    const procDate = new Date(baseDate.getTime() + 1000 * 60 * 60 * 2.5);
    const processingTime = format(procDate);

    // 3. In Transit (usually 14 hours after placement)
    const shipDate = new Date(baseDate.getTime() + 1000 * 60 * 60 * 14.5);
    const shippedTime = format(shipDate);

    // 4. Delivered (usually 38 hours after placement)
    const delivDate = new Date(baseDate.getTime() + 1000 * 60 * 60 * 38.2);
    const deliveredTime = format(delivDate);

    // Estimation dates for pending stages
    const estDate = new Date(baseDate.getTime() + 1000 * 60 * 60 * 48);
    const estDeliveryStr = estDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return {
      placed: { time: placedTime, label: 'Order Confirmed', desc: 'Secure payment cleared' },
      processing: { 
        time: status !== 'PENDING' ? processingTime : 'Awaiting compilation', 
        label: 'Compilation & Spinning', 
        desc: status === 'PENDING' ? 'Queued in sorting ledger' : 'Threads spun and packeted' 
      },
      shipped: { 
        time: (status === 'SHIPPED' || status === 'DELIVERED') ? shippedTime : 'Awaiting dispatch', 
        label: 'In Transit & Gateway', 
        desc: (status === 'SHIPPED' || status === 'DELIVERED') ? 'Sovereign Post Nordic dispatch' : 'Pending airline container slot' 
      },
      delivered: { 
        time: status === 'DELIVERED' ? deliveredTime : `Est: ${estDeliveryStr}`, 
        label: 'Arrived & Stitched', 
        desc: status === 'DELIVERED' ? 'Signed at delivery port' : 'Awaiting final route courier' 
      }
    };
  };

  const steps = getTimestamps(order.createdAt, order.status);

  // Set the default hovered node to the current active tracking post
  useEffect(() => {
    if (order.status === 'PENDING') setSelectedNode('sto');
    else if (order.status === 'PROCESSING') setSelectedNode(isDomestic ? 'got' : 'cph');
    else if (order.status === 'SHIPPED') setSelectedNode(isDomestic ? 'mal' : 'lon');
    else setSelectedNode('dest');
  }, [order.status, isDomestic]);

  return (
    <div className="bg-white border border-slate-200/80 p-5 md:p-6 mt-6 space-y-6 select-none shadow-[0_1px_3px_rgba(0,0,0,0.02)] rounded-none">
      
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.2em] font-extrabold text-[#705030] uppercase block">
            SOVEREIGN DISPATCH REGISTRY
          </span>
          <h4 className="font-serif text-base tracking-tight text-slate-900 font-medium mt-1">
            Tracking Transit Node &amp; Geographic Route
          </h4>
        </div>
        <div className="flex gap-2 font-mono text-[9px] uppercase tracking-widest flex-wrap">
          <button 
            type="button"
            onClick={() => setMapLayer(mapLayer === 'cartography' ? 'routes' : 'cartography')}
            className={`px-3 py-1 border transition-all flex items-center gap-1.5 focus:outline-none ${mapLayer === 'routes' ? 'bg-slate-950 text-white border-slate-950 font-bold' : 'bg-transparent text-slate-500 border-slate-200 hover:border-slate-400'}`}
          >
            <Compass className="w-3 h-3" /> {mapLayer === 'routes' ? 'Strict Routes' : 'Tactical Layers'}
          </button>
          <button 
            type="button" 
            onClick={() => setIsSimulationActive(!isSimulationActive)}
            className={`px-3 py-1 border transition-all flex items-center gap-1.5 focus:outline-none ${isSimulationActive ? 'bg-amber-50/60 border-amber-200 text-[#705030] font-bold' : 'bg-transparent text-slate-400 border-slate-100'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isSimulationActive ? 'bg-amber-600 animate-ping' : 'bg-slate-300'}`} />
            Live Transit Radar
          </button>
        </div>
      </div>

      {/* Vector Tracking Map Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Mapping grid */}
        <div className="lg:col-span-7 bg-slate-50/60 border border-slate-100 relative overflow-hidden aspect-[1.8/1] md:aspect-[2.1/1] p-3 flex flex-col justify-between">
          
          {/* Subtle Ambient Map Grid Lines */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_25px]" />
          
          {/* Top telemetry layer */}
          <div className="flex justify-between items-start z-10 font-mono text-[8.5px] uppercase tracking-wider text-slate-400 bg-white/75 backdrop-blur-xs p-2 border border-slate-100/50">
            <div>
              <span className="block font-bold text-[#705030]">DISPATCH CARRIER</span>
              <span className="text-slate-600 font-medium">SOVEREIGN POSTRONIC NORDIC</span>
            </div>
            <div className="text-right hidden sm:block">
              <span className="block font-bold">DISPATCH TYPE</span>
              <span className="text-slate-600 font-medium">CLIMATE-NEUTRAL FIBER EXPRESS</span>
            </div>
            <div className="text-right">
              <span className="block font-bold">ROUTE STATUS</span>
              <span className="text-[#705030] font-extrabold">{order.status}</span>
            </div>
          </div>

          {/* Interactive SVG Transit Plotter */}
          <svg className="absolute inset-0 w-full h-full z-0 p-4" viewBox="0 0 600 250" preserveAspectRatio="none">
            {/* Soft decorative geographic lines (Simulated land contour outlines for visual richness) */}
            <path 
              d="M 20,40 Q 90,30 140,80 T 260,150 T 400,100 T 580,200" 
              fill="none" 
              stroke="#ece9e2" 
              strokeWidth="1.5" 
              strokeDasharray="4,4" 
            />
            <path 
              d="M 50,220 Q 180,190 280,230 T 450,190 T 570,110" 
              fill="none" 
              stroke="#ece9e2" 
              strokeWidth="1" 
              strokeDasharray="6,4" 
            />

            {/* Simulated shipping routes mesh if layer is on */}
            {mapLayer === 'routes' && (
              <g className="opacity-40" stroke="#705030" strokeWidth="0.5" strokeDasharray="2,5">
                <line x1={originNode.x} y1={originNode.y} x2={destNode.x} y2={destNode.y} />
                <line x1={intermediateNode1.x} y1={intermediateNode1.y} x2={originNode.x} y2={originNode.y} />
                <line x1={intermediateNode2.x} y1={intermediateNode2.y} x2={destNode.x} y2={destNode.y} />
              </g>
            )}

            {/* Primary Delivery Path Route */}
            <path 
              d={routePathDescription}
              fill="none" 
              stroke="#e2e8f0" 
              strokeWidth="4" 
              strokeLinecap="round" 
            />
            
            {/* Completed Path Indicator */}
            <path 
              d={routePathDescription}
              fill="none" 
              stroke="#705030" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeDasharray="600" 
              strokeDashoffset={600 - (progressPercent * 6)} 
              className="transition-all duration-1000 ease-out"
            />

            {/* Live radar wave pulses on nodes */}
            {isSimulationActive && mapNodes.map((n, idx) => {
              const nodeActive = (n.id === 'sto') || 
                                 (n.id === intermediateNode1.id && (order.status === 'PROCESSING' || order.status === 'SHIPPED' || order.status === 'DELIVERED')) ||
                                 (n.id === intermediateNode2.id && (order.status === 'SHIPPED' || order.status === 'DELIVERED')) ||
                                 (n.id === 'dest' && order.status === 'DELIVERED');
              if (!nodeActive) return null;
              return (
                <circle 
                  key={`pulse-${idx}`}
                  cx={n.x} 
                  cy={n.y} 
                  r="12" 
                  fill="none" 
                  stroke={n.id === 'dest' ? '#10b981' : '#705030'} 
                  strokeWidth="1.5" 
                  className="animate-ping opacity-25"
                />
              );
            })}

            {/* Nodes Coordinates Points */}
            {mapNodes.map((n) => {
              const nodeActive = (n.id === 'sto') || 
                                 (n.id === intermediateNode1.id && (order.status === 'PROCESSING' || order.status === 'SHIPPED' || order.status === 'DELIVERED')) ||
                                 (n.id === intermediateNode2.id && (order.status === 'SHIPPED' || order.status === 'DELIVERED')) ||
                                 (n.id === 'dest' && order.status === 'DELIVERED');
              return (
                <g 
                  key={n.id} 
                  className="cursor-pointer" 
                  onClick={() => setSelectedNode(n.id)}
                  onMouseEnter={() => setSelectedNode(n.id)}
                >
                  {/* Point Ring outer */}
                  <circle 
                    cx={n.x} 
                    cy={n.y} 
                    r={selectedNode === n.id ? '9' : '6'} 
                    fill="#FAF9F6" 
                    stroke={selectedNode === n.id ? '#705030' : '#cbd5e1'} 
                    strokeWidth={selectedNode === n.id ? '2.5' : '1.5'}
                    className="transition-all duration-300"
                  />
                  {/* Inner center dot */}
                  <circle 
                    cx={n.x} 
                    cy={n.y} 
                    r="3.5" 
                    fill={nodeActive ? (n.id === 'dest' && order.status === 'DELIVERED' ? '#10b981' : '#705030') : '#94a3b8'} 
                  />
                </g>
              );
            })}

            {/* Pulsing Active Transit Vehicle (Truck/Flight) Icon Carrier */}
            {order.status !== 'DELIVERED' && (
              <g transform={`translate(${activeTruckCoords.x - 12}, ${activeTruckCoords.y - 12})`} className="filter drop-shadow-md">
                <circle cx="12" cy="12" r="11" fill="#705030" stroke="#ffffff" strokeWidth="1.5" />
                <foreignObject x="4" y="4" width="16" height="16">
                  <div className="text-white flex items-center justify-center w-full h-full">
                    {order.status === 'SHIPPED' ? (
                      <Truck className="w-2.5 h-2.5 animate-pulse" />
                    ) : (
                      <Package className="w-2.5 h-2.5" />
                    )}
                  </div>
                </foreignObject>
              </g>
            )}
          </svg>

          {/* Interactive node info panel */}
          <div className="z-10 bg-white/95 backdrop-blur-xs border border-slate-200/60 p-2.5 flex items-start gap-2 max-w-sm">
            <MapPin className="w-3.5 h-3.5 text-[#705030] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-mono text-[8px] uppercase font-bold text-slate-400 tracking-wider">
                Geographic Node Coordinate
              </p>
              <h5 className="font-serif text-xs text-slate-950 font-bold block leading-tight">
                {selectedNode ? mapNodes.find(n => n.id === selectedNode)?.name : 'Hover coordinates to trace'}
              </h5>
              <p className="text-[9px] text-[#705030] font-mono leading-tight mt-0.5">
                {selectedNode ? mapNodes.find(n => n.id === selectedNode)?.info : 'Interactive Scandinavian dispatch ledger.'}
              </p>
            </div>
          </div>

        </div>

        {/* Detailed Timeline Steps Ledger */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] font-mono tracking-[0.2em] font-extrabold text-slate-400 uppercase block border-b border-slate-100 pb-2">
            Detailed Dispatch Tracking Ledger
          </span>

          <div className="relative pl-6 space-y-4 pt-1">
            {/* Timeline Vertical Stitch Line */}
            <div className="absolute top-2 bottom-2 left-2.5 w-[1px] bg-slate-200" />

            {/* STEP 1: ORDER PLACED */}
            <div className="relative">
              <span className="absolute -left-5 top-0.5 w-4 h-4 rounded-full border border-slate-300 bg-white flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#705030]" />
              </span>
              <div>
                <div className="flex items-center justify-between">
                  <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    {steps.placed.label}
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                  </h5>
                  <span className="font-mono text-[10px] text-slate-400 font-bold">{steps.placed.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5 lowercase leading-tight">{steps.placed.desc}</p>
              </div>
            </div>

            {/* STEP 2: PROCESSING */}
            <div className="relative">
              <span className={`absolute -left-5 top-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${order.status !== 'PENDING' ? 'border-[#705030] bg-white' : 'border-slate-200 bg-slate-50'}`}>
                {order.status !== 'PENDING' ? (
                  <span className="w-2 h-2 rounded-full bg-[#705030]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                )}
              </span>
              <div>
                <div className="flex items-center justify-between">
                  <h5 className={`font-sans text-xs font-bold uppercase tracking-wider ${order.status !== 'PENDING' ? 'text-slate-900' : 'text-slate-400'}`}>
                    {steps.processing.label}
                  </h5>
                  <span className={`font-mono text-[10px] ${order.status !== 'PENDING' ? 'text-slate-600' : 'text-slate-300'}`}>
                    {steps.processing.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5 lowercase leading-tight">{steps.processing.desc}</p>
                {order.status === 'PENDING' && (
                  <span className="inline-block mt-1 text-[8.5px] font-mono uppercase bg-amber-50 text-amber-800 border border-amber-150 px-1.5 py-0.5 tracking-wider">
                    Queue Processing Active
                  </span>
                )}
              </div>
            </div>

            {/* STEP 3: SHIPPED */}
            <div className="relative">
              <span className={`absolute -left-5 top-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${(order.status === 'SHIPPED' || order.status === 'DELIVERED') ? 'border-[#705030] bg-white' : 'border-slate-200 bg-slate-50'}`}>
                {(order.status === 'SHIPPED' || order.status === 'DELIVERED') ? (
                  <span className="w-2 h-2 rounded-full bg-[#705030]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                )}
              </span>
              <div>
                <div className="flex items-center justify-between">
                  <h5 className={`font-sans text-xs font-bold uppercase tracking-wider ${(order.status === 'SHIPPED' || order.status === 'DELIVERED') ? 'text-slate-900' : 'text-slate-400'}`}>
                    {steps.shipped.label}
                  </h5>
                  <span className={`font-mono text-[10px] ${(order.status === 'SHIPPED' || order.status === 'DELIVERED') ? 'text-slate-600' : 'text-slate-300'}`}>
                    {steps.shipped.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5 lowercase leading-tight">{steps.shipped.desc}</p>
                {order.status === 'PROCESSING' && (
                  <div className="mt-1 flex items-center gap-1.5 text-[8.5px] font-mono text-amber-700">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>Spinning complete. Preparing flight package</span>
                  </div>
                )}
              </div>
            </div>

            {/* STEP 4: DELIVERED */}
            <div className="relative">
              <span className={`absolute -left-5 top-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${order.status === 'DELIVERED' ? 'border-emerald-600 bg-white' : 'border-slate-200 bg-slate-50'}`}>
                {order.status === 'DELIVERED' ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                )}
              </span>
              <div>
                <div className="flex items-center justify-between">
                  <h5 className={`font-sans text-xs font-bold uppercase tracking-wider ${order.status === 'DELIVERED' ? 'text-emerald-700 flex items-center gap-1 font-extrabold' : 'text-slate-400'}`}>
                    {steps.delivered.label}
                    {order.status === 'DELIVERED' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                  </h5>
                  <span className={`font-mono text-[10px] ${order.status === 'DELIVERED' ? 'text-emerald-750 font-bold' : 'text-slate-350 bg-slate-100/50 px-1 py-0.5 rounded-xs'}`}>
                    {steps.delivered.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5 lowercase leading-tight">{steps.delivered.desc}</p>
                {order.status === 'SHIPPED' && (
                  <div className="mt-1 flex items-center gap-1.5 text-[8.5px] font-mono text-blue-600 tracking-wider">
                    <Truck className="w-3 h-3 animate-bounce" />
                    <span>In Stockholm Dispatch Terminal Transit</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Secure Assurance Banner */}
          <div className="bg-slate-50 p-3 flex gap-2 border border-slate-100">
            <ShieldCheckIcon className="w-4 h-4 text-[#705030] flex-shrink-0 mt-0.5" />
            <p className="text-[10px] font-sans text-slate-500 lowercase leading-tight">
              all deliveries are safeguarded with carbon offsets and packed in circular unbleached fleece casing. direct questions to active concierge thread.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

// Extra light standalone internal icon component for solid security feel
function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
