const list = document.getElementById('posts');
const search = document.getElementById('search');

let POSTS = [];

function render(items){
  list.innerHTML = '';
  if(!items.length){
    list.innerHTML = '<p class="muted">No matching posts yet.</p>';
    return;
  }
  items.forEach(p=>{
    const a = document.createElement('a');
    a.className = 'item';
    a.href = `blog.html#${encodeURIComponent(p.slug)}`;
    a.innerHTML = `<h4>${p.title}</h4><p>${p.excerpt}</p><small>${p.date} — ${p.tag}</small>`;
    list.appendChild(a);
  });

  // If a post slug is in the hash, open a quick reader dialog
  const hash = decodeURIComponent(location.hash.replace('#',''));
  if(hash){
    const post = POSTS.find(x=>x.slug===hash);
    if(post){ showPost(post); }
  }
}

function showPost(p){
  const html = `
    <div class="card" style="max-width:900px;margin:14px auto;">
      <h2>${p.title}</h2>
      <p class="muted">${p.date} — ${p.tag}</p>
      <div style="margin-top:10px; line-height:1.7;">${p.html}</div>
      <p style="margin-top:14px;">
        Discuss this post in <a class="btn link" target="_blank" rel="noopener"
        href="https://github.com/YOUR-USERNAME/Worth-Goss/discussions">Discussions →</a>
      </p>
    </div>`;
  list.insertAdjacentHTML('afterbegin', html);
}

fetch('data/posts.json')
  .then(r=>r.json())
  .then(data=>{
    POSTS = data;
    render(POSTS);
  });

search?.addEventListener('input', e=>{
  const q = e.target.value.toLowerCase().trim();
  if(!q) return render(POSTS);
  const filtered = POSTS.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.excerpt.toLowerCase().includes(q) ||
    p.tag.toLowerCase().includes(q)
  );
  render(filtered);
});
