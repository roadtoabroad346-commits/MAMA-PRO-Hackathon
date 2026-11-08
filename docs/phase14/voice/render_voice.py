from pathlib import Path
import subprocess,json
R=Path.cwd();W=R/'work/voice-tools';O=R/'docs/phase14/voice';font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def run(args):subprocess.run(['ffmpeg','-y','-v','error']+args,check=True)
for i,d in enumerate([35,20,140,35,35,25,8]):
 args=['-loop','1','-i',str(W/f'slide{i+1}.png')]
 label="Синтетическая речь | Слайды и запись фактического демо | Не репетиция человека"
 draw=f"drawbox=x=0:y=0:w=1280:h=27:color=0x173E3A:t=fill,drawtext=fontfile={font}:text='{label}':x=20:y=6:fontsize=16:fontcolor=white"
 if i==2:
  args+=['-ss','1.4','-i',str(R/'docs/phase14/demo-rehearsal-ru.webm')]
  fil=f"[0:v]drawbox=x=510:y=190:w=730:h=490:color=0x173E3A:t=fill[base];[1:v]scale=-2:480,tpad=stop_mode=clone:stop_duration=14[demo];[base][demo]overlay=825:175,{draw}[v]"
 else:fil=f'[0:v]{draw}[v]'
 run(args+['-filter_complex',fil,'-map','[v]','-t',str(d),'-r','15','-an','-c:v','libx264','-preset','ultrafast','-crf','24','-pix_fmt','yuv420p',str(W/f'clip{i}.mp4')]);print('Rendered slide',i+1,flush=True)
(W/'concat.txt').write_text('\n'.join("file '"+str(W/f'clip{i}.mp4')+"'" for i in range(7)))
run(['-f','concat','-safe','0','-i',str(W/'concat.txt'),'-i',str(R/'work/full-voice.wav'),'-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','96k','-t','298','-movflags','+faststart',str(O/'FULL_VOICE_REHEARSAL_RU.mp4')])
run(['-i',str(R/'work/full-voice.wav'),'-c:a','libmp3lame','-b:a','96k',str(O/'FULL_VOICE_REHEARSAL_RU.mp3')])
print('DONE',flush=True)
