import { describe, it, expect, vi } from "vitest";

import { render, screen, fireEvent } from '@testing-library/react';

import ListingCard from '../../components/listings/ListingCard';
import SearchBar from '../../components/listings/SearchBar';
import PhotoUploadComponent from '../../components/listings/PhotoUploadComponent';
import ListingStatusBadge from '../../components/listings/ListingStatusBadge';

const mockListing = {
  id: 1,
  material: { type: 'plastic', unit: 'kg' },
  quantity: 50,
  status: 'active',
  location_address: 'Nairobi, Kenya',
  price_expectation: 700,
  photos: [{ photo_url: 'https://example.com/photo.jpg' }],
};

describe('ListingCard', () => {
  it('renders listing details', () => {
    render(<ListingCard listing={mockListing} />);
    expect(screen.getByText('plastic')).toBeInTheDocument();
    expect(screen.getByText('50 kg')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('KES 700')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<ListingCard listing={mockListing} onClick={handleClick} />);
    fireEvent.click(screen.getByText('plastic'));
    expect(handleClick).toHaveBeenCalledWith(1);
  });

  it('renders without photos', () => {
    const listingNoPhotos = { ...mockListing, photos: [] };
    render(<ListingCard listing={listingNoPhotos} />);
    expect(screen.getByText('plastic')).toBeInTheDocument();
  });
});

describe('SearchBar', () => {
  it('renders filter inputs', () => {
    render(<SearchBar />);
    expect(screen.getByText('All Materials')).toBeInTheDocument();
    expect(screen.getByText('All Status')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min qty e.g. 10')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max qty e.g. 100')).toBeInTheDocument();
  });

  it('calls onSearch when submitted', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    fireEvent.click(screen.getByText('Search'));
    expect(handleSearch).toHaveBeenCalled();
  });

  it('calls onSearch with empty filters on reset', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    fireEvent.click(screen.getByText('Reset'));
    expect(handleSearch).toHaveBeenCalledWith({});
  });
});

describe('PhotoUploadComponent', () => {
  it('renders upload button', () => {
    render(<PhotoUploadComponent />);
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('shows photo count', () => {
    render(<PhotoUploadComponent photos={[]} />);
    expect(screen.getByText('0 / 5 photos')).toBeInTheDocument();
  });

  it('renders with photos', () => {
    const photos = [{ photo_url: 'https://example.com/1.jpg' }];
    render(<PhotoUploadComponent photos={photos} onPhotosChange={vi.fn()} />);
    expect(screen.getByAltText('Photo 1')).toBeInTheDocument();
  });
});

describe('ListingStatusBadge', () => {
  it.each([
    ['active', 'Active'],
    ['matched', 'Matched'],
    ['completed', 'Completed'],
    ['expired', 'Expired'],
  ])('renders %s status', (status, label) => {
    render(<ListingStatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
