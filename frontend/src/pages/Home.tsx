import { Link } from 'react-router-dom';
import { Code, GitFork, Star, Search, Lock } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Manage & Share Code Snippets
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Store, organize, and share your code snippets with syntax highlighting, forking capabilities, and advanced search
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/snippets" className="btn btn-primary text-lg px-8 py-3">
            Explore Snippets
          </Link>
          <Link to="/register" className="btn btn-secondary text-lg px-8 py-3">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Code className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Syntax Highlighting</h3>
          <p className="text-gray-600">
            Beautiful syntax highlighting for 100+ programming languages with Monaco Editor
          </p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <GitFork className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Fork & Collaborate</h3>
          <p className="text-gray-600">
            Fork public snippets, track lineage, and build on others' work
          </p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Search className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Powerful Search</h3>
          <p className="text-gray-600">
            Find snippets by language, tags, author, or full-text search
          </p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Star className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Star & Organize</h3>
          <p className="text-gray-600">
            Star your favorite snippets and organize them into collections
          </p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Lock className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Privacy Controls</h3>
          <p className="text-gray-600">
            Choose between public, private, or unlisted snippet visibility
          </p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Code className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Code Execution</h3>
          <p className="text-gray-600">
            Preview code execution in a secure, sandboxed environment
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 text-white rounded-lg p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-xl mb-6">Join thousands of developers sharing and discovering code snippets</p>
        <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
          Create Free Account
        </Link>
      </section>
    </div>
  );
};

export default Home;
