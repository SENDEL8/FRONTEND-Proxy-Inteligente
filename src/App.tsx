import React, { useState } from 'react';
import axios from 'axios';
import { Terminal, Code2, Send, Loader2, AlertCircle, Copy, Check } from 'lucide-react';
import './App.css';

interface ResponseData {
  testCode: string;
  latency: number;
}

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust'
];

function App() {
  const [lenguaje, setLenguaje] = useState(LANGUAGES[0]);
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim()) return;

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const response = await axios.post('http://localhost:3000/proxy/generate', {
        lenguaje,
        codigo
      });
      setResultado(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al conectar con el servidor. Asegúrate de que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (resultado?.testCode) {
      navigator.clipboard.writeText(resultado.testCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container">
      <header>
        <div className="logo">
          <Terminal size={32} />
          <h1>Proxy Inteligente <span>LLM</span></h1>
        </div>
        <p>Generación de pruebas unitarias robustas mediante IA</p>
      </header>

      <main>
        <section className="input-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="language">Lenguaje de Programación</label>
              <select 
                id="language" 
                value={lenguaje} 
                onChange={(e) => setLenguaje(e.target.value)}
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="code">Función de Código (Raw)</label>
              <textarea
                id="code"
                placeholder="Pega tu función aquí..."
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                rows={10}
              />
            </div>

            <button type="submit" disabled={loading || !codigo.trim()}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Generar Prueba Unitativa</span>
                </>
              )}
            </button>
          </form>
        </section>

        <section className="output-section">
          <div className="output-header">
            <div className="title">
              <Code2 size={24} />
              <h2>Resultado</h2>
            </div>
            {resultado && (
              <div className="meta">
                <span>Latencia: {resultado.latency}ms</span>
                <button onClick={copyToClipboard} className="btn-copy">
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            )}
          </div>

          <div className="code-container">
            {error && (
              <div className="error-msg">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}
            
            {!resultado && !error && !loading && (
              <div className="placeholder">
                <p>El código generado aparecerá aquí.</p>
              </div>
            )}

            {loading && (
              <div className="loading-overlay">
                <Loader2 className="animate-spin" size={48} />
                <p>Consultando al modelo...</p>
              </div>
            )}

            {resultado && (
              <pre>
                <code>{resultado.testCode}</code>
              </pre>
            )}
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Smart Proxy LLM - Built with NestJS & React</p>
      </footer>
    </div>
  );
}

export default App;
