// src/tests/components/listings.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ListingCard from '../../components/listings/ListingCard';
import SearchBar from '../../components/listings/SearchBar';
import PhotoUploadComponent from '../../components/listings/PhotoUploadComponent';
import ListingStatusBadge from '../../components/listings/ListingStatusBadge';

// Mock listing data
const mockListing = {
  id: 1,
  material: { type: 'plastic', unit: 'kg' },
  quantity: 50,
  status: 'active',
  location_address: 'Nairobi, Kenya',
  price_expectation: 700,
  photos: [{ photo_url: 'https://example.com/photo.jpg' }],
};

// ListingCard Tests 

describe('ListingCard', () => {
  it('renders listing details correctly', () => {
    render(
      <BrowserRouter>
        <ListingCard listing={mockListing} />
      </BrowserRouter>
    );

    expect(screen.getByText('plastic')).toBeInTheDocument();
    expect(screen.getByText('50 kg')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('📍 Nairobi, Kenya')).toBeInTheDocument();
    expect(screen.getByText('KES 700')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(
      <BrowserRouter>
        <ListingCard listing={mockListing} onClick={handleClick} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('plastic').closest('div'));
    expect(handleClick).toHaveBeenCalledWith(1);
  });

  it('renders without photos', () => {
    const listingWithoutPhotos = { ...mockListing, photos: [] };
    render(
      <BrowserRouter>
        <ListingCard listing={listingWithoutPhotos} />
      </BrowserRouter>
    );

    expect(screen.getByText('plastic')).toBeInTheDocument();
  });
});

// SearchBar Tests 

describe('SearchBar', () => {
  it('renders all filter inputs', () => {
    render(<SearchBar />);

    expect(screen.getByText('All Materials')).toBeInTheDocument();
    expect(screen.getByText('All Status')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min quantity')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max quantity')).toBeInTheDocument();
  });

  it('calls onSearch with filters when submitted', () => {
    const handleSearch = jest.fn();
    render(<SearchBar onSearch={handleSearch} />);

    fireEvent.change(screen.getByDisplayValue('All Materials'), {
      target: { name: 'material_type', value: 'plastic' },
    });

    fireEvent.click(screen.getByText('Search'));
    expect(handleSearch).toHaveBeenCalled();
  });

  it('calls onSearch with empty filters when reset', () => {
    const handleSearch = jest.fn();
    render(<SearchBar onSearch={handleSearch} />);

    fireEvent.click(screen.getByText('Reset'));
    expect(handleSearch).toHaveBeenCalledWith({});
  });
});

// PhotoUploadComponent Tests 

describe('PhotoUploadComponent', () => {
  it('renders upload button', () => {
    render(<PhotoUploadComponent />);
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('displays photo count', () => {
    render(<PhotoUploadComponent photos={[]} />);
    expect(screen.getByText('0 / 5 photos')).toBeInTheDocument();
  });
});

// ListingStatusBadge Tests 

describe('ListingStatusBadge', () => {
  it('renders active status', () => {
    render(<ListingStatusBadge status="active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders matched status', () => {
    render(<ListingStatusBadge status="matched" />);
    expect(screen.getByText('Matched')).toBeInTheDocument();
  });

  it('renders completed status', () => {
    render(<ListingStatusBadge status="completed" />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders expired status', () => {
    render(<ListingStatusBadge status="expired" />);
    expect(screen.getByText('Expired')).toBeInTheDocument();
  });
});