import React, { useCallback, useEffect, useState } from 'react';
import { Input } from '@/ui/input';
import { Select } from '@/ui/select';
import { Button } from '@/ui/button';
import { Label } from '@/ui/label';
import VehicleCard from '@/components/VehicleCard';
import api from '@/lib/api';
import { Search, Filter } from 'lucide-react';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: '',
    min_price: '',
    max_price: '',
    condition: '',
    location: ''
  });
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 12;

  useEffect(() => {
    document.title = 'Véhicules à vendre et à louer au Congo | S.C.I.C.';

    const description = 'Découvrez des voitures et véhicules à vendre ou à louer au Congo-Brazzaville sur Select Your Car In Congo (S.C.I.C.). Recherchez par marque, prix, état et localisation.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://selectyourcarincongo.com/vehicles');

    return () => {
      document.title = 'Select Your Car In Congo | S.C.I.C.';
    };
  }, []);

  const fetchVehicles = useCallback(
    async (customFilters = filters, currentPage = page) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('skip', currentPage * limit);
        params.append('limit', limit);

        Object.keys(customFilters).forEach((key) => {
          if (customFilters[key]) {
            params.append(key, customFilters[key]);
          }
        });

        const response = await api.get(`/vehicles/public?${params.toString()}`);
        setVehicles(response.data.vehicles || []);
        setTotal(response.data.total || 0);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    },
    [filters, page]
  );

  useEffect(() => {
    fetchVehicles(filters, page);
  }, [fetchVehicles, filters, page]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(0);
  };

  const handleSearch = () => {
    setPage(0);
    fetchVehicles(filters, 0);
  };

  const handleReset = () => {
    const resetFilters = {
      brand: '',
      min_price: '',
      max_price: '',
      condition: '',
      location: ''
    };
    setFilters(resetFilters);
    setPage(0);
    fetchVehicles(resetFilters, 0);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Véhicules à vendre et à louer au Congo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Trouvez votre prochaine voiture au Congo-Brazzaville avec S.C.I.C. - Select Your Car In Congo. Parcourez les annonces de véhicules disponibles et recherchez par marque, prix, état et localisation.
          </p>
        </header>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Rechercher un véhicule</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="brand">Marque</Label>
              <Input
                id="brand"
                name="brand"
                placeholder="Ex. Toyota"
                value={filters.brand}
                onChange={handleFilterChange}
              />
            </div>

            <div>
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                name="location"
                placeholder="Ex. Brazzaville"
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>

            <div>
              <Label htmlFor="condition">État du véhicule</Label>
              <Select
                id="condition"
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
              >
                <option value="">Tous</option>
                <option value="excellent">Excellent</option>
                <option value="good">Bon</option>
                <option value="fair">Moyen</option>
                <option value="poor">À rénover</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="min_price">Prix minimum (FCFA)</Label>
              <Input
                id="min_price"
                name="min_price"
                type="number"
                placeholder="800000"
                value={filters.min_price}
                onChange={handleFilterChange}
              />
            </div>

            <div>
              <Label htmlFor="max_price">Prix maximum (FCFA)</Label>
              <Input
                id="max_price"
                name="max_price"
                type="number"
                placeholder="10000000"
                value={filters.max_price}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Rechercher
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Réinitialiser
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            {vehicles.length} véhicule{vehicles.length !== 1 ? 's' : ''} affiché{vehicles.length !== 1 ? 's' : ''} sur {total}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Chargement des véhicules...</p>
          </div>
        ) : vehicles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={{ ...vehicle, id: vehicle._id }} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                >
                  Précédent
                </Button>
                <span className="py-2 px-4">
                  Page {page + 1} sur {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">Aucun véhicule ne correspond à vos critères.</p>
            <Button variant="outline" onClick={handleReset} className="mt-4">
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;