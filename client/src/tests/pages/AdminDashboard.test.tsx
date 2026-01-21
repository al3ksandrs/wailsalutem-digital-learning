import { render, screen, fireEvent } from '@testing-library/react';
import AdminDashboard from 'src/pages/Admin/AdminDashboard';
import * as adminService from '../../services/adminService';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const MOCK_STATS = {
  totalStudents: 100,
  newStudentsMonth: 10,
  totalTeachers: 50,
  newTeachersMonth: 5,
  pendingTeachers: 3,
  totalSubjects: 10,
  openHelpRequests: 2,
  newRequestsMonth: 4,
};

vi.mock('../../../services/adminService', () => ({
  useGetDashboardStats: vi.fn(),
}));

vi.mock('../../../components/LogoutButton', () => ({
  default: () => <button data-testid="logout-btn">Logout</button>,
}));

vi.mock('../../../pages/Admin/tabs/UserManagementTab', () => ({
  UserManagementTab: () => <div data-testid="user-management-tab">User Management Content</div>,
}));

vi.mock('../../../pages/Admin/tabs/HelpRequestsTab', () => ({
  HelpRequestsTab: () => <div data-testid="help-requests-tab">Help Requests Content</div>,
}));

vi.mock('../../../pages/Admin/tabs/PendingTeachersTab', () => ({
  PendingTeachersTab: () => <div data-testid="pending-teachers-tab">Pending Teachers Content</div>,
}));

vi.mock('../../../pages/Admin/tabs/ManualMatchingTab', () => ({
  ManualMatchingTab: () => <div data-testid="manual-matching-tab">Manual Matching Content</div>,
}));

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (adminService.useGetDashboardStats as any).mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(<AdminDashboard />);
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  it('renders dashboard stats and default tab when loaded', () => {
    (adminService.useGetDashboardStats as any).mockReturnValue({
      data: MOCK_STATS,
      isLoading: false,
    });

    render(<AdminDashboard />);

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Total students')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument(); 
    expect(screen.getByText('Total teachers')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    
    expect(screen.getByTestId('user-management-tab')).toBeInTheDocument();
  });

  it('calculates and displays growth percentages correctly', () => {
    (adminService.useGetDashboardStats as any).mockReturnValue({
      data: MOCK_STATS,
      isLoading: false,
    });

    render(<AdminDashboard />);

    // Previous total = 100 - 10 = 90. (10/90)*100 = 11%
    expect(screen.getByText('+11% this month')).toBeInTheDocument();
  });

  it('switches tabs correctly', () => {
    (adminService.useGetDashboardStats as any).mockReturnValue({
      data: MOCK_STATS,
      isLoading: false,
    });

    render(<AdminDashboard />);

    const helpTabBtn = screen.getByText('Help requests');
    fireEvent.click(helpTabBtn);
    expect(screen.getByTestId('help-requests-tab')).toBeInTheDocument();
    expect(screen.queryByTestId('user-management-tab')).not.toBeInTheDocument();

    const pendingTabBtn = screen.getByText('Pending teacher registrations');
    fireEvent.click(pendingTabBtn);
    expect(screen.getByTestId('pending-teachers-tab')).toBeInTheDocument();

    const manualTabBtn = screen.getByText('Manual matching');
    fireEvent.click(manualTabBtn);
    expect(screen.getByTestId('manual-matching-tab')).toBeInTheDocument();
  });

  it('displays action required text for pending items', () => {
    (adminService.useGetDashboardStats as any).mockReturnValue({
      data: MOCK_STATS, 
      isLoading: false,
    });

    render(<AdminDashboard />);
    
    // StatsCard renders "Action required" if pending items > 0
    const actionRequiredElements = screen.getAllByText('(Action required)');
    expect(actionRequiredElements.length).toBeGreaterThan(0);
  });
});