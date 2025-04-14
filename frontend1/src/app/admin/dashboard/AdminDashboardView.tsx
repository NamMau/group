'use client';

import React, { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { StatisticsCharts } from '@/components/admin/dashboard/StatisticsCharts';
import { Box, Tab, Tabs, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useRouter } from 'next/navigation';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const AdminDashboardView = () => {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [users, setUsers] = useState<Array<{ _id: string; fullName: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedRole) {
      fetchUsersByRole(selectedRole);
    }
  }, [selectedRole]);

  const fetchUsersByRole = async (role: string) => {
    try {
      setLoading(true);
      const fetchedUsers = await userService.getUsersByRole(role);
      setUsers(fetchedUsers);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedRole('');
    setSelectedUser('');
  };

  const handleRoleChange = (event: any) => {
    setSelectedRole(event.target.value);
    setSelectedUser('');
  };

  const handleUserChange = (event: any) => {
    setSelectedUser(event.target.value);
  };

  const navigateToUserDashboard = () => {
    if (selectedUser && selectedRole) {
      if (selectedRole === 'student') {
        router.push(`/student/dashboard/${selectedUser}`);
      } else if (selectedRole === 'tutor') {
        router.push(`/tutor/dashboard/${selectedUser}`);
      }
    }
  };

  return (
    <div className="p-6">
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="User Dashboards" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <StatisticsCharts />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <div className="space-y-4">
          <FormControl fullWidth>
            <InputLabel>Select Role</InputLabel>
            <Select
              value={selectedRole}
              onChange={handleRoleChange}
              label="Select Role"
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="tutor">Tutor</MenuItem>
            </Select>
          </FormControl>

          {selectedRole && (
            <FormControl fullWidth>
              <InputLabel>Select User</InputLabel>
              <Select
                value={selectedUser}
                onChange={handleUserChange}
                label="Select User"
                disabled={loading}
              >
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {error && (
            <Typography color="error" className="mt-2">
              {error}
            </Typography>
          )}

          {selectedUser && (
            <button
              onClick={navigateToUserDashboard}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              View Dashboard
            </button>
          )}
        </div>
      </TabPanel>
    </div>
  );
}; 