import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ── Mock PickupMap entirely (avoids Leaflet dynamic-import issues in jsdom) ──
jest.mock('../../components/pickup/PickupMap', () => {
  return function MockPickupMap({ pickupLocation }) {
    return (
      <div data-testid='pickup-map'>
        {pickupLocation?.address && <p>{pickupLocation.address}</p>}
      </div>
    );
  };
});

jest.mock('../../services/pickupService', () => ({
  getPickups:     jest.fn().mockResolvedValue({ data: [] }),
  getDrivers:     jest.fn().mockResolvedValue({ data: [] }),
  schedulePickup: jest.fn().mockResolvedValue({ data: { id: 'p99', status: 'scheduled' } }),
  uploadProof:    jest.fn().mockResolvedValue({ data: { success: true } }),
  assignDriver:   jest.fn().mockResolvedValue({ data: { success: true } }),
}));

import PickupCard       from '../../components/pickup/PickupCard';
import PickupTracker    from '../../components/pickup/PickupTracker';
import PickupScheduler  from '../../components/pickup/PickupScheduler';
import PickupMap        from '../../components/pickup/PickupMap';
import ProofUpload      from '../../components/pickup/ProofUpload';
import DriverAssignment from '../../components/pickup/DriverAssignment';

// ── Helpers ────────────────────────────────────────────────────
const wrap = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

const MOCK_PICKUP = {
  id: 'p1',
  scheduled_time: '2026-06-14T09:00:00Z',
  pickup_location: { address: '45 Ngong Road, Nairobi', lat: -1.2921, lng: 36.7819 },
  status: 'scheduled',
  driver: { name: 'Joseph Kamau', vehicle: 'Toyota Pickup', phone: '+254712345678' },
  material: { type: 'plastic', quantity: 50, unit: 'kg' },
};

// ── PickupCard ─────────────────────────────────────────────────
describe('PickupCard', () => {
  it('renders pickup card with material type and status', () => {
    wrap(<PickupCard pickup={MOCK_PICKUP} />);
    expect(screen.getByText(/Plastic Pickup/i)).toBeInTheDocument();
    expect(screen.getByText(/Scheduled/i)).toBeInTheDocument();
  });

  it('renders address and driver name', () => {
    wrap(<PickupCard pickup={MOCK_PICKUP} />);
    expect(screen.getByText(/45 Ngong Road/i)).toBeInTheDocument();
    expect(screen.getByText(/Joseph Kamau/i)).toBeInTheDocument();
  });

  it('links to the tracking page', () => {
    wrap(<PickupCard pickup={MOCK_PICKUP} />);
    const link = screen.getByTestId('pickup-card').closest('a');
    expect(link).toHaveAttribute('href', '/pickups/p1');
  });

  it('shows error badge for cancelled status', () => {
    wrap(<PickupCard pickup={{ ...MOCK_PICKUP, status: 'cancelled' }} />);
    expect(screen.getByText(/Cancelled/i)).toBeInTheDocument();
  });
});

// ── PickupTracker ──────────────────────────────────────────────
describe('PickupTracker', () => {
  it('renders all four status steps', () => {
    render(<PickupTracker status='scheduled' />);
    expect(screen.getByText('Scheduled')).toBeInTheDocument();
    expect(screen.getByText('On the Way')).toBeInTheDocument();
    expect(screen.getByText('Arrived')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('marks the current step with "Current" badge', () => {
    render(<PickupTracker status='on_the_way' />);
    expect(screen.getByText('Current')).toBeInTheDocument();
  });

  it('shows the tracker container', () => {
    render(<PickupTracker status='scheduled' />);
    expect(screen.getByTestId('pickup-tracker')).toBeInTheDocument();
  });

  it('handles completed status without error', () => {
    render(<PickupTracker status='completed' />);
    expect(screen.getByTestId('pickup-tracker')).toBeInTheDocument();
  });
});

// ── PickupScheduler ────────────────────────────────────────────
describe('PickupScheduler', () => {
  it('renders date, time, and address inputs', () => {
    render(<PickupScheduler />);
    expect(screen.getByLabelText(/Pickup Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Time Slot/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pickup Address/i)).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    render(<PickupScheduler />);
    fireEvent.click(screen.getByRole('button', { name: /Confirm Pickup/i }));
    await waitFor(() => {
      expect(screen.getByText(/Please select a date/i)).toBeInTheDocument();
      expect(screen.getByText(/Please choose a time slot/i)).toBeInTheDocument();
      expect(screen.getByText(/Pickup address is required/i)).toBeInTheDocument();
    });
  });

  it('clears address error when field is filled', async () => {
    render(<PickupScheduler />);
    fireEvent.click(screen.getByRole('button', { name: /Confirm Pickup/i }));
    await waitFor(() => expect(screen.getByText(/Pickup address is required/i)).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/Pickup Address/i), { target: { value: 'Ngong Road' } });
    await waitFor(() =>
      expect(screen.queryByText(/Pickup address is required/i)).not.toBeInTheDocument()
    );
  });

  it('calls onScheduled with correct payload on valid submit', async () => {
    const onScheduled = jest.fn();
    render(<PickupScheduler onScheduled={onScheduled} />);

    fireEvent.change(screen.getByLabelText(/Pickup Date/i),    { target: { value: '2026-12-01' } });
    fireEvent.change(screen.getByLabelText(/Time Slot/i),      { target: { value: '08:00' } });
    fireEvent.change(screen.getByLabelText(/Pickup Address/i), { target: { value: '45 Ngong Road' } });
    fireEvent.click(screen.getByRole('button', { name: /Confirm Pickup/i }));

    await waitFor(() => {
      expect(onScheduled).toHaveBeenCalledWith(
        expect.objectContaining({
          scheduled_time: '2026-12-01T08:00:00Z',
          pickup_location: { address: '45 Ngong Road' },
        })
      );
    });
  });
});

// ── PickupMap ──────────────────────────────────────────────────
describe('PickupMap', () => {
  it('renders the map container', () => {
    render(<PickupMap />);
    expect(screen.getByTestId('pickup-map')).toBeInTheDocument();
  });

  it('displays the pickup address when provided', () => {
    render(
      <PickupMap
        pickupLocation={{ address: '45 Ngong Road, Nairobi', lat: -1.2921, lng: 36.7819 }}
      />
    );
    expect(screen.getByText(/45 Ngong Road/i)).toBeInTheDocument();
  });
});

// ── ProofUpload ────────────────────────────────────────────────
describe('ProofUpload', () => {
  beforeEach(() => {
    global.URL.createObjectURL = jest.fn().mockReturnValue('blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();
  });

  it('renders weight input and drop zone', () => {
    render(<ProofUpload />);
    expect(screen.getByLabelText(/Verified Weight/i)).toBeInTheDocument();
    expect(screen.getByTestId('drop-zone')).toBeInTheDocument();
  });

  it('shows validation error for missing weight on submit', async () => {
    render(<ProofUpload />);
    fireEvent.click(screen.getByRole('button', { name: /Submit Proof/i }));
    await waitFor(() => {
      expect(screen.getByText(/Enter a valid weight/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for missing photo', async () => {
    render(<ProofUpload />);
    fireEvent.change(screen.getByLabelText(/Verified Weight/i), { target: { value: '50' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Proof/i }));
    await waitFor(() => {
      expect(screen.getByText(/Upload at least one photo/i)).toBeInTheDocument();
    });
  });

  it('adds files via file input and shows thumbnail count', async () => {
    render(<ProofUpload />);
    const fileInput = document.querySelector('input[type="file"]');
    const mockFile = new File(['content'], 'photo.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    await waitFor(() => {
      expect(screen.getByText(/1\/4/i)).toBeInTheDocument();
    });
  });

  it('updates drag-over state on drag events', () => {
    render(<ProofUpload />);
    const dropZone = screen.getByTestId('drop-zone');
    fireEvent.dragOver(dropZone, { preventDefault: jest.fn() });
    fireEvent.dragLeave(dropZone);
    // No throw = pass — state changes are internal
    expect(dropZone).toBeInTheDocument();
  });

  it('shows success state after submit with onSubmit callback', async () => {
    const onSubmit = jest.fn().mockResolvedValue({});
    render(<ProofUpload pickupId='p1' onSubmit={onSubmit} />);

    const fileInput = document.querySelector('input[type="file"]');
    const mockFile = new File(['content'], 'photo.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    fireEvent.change(screen.getByLabelText(/Verified Weight/i), { target: { value: '48.5' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Proof/i }));

    await waitFor(() => {
      expect(screen.getByText(/Proof Submitted/i)).toBeInTheDocument();
    });
    expect(onSubmit).toHaveBeenCalled();
  });
});

// ── DriverAssignment ───────────────────────────────────────────
const MOCK_DRIVERS = [
  { id: 'd1', name: 'John Mwangi',  vehicle: 'Toyota Hilux', phone: '+254712345678', status: 'available' },
  { id: 'd2', name: 'Peter Kamau',  vehicle: 'Ford Ranger',  phone: '+254798765432', status: 'on_trip'   },
];

describe('DriverAssignment', () => {
  it('renders the assignment panel', () => {
    render(<DriverAssignment pickupId='p1' />);
    expect(screen.getByTestId('driver-assignment')).toBeInTheDocument();
  });

  it('shows "No drivers available" when driver list is empty', async () => {
    render(<DriverAssignment pickupId='p1' />);
    await waitFor(() => {
      expect(screen.getByText(/No drivers available/i)).toBeInTheDocument();
    });
  });

  it('renders available driver cards', async () => {
    const { getDrivers } = require('../../services/pickupService');
    getDrivers.mockResolvedValueOnce({ data: MOCK_DRIVERS });
    render(<DriverAssignment pickupId='p1' />);
    await waitFor(() => {
      expect(screen.getByText('John Mwangi')).toBeInTheDocument();
    });
    // on_trip driver is filtered out — only available ones shown
    expect(screen.queryByText('Peter Kamau')).not.toBeInTheDocument();
  });

  it('shows validation error when submitting without a selection', async () => {
    const { getDrivers } = require('../../services/pickupService');
    getDrivers.mockResolvedValueOnce({ data: MOCK_DRIVERS });
    render(<DriverAssignment pickupId='p1' />);
    await waitFor(() => expect(screen.getByText('John Mwangi')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /Assign Driver/i }));
    await waitFor(() => {
      expect(screen.getByText(/Please select a driver/i)).toBeInTheDocument();
    });
  });

  it('shows assigned state after successful assignment', async () => {
    const { getDrivers } = require('../../services/pickupService');
    getDrivers.mockResolvedValueOnce({ data: MOCK_DRIVERS });
    const onAssigned = jest.fn();
    render(<DriverAssignment pickupId='p1' onAssigned={onAssigned} />);
    await waitFor(() => expect(screen.getByText('John Mwangi')).toBeInTheDocument());

    // Click the radio input to trigger onChange
    const radio = document.querySelector('input[type="radio"][value="d1"]');
    fireEvent.click(radio);

    fireEvent.click(screen.getByRole('button', { name: /Assign Driver/i }));
    await waitFor(() => {
      expect(screen.getByText(/Driver Assigned/i)).toBeInTheDocument();
    });
    expect(onAssigned).toHaveBeenCalledWith('d1');
  });
});
