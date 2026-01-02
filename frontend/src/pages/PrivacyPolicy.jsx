import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Politique de Confidentialité
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">Dernière mise à jour : Janvier 2025</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">1. Introduction</h2>
              <p className="text-gray-700">
                S.C.I.C (Select Your Car In Congo) s'engage à protéger la confidentialité et la sécurité 
                de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, 
                utilisons, stockons et protégeons vos informations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">2. Données Collectées</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>2.1 Informations que vous nous fournissez :</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Informations de compte :</strong> Nom, email, numéro de téléphone</li>
                  <li><strong>Informations de paiement :</strong> Preuves de paiement MTN Mobile Money</li>
                  <li><strong>Annonces de véhicules :</strong> Photos, descriptions, prix, localisation</li>
                  <li><strong>Communications :</strong> Messages envoyés via notre plateforme</li>
                </ul>
                
                <p className="mt-3"><strong>2.2 Données collectées automatiquement :</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Adresse IP et localisation approximative</li>
                  <li>Type de navigateur et système d'exploitation</li>
                  <li>Pages visitées et durée de visite</li>
                  <li>Cookies pour améliorer l'expérience utilisateur</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">3. Utilisation de Vos Données</h2>
              <div className="space-y-2 text-gray-700">
                <p>Nous utilisons vos données personnelles pour :</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Créer et gérer votre compte utilisateur</li>
                  <li>Publier vos annonces de véhicules</li>
                  <li>Traiter vos paiements et vérifier les transactions</li>
                  <li>Faciliter la communication entre acheteurs et vendeurs</li>
                  <li>Modérer le contenu et prévenir les fraudes</li>
                  <li>Vous envoyer des notifications importantes (validation d'annonce, etc.)</li>
                  <li>Améliorer nos services et votre expérience utilisateur</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">4. Partage de Vos Données</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>4.1 Nous partageons vos données uniquement :</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Avec d'autres utilisateurs :</strong> Votre nom et numéro de téléphone sont visibles sur vos annonces</li>
                  <li><strong>Avec MTN Mobile Money :</strong> Pour traiter vos paiements</li>
                  <li><strong>Avec les autorités :</strong> Si requis par la loi congolaise</li>
                </ul>
                
                <p className="mt-3"><strong>4.2 Nous ne vendons JAMAIS vos données :</strong></p>
                <p>S.C.I.C ne vend, ne loue, ni ne partage vos données personnelles avec des tiers à des fins commerciales.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">5. Sécurité de Vos Données</h2>
              <div className="space-y-2 text-gray-700">
                <p>Nous mettons en œuvre des mesures de sécurité appropriées :</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Chiffrement des mots de passe (bcrypt)</li>
                  <li>Connexions sécurisées HTTPS</li>
                  <li>Authentification JWT avec expiration</li>
                  <li>Accès limité aux données par notre équipe</li>
                  <li>Sauvegardes régulières</li>
                  <li>Surveillance des activités suspectes</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">6. Conservation des Données</h2>
              <div className="space-y-2 text-gray-700">
                <p>Nous conservons vos données personnelles :</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Compte actif :</strong> Tant que votre compte existe</li>
                  <li><strong>Après suppression :</strong> 90 jours pour obligations légales et litiges</li>
                  <li><strong>Données de paiement :</strong> 5 ans (conformité fiscale)</li>
                  <li><strong>Annonces publiées :</strong> Archivées après suppression (historique)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">7. Vos Droits</h2>
              <div className="space-y-2 text-gray-700">
                <p>Vous avez le droit de :</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Accéder :</strong> Demander une copie de vos données personnelles</li>
                  <li><strong>Rectifier :</strong> Corriger vos informations inexactes</li>
                  <li><strong>Supprimer :</strong> Demander la suppression de votre compte</li>
                  <li><strong>Limiter :</strong> Restreindre le traitement de vos données</li>
                  <li><strong>Vous opposer :</strong> Refuser certains traitements</li>
                  <li><strong>Portabilité :</strong> Recevoir vos données dans un format structuré</li>
                </ul>
                <p className="mt-3">
                  Pour exercer ces droits, contactez-nous à : <strong>support@selectyourcarincongo.com</strong>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">8. Cookies et Technologies Similaires</h2>
              <div className="space-y-2 text-gray-700">
                <p>Nous utilisons des cookies pour :</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Maintenir votre session connectée</li>
                  <li>Mémoriser vos préférences (langue, etc.)</li>
                  <li>Analyser l'utilisation de notre site</li>
                  <li>Améliorer les performances</li>
                </ul>
                <p className="mt-3">
                  Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, 
                  mais certaines fonctionnalités pourraient ne plus fonctionner correctement.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">9. Données des Mineurs</h2>
              <p className="text-gray-700">
                S.C.I.C est réservé aux personnes de 18 ans et plus. Nous ne collectons pas 
                sciemment de données personnelles auprès de mineurs. Si vous pensez qu'un mineur 
                a créé un compte, contactez-nous immédiatement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">10. Modifications de la Politique</h2>
              <p className="text-gray-700">
                Nous pouvons modifier cette politique de confidentialité à tout moment. 
                Les modifications seront publiées sur cette page avec la date de mise à jour. 
                Nous vous encourageons à consulter régulièrement cette page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">11. Contact</h2>
              <div className="space-y-2 text-gray-700">
                <p>Pour toute question concernant la confidentialité de vos données :</p>
                <ul className="list-none space-y-1">
                  <li><strong>Email :</strong> support@selectyourcarincongo.com</li>
                  <li><strong>Téléphone :</strong> +242 068 913 333</li>
                  <li><strong>Horaires :</strong> 7h - 22h (tous les jours)</li>
                  <li><strong>Adresse :</strong> Brazzaville, République du Congo</li>
                </ul>
              </div>
            </section>

            <div className="mt-8 pt-6 border-t">
              <p className="text-center text-gray-600">
                En utilisant S.C.I.C, vous consentez à la collecte et à l'utilisation de vos données 
                conformément à cette politique de confidentialité.
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

export default PrivacyPolicy;