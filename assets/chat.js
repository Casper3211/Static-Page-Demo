
(() => {
  // Never paste a real key in this source file. Use the live password field.
  let apiKey = '';
  let activeRequest = null;
  const MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';
  const $ = id => document.getElementById(id);
  const panel = $('sq-panel'), toggle = $('sq-toggle'), input = $('sq-input');
  const fullPage = document.body.dataset.layout === 'full' || new URLSearchParams(location.search).get('view') === 'bot';

  function openChat() { panel.hidden = false; toggle.setAttribute('aria-expanded','true'); (apiKey ? input : $('sq-key')).focus(); }
  function closeChat() { panel.hidden = true; toggle.setAttribute('aria-expanded','false'); toggle.focus(); }
  toggle.onclick = () => panel.hidden ? openChat() : closeChat();
  $('sq-close').onclick = closeChat;
  panel.addEventListener('keydown', e => { if(e.key === 'Escape' && !fullPage) closeChat(); });
  document.querySelectorAll('[data-prompt]').forEach(button => button.onclick = () => {openChat(); input.value = button.dataset.prompt;});
  if(fullPage) document.body.classList.add('sq-full');
  openChat();

  function clearKey() { activeRequest?.abort(); apiKey=''; $('sq-key').value=''; $('sq-mode').textContent='Demo · built-in replies'; }
  $('sq-connection').onsubmit=e=>{
    e.preventDefault();const value=$('sq-key').value.trim();
    if(!value){$('sq-status').textContent='Paste a key into the password field first.';return;}
    clearKey();apiKey=value;$('sq-mode').textContent='AI · key ready (tested when you send)';
    $('sq-status').textContent='Key updated. Send a theme to test it.';input.focus();
  };
  $('sq-clear').onclick=()=>{clearKey();$('sq-status').textContent='Key cleared. Demo mode is ready.';};
  window.addEventListener('pagehide',clearKey);
  function addMessage(label, content) {
    const line = document.createElement('div'); line.className = 'sq-message';
    const name = document.createElement('strong'); name.textContent = label;
    const body=document.createElement('div');body.className='sq-content';
    if(label==='YOU') body.textContent=content; else renderMarkdown(body,content);
    line.append(name,body); $('sq-log').append(line);
    $('sq-log').scrollTop = $('sq-log').scrollHeight;
  }
  $('sq-form').onsubmit = async e => {
    e.preventDefault();
    const message=input.value.trim(); if(!message || activeRequest) return;
    if(message.includes('sk-or-') || (apiKey && message.includes(apiKey))){$('sq-status').textContent='Put keys in the password field, not a message.';return;}
    input.value='';
    addMessage('YOU',message);
    if(apiKey) {
      const controller=new AbortController();activeRequest=controller;
      const timer=setTimeout(()=>controller.abort(),60000);
      $('sq-send').disabled=true;$('sq-status').textContent='Waiting for AI…';
      try {
        const response=await fetch('https://openrouter.ai/api/v1/chat/completions',{
          method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
          body:JSON.stringify({model:MODEL,messages:[{role:'system',content:'Write a friendly would-you-rather question with two funny choices labeled A and B based on the theme. Format your reply as three separate Markdown paragraphs: **A.** followed by the first choice, **B.** followed by the second choice, then Which would you choose, and why? Put a blank line between each paragraph. Keep it under 70 words.'},{role:'user',content:message}],max_tokens:2048,stream:false}),signal:controller.signal
        });
        if(!response.ok) throw new Error(response.status===401?'Key rejected. Paste a new key and click Use / update key.':response.status===429?'Free model busy or quota exhausted. Wait or use demo.':'OpenRouter could not answer. Check your key, model access, and quota.');
        const data=await response.json();const reply=data.choices?.[0]?.message?.content;
        if(typeof reply!=='string'||!reply.trim()) throw new Error('No text returned. Try again later.');
        if(controller.signal.aborted)return;
        addMessage('AI',reply);$('sq-status').textContent='Which would you choose?';
      } catch(error) {
        if(!input.value) input.value=message;
        if(!controller.signal.aborted) $('sq-status').textContent=error instanceof TypeError?'Connection failed. Try again or use demo.':error.message;
        else if(apiKey) $('sq-status').textContent='Request stopped. Send again when ready.';
      } finally {clearTimeout(timer);activeRequest=null;$('sq-send').disabled=false;}
      return;
    }
    const food=/food|pizza|eat/i.test(message);
    addMessage('DEMO (BUILT-IN)',food ? 'A. Eat pizza with a spoon forever?\nB. Eat soup with chopsticks forever?\n\nWhich would you pick, and why?' : 'A. Teleport anywhere, but arrive in pajamas?\nB. Fly anywhere, but only at walking speed?\n\nWhich would you pick, and why?');
    input.value=''; $('sq-status').textContent='Built-in example. No AI request was sent.';
  };

})();
