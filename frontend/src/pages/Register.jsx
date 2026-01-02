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
            <CardTitle className="text-center text-2xl">Inscription</CardTitle>
            <p className="text-center text-gray-600 text-sm">Créez votre compte S.C.I.C</p>
            <div className="bg-blue-50 p-3 rounded-lg mt-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">💰 Tarifs d'inscription :</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Compte Vente</strong> : 3,000 FCFA + 1ère annonce gratuite</li>
                <li>• <strong>Compte Location</strong> : 1,500 FCFA + 1ère annonce gratuite</li>
              </ul>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre nom"
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
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Numéro de téléphone (Congo)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="242068911111"
                />
                <p className="text-xs text-gray-500 mt-1">Format : 242 suivi de 8-9 chiffres</p>
              </div>

              <div>
                <Label htmlFor="account_type">Type de compte</Label>
                <Select
                  id="account_type"
                  name="account_type"
                  required
                  value={formData.account_type}
                  onChange={handleChange}
                >
                  <option value="sale">Vente de véhicules (3,000 FCFA)</option>
                  <option value="rental">Location de véhicules (1,500 FCFA)</option>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.account_type === 'sale' 
                    ? 'Pour vendre des véhicules (prix: 800K - 1Mrd FCFA)'
                    : 'Pour louer des véhicules (prix: 10K - 15M FCFA)'}
                </p>
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