import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { Select } from '@/ui/select';
import { Upload, X, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { getUser, isAuthenticated } from '@/utils/auth';
import { toast } from 'react-toastify';

const PostVehicle = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState(['']);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: '',
    condition: 'good',
    price: '',
    registration_plate: '',
    location: '',
    description: '',
    phone: user?.phone || '242'
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    if (!user?.registration_fee_paid) {
      toast.error('Please complete payment before posting vehicles');
      navigate('/payment');
    }
  }, [navigate, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const addImageUrl = () => {
    if (imageUrls.length < 8) {
      setImageUrls([...imageUrls, '']);
    }
  };

  const removeImageUrl = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls.length > 0 ? newUrls : ['']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const price = parseFloat(formData.price);
    if (price < 800000 || price > 1000000000) {
      toast.error('Price must be between 800,000 and 1,000,000,000 FCFA');
      return;
    }

    if (formData.description.length < 50) {
      toast.error('Description must be at least 50 characters');
      return;
    }

    setLoading(true);
    try {
      const validImages = imageUrls.filter(url => url.trim() !== '');

      const vehicleData = {
        ...formData,
        price: parseFloat(formData.price),
        mileage: parseInt(formData.mileage),
        year: parseInt(formData.year),
        images: validImages
      };

      await api.post('/vehicles', vehicleData);
      toast.success('Vehicle posted successfully! Awaiting admin approval.');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to post vehicle';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.registration_fee_paid) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Post Your Vehicle</h1>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="brand" required value={formData.brand} onChange={handleChange} placeholder="Brand" />
                <Input name="model" required value={formData.model} onChange={handleChange} placeholder="Model" />
                <Input name="year" type="number" required value={formData.year} onChange={handleChange} />
                <Input name="mileage" type="number" required value={formData.mileage} onChange={handleChange} />
              </div>

              <div>
                <Textarea name="description" required value={formData.description} onChange={handleChange} />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Posting...' : 'Post Vehicle'}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostVehicle;