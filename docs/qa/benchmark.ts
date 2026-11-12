import { catalogSchema } from '../../src/domain/catalog';
import raw from '../../src/data/catalog.json';
import { SearchService } from '../../src/domain/SearchService';
import { emptySearchInput, type SearchInput } from '../../src/domain/contracts';
import os from 'node:os';
const base=catalogSchema.parse(raw);const results=[];
for(const count of [20,30]) {
 const catalog=structuredClone(base);
 if(count===30)catalog.offers.push(...base.offers.slice(0,10).map(o=>({...o,id:o.id+'-benchmark'})));
 const service=new SearchService(catalogSchema.parse(catalog));
 const inputs:SearchInput[]=Array.from({length:100},(_,i)=>({...emptySearchInput(),
  serviceLanguage:[null,'ru','kk'][i%3] as SearchInput['serviceLanguage'],format:[null,'offline','online'][i%3] as SearchInput['format'],
  budgetKzt:[null,0,1000,6000,10000][i%5],budgetHard:i%2===0,
  query:['','логопед','сөйлеу терапевті','Демо-специалист 12','none'][Math.floor(i/5)%5],sort:['relevant','price','district'][i%3] as SearchInput['sort']}));
 for(let i=0;i<1000;i++)service.search(inputs[i%100]);
 const samples=inputs.map(input=>{const t=performance.now();service.search(input);return performance.now()-t;}).sort((a,b)=>a-b);
 results.push({offers:count,samples:samples.length,warmup:1000,p95Ms:samples[94],maxMs:samples[99],under100Ms:samples[94]<=100});
}
console.log(JSON.stringify({runtime:process.version,cpu:os.cpus()[0].model,device:'Cloud Linux Node; not a physical mobile browser',results},null,2));
