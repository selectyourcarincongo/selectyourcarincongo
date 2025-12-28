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
  }, []);

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
    
    // Validate price range
    const price = parseFloat(formData.price);
    if (price < 800000 || price > 1000000000) {
      toast.error('Price must be between 800,000 and 1,000,000,000 FCFA');
      return;
    }

    // Validate description length
    if (formData.description.length < 50) {
      toast.error('Description must be at least 50 characters');
      return;
    }

    setLoading(true);
    try {
      // Filter out empty image URLs
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
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    name="brand"
                    required
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g. Toyota"
                  />
                </div>

                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    name="model"
                    required
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g. Land Cruiser"
                  />
                </div>

                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    required
                    min="1980"
                    max="2026"
                    value={formData.year}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="mileage">Mileage (km) *</Label>
                  <Input
                    id="mileage"
                    name="mileage"
                    type="number"
                    required
                    min="0"
                    value={formData.mileage}
                    onChange={handleChange}
                    placeholder="e.g. 50000"
                  />
                </div>

                <div>
                  <Label htmlFor="condition">Condition *</Label>
                  <Select
                    id="condition"
                    name="condition"
                    required
                    value={formData.condition}
                    onChange={handleChange}
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">Price (FCFA) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    required
                    min="800000"
                    max="1000000000"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 5000000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Min: 800,000 FCFA - Max: 1,000,000,000 FCFA
                  </p>
                </div>
              </div>

              {/* Location & Registration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Brazzaville, Poto-Poto"
                  />
                </div>

                <div>
                  <Label htmlFor="registration_plate">Registration Plate (Optional)</Label>
                  <Input
                    id="registration_plate"
                    name="registration_plate"
                    value={formData.registration_plate}
                    onChange={handleChange}
                    placeholder="e.g. CG-1234-AB"
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <Label htmlFor="phone">Contact Phone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="242068911111"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: 242 followed by 8-9 digits
                </p>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your vehicle in detail (minimum 50 characters)..."
                  rows={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length} / 50 characters minimum
                </p>
              </div>

              {/* Images */}
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Upload className="h-4 w-4" />
                  Vehicle Images (Max 8)
                </Label>
                <div className="space-y-3">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="url"
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        placeholder={`Image URL ${index + 1}`}
                      />
                      {imageUrls.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeImageUrl(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                {imageUrls.length < 8 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addImageUrl}
                    className="mt-3 w-full"
                  >
                    + Add Another Image
                  </Button>
                )}
                
                <div className="bg-blue-50 p-3 rounded-lg mt-3">
                  <p className="text-sm text-blue-800 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Upload your images to <strong>imgur.com</strong> or similar service, then paste the direct image URLs here.
                    </span>
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Posting...' : 'Post Vehicle'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostVehicle;