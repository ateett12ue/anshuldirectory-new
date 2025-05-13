import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PersonHome from './pages/PersonHome';
import PersonAdd from './pages/PersonAdd';
import PersonList from './pages/PersonList';
import TestPage from './pages/TestPage';
import { PersonProvider } from './context/PersonContext';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PersonProvider>
        <Router>
          <div className="min-h-screen text-white">
            <nav className="sticky top-0 bg-black shadow-md z-10">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link 
                  to="/" 
                  className="group relative flex items-center"
                  title="Anshul's Directory"
                >
                  <div className="w-8 h-8 bg-white rounded-full mr-2 flex items-center justify-center text-black font-bold">
                    D
                  </div>
                  <span className="text-xl font-extrabold tracking-widest text-white">
                    DIRECTORY
                  </span>
                  
                  {/* Tooltip */}
                  <span className="absolute top-full left-0 mt-1 text-white text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Anshul's Directory
                  </span>
                </Link>
                <div className="space-x-8">
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                    Home
                  </Link>
                  <Link to="/add" className="text-gray-300 hover:text-white transition-colors">
                    Add Person
                  </Link>
                  <Link to="/list" className="text-gray-300 hover:text-white transition-colors">
                    View Directory
                  </Link>
                  {/* <Link to="/test" className="text-gray-300 hover:text-white transition-colors">
                    Test
                  </Link> */}
                </div>
              </div>
            </nav>

            <main>
              <Routes>
                <Route path="/" element={<PersonHome />} />
                <Route path="/add" element={<PersonAdd />} />
                <Route path="/list" element={<PersonList />} />
                <Route path="/test" element={<TestPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </PersonProvider>
    </QueryClientProvider>
  );
}

export default App;
