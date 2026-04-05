import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Users, Car, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import api from '@/lib/api';
import { isAdmin } from '@/utils/auth';
import { formatPrice, formatDate } from '@/lib/utils';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVehicles = useCallback(async () => {
    try {
      const response = await api.get('/admin/vehicles?limit=50');
      setVehicles(response.data.vehicles || []);
    } catch (error) {
      toast.error('Failed to fetch vehicles');
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get('/admin/users?limit=50');
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    try {
      const response = await api.get('/admin/payments?limit=50');
      setPayments(response.data.payments || []);
    } catch (error) {
      toast.error('Failed to fetch payments');
    }
  }, []);

  useEffect(() => {
    if (!isAdmin()) {
      toast.error('Admin access required');
      navigate('/');
      return;
    }
    fetchStats();
  }, [navigate, fetchStats]);

  useEffect(() => {
    if (activeTab === 'vehicles') fetchVehicles();
    else if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'payments') fetchPayments();
  }, [activeTab, fetchVehicles, fetchUsers, fetchPayments]);

  const approveVehicle = async (vehicleId) => {
    try {
      await api.put(`/admin/vehicles/${vehicleId}/approve`);
      toast.success('Vehicle approved');
      fetchVehicles();
      fetchStats();
    } catch (error) {
      toast.error('Failed to approve vehicle');
    }
  };

  const rejectVehicle = async (vehicleId) => {
    try {
      await api.put(`/admin/vehicles/${vehicleId}/reject`);
      toast.success('Vehicle rejected');
      fetchVehicles();
      fetchStats();
    } catch (error) {
      toast.error('Failed to reject vehicle');
    }
  };

  const approvePayment = async (paymentId) => {
    try {
      await api.put(`/admin/payments/${paymentId}/approve`);
      toast.success('Payment approved');
      fetchPayments();
      fetchStats();
    } catch (error) {
      toast.error('Failed to approve payment');
    }
  };

  const rejectPayment = async (paymentId) => {
    try {
      await api.put(`/admin/payments/${paymentId}/reject`);
      toast.success('Payment rejected');
      fetchPayments();
      fetchStats();
    } catch (error) {
      toast.error('Failed to reject payment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <p className="text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="flex gap-2 mb-6 border-b overflow-x-auto">
          {['stats', 'vehicles', 'users', 'payments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize transition ${
                activeTab === tab
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'stats' && stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="h-8 w-8 text-primary" />
                    <span className="text-3xl font-bold">{stats.users?.total || 0}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Total Vehicles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Car className="h-8 w-8 text-primary" />
                    <span className="text-3xl font-bold">{stats.vehicles?.total || 0}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Pending: {stats.vehicles?.pending || 0} | Approved: {stats.vehicles?.approved || 0}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-8 w-8 text-primary" />
                    <span className="text-3xl font-bold">{stats.payments?.completed || 0}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Pending: {stats.payments?.pending || 0}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(stats.revenue?.total || 0)}
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="space-y-4">
            {vehicles.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600">No vehicles found</p>
                </CardContent>
              </Card>
            ) : (
              vehicles.map((vehicle) => (
                <Card key={vehicle._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <img
                        src={vehicle.images?.[0] || 'https://via.placeholder.com/200x150'}
                        alt={vehicle.brand}
                        className="w-full md:w-48 h-32 object-cover rounded"
                      />

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold">
                              {vehicle.brand} {vehicle.model}
                            </h3>
                            <p className="text-lg font-semibold text-primary">
                              {formatPrice(vehicle.price)}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              vehicle.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : vehicle.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {vehicle.status}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {vehicle.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mb-3">
                          <span>Year: {vehicle.year}</span>
                          <span>Mileage: {vehicle.mileage?.toLocaleString()} km</span>
                          <span>Location: {vehicle.location}</span>
                          <span>Posted: {formatDate(vehicle.created_at)}</span>
                        </div>

                        {vehicle.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => approveVehicle(vehicle._id)}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => rejectVehicle(vehicle._id)}
                              className="flex items-center gap-2"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/vehicles/${vehicle._id}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Phone</th>
                      <th className="px-4 py-2 text-left">Role</th>
                      <th className="px-4 py-2 text-left">Payment</th>
                      <th className="px-4 py-2 text-left">Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-t">
                        <td className="px-4 py-3">{user.name}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">+{user.phone}</td>
                        <td className="px-4 py-3 capitalize">{user.role}</td>
                        <td className="px-4 py-3">
                          {user.registration_fee_paid ? (
                            <span className="text-green-600 font-semibold">Paid</span>
                          ) : (
                            <span className="text-orange-600 font-semibold">Pending</span>
                          )}
                        </td>
                        <td className="px-4 py-3">{formatDate(user.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-4">
            {payments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600">No payments found</p>
                </CardContent>
              </Card>
            ) : (
              payments.map((payment) => (
                <Card key={payment._id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-lg font-semibold">{formatPrice(payment.amount)}</p>
                        <p className="text-sm text-gray-600">Payment ID: {payment.external_id}</p>
                        <p className="text-sm text-gray-600">Date: {formatDate(payment.created_at)}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : payment.status === 'manual_review'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm">
                        <strong>Method:</strong> {payment.payment_method}
                      </p>
                      {payment.manual_proof_url && (
                        <p className="text-sm">
                          <strong>Proof:</strong>{' '}
                          <a
                            href={payment.manual_proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View proof
                          </a>
                        </p>
                      )}
                    </div>

                    {payment.status === 'manual_review' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => approvePayment(payment._id)}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectPayment(payment._id)}
                          className="flex items-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;