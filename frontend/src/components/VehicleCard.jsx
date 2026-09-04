import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/ui/card';
import { Button } from '@/ui/button';
import { MapPin, Calendar, Gauge, Eye } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const VehicleCard = ({ vehicle }) => {
  const defaultImage = 'https://via.placeholder.com/400x300?text=No+Image';
  const vehicleName = `${vehicle.brand} ${vehicle.model}`;
  const seoAlt = `${vehicleName}${vehicle.year ? ` ${vehicle.year}` : ''} au Congo-Brazzaville - Select Your Car In Congo`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={vehicle.images?.[0] || defaultImage}
          alt={seoAlt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-3 py-1 rounded-full font-bold text-sm">
          {formatPrice(vehicle.price)}
        </div>
        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium capitalize">
          {vehicle.condition}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {vehicleName}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{vehicle.year}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            <span>{vehicle.mileage?.toLocaleString()} km</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{vehicle.location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{vehicle.views} vues</span>
          </div>
        </div>
        
        <p className="text-gray-700 mt-3 line-clamp-2">
          {vehicle.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link
          to={`/vehicles/${vehicle.id}`}
          className="w-full"
          aria-label={`Voir l'annonce ${vehicleName} sur Select Your Car In Congo`}
          title={`Voir ${vehicleName}`}
        >
          <Button className="w-full">
            Voir les détails
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;