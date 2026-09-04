import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/button';
import { Car, Shield, DollarSign, Users } from 'lucide-react';
import VehicleCard from '@/components/VehicleCard';
import api from '@/lib/api';

const heroImages = [
  'https://customer-assets.emergentagent.com/job_capture-transform/artifacts/kyz5dg91_IMG_4340.jpeg',
  'https://customer-assets.emergentagent.com/job_capture-transform/artifacts/dhk2xe5w_IMG_4376.jpeg',
  'https://customer-assets.emergentagent.com/job_capture-transform/artifacts/p97ttie4_IMG_4377.jpeg',
  'https://customer-assets.emergentagent.com/job_capture-transform/artifacts/w7y3zsaf_AED086EA-8B0B-4247-B066-829D0858934B.jpeg'
];

const Home = () => {
  const navigate = useNavigate();
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const fetchFeaturedVehicles = useCallback(async () => {
    try {
      const response = await api.get('/vehicles/public?limit=6');
      setFeaturedVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedVehicles();

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchFeaturedVehicles]);

  return (
    <div className="min-h-screen">
      <section className="relative h-[600px] overflow-hidden" aria-label="Select Your Car In Congo - plateforme automobile au Congo-Brazzaville">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={index !== currentSlide}
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

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Select Your Car In Congo
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 drop-shadow-md">
              <strong>S.C.I.C.</strong> — La plateforme automobile au Congo-Brazzaville pour acheter, vendre et louer des véhicules.
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

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20" aria-label="Navigation du diaporama">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Afficher l'image ${index + 1}`}
              aria-current={index === currentSlide ? 'true' : undefined}
            />
          ))}
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Select Your Car In Congo (S.C.I.C.)
          </h2>
          <p className="text-lg leading-8 text-gray-600">
            <strong>Select Your Car In Congo</strong>, aussi appelée <strong>S.C.I.C.</strong>, est une plateforme automobile dédiée au Congo-Brazzaville. Recherchez des véhicules à vendre ou à louer et consultez les annonces selon la marque, le modèle, le prix, l'état et la localisation. S.C.I.C. facilite la mise en relation entre acheteurs, vendeurs et loueurs au Congo.
          </p>
          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <Button variant="outline" onClick={() => navigate('/vehicles')}>
              Voir les véhicules
            </Button>
            <Button variant="outline" onClick={() => navigate('/contact')}>
              Nous contacter
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Pourquoi choisir S.C.I.C. ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Véhicules au Congo</h3>
              <p className="text-gray-600">Consultez les annonces de véhicules disponibles à la vente ou à la location.</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Recherche pratique</h3>
              <p className="text-gray-600">Filtrez les véhicules par marque, prix, état et localisation.</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Vente et location</h3>
              <p className="text-gray-600">Publiez une annonce pour vendre ou louer votre véhicule au Congo-Brazzaville.</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mise en relation</h3>
              <p className="text-gray-600">S.C.I.C. met en relation les personnes intéressées par l'achat, la vente et la location de véhicules.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Véhicules à la une</h2>
            <Button variant="outline" onClick={() => navigate('/vehicles')}>
              Voir tous les véhicules
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Chargement des véhicules...</p>
            </div>
          ) : featuredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={{ ...vehicle, id: vehicle._id }} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucun véhicule disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 congo-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Vendre ou louer votre véhicule au Congo ?</h2>
          <p className="text-xl mb-8 text-white/90">
            Rejoignez S.C.I.C. et publiez votre première annonce de véhicule.
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
