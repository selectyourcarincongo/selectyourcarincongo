import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
      toast.error('Impossible de charger les détails du véhicule.');
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

    const vehicleName = `${vehicle.brand} ${vehicle.model}`;
    const transactionType = vehicle.vehicle_type === 'rental' ? 'à louer' : 'à vendre';
    const priceLabel = `${formatPrice(vehicle.price)} FCFA`;
    const yearLabel = vehicle.year ? ` ${vehicle.year}` : '';
    const mileageLabel = vehicle.mileage != null
      ? ` ${vehicle.mileage.toLocaleString()} km`
      : '';

    const title = `${vehicleName}${yearLabel} ${transactionType} au Congo | S.C.I.C.`;

    const description =
      `${vehicleName}${yearLabel} ${transactionType} au Congo-Brazzaville. ` +
      `Prix : ${priceLabel}. ` +
      `Kilométrage :${mileageLabel || ' non précisé'}. ` +
      `Localisation : ${vehicle.location}. ` +
      `${vehicle.condition ? `État : ${vehicle.condition}. ` : ''}` +
      `Consultez l'annonce complète sur Select Your Car In Congo (S.C.I.C.).`;

    const image = vehicle.images?.[0];
    const url = `https://selectyourcarincongo.com/vehicles/${id}`;

    document.title = title;

    const setMeta = (selector, attribute, value) => {
      let meta = document.querySelector(selector);

      if (!meta) {
        meta = document.createElement('meta');
        const match = selector.match(/(?:property|name)="([^"]+)"/);

        if (match) {
          meta.setAttribute(attribute, match[1]);
        }

        document.head.appendChild(meta);
      }

      meta.setAttribute('content', value);
    };

    setMeta('meta[name="description"]', 'name', description);

    setMeta('meta[property="og:title"]', 'property', title);
    setMeta('meta[property="og:description"]', 'property', description);
    setMeta('meta[property="og:url"]', 'property', url);
    setMeta('meta[property="og:type"]', 'property', 'product');
    setMeta('meta[property="og:site_name"]', 'property', 'Select Your Car In Congo');
    setMeta('meta[property="og:locale"]', 'property', 'fr_CG');

    setMeta('meta[name="twitter:card"]', 'name', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', title);
    setMeta('meta[name="twitter:description"]', 'name', description);

    if (image) {
      setMeta('meta[property="og:image"]', 'property', image);
      setMeta(
        'meta[property="og:image:alt"]',
        'property',
        `${vehicleName}${yearLabel} ${transactionType} au Congo-Brazzaville`
      );

      setMeta('meta[name="twitter:image"]', 'name', image);
      setMeta(
        'meta[name="twitter:image:alt"]',
        'name',
        `${vehicleName}${yearLabel} ${transactionType} au Congo-Brazzaville`
      );
    }

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

    const vehicleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Vehicle',
      name: vehicleName,
      brand: {
        '@type': 'Brand',
        name: vehicle.brand
      },
      model: vehicle.model,
      vehicleModelDate: vehicle.year ? String(vehicle.year) : undefined,
      mileageFromOdometer: vehicle.mileage != null
        ? {
            '@type': 'QuantitativeValue',
            value: vehicle.mileage,
            unitCode: 'KMT'
          }
        : undefined,
      vehicleCondition: vehicle.condition
        ? `https://schema.org/${vehicle.condition === 'excellent' ? 'NewCondition' : 'UsedCondition'}`
        : undefined,
      offers: {
        '@type': 'Offer',
        price: vehicle.price,
        priceCurrency: 'XAF',
        availability: 'https://schema.org/InStock',
        url,
        itemCondition: 'https://schema.org/UsedCondition',
        areaServed: {
          '@type': 'Country',
          name: 'Republic of the Congo'
        }
      },
      image: vehicle.images?.length ? vehicle.images : undefined,
      description: vehicle.description || description,
      url,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url
      }
    };

    schema.textContent = JSON.stringify(vehicleSchema);
    document.head.appendChild(schema);

    const existingBreadcrumbSchema = document.getElementById(
      'vehicle-breadcrumb-structured-data'
    );

    if (existingBreadcrumbSchema) existingBreadcrumbSchema.remove();

    const breadcrumbSchema = document.createElement('script');
    breadcrumbSchema.id = 'vehicle-breadcrumb-structured-data';
    breadcrumbSchema.type = 'application/ld+json';

    breadcrumbSchema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Accueil',
          item: 'https://selectyourcarincongo.com/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Véhicules',
          item: 'https://selectyourcarincongo.com/vehicles'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: vehicleName,
          item: url
        }
      ]
    });

    document.head.appendChild(breadcrumbSchema);

    return () => {
      const currentSchema = document.getElementById('vehicle-structured-data');
      if (currentSchema) currentSchema.remove();

      const currentBreadcrumbSchema = document.getElementById(
        'vehicle-breadcrumb-structured-data'
      );
      if (currentBreadcrumbSchema) currentBreadcrumbSchema.remove();
    };
  }, [vehicle, id]);

  const handleContactSeller = () => {
    if (!isAuthenticated()) {
      toast.info('Connectez-vous pour contacter le vendeur.');
      navigate('/login');
      return;
    }

    window.location.href = `tel:${vehicle.phone}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600">Chargement du véhicule...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) return null;

  const defaultImage = 'https://via.placeholder.com/800x600?text=No+Image';
  const images = vehicle.images?.length > 0 ? vehicle.images : [defaultImage];
  const vehicleName = `${vehicle.brand} ${vehicle.model}`;
  const imageAlt = `${vehicleName}${vehicle.year ? ` ${vehicle.year}` : ''} au Congo-Brazzaville`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <nav aria-label="Fil d’Ariane" className="mb-4 text-sm text-gray-600">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/" className="hover:underline">Accueil</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/vehicles" className="hover:underline">Véhicules</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 font-medium" aria-current="page">{vehicleName}</li>
          </ol>
        </nav>

        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux véhicules
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={images[currentImageIndex]}
                alt={imageAlt}
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
                      currentImageIndex === index ? 'border-primary' : 'border-gray-200 hover:border-gray-400'
                    }`}
                    aria-label={`Afficher la photo ${index + 1} de ${vehicleName}`}
                  >
                    <img
                      src={img}
                      alt={`${vehicleName}${vehicle.year ? ` ${vehicle.year}` : ''} - photo ${index + 1}`}
                      loading="lazy"
                      decoding="async"
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
                <h2 className="text-2xl font-bold mb-4">Caractéristiques du véhicule</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div><p className="text-sm text-gray-500">Année</p><p className="font-semibold">{vehicle.year}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Gauge className="h-5 w-5 text-primary" />
                    <div><p className="text-sm text-gray-500">Kilométrage</p><p className="font-semibold">{vehicle.mileage?.toLocaleString()} km</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div><p className="text-sm text-gray-500">Localisation</p><p className="font-semibold">{vehicle.location}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Hash className="h-5 w-5 text-primary" />
                    <div><p className="text-sm text-gray-500">État</p><p className="font-semibold capitalize">{vehicle.condition}</p></div>
                  </div>
                  {vehicle.registration_plate && (
                    <div className="flex items-center gap-3">
                      <Hash className="h-5 w-5 text-primary" />
                      <div><p className="text-sm text-gray-500">Immatriculation</p><p className="font-semibold">{vehicle.registration_plate}</p></div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-primary" />
                    <div><p className="text-sm text-gray-500">Vues</p><p className="font-semibold">{vehicle.views}</p></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{vehicleName}</h1>
                  <p className="text-sm text-gray-600 mb-3">{vehicle.year} · {vehicle.location} · {vehicle.condition}</p>
                  <p className="text-4xl font-bold text-primary">{formatPrice(vehicle.price)}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-600"><Phone className="h-4 w-4" /><span className="text-sm">+{vehicle.phone}</span></div>
                  <div className="flex items-center gap-2 text-gray-600"><Calendar className="h-4 w-4" /><span className="text-sm">Publiée le {formatDate(vehicle.created_at)}</span></div>
                </div>

                <Button className="w-full mb-3" size="lg" onClick={handleContactSeller}>
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler le vendeur
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    const message = `Bonjour, je suis intéressé(e) par votre ${vehicle.brand} ${vehicle.model} (${formatPrice(vehicle.price)}).`;
                    window.open(`https://wa.me/${vehicle.phone}?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                >
                  Contacter sur WhatsApp
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Conseils de sécurité</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Rencontrez le vendeur dans un lieu public et sûr.</li>
                  <li>• Inspectez soigneusement le véhicule.</li>
                  <li>• Vérifiez les documents du véhicule.</li>
                  <li>• Ne payez jamais avant d’avoir vu le véhicule.</li>
                  <li>• Envisagez de venir avec un mécanicien.</li>
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