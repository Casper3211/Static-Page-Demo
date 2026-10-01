// Change the instructions below to give your game a different personality.
export const INSTRUCTIONS = `Create a playful would-you-rather question using the user's theme.
Write exactly two funny, balanced choices labeled A and B.
End with: Which would you pick, and why?
Keep it under 70 words, friendly, and suitable for a club meeting.`;
const MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';

export default {
  async fetch(request, env) {
    const headers = {'Content-Type':'application/json', 'Cache-Control':'no-store', 'Vary':'Origin'};
    const reply = (status, body) => new Response(JSON.stringify(body), {status, headers});
    if(new URL(request.url).pathname !== '/api/chat') return reply(404,{error:'Not found.'});
    if(!env.ALLOWED_ORIGIN || request.headers.get('Origin') !== env.ALLOWED_ORIGIN)
      return reply(403,{error:'This website is not allowed. Check ALLOWED_ORIGIN.'});
    headers['Access-Control-Allow-Origin'] = env.ALLOWED_ORIGIN;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    if(request.method === 'OPTIONS') return new Response(null,{status:204,headers});
    if(request.method !== 'POST') return reply(405,{error:'Use POST.'});
    if(!env.OPENROUTER_API_KEY) return reply(503,{error:'Owner: deploy the OPENROUTER_API_KEY secret first.'});
    if(!request.headers.get('Content-Type')?.startsWith('application/json')) return reply(415,{error:'Send JSON.'});
    // Bound the body while reading, including requests without Content-Length.
    let size=0, chunks=[];
    const reader=request.body?.getReader();
    if(!reader) return reply(400,{error:'Enter a theme.'});
    while(true) {
      const {done,value}=await reader.read(); if(done) break;
      size+=value.byteLength;
      if(size>8192) {await reader.cancel(); return reply(413,{error:'Message too large.'});}
      chunks.push(value);
    }
    let data;
    try { const bytes=new Uint8Array(size); let i=0; for(const c of chunks){bytes.set(c,i);i+=c.length;} data=JSON.parse(new TextDecoder().decode(bytes)); }
    catch {return reply(400,{error:'Invalid JSON.'});}
    if(typeof data?.message!=='string' || !data.message.trim() || data.message.length>1000)
      return reply(400,{error:'Enter a theme of 1–1000 characters.'});
    if(data.message.includes('sk-or-')) return reply(400,{error:'Do not send API keys as messages.'});
    try {
      const upstream=await fetch('https://openrouter.ai/api/v1/chat/completions',{
        method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${env.OPENROUTER_API_KEY}`},
        body:JSON.stringify({model:MODEL,messages:[{role:'system',content:INSTRUCTIONS},{role:'user',content:data.message.trim()}],max_tokens:2048,stream:false}),
        signal:AbortSignal.timeout(55000)
      });
      if(!upstream.ok) return reply(upstream.status===429?429:502,{error:upstream.status===429?'Free model busy or quota exhausted. Try later or use demo.':'OpenRouter could not answer. Owner: check the key and model access.'});
      const result=await upstream.json(); const content=result.choices?.[0]?.message?.content;
      if(typeof content!=='string'||!content.trim()) return reply(502,{error:'No text returned. Try again later.'});
      return reply(200,{reply:content});
    } catch {return reply(502,{error:'AI request timed out or failed. Try later or use demo.'});}
  }
};
