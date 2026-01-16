import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, Calendar, Edit2, Save, X, Eye, EyeOff, LogOut, Lock } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.admin@goldenschool.com',
    phone: '+91 98765 43210',
    department: 'School Administration',
    position: 'Principal',
    address: '123 Education Street, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    joinDate: '2020-06-15',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [editedData, setEditedData] = useState(formData);

  // Admin stats
  const adminStats = [
    { label: 'Students', value: '1,245', icon: User, color: 'bg-blue-100 text-blue-600' },
    { label: 'Teachers', value: '85', icon: Building, color: 'bg-purple-100 text-purple-600' },
    { label: 'Classes', value: '42', icon: Calendar, color: 'bg-green-100 text-green-600' },
    { label: 'Last Login', value: 'Today', icon: LogOut, color: 'bg-orange-100 text-orange-600' },
  ];

  const recentActivity = [
    { action: 'Updated student records', time: '2 hours ago', type: 'update' },
    { action: 'Added new teacher - Priya Sharma', time: '5 hours ago', type: 'add' },
    { action: 'Approved fee waiver requests', time: '1 day ago', type: 'approve' },
    { action: 'Generated class reports', time: '2 days ago', type: 'report' },
    { action: 'Updated exam schedule', time: '3 days ago', type: 'update' },
  ];

  const loginHistory = [
    { date: '14 Jan, 2026', time: '10:30 AM', device: 'Chrome - Windows', status: 'Active' },
    { date: '13 Jan, 2026', time: '09:15 AM', device: 'Safari - MacOS', status: 'Logged out' },
    { date: '12 Jan, 2026', time: '02:45 PM', device: 'Chrome - Windows', status: 'Logged out' },
    { date: '11 Jan, 2026', time: '11:20 AM', device: 'Firefox - Linux', status: 'Logged out' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    setFormData(editedData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill all password fields');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    alert('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowChangePassword(false);
  };

  const handleCancel = () => {
    setEditedData(formData);
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Profile</h1>
        <p className="text-gray-600">Manage your account and settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
        {/* Cover Section */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>

        {/* Profile Header */}
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 -mt-16 relative z-10 mb-8">
            <div className="flex items-end gap-4">
              <div className="w-32 h-32 bg-white rounded-lg shadow-lg border-4 border-white flex items-center justify-center">
                <User className="w-20 h-20 text-blue-600" />
              </div>
              <div className="pb-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-blue-600 font-semibold">{formData.position}</p>
                <p className="text-gray-600 text-sm">{formData.department}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                isEditing
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 pt-8 border-t border-gray-200">
            {adminStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>

            {!isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">First Name</label>
                    <p className="text-gray-900 font-medium mt-2">{formData.firstName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Last Name</label>
                    <p className="text-gray-900 font-medium mt-2">{formData.lastName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Email Address</label>
                    <p className="text-gray-900 font-medium mt-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      {formData.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Phone Number</label>
                    <p className="text-gray-900 font-medium mt-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      {formData.phone}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Position</label>
                    <p className="text-gray-900 font-medium mt-2">{formData.position}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Department</label>
                    <p className="text-gray-900 font-medium mt-2">{formData.department}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Address</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Street Address</label>
                      <p className="text-gray-900 font-medium mt-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        {formData.address}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-sm font-semibold text-gray-600">City</label>
                        <p className="text-gray-900 font-medium mt-2">{formData.city}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">State</label>
                        <p className="text-gray-900 font-medium mt-2">{formData.state}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">ZIP Code</label>
                        <p className="text-gray-900 font-medium mt-2">{formData.zipCode}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Join Date</label>
                    <p className="text-gray-900 font-medium mt-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      {new Date(formData.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 block mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editedData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 block mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editedData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 block mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={editedData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 block mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editedData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 block mb-2">Position</label>
                    <input
                      type="text"
                      name="position"
                      value={editedData.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 block mb-2">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={editedData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Address</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600 block mb-2">Street Address</label>
                      <input
                        type="text"
                        name="address"
                        value={editedData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-sm font-semibold text-gray-600 block mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={editedData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600 block mb-2">State</label>
                        <input
                          type="text"
                          name="state"
                          value={editedData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600 block mb-2">ZIP Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={editedData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Change Password */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {!showChangePassword ? (
              <>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  Security
                </h3>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Change Password
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
                
                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-2.5 text-gray-500"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-gray-500"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-gray-500"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleChangePassword}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => setShowChangePassword(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700 transition">
                Download Profile
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700 transition">
                Export Data
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-red-50 rounded-lg font-medium text-red-600 transition">
                Logout All Devices
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Login History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'update' ? 'bg-blue-600' :
                  activity.type === 'add' ? 'bg-green-600' :
                  activity.type === 'approve' ? 'bg-purple-600' :
                  'bg-orange-600'
                }`}></div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.action}</p>
                  <p className="text-gray-500 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Login History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Login History</h3>
          <div className="space-y-4">
            {loginHistory.map((login, idx) => (
              <div key={idx} className="pb-4 border-b border-gray-200 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-gray-900 font-medium">{login.device}</p>
                    <p className="text-gray-600 text-sm">{login.date} at {login.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    login.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {login.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;