from pathlib import Path
import re,subprocess,os,wave,json,fitz
R=Path.cwd();W=R/'work/voice-tools';O=R/'docs/phase14/voice';O.mkdir(exist_ok=True)
s=(R/'docs/PITCH_AND_DEMO.md').read_text();main=[t for _,t in re.findall(r'### ([^\n]+)\n\n\*\*Речь:\*\* «([^»]+)»',s)];demo=re.findall(r'\| [^\n]*\| «([^»]+)» \| K[234]',s);assert len(demo)==6
texts=main[:2]+demo+main[2:];starts=[0,35,55,70,100,125,150,175,195,230,265,290];ends=starts[1:]+[298]
env=os.environ.copy();env['LD_LIBRARY_PATH']=str(W/'root/usr/lib/x86_64-linux-gnu')
rate=22050;whole=bytearray(298*rate*2);rows=[]
for i,(t,a,b) in enumerate(zip(texts,starts,ends)):
 # Pronunciation expansion only; canonical wording remains in transcript.
 spoken=t.replace('Қолдау.Жол','Колдау Жол').replace('KK','казахского языка').replace('P0','пи ноль').replace('live','лайв').replace('Chromium','Хромиум').replace('JSON','джейсон').replace('IndexedDB','индекс ди би').replace('production','продакшен')
 f=W/f'{i+1:02}.txt';f.write_text(spoken)
 subprocess.run([str(W/'root/usr/bin/espeak-ng'),'--path='+str(W/'root/usr/lib/x86_64-linux-gnu'),'-v','ru','-s','145','-f',str(f),'-w',str(W/f'{i+1:02}.wav')],env=env,check=True)
 with wave.open(str(W/f'{i+1:02}.wav')) as w:
  assert w.getframerate()==rate;frames=w.readframes(w.getnframes());dur=w.getnframes()/rate
 assert dur<=b-a,(i,dur,b-a)
 whole[a*rate*2:a*rate*2+len(frames)]=frames
 rows.append({'part':i+1,'start':a,'slotEnd':b,'spokenSeconds':round(dur,3),'speechEnd':round(a+dur,3),'text':t})
with wave.open(str(R/'work/full-voice.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(whole)
(O/'timeline.json').write_text(json.dumps({'method':'Synthetic eSpeak NG Russian voice 145; pre-recorded real demo; not a human rehearsal','duration':298,'rows':rows},ensure_ascii=False,indent=2))
(O/'TRANSCRIPT.md').write_text('# Полный озвученный прогон — синтетическая речь\n\n'+ '\n\n'.join(f"## {r['start']}–{r['slotEnd']} с\n\n{r['text']}" for r in rows))
for i,p in enumerate(fitz.open(R/'docs/phase14/DEFENSE_SLIDES.pdf')):p.get_pixmap().save(R/f'work/voice-tools/slide{i+1}.png')
print(json.dumps(rows,ensure_ascii=False))
