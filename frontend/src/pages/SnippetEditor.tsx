import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { snippetService } from '../services/snippetService';
import { Snippet } from '../types';

const SnippetEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'unlisted'>('private');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) loadSnippet(id);
  }, [id]);

  const loadSnippet = async (snippetId: string) => {
    try {
      const data = await snippetService.getSnippetById(snippetId);
      const snippet = data.snippet;
      setTitle(snippet.title);
      setDescription(snippet.description || '');
      setCode(snippet.code);
      setLanguage(snippet.language);
      setTags(snippet.tags.join(', '));
      setVisibility(snippet.visibility);
    } catch (error) {
      console.error('Failed to load snippet:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const snippetData = {
      title,
      description,
      code,
      language,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      visibility,
    };

    try {
      if (id) {
        await snippetService.updateSnippet(id, snippetData);
      } else {
        const created = await snippetService.createSnippet(snippetData);
        navigate(`/snippets/${created._id}`);
        return;
      }
      navigate(`/snippets/${id}`);
    } catch (error) {
      console.error('Failed to save snippet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{id ? 'Edit' : 'Create'} Snippet</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              required
              placeholder="My awesome snippet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              rows={3}
              placeholder="What does this snippet do?"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="input"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="input"
                placeholder="react, hooks, utility"
              />
            </div>
          </div>
        </div>

        <div className="card p-0 overflow-hidden">
          <div className="bg-gray-800 text-white px-4 py-2 text-sm font-mono">
            Code Editor
          </div>
          <Editor
            height="500px"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Saving...' : id ? 'Update Snippet' : 'Create Snippet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SnippetEditor;
