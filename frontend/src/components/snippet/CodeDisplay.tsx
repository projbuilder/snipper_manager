import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import { useEffect } from 'react';

interface Props {
  code: string;
  language: string;
}

const CodeDisplay = ({ code, language }: Props) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card p-0 overflow-hidden">
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
        <span className="text-sm font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 text-sm hover:text-gray-300 transition"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="!m-0 !rounded-none">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};

export default CodeDisplay;
