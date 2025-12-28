import React, { useEffect, useState } from 'react';
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
    fetchVehicles();
  }, [page]);

  const fetchVehicles = async (customFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('skip', page * limit);
      params.append('limit', limit);
      
      Object.keys(customFilters).forEach(key => {
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
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setPage(0);
    fetchVehicles();
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
    fetchVehicles(resetFilters);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Browse Vehicles</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                placeholder="e.g. Toyota"
                value={filters.brand}
                onChange={handleFilterChange}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g. Brazzaville"
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>

            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select
                id="condition"
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="min_price">Min Price (FCFA)</Label>
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
              <Label htmlFor="max_price">Max Price (FCFA)</Label>
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
              Search
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {vehicles.length} of {total} vehicles
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading vehicles...</p>
          </div>
        ) : vehicles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={{ ...vehicle, id: vehicle._id }} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                >
                  Previous
                </Button>
                <span className="py-2 px-4">
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No vehicles found matching your criteria</p>
            <Button variant="outline" onClick={handleReset} className="mt-4">
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;