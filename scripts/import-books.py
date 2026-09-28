"""Import supplied Ordem Paranormal PDFs. No network calls. Usage: python scripts/import-books.py UPLOAD_DIR OCR_DIR"""
import fitz,json,re,sys,hashlib,collections,pathlib
ROOT=pathlib.Path(sys.argv[1]);OCR=pathlib.Path(sys.argv[2]); E=[];R=[];S=[]
def norm(t):return re.sub(r'\s+',' ',t.replace('\\n',' ').replace('\xad','')).strip()
def clean(t):
 t=re.sub(r'(?im)^.*(?:mateus.*ramos|mateuscamarinha|gmail\.com).*$','',t)
 t=re.sub(r'([a-záéíóúãõâêôç])[-\xad]\s*\n\s*([a-záéíóúãõâêôç])',r'\1\2',t)
 return re.sub(r'\n{3,}','\n\n',t.replace('\xad','').replace('\\n',' ')).strip()
def span(s):
 if 'd20' in s['font'].lower():return re.sub('[Oo]+',lambda m:str(len(m[0]))+'d20',s['text'])
 if 'OutroLado' in s['font']:return '• ' if s['text'].strip()=='b' else ''
 return s['text']
def pages(file):
 d=fitz.open(ROOT/file);out=[]
 for i,p in enumerate(d):
  ls=[]
  for b in p.get_text('dict')['blocks']:
   if b['type']!=0:continue
   for l in b['lines']:
    t=''.join(span(s) for s in l['spans'])
    if t.strip() and not t.strip().isdigit():ls.append({'t':t,'s':l['spans'],'box':l['bbox'],'block':b['number']})
  out.append({'n':i+1,'l':ls})
 return out
def ent(name,desc,src,page,typ,cls='',**kw):
 name=norm(name).strip(' .•\t');desc=clean(desc)
 if len(name)<2 or len(desc)<15:return
 id=hashlib.sha1((src+typ+cls+name+str(page)).encode()).hexdigest()[:16]
 circle=0
 if typ=='Ritual':
  m=re.search(r'(SANGUE|MORTE|ENERGIA|CONHECIMENTO|MEDO)\s*([1-4])',desc,re.I)
  if m:circle=int(m[2])
 m=re.search(r'(?:gastar|gasta|custa|gastando|pagando)\s+(\d+)\s*PE',norm(desc),re.I)
 cost=[0,1,3,6,10][circle] if circle else int(m[1]) if m else 0
 pre=re.search(r'Pr[eé]-requisit[oa]s?\s*:?\s*(.*?)(?:\n\n|$)',desc,re.I|re.S)
 obj=dict(id=id,name=name,description=desc,source=src,page=page,type=typ,cls=cls,cost=cost,circle=circle,prerequisite=norm(pre[1])[:500] if pre else '',**kw);E.append(obj);return obj
def rules(ps,src,ranges):
 for lo,hi in ranges:
  for p in ps[lo-1:hi]:
   t=clean('\n'.join(l['t'] for l in p['l']))
   if len(t)<50:continue
   titles=[norm(l['t']) for l in p['l'] if any(14<s['size']<40 for s in l['s']) and len(norm(l['t']))>3]
   R.append(dict(id=src+'-'+str(p['n']),source=src,page=p['n'],title=' · '.join(titles[:3]) or 'Consulta — página '+str(p['n']),text=t,ocr=False))
def sections(ps,src,typ,predicate,cls='',skip=lambda l:False):
 cur=None
 for p in ps:
  for l in p['l']:
   if skip(l):continue
   if any(predicate(s) for s in l['s']):
    if cur:ent(cur[0],'\n'.join(cur[2]),src,cur[1],typ,cls)
    cur=[l['t'],p['n'],[]]
   elif cur:cur[2].append(l['t'])
 if cur:ent(cur[0],'\n'.join(cur[2]),src,cur[1],typ,cls)
base=pages('ordem-paranormal-rpg-v1-3-lyfxjj.pdf');S.append(dict(id='base',name='Livro de Regras v1.3',short='Livro de Regras',status='ready',system='OP1'))
large=lambda s:s['font']=='DaisyWheel' and s['size']>18
sections(base[25:31],'base','Origem',large,skip=lambda l:any('Optima' in s['font'] or 'Gabriele' in s['font'] for s in l['s']))
sections(base[122:126],'base','Poder paranormal',large,skip=lambda l:any('Optima' in s['font'] and s['size']>=14 for s in l['s']))
sections(base[133:153],'base','Ritual',large,skip=lambda l:'DESCRIÇÃO DOS RITUAIS' in l['t'])
for cls,lo,hi in [('Combatente',34,37),('Especialista',38,41),('Ocultista',42,45)]:
 cur=None;track=''
 def flush():
  global cur
  if cur:ent(cur['name'],'\n'.join(cur['body']),'base',cur['page'],cur['type'],cls,track=cur.get('track',''),minNex=cur.get('minNex',0));cur=None
 for p in base[lo-1:hi]:
  for l in p['l']:
   ss=l['s'];t=l['t']
   if any('Optima' in s['font'] or 'Gabriele' in s['font'] for s in ss):continue
   if any(large(s) for s in ss):flush();track=norm(t);continue
   name=''.join(s['text'] for s in ss if 'SemiboldIt' in s['font']).strip();nex=re.match(r'NEX\s+(\d+)%\s*[-–—]\s*(.+?)\.',norm(t));intr=re.match(r'(Ataque Especial|Perito|Eclético|Escolhido pelo Outro Lado)\.',norm(t),re.I)
   if name.endswith('.') or nex or intr:
    flush();name=nex[2] if nex else intr[1] if intr else name.rstrip('.');typ='Habilidade de trilha' if nex else 'Habilidade de classe' if intr else 'Poder de classe'
    cur=dict(name=name,body=[t[t.find(name)+len(name):].lstrip('. ')],page=p['n'],type=typ,track=track if nex else '',minNex=int(nex[1]) if nex else 5 if intr else 0)
   elif cur:
    if any(s['size']>18 for s in ss):flush()
    else:cur['body'].append(t)
 flush()
for cls,page,txt in [('Combatente',35,'Vida inicial: 20 + Vigor; por avanço: 4 + Vigor. Esforço inicial: 2 + Presença; por avanço: 2 + Presença. Sanidade inicial: 12; por avanço: 3. Perícias: Luta ou Pontaria, Fortitude ou Reflexos e mais 1 + Intelecto à escolha. Proficiências: armas simples, táticas e proteções leves.'),('Especialista',39,'Vida inicial: 16 + Vigor; por avanço: 3 + Vigor. Esforço inicial: 3 + Presença; por avanço: 3 + Presença. Sanidade inicial: 16; por avanço: 4. Escolha 7 + Intelecto perícias treinadas. Proficiências: armas simples e proteções leves.'),('Ocultista',43,'Vida inicial: 12 + Vigor; por avanço: 2 + Vigor. Esforço inicial: 4 + Presença; por avanço: 4 + Presença. Sanidade inicial: 20; por avanço: 5. Perícias: Ocultismo, Vontade e mais 3 + Intelecto à escolha. Proficiência: armas simples.')]:ent(cls,txt,'base',page,'Classe',cls)
rules(base,'base',[(24,100),(120,161),(169,182),(300,307),(320,321)])
files={1:'Arquivos-Secretos-01-v1-1.pdf',2:'Arquivos-Secretos-02.pdf',3:'Arquivos-Secretos-3-v-1-0.pdf',4:'Arquivos-Secretos-04-v1.0.pdf',5:'Arquivos-Secretos-05-v1.0.pdf',6:'Arquivos-Secretos-06-v1.1.pdf',7:'Arquivos-Secretos-07-v1.0.pdf'}
ranges={1:[(43,59)],2:[(16,25),(41,41),(47,47),(53,53),(59,59),(65,67),(93,93),(97,97)],3:[(108,137)],4:[(64,73)],5:[(54,63)],6:[(66,77)],7:[(76,88),(92,92)]};AP={}
def typ(n,p,t):
 if (n,p) in [(1,43),(4,64),(5,54),(6,66),(7,80)]:return 'Origem',''
 if n==1:return {44:('Poder de classe','Ocultista'),46:('Poder geral',''),47:('Poder paranormal',''),48:('Ritual',''),50:('Ritual',''),54:('Item',''),55:('Item','')}.get(p,('Regra',''))
 if n==2:return ('Item','') if any(w in t for w in ['Machado','Elmo','Manoplas','Punhal','Sniper','Antena','Faca']) else ('Ritual','') if p in [65,66,67,93] else ('Habilidade especial','')
 if n==3:
  if p==108:return ('Poder geral','') if t in ['Ambidestria','Vitalidade Sofrida'] else ('Poder de classe','Combatente' if t=='Guardião da Tropa' else 'Ocultista')
  if p==109:return ('Poder paranormal','') if 'Precognitiva' in t else ('Poder geral','')
  if p in [110,111]:return 'Poder de sacrifício',''
  return ('Item','') if 112<=p<=118 else ('Regra','')
 if n in [4,5]:
  off=p-(64 if n==4 else 54)
  if off==1:return 'Poder de classe','Combatente' if t in ['Chuva de Balas','Combatente Esforçado','Treinamento Militarizado','Aura de Confiança','Fôlego de Emergência','Parede de Carne'] else 'Especialista'
  if off==2:return ('Poder geral','') if t in ['Gororoba','Ruído Branco','Apaixonado por Veículos','Desafiar o Ego','Direção Defensiva'] else ('Poder de classe','Ocultista')
  if off==3:return 'Poder paranormal',''
  if n==5 and p>=62:return 'Poder de transmissão',''
  return 'Item',''
 if n==6:return {67:('Poder de classe','Combatente'),68:('Poder de classe','Especialista'),69:('Poder de classe','Ocultista'),70:('Poder geral',''),71:('Poder paranormal',''),72:('Poder paranormal','')}.get(p,('Item',''))
 return ('Ritual','') if p in [76,77] else ('Item','')
for n,file in files.items():
 ps=pages(file);AP[n]=ps;src='as'+str(n);S.append(dict(id=src,name=f'Arquivos Secretos {n:02}',short=f'AS {n:02}',status='ready',system='OP1'));rules(ps,src,ranges[n]);cur=None
 def flushA():
  global cur
  if cur:
   type,cls=typ(n,cur['p'],norm(cur['name']))
   if type!='Regra':ent(cur['name'],'\n'.join(cur['body']),src,cur['p'],type,cls)
  cur=None
 for lo,hi in ranges[n]:
  flushA()
  for p in ps[lo-1:hi]:
   lasthead=False;lastblock=None
   for l in p['l']:
    ss=l['s'];t=l['t'];head=all(('BurnetGothic' in s['font'] and 15<=s['size']<=17.2) or ('KeyesCedilha' in s['font'] and 16<=s['size']<=18) for s in ss if s['text'].strip())
    if head:
     if lasthead and lastblock==l['block'] and cur:cur['name']+=' '+t
     else:flushA();cur=dict(name=t,p=p['n'],body=[])
    elif cur and not any(s['size']>=24 for s in ss):cur['body'].append(t)
    lasthead=head;lastblock=l['block']
  flushA()
for n,lo,hi,cls,track in [(1,45,45,'Ocultista','Maledictólogo'),(3,119,119,'Combatente','Combatente Performático'),(4,69,69,'Especialista','Granadeiro Blaster'),(5,58,58,'Ocultista','Criptologista do Oculto'),(7,81,84,'Especialista','Monstruoso'),(7,85,88,'Ocultista','Monstruoso')]:
 text=clean('\n'.join(l['t'] for p in AP[n][lo-1:hi] for l in p['l']));ms=list(re.finditer(r'(?:NEX\s*)?(10|40|65|99)%\s*[-–—]\s*(.+?)\.',text,re.S))
 for i,m in enumerate(ms):ent(m[2],text[m.end():ms[i+1].start() if i+1<len(ms) else len(text)],'as'+str(n),lo,'Habilidade de trilha',cls,track=track,minNex=int(m[1]))
# Save intermediate catalogue before OCR augmentation.
S.append(dict(id='horror',name='Sobrevivendo ao Horror',short='Sobrevivendo ao Horror',status='ocr',system='OP1'))
S.append(dict(id='op2',name='Ordem Paranormal RPG 2 — Playtest Alpha',short='OP2 Alpha',status='password',system='OP2'))
E=[e for e in E if not e['name'].startswith(('Novo uso','NOVO USO','DIGNO DE SACRIFÍCIO','100'))]
for e in E:
 if e['name'].isupper():e['name']=e['name'].title()
 e['description']=re.sub(r'\n(?:TRILHAS DE|PODERES DE|HABILIDADES DE).*?(?=\n|$)','',e['description'])
pathlib.Path('src/catalog.json').write_text(json.dumps(dict(sources=S,entries=E,rules=R),ensure_ascii=False,separators=(',',':')))
print('Base e Arquivos:',len(E),'entradas;',len(R),'páginas de regras.')
