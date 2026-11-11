import type { SearchResult } from './SearchService';
export interface LocatedOffer {offerId:string;lat:number;lon:number;source:string;checkedAt:string;access:{stepFree:null;lift:null;source:string;checkedAt:null}}
// Fictional points, manually authored for the demo. Not actual practice addresses.
export const demoLocations:LocatedOffer[]=[['O01',43.222,76.901],['O02',43.25,76.91],['O04',43.235,76.85],['O06',43.218,76.913],['O07',43.212,76.9],['O08',43.219,76.922],['O10',43.24,76.96],['O11',43.209,76.924],['O12',43.26,76.929],['O13',43.24,76.839],['O16',43.255,76.94],['O17',43.23,76.97],['O23',43.217,76.94]].map(([id,lat,lon])=>({offerId:String(id),lat:Number(lat),lon:Number(lon),source:'synthetic-map-v1',checkedAt:'2026-11-10T12:00:00+05:00',access:{stepFree:null,lift:null,source:'unknown',checkedAt:null}}));
export function mapSearchResult(result:SearchResult,locations=demoLocations){
 const ids=[...new Set(result.items.flatMap(item=>item.matchingOfferIds))];
 return {points:ids.flatMap(id=>{const point=locations.find(l=>l.offerId===id);return point?[point]:[];}),missing:ids.filter(id=>!locations.some(l=>l.offerId===id))};
}
export function straightDistanceKm(a:{lat:number;lon:number},b:{lat:number;lon:number}){const r=Math.PI/180,dLat=(b.lat-a.lat)*r,dLon=(b.lon-a.lon)*r;return 6371*2*Math.asin(Math.sqrt(Math.sin(dLat/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dLon/2)**2));}
