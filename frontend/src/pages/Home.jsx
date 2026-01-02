import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/button';
import { Car, Shield, DollarSign, Users } from 'lucide-react';
import VehicleCard from '@/components/VehicleCard';
import api from '@/lib/api';

const Home = () => {
  const navigate = useNavigate();
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Images de fond avec vos véhicules (plaques déjà floutées)
  const heroImages = [
    'https://customer-assets.emergentagent.com/job_capture-transform/artifacts/kyz5dg91_IMG_4340.jpeg',
    'https://customer-assets.emergentagent.com/job_capture-transform/artifacts/dhk2xe5w_IMG_4376.jpeg',
    'https://customer-assets.emergentagent.com/job_capture-transform/artifacts/p97ttie4_IMG_4377.jpeg',
    'https://customer-assets.emergentagent.com/job_capture-transform/artifacts/w7y3zsaf_AED086EA-8B0B-4247-B066-829D0858934B.jpeg'
  ];

  useEffect(() => {
    fetchFeaturedVehicles();
    
    // Carrousel automatique toutes les 5 secondes
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchFeaturedVehicles = async () => {
    try {
      const response = await api.get('/vehicles/public?limit=6');
      setFeaturedVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section avec Carrousel */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Images de fond en carrousel */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${image})`,
                filter: 'brightness(0.6)'
              }}
            />
          </div>
        ))}

        {/* Overlay gradient pour lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        {/* Contenu du Hero */}
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Trouvez Votre Véhicule Parfait au Congo
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 drop-shadow-md">
              S.C.I.C - Select Your Car In Congo : Achetez, vendez et louez des véhicules
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button
                size="lg"
                className="text-lg px-8 bg-white text-primary hover:bg-gray-100 shadow-xl"
                onClick={() => navigate('/vehicles')}
              >
                Parcourir les Véhicules
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-2 border-white text-white hover:bg-white/10 shadow-xl backdrop-blur-sm"
                onClick={() => navigate('/register')}
              >
                Vendre / Louer
              </Button>
            </div>
          </div>
        </div>

        {/* Indicateurs de slide */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Pourquoi choisir S.C.I.C ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Large Sélection</h3>
              <p className="text-gray-600">Parcourez des centaines de véhicules de qualité</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Annonces Vérifiées</h3>
              <p className="text-gray-600">Tous les véhicules sont vérifiés par notre équipe</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Meilleurs Prix</h3>
              <p className="text-gray-600">Prix compétitifs dans toutes les catégories</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Communauté de Confiance</h3>
              <p className="text-gray-600">Rejoignez des milliers d'utilisateurs satisfaits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Vehicles</h2>
            <Button
              variant="outline"
              onClick={() => navigate('/vehicles')}
            >
              View All
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading vehicles...</p>
            </div>
          ) : featuredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={{ ...vehicle, id: vehicle._id }} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No vehicles available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 congo-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à Vendre ou Louer Votre Véhicule ?</h2>
          <p className="text-xl mb-8 text-white/90">
            Inscrivez-vous aujourd'hui : 3,000 FCFA (vente) ou 1,500 FCFA (location) + 1ère annonce gratuite !
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 bg-white text-primary hover:bg-gray-100"
            onClick={() => navigate('/register')}
          >
            Commencer Maintenant
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;