import React, { useState } from 'react';
import { useGetDashboardStats } from '../../services/adminService';
import StatsCard from '../../components/StatsCard';
import LogoutButton from '../../components/LogoutButton';
import '../../css/admin-dashboard.css';

// Tabs
import { UserManagementTab } from './tabs/UserManagementTab';
import { HelpRequestsTab } from './tabs/HelpRequestsTab';
import { PendingTeachersTab } from './tabs/PendingTeachersTab';
import { PendingMatchesTab } from './tabs/PendingMatchesTab';
import { ManualMatchingTab } from './tabs/ManualMatchingTab';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'user_management' | 'help_requests' | 'pending_teachers' | 'pending_matches' | 'manual_matching'>('user_management');

  const { data: stats, isLoading } = useGetDashboardStats();

  // Helper to calculate percentage growth based on monthly new users
  const getGrowthText = (total: number, newThisMonth: number) => {
    if (!total || total === 0) return "No data";
    if (!newThisMonth || newThisMonth === 0) return "No change this month";
    
    const previousTotal = total - newThisMonth;
    if (previousTotal <= 0) return `+100% this month`; 
    
    const percentage = Math.round((newThisMonth / previousTotal) * 100);
    return `+${percentage}% this month`;
  };

  if (isLoading) return <div className="admin-loading">Loading dashboard...</div>;

  const s = stats as any;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <LogoutButton />
      </div>

      {/* Stats section */}
      <div className="admin-stats">
        <StatsCard 
          title="Total students" 
          value={s?.totalStudents || 0} 
          icon="👨‍🎓" 
          trend={getGrowthText(s?.totalStudents, s?.newStudentsMonth)}
          trendDirection={s?.newStudentsMonth > 0 ? "up" : "neutral"}
        />
        <StatsCard 
          title="Total teachers" 
          value={s?.totalTeachers || 0} 
          icon="👨‍🏫" 
          trend={getGrowthText(s?.totalTeachers, s?.newTeachersMonth)}
          trendDirection={s?.newTeachersMonth > 0 ? "up" : "neutral"}
        />
        <StatsCard 
          title="Pending approvals" 
          value={s?.pendingTeachers || 0} 
          icon="⏳" 
          color={(s?.pendingTeachers || 0) > 0 ? 'orange' : 'blue'}
          trend={s?.pendingTeachers ? "(Action required)" : "All caught up"}
          trendDirection={s?.pendingTeachers ? "down" : "neutral"}
        />
        <StatsCard 
            title="Pending Matches"
            value={s?.pendingMatches || 0}
            icon="🤝"
            color={(s?.pendingMatches || 0) > 0 ? 'orange' : 'purple'}
            trend={s?.pendingMatches ? "(Action required)" : "No new requests"}
            trendDirection={s?.pendingMatches ? "down" : "neutral"}
        />
      </div>

      {/* Tabs navigation */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab-btn ${activeTab === 'user_management' ? 'active' : ''}`}
          onClick={() => setActiveTab('user_management')}
        >
          User management
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'help_requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('help_requests')}
        >
          Help requests
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'pending_teachers' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending_teachers')}
        >
          Pending teacher registrations
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'pending_matches' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending_matches')}
        >
          Pending matches
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'manual_matching' ? 'active' : ''}`}
          onClick={() => setActiveTab('manual_matching')}
        >
          Manual matching
        </button>
      </div>

      {/* Tab content */}
      <div className="admin-content">
        {activeTab === 'user_management' && <UserManagementTab />}
        {activeTab === 'help_requests' && <HelpRequestsTab />}
        {activeTab === 'pending_teachers' && <PendingTeachersTab />}
        {activeTab === 'pending_matches' && <PendingMatchesTab />}
        {activeTab === 'manual_matching' && <ManualMatchingTab />}
      </div>
    </div>
  );
};

export default AdminDashboard;