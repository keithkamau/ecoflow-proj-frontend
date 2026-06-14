// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ListingProvider } from './context/ListingContexts';
import EditListingPage from './pages/listings/EditListingPage';

// Pages
import ListingsPage from './pages/listings/ListingsPage';
import ListingDetailPage from './pages/listings/ListingDetailPage';
import CreateListingPage from './pages/listings/CreateListingPage';
import MyListingsPage from './pages/listings/MyListingsPage';
import RecyclerInventoryPage from './pages/listings/RecyclerInventoryPage';

function App() {
  return (
    <ListingProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/listings/new" element={<CreateListingPage />} />
            <Route path="/listings/:id" element={<ListingDetailPage />} />
            <Route path="/listings/:id/edit" element={<EditListingPage />} />
            <Route path="/my-listings" element={<MyListingsPage />} />
            <Route path="/inventory" element={<RecyclerInventoryPage />} />
            <Route path="/" element={<ListingsPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ListingProvider>
  );
}

export default App;
