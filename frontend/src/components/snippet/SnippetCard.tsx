import { Link } from 'react-router-dom';
import { Star, GitFork, Eye } from 'lucide-react';
import { Snippet } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  snippet: Snippet;
}

const SnippetCard = ({ snippet }: Props) => {
  const author = typeof snippet.author === 'object' ? snippet.author : null;

  return (
    <Link to={`/snippets/${snippet._id}`} className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold line-clamp-1">{snippet.title}</h3>
        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
          {snippet.language}
        </span>
      </div>

      {snippet.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{snippet.description}</p>
      )}

      <div className="flex flex-wrap gap-1 mb-3">
        {snippet.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
            #{tag}
          </span>
        ))}
        {snippet.tags.length > 3 && (
          <span className="text-xs text-gray-500">+{snippet.tags.length - 3}</span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>{snippet.stats.stars}</span>
          </span>
          <span className="flex items-center space-x-1">
            <GitFork className="w-4 h-4" />
            <span>{snippet.forks}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{snippet.stats.views}</span>
          </span>
        </div>
        <span className="text-xs">
          {formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true })}
        </span>
      </div>

      {author && (
        <div className="mt-2 pt-2 border-t text-xs text-gray-500">
          by {author.displayName || author.username}
        </div>
      )}
    </Link>
  );
};

export default SnippetCard;
