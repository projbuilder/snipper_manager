import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Outlet />
      </main>
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <p className="text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Code Snippet Manager. Built with MERN Stack.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
