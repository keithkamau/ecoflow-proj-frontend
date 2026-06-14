
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';

import PhotoUploadComponent from '../../components/listings/PhotoUploadComponent';

beforeAll(() => {
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn(() => 'blob:test'),
    revokeObjectURL: vi.fn(),
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

  it('handles file upload', () => {
    const handleChange = vi.fn();
    const { container } = render(<PhotoUploadComponent onPhotosChange={handleChange} />);
    
    const input = container.querySelector('input[type="file"]');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(input, { target: { files: [file] } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('removes photo when clicked', () => {
    const photos = [{ id: '1', photo_url: 'https://example.com/1.jpg', isNew: false }];
    const handleChange = vi.fn();
    render(<PhotoUploadComponent photos={photos} onPhotosChange={handleChange} />);
    
    const removeButtons = screen.getAllByText('✕');
    fireEvent.click(removeButtons[0]);
    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it('hides add button when max photos reached', () => {
    const photos = Array(5).fill({ photo_url: 'https://example.com/1.jpg' });
    render(<PhotoUploadComponent photos={photos} onPhotosChange={vi.fn()} />);
    expect(screen.queryByText('Add')).not.toBeInTheDocument();
  });
});
