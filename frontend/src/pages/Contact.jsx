import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simuler l'envoi (à remplacer par vraie API)
    setTimeout(() => {
      toast.success('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-xl text-gray-600">
            Une question ? Une suggestion ? Notre équipe est là pour vous aider !
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Envoyez-nous un message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+242 068 911 111"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Sujet *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Objet de votre message"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre demande en détail..."
                    rows={6}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Nos coordonnées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Téléphone</h3>
                    <p className="text-gray-600">+242 068 913 333</p>
                    <p className="text-sm text-gray-500 mt-1">WhatsApp disponible</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-gray-600">support@selectyourcarincongo.com</p>
                    <p className="text-sm text-gray-500 mt-1">Réponse sous 24h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Horaires de réponse</h3>
                    <p className="text-gray-600 font-semibold">7h - 22h</p>
                    <p className="text-sm text-gray-500 mt-1">Tous les jours (7j/7)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Localisation</h3>
                    <p className="text-gray-600">Brazzaville</p>
                    <p className="text-sm text-gray-500 mt-1">République du Congo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary-50 border-primary">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3 text-primary">Informations de paiement</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>MTN Mobile Money :</strong></p>
                  <p className="ml-4">• Numéro : +242 068 913 333</p>
                  <p className="ml-4">• Code Merchant : 374575</p>
                  <p className="text-sm mt-3 text-gray-600">
                    Pour toute question sur les paiements, contactez-nous pendant nos horaires d'ouverture.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3">Questions fréquentes</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <p className="font-semibold">Comment publier une annonce ?</p>
                    <p className="text-gray-600">Inscrivez-vous, payez les frais d'inscription, puis cliquez sur "Publier".</p>
                  </div>
                  <div>
                    <p className="font-semibold">Combien de temps pour validation ?</p>
                    <p className="text-gray-600">Les annonces sont généralement validées sous 24-48h.</p>
                  </div>
                  <div>
                    <p className="font-semibold">Puis-je modifier mon annonce ?</p>
                    <p className="text-gray-600">Oui, depuis votre dashboard. L'annonce sera re-validée.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
