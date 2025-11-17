import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { snippetService } from '../services/snippetService';
import {
  LANGUAGE_OPTIONS,
  getLanguageOption,
  DEFAULT_LANGUAGE,
} from '../constants/languages';
import { registerMonacoLanguages } from '../utils/monacoLanguages';

const SnippetEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE.value);
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'unlisted'>('private');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedLanguage = useMemo(() => getLanguageOption(language), [language]);

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
      setLanguage(getLanguageOption(snippet.language).value);
      setTags(snippet.tags.join(', '));
      setVisibility(snippet.visibility);
    } catch (error) {
      console.error('Failed to load snippet:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const snippetData = {
      title,
      description,
      code,
      language: selectedLanguage.value,
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
      const message =
        (error as any)?.response?.data?.error?.message ??
        (error instanceof Error ? error.message : 'Failed to save snippet. Please try again.');
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{id ? 'Edit' : 'Create'} Snippet</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {errorMessage}
          </div>
        )}

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
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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
            language={selectedLanguage.monacoLanguage}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            beforeMount={registerMonacoLanguages}
            path={`snippet.${selectedLanguage.extension}`}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
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
