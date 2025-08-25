
'use client';
import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function Home() {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('secret12');
  const [token, setToken] = useState<string | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  async function post(path: string, body: any) {
    const res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  }

  async function register() {
    debugger;
    if (!email || !password) return alert('Please enter email and password');
    const r = await post('/auth/register', { email, password });
    setToken(r.access_token);
  }
  async function login() {
    const r = await post('/auth/login', { email, password });
    setToken(r.access_token);
  }
  async function getSignedUrl() {
    const key = `demo-${Date.now()}.txt`;
    const res = await fetch(`${API}/storage/signed-put-url?key=${key}&contentType=text/plain`);
    const text = await res.text();
    setSignedUrl(text.replace(/"/g, ''));
  }
  async function upload() {
    if (!signedUrl) return;
    await fetch(signedUrl, { method: 'PUT', body: 'hello from next!' });
    alert('uploaded to MinIO');
  }

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Hybrid Dev: DB+MinIO in Docker, API/Web on Host</h1>

      <section>
        <h2>Auth</h2>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button onClick={register}>Register</button>
        <button onClick={login}>Login</button>
        <p>JWT: {token ? token.slice(0,20)+'...' : '—'}</p>
      </section>

      <section>
        <h2>Storage</h2>
        <button onClick={getSignedUrl}>Get Signed PUT URL</button>
        <p style={{ wordBreak:'break-all' }}>{signedUrl || '—'}</p>
        <button onClick={upload} disabled={!signedUrl}>Upload sample file</button>
      </section>

      <section>
        <h2>Health</h2>
        <button onClick={async ()=>{
          const data = await fetch(`${API}/health`).then(r=>r.json());
          alert(JSON.stringify(data));
        }}>Ping API</button>
      </section>
    </main>
  );
}
