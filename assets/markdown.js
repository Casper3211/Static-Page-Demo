// Small Markdown subset rendered as DOM nodes. Raw HTML is always literal text.
// Supports bold, emphasis, inline/fenced code, headings, lists, quotes and HTTPS links.
function renderMarkdown(target, text) {
  function inline(parent, value) {
    const pattern = /(`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\n]+\*|\[[^\]\n]+\]\(https?:\/\/[^\s)]+\))/g;
    let at = 0;
    for (const match of value.matchAll(pattern)) {
      parent.append(document.createTextNode(value.slice(at, match.index)));
      const token = match[0]; let node;
      if (token.startsWith('`')) { node=document.createElement('code');node.textContent=token.slice(1,-1); }
      else if (token.startsWith('**')) { node=document.createElement('strong');node.textContent=token.slice(2,-2); }
      else if (token.startsWith('*')) { node=document.createElement('em');node.textContent=token.slice(1,-1); }
      else {
        const parts=token.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
        node=document.createElement('a');node.textContent=parts[1];node.href=parts[2];node.target='_blank';node.rel='noopener noreferrer';
      }
      parent.append(node);at=match.index+token.length;
    }
    parent.append(document.createTextNode(value.slice(at)));
  }
  const lines=String(text).replace(/\r\n?/g,'\n').split('\n');let list=null;
  for(let i=0;i<lines.length;i++) {
    const line=lines[i];
    if(line.startsWith('```')) {
      list=null;const code=[];while(++i<lines.length&&!lines[i].startsWith('```'))code.push(lines[i]);
      const pre=document.createElement('pre'),element=document.createElement('code');element.textContent=code.join('\n');pre.append(element);target.append(pre);continue;
    }
    if(!line.trim()){list=null;continue;}
    const item=line.match(/^\s*(?:([-*])|\d+\.)\s+(.+)$/);
    if(item){const tag=item[1]?'ul':'ol';if(!list||list.localName!==tag){list=document.createElement(tag);target.append(list);}const li=document.createElement('li');inline(li,item[2]);list.append(li);continue;}
    list=null;const heading=line.match(/^(#{1,6})\s+(.+)$/),quote=line.match(/^>\s?(.*)$/);
    const node=document.createElement(heading?'h'+Math.min(heading[1].length+2,5):quote?'blockquote':'p');inline(node,heading?heading[2]:quote?quote[1]:line);target.append(node);
  }
}
