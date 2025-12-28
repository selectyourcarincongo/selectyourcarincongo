import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Car, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { getUser, isAuthenticated } from '@/utils/auth';
import VehicleCard from '@/components/VehicleCard';
import api from '@/lib/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchUserVehicles();
    checkPaymentStatus();
  }, []);

  const fetchUserVehicles = async () => {
    try {
      const response = await api.get('/vehicles/user/me');
      setVehicles(response.data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await api.get('/payment/status');
      setPaymentStatus(response.data);
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>

        {/* Payment Status Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.registration_fee_paid ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Paid</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 text-orange-600 mb-3">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-semibold">Pending</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate('/payment')}
                  >
                    Complete Payment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                My Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Car className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold">{vehicles.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Account Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-lg font-semibold capitalize">{user.role}</span>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {user.registration_fee_paid && (
          <div className="mb-8">
            <Button
              onClick={() => navigate('/post-vehicle')}
              size="lg"
              className="flex items-center gap-2"
            >
              <Car className="h-5 w-5" />
              Post New Vehicle
            </Button>
          </div>
        )}

        {/* My Vehicles Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">My Vehicles</h2>
          
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div key={vehicle._id} className="relative">
                  <VehicleCard vehicle={{ ...vehicle, id: vehicle._id }} />
                  <div className="absolute top-2 right-2 z-10">
                    <span className={
                      `px-3 py-1 rounded-full text-xs font-semibold ${
                        vehicle.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : vehicle.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`
                    }>
                      {vehicle.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {user.registration_fee_paid
                    ? "You haven't posted any vehicles yet"
                    : "Complete payment to start posting vehicles"}
                </p>
                {user.registration_fee_paid ? (
                  <Button onClick={() => navigate('/post-vehicle')}>
                    Post Your First Vehicle
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/payment')}>
                    Complete Payment
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;