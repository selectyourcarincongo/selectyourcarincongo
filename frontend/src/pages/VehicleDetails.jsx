import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/ui/card';
import { Button } from '@/ui/button';
import { MapPin, Calendar, Gauge, Phone, Hash, Eye, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { isAuthenticated } from '@/utils/auth';
import { toast } from 'react-toastify';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchVehicleDetails = useCallback(async () => {
    try {
      const response = await api.get(`/vehicles/${id}`);
      setVehicle(response.data);
    } catch (error) {
      toast.error('Failed to load vehicle details');
      navigate('/vehicles');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchVehicleDetails();
  }, [fetchVehicleDetails]);

  useEffect(() => {
    if (!vehicle) return;

    const title = `${vehicle.brand} ${vehicle.model} à vendre au Congo | S.C.I.C.`;
    const description = `${vehicle.brand} ${vehicle.model} ${vehicle.year || ''} à vendre au Congo-Brazzaville. Prix : ${formatPrice(vehicle.price)}. Localisation : ${vehicle.location}. Découvrez cette annonce sur Select Your Car In Congo (S.C.I.C.).`;
    const image = vehicle.images?.[0];
    const url = `https://selectyourcarincongo.com/vehicles/${id}`;

    document.title = title;

    const setMeta = (selector, attribute, value) => {
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, selector.includes('property=') ? selector.match(/property="([^"]+)"/)?.[1] : selector.match(/name="([^"]+)"/)?.[1]);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', value);
    };

    setMeta('meta[name="description"]', 'name', description);
    setMeta('meta[property="og:title"]', 'property', title);
    setMeta('meta[property="og:description"]', 'property', description);
    setMeta('meta[property="og:url"]', 'property', url);
    setMeta('meta[property="og:type"]', 'property', 'product');
    if (image) setMeta('meta[property="og:image"]', 'property', image);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    const existingSchema = document.getElementById('vehicle-structured-data');
    if (existingSchema) existingSchema.remove();

    const schema = document.createElement('script');
    schema.id = 'vehicle-structured-data';
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Vehicle',
      name: `${vehicle.brand} ${vehicle.model}`,
      brand: {
        '@type': 'Brand',
        name: vehicle.brand
      },
      model: vehicle.model,
      vehicleModelDate: vehicle.year ? String(vehicle.year) : undefined,
      mileageFromOdometer: vehicle.mileage != null ? {
        '@type': 'QuantitativeValue',
        value: vehicle.mileage,
        unitCode: 'KMT'
      } : undefined,
      offers: {
        '@type': 'Offer',
        price: vehicle.price,
        priceCurrency: 'XAF',
        availability: 'https://schema.org/InStock',
        url
      },
      image: image ? [image] : undefined,
      description: vehicle.description || description,
      url
    });
    document.head.appendChild(schema);

    return () => {
      const currentSchema = document.getElementById('vehicle-structured-data');
      if (currentSchema) currentSchema.remove();
    };
  }, [vehicle, id]);

  const handleContactSeller = () => {
    if (!isAuthenticated()) {
      toast.info('Please login to contact seller');
      navigate('/login');
      return;
    }

    window.location.href = `tel:${vehicle.phone}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return null;
  }

  const defaultImage = 'https://via.placeholder.com/800x600?text=No+Image';
  const images = vehicle.images?.length > 0 ? vehicle.images : [defaultImage];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={images[currentImageIndex]}
                alt={`${vehicle.brand} ${vehicle.model} à vendre au Congo`}
                className="w-full h-96 object-cover"
              />

              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition ${
                      currentImageIndex === index
                        ? 'border-primary'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${vehicle.brand} ${vehicle.model} - photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{vehicle.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Vehicle Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-semibold">{vehicle.year}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Gauge className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Mileage</p>
                      <p className="font-semibold">{vehicle.mileage?.toLocaleString()} km</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold">{vehicle.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Hash className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Condition</p>
                      <p className="font-semibold capitalize">{vehicle.condition}</p>
                    </div>
                  </div>

                  {vehicle.registration_plate && (
                    <div className="flex items-center gap-3">
                      <Hash className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">Registration</p>
                        <p className="font-semibold">{vehicle.registration_plate}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Views</p>
                      <p className="font-semibold">{vehicle.views}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {vehicle.brand} {vehicle.model}
                  </h1>
                  <p className="text-4xl font-bold text-primary">
                    {formatPrice(vehicle.price)}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">+{vehicle.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Posted {formatDate(vehicle.created_at)}</span>
                  </div>
                </div>

                <Button
                  className="w-full mb-3"
                  size="lg"
                  onClick={handleContactSeller}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Seller
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    const message = `Hi, I'm interested in your ${vehicle.brand} ${vehicle.model} (${formatPrice(vehicle.price)})`;
                    window.open(
                      `https://wa.me/${vehicle.phone}?text=${encodeURIComponent(message)}`,
                      '_blank'
                    );
                  }}
                >
                  WhatsApp Seller
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Safety Tips</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Meet seller in a safe public location</li>
                  <li>• Inspect the vehicle thoroughly</li>
                  <li>• Verify vehicle documents</li>
                  <li>• Never pay before seeing the vehicle</li>
                  <li>• Consider bringing a mechanic</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;