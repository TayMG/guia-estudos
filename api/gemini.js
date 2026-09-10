// Proxy universal: gera blocos via Gemini e gerencia os blocos
// compartilhados no Upstash Redis (gratuito).
// Variáveis de ambiente (Vercel → Settings → Environment Variables):
//   GEMINI_API_KEY             = sua key da AI Studio (aistudio.google.com)
//   UPSTASH_REDIS_REST_URL     = ex: https://proud-jay-12345.upstash.io
//   UPSTASH_REDIS_REST_TOKEN   = token REST do Upstash

const SYSTEM_PROMPT =
    'Você é um assistente de estudo de Arquitetura de Computadores (Intel x86/x64). ' +
    'Organize as anotações em seções claras, "mastigue" (simplifique) conceitos difíceis, ' +
    'destaque pontos-chave com <mark> e <strong>, use classes HTML existentes do site: ' +
    '.card, .card-dica, .card-importante, .card-prova, .diagrama, <table>, e dê exemplos práticos. ' +
    'Retorne APENAS um JSON válido: {"titulo":"Título do bloco","html":"<div>...</div>"}';

const CHAVE_BLOCOS = 'gemini_blocos';

function bloco(valorTexto) {
    return {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: valorTexto }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 4096 },
    };
}

const MODELOS = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.5-flash'];

async function chamarGemini(modelo, texto, apiKey) {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + modelo + ':generateContent?key=' + apiKey;
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bloco(texto)),
    });
}

/* Executa um comando no Upstash usando o formato path-style da REST API.
   Ex: rpush/gemini_blocos/<valor-url-encoded> */
async function upsCmd(cmd) {
    const base = String(process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/+$/, '');
    const path = cmd.map(encodeURIComponent).join('/');
    const resp = await fetch(base + '/' + path, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + process.env.UPSTASH_REDIS_REST_TOKEN },
    });
    if (!resp.ok) {
        const texto = (await resp.text()).slice(0, 300);
        throw new Error('Upstash HTTP ' + resp.status + ': ' + texto);
    }
    return resp.json();
}

async function listarBlocos() {
    const r = await upsCmd(['LRANGE', CHAVE_BLOCOS, '0', '-1']);
    const arr = (r && r.result) || [];
    return arr
        .map((s) => {
            try { return JSON.parse(s); } catch (e) { return null; }
        })
        .filter(Boolean);
}

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(204).end();
    }

    const body = req.body || {};
    const acao = req.method === 'GET' ? req.query.acao : body.acao;

    if (acao === 'gerar') {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY não configurada no Vercel.' });
        const pedido = body.modelo || 'gemini-2.5-flash';
        const fila = MODELOS.includes(pedido) ? [pedido, ...MODELOS.filter((m) => m !== pedido)] : MODELOS;
        try {
            let data = null;
            let erroDel = null;
            for (const mdl of fila) {
                const r = await chamarGemini(mdl, body.texto || '', apiKey);
                if (r.status === 404) { erroDel = await r.json(); continue; }
                data = await r.json();
                break;
            }
            if (!data) {
                const msg = (erroDel && erroDel.error && erroDel.error.message) || 'Modelo não disponível.';
                return res.status(404).json({ error: msg });
            }
            let txt = '';
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                txt = (data.candidates[0].content.parts || []).map((p) => p.text || '').join('');
            }
            if (!txt) {
                return res.status(502).json({ error: (data.error && data.error.message) || 'Resposta vazia do Gemini.' });
            }
            return res.json({ texto: txt });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    if (acao === 'listar') {
        try {
            return res.json({ blocos: await listarBlocos() });
        } catch (err) {
            return res.status(500).json({ error: 'Falha ao ler blocos: ' + err.message });
        }
    }

    if (acao === 'salvar') {
        if (!body.html) return res.status(400).json({ error: 'Conteúdo vazio.' });
        const blocoNovo = {
            id: 'b' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
            titulo: body.titulo || 'Bloco gerado',
            html: body.html,
            autor: body.autor || 'anônimo',
            data: new Date().toISOString(),
        };
        try {
            await upsCmd(['RPUSH', CHAVE_BLOCOS, JSON.stringify(blocoNovo)]);
            return res.json({ bloco: blocoNovo });
        } catch (err) {
            return res.status(500).json({ error: 'Falha ao salvar bloco: ' + err.message });
        }
    }

    if (acao === 'remover') {
        if (!body.id) return res.status(400).json({ error: 'Falta id do bloco.' });
        try {
            const blocos = await listarBlocos();
            const alvo = blocos.find((b) => b.id === body.id);
            if (alvo) await upsCmd(['LREM', CHAVE_BLOCOS, '0', JSON.stringify(alvo)]);
            return res.json({ ok: true });
        } catch (err) {
            return res.status(500).json({ error: 'Falha ao remover: ' + err.message });
        }
    }

    return res.status(400).json({ error: 'Ação inválida.' });
}