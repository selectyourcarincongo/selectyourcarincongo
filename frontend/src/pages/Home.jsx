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

  useEffect(() => {
    fetchFeaturedVehicles();
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
      {/* Hero Section */}
      <section className="congo-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Trouvez Votre Véhicule Parfait au Congo
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            S.C.I.C - Select Your Car In Congo : Achetez, vendez et louez des véhicules
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 bg-white text-primary hover:bg-gray-100"
              onClick={() => navigate('/vehicles')}
            >
              Parcourir les Véhicules
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-white text-white hover:bg-white/10"
              onClick={() => navigate('/register')}
            >
              Vendre / Louer
            </Button>
          </div>
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
          <h2 className="text-3xl font-bold mb-4">Ready to Sell Your Vehicle?</h2>
          <p className="text-xl mb-8 text-white/90">
            Register today for only 7,500 FCFA and start selling
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 bg-white text-primary hover:bg-gray-100"
            onClick={() => navigate('/register')}
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;