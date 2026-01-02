import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Conditions Générales d'Utilisation
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">Dernière mise à jour : Janvier 2025</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">1. Présentation de S.C.I.C</h2>
              <p className="text-gray-700">
                S.C.I.C (Select Your Car In Congo) est une plateforme en ligne qui met en relation les vendeurs 
                et loueurs de véhicules avec des acheteurs et locataires potentiels en République du Congo. 
                En utilisant notre service, vous acceptez les présentes conditions générales d'utilisation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">2. Inscription et Compte</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>2.1 Conditions d'inscription :</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Vous devez avoir au moins 18 ans</li>
                  <li>Fournir des informations exactes et à jour</li>
                  <li>Posséder un numéro de téléphone congolais valide</li>
                  <li>Payer les frais d'inscription applicables</li>
                </ul>
                
                <p className="mt-3"><strong>2.2 Types de comptes :</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Compte Vente :</strong> 3,000 FCFA - Pour vendre des véhicules</li>
                  <li><strong>Compte Location :</strong> 1,500 FCFA - Pour louer des véhicules</li>
                  <li>La première annonce est gratuite après inscription</li>
                  <li>Annonces supplémentaires : 3,000 FCFA (vente) ou 1,500 FCFA (location)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">3. Publication d'Annonces</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>3.1 Règles de publication :</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Toutes les annonces doivent être vérifiées par notre équipe avant publication</li>
                  <li>Les photos doivent correspondre au véhicule annoncé</li>
                  <li>Les prix doivent être réalistes et conformes au marché</li>
                  <li>Prix de vente : 800,000 - 1,000,000,000 FCFA</li>
                  <li>Prix de location : 10,000 - 15,000,000 FCFA</li>
                  <li>Maximum 8 photos par annonce</li>
                  <li>Description minimum de 50 caractères</li>
                </ul>
                
                <p className="mt-3"><strong>3.2 Interdictions :</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Publier des annonces frauduleuses ou mensongères</li>
                  <li>Utiliser des photos ne correspondant pas au véhicule</li>
                  <li>Afficher des prix irréalistes ou trompeurs</li>
                  <li>Publier des véhicules volés ou avec documents falsifiés</li>
                  <li>Utiliser la plateforme à des fins illégales</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">4. Paiements et Remboursements</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>4.1 Modes de paiement :</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>MTN Mobile Money : +242 068 913 333</li>
                  <li>Code Merchant : 374575</li>
                  <li>Preuve de paiement requise pour validation manuelle</li>
                </ul>
                
                <p className="mt-3"><strong>4.2 Politique de remboursement :</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Les frais d'inscription ne sont pas remboursables</li>
                  <li>Les frais de publication ne sont pas remboursables</li>
                  <li>En cas d'erreur de notre part, remboursement intégral sous 7 jours</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">5. Responsabilités</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>5.1 Responsabilité de S.C.I.C :</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Nous fournissons une plateforme de mise en relation uniquement</li>
                  <li>Nous ne sommes pas partie aux transactions entre acheteurs et vendeurs</li>
                  <li>Nous ne garantissons pas l'exactitude des annonces</li>
                  <li>Nous modérons les annonces mais ne vérifions pas physiquement les véhicules</li>
                </ul>
                
                <p className="mt-3"><strong>5.2 Responsabilité des utilisateurs :</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Vous êtes responsable de l'exactitude de vos annonces</li>
                  <li>Vous devez vérifier l'état du véhicule avant achat/location</li>
                  <li>Vous devez effectuer les transactions en toute sécurité</li>
                  <li>Vous devez respecter les lois congolaises en vigueur</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">6. Conseils de Sécurité</h2>
              <div className="space-y-2 text-gray-700">
                <ul className="list-disc pl-6 space-y-1">
                  <li>Rencontrez le vendeur dans un lieu public et sécurisé</li>
                  <li>Inspectez toujours le véhicule avant l'achat</li>
                  <li>Vérifiez tous les documents du véhicule</li>
                  <li>Ne payez jamais avant d'avoir vu le véhicule</li>
                  <li>Faites-vous accompagner d'un mécanicien si possible</li>
                  <li>Méfiez-vous des prix anormalement bas</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">7. Suspension et Suppression de Compte</h2>
              <div className="space-y-2 text-gray-700">
                <p>Nous nous réservons le droit de suspendre ou supprimer votre compte en cas de :</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Violation des présentes CGU</li>
                  <li>Activités frauduleuses ou illégales</li>
                  <li>Plaintes répétées d'autres utilisateurs</li>
                  <li>Non-paiement des frais applicables</li>
                  <li>Comportement abusif envers notre équipe ou d'autres utilisateurs</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">8. Modification des CGU</h2>
              <p className="text-gray-700">
                S.C.I.C se réserve le droit de modifier ces conditions générales à tout moment. 
                Les modifications seront publiées sur cette page et prendront effet immédiatement. 
                Votre utilisation continue du service après modification constitue votre acceptation 
                des nouvelles conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">9. Contact</h2>
              <div className="space-y-2 text-gray-700">
                <p>Pour toute question concernant ces CGU, contactez-nous :</p>
                <ul className="list-none space-y-1">
                  <li><strong>Email :</strong> support@selectyourcarincongo.com</li>
                  <li><strong>Téléphone :</strong> +242 068 913 333</li>
                  <li><strong>Horaires :</strong> 7h - 22h (tous les jours)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">10. Droit Applicable</h2>
              <p className="text-gray-700">
                Ces conditions générales sont régies par les lois de la République du Congo. 
                Tout litige sera soumis aux tribunaux compétents de Brazzaville.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t">
              <p className="text-center text-gray-600">
                En utilisant S.C.I.C, vous reconnaissez avoir lu et accepté ces conditions générales d'utilisation.
              </p>
              <div className="mt-4 text-center">
                <Link to="/" className="text-primary hover:underline font-medium">
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;