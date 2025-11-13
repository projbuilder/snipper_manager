import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, GitFork, Eye, Edit, Trash2, Lock, Globe } from 'lucide-react';
import { snippetService } from '../services/snippetService';
import { useAuthStore } from '../store/authStore';
import { Snippet } from '../types';
import CodeDisplay from '../components/snippet/CodeDisplay';
import { formatDistanceToNow } from 'date-fns';

const SnippetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [isStarred, setIsStarred] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadSnippet(id);
  }, [id]);

  const loadSnippet = async (snippetId: string) => {
    try {
      const data = await snippetService.getSnippetById(snippetId);
      setSnippet(data.snippet);
      setIsStarred(data.isStarred);
    } catch (error) {
      console.error('Failed to load snippet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStar = async () => {
    if (!snippet || !id) return;
    try {
      const data = await snippetService.starSnippet(id);
      setIsStarred(data.isStarred);
      setSnippet({ ...snippet, stats: { ...snippet.stats, stars: data.stars } });
    } catch (error) {
      console.error('Failed to star snippet:', error);
    }
  };

  const handleFork = async () => {
    if (!id) return;
    try {
      const forked = await snippetService.forkSnippet(id);
      navigate(`/snippets/${forked._id}/edit`);
    } catch (error) {
      console.error('Failed to fork snippet:', error);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this snippet?')) return;
    try {
      await snippetService.deleteSnippet(id);
      navigate('/snippets');
    } catch (error) {
      console.error('Failed to delete snippet:', error);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!snippet) return <div className="text-center py-12">Snippet not found</div>;

  const author = typeof snippet.author === 'object' ? snippet.author : null;
  const isOwner = user && author && user._id === author._id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-3xl font-bold">{snippet.title}</h1>
              {snippet.visibility === 'private' ? (
                <Lock className="w-5 h-5 text-gray-500" />
              ) : (
                <Globe className="w-5 h-5 text-gray-500" />
              )}
            </div>
            {snippet.description && <p className="text-gray-600">{snippet.description}</p>}
          </div>

          {isOwner && (
            <div className="flex space-x-2">
              <Link to={`/snippets/${id}/edit`} className="btn btn-secondary">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
            {snippet.language}
          </span>
          {snippet.tags.map((tag) => (
            <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
          <button
            onClick={handleStar}
            className={`flex items-center space-x-1 hover:text-yellow-600 transition ${
              isStarred ? 'text-yellow-600' : ''
            }`}
          >
            <Star className="w-4 h-4" fill={isStarred ? 'currentColor' : 'none'} />
            <span>{snippet.stats.stars} stars</span>
          </button>
          <button onClick={handleFork} className="flex items-center space-x-1 hover:text-primary-600">
            <GitFork className="w-4 h-4" />
            <span>{snippet.forks} forks</span>
          </button>
          <span className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{snippet.stats.views} views</span>
          </span>
        </div>

        {author && (
          <div className="flex items-center text-sm text-gray-600 border-t pt-3">
            <span>Created by <strong>{author.displayName || author.username}</strong></span>
            <span className="mx-2">•</span>
            <span>{formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true })}</span>
          </div>
        )}
      </div>

      <CodeDisplay code={snippet.code} language={snippet.language} />
    </div>
  );
};

export default SnippetDetail;
