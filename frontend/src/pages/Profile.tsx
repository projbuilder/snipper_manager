import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { snippetService } from '../services/snippetService';
import { Snippet } from '../types';
import SnippetCard from '../components/snippet/SnippetCard';

const Profile = () => {
  const { user } = useAuthStore();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadUserSnippets();
  }, [user]);

  const loadUserSnippets = async () => {
    if (!user) return;
    try {
      const data = await snippetService.getUserSnippets(user._id);
      setSnippets(data.snippets);
    } catch (error) {
      console.error('Failed to load snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="card">
        <h1 className="text-3xl font-bold mb-2">{user.displayName}</h1>
        <p className="text-gray-600">@{user.username}</p>
        <p className="text-sm text-gray-500 mt-2">{user.email}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">My Snippets ({snippets.length})</h2>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : snippets.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">You haven't created any snippets yet.</p>
            <a href="/snippets/new" className="btn btn-primary">
              Create Your First Snippet
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets.map((snippet) => (
              <SnippetCard key={snippet._id} snippet={snippet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
