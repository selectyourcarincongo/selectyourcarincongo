import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Select } from '@/ui/select';
import api from '@/lib/api';
import { setToken, setUser } from '@/utils/auth';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '242',
    password: '',
    confirmPassword: '',
    account_type: 'sale'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await api.post('/auth/register', registerData);
      
      setToken(response.data.access_token);
      setUser(response.data.user);
      
      toast.success('Registration successful!');
      
      // Redirect to payment page
      navigate('/payment');
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Register</CardTitle>
            <p className="text-center text-gray-600 text-sm">Create your Congo Auto account</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number (Congo)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="242068911111"
                />
                <p className="text-xs text-gray-500 mt-1">Format: 242 followed by 8-9 digits</p>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  minLength={6}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Login here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;