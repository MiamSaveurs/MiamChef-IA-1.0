
import React, { useState } from 'react';
import { X, Scale, FileText, Shield, AlertCircle } from 'lucide-react';

/* 
 * NOTE SYSTÈME POUR L'IA (MÉMOIRE FUTURE) :
 * Si de nouvelles fonctionnalités payantes ou impliquant des données utilisateur sont ajoutées à l'application MiamChef IA,
 * VOUS DEVEZ IMPÉRATIVEMENT mettre à jour les sections 2 (Fonctionnalités) et 3 (Données) des CGU/CGV ci-dessous.
 * Ces documents doivent évoluer de manière synchrone avec le code.
 */

interface LegalDocumentsProps {
  onClose: () => void;
}

const LegalDocuments: React.FC<LegalDocumentsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'mentions' | 'cgu' | 'cgv'>('mentions');

  return (
    <div className="fixed inset-0 z-[80] bg-white overflow-y-auto animate-fade-in font-body text-chef-dark">
      
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-gray-100">
          <div className="px-6 py-4 flex justify-between items-center max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
                <Scale className="text-chef-green" size={24} />
                <span className="font-display text-xl">Informations Légales</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-500" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex px-6 max-w-4xl mx-auto gap-6 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('mentions')}
                className={`pb-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${activeTab === 'mentions' ? 'border-chef-green text-chef-green' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                  Mentions Légales
              </button>
              <button 
                onClick={() => setActiveTab('cgu')}
                className={`pb-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${activeTab === 'cgu' ? 'border-chef-green text-chef-green' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                  CGU (Utilisation)
              </button>
              <button 
                onClick={() => setActiveTab('cgv')}
                className={`pb-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${activeTab === 'cgv' ? 'border-chef-green text-chef-green' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                  CGV (Vente)
              </button>
          </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 pb-24 space-y-8">
        
        {/* Warning Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 text-sm text-yellow-800">
            <AlertCircle className="shrink-0" size={20} />
            <p>
                <strong>Note au propriétaire :</strong> Les mentions entre crochets <strong>[COMME CECI]</strong> doivent être remplacées par vos informations réelles (Nom, Adresse, SIRET) avant la mise en ligne officielle.
            </p>
        </div>

        {activeTab === 'mentions' && (
            <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-display mb-6">Mentions Légales</h1>
                
                <section>
                    <h2 className="font-bold text-lg mb-2">1. Éditeur de l'application</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        L'application <strong>MiamChef IA</strong> est éditée par :<br/><br/>
                        <strong>[VOTRE NOM OU NOM DE SOCIÉTÉ]</strong><br/>
                        Statut juridique : [Ex: Auto-entrepreneur / SASU / SARL]<br/>
                        Siège social : [VOTRE ADRESSE COMPLÈTE]<br/>
                        Numéro SIRET : [VOTRE NUMÉRO SIRET]<br/>
                        Directeur de la publication : [VOTRE NOM]<br/>
                        Contact : [VOTRE ADRESSE EMAIL PRO]
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2">2. Hébergement</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        L'application est hébergée par :<br/>
                        [Ex: Vercel Inc. / Google Cloud Platform]<br/>
                        Adresse : [Adresse de l'hébergeur]<br/>
                        Site web : [Site de l'hébergeur]
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2">3. Propriété Intellectuelle</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        L'ensemble de l'application MiamChef IA (code, design, textes, logos, algorithmes) est la propriété exclusive de l'éditeur. Toute reproduction ou représentation, totale ou partielle, est interdite sans autorisation expresse.
                    </p>
                </section>
            </div>
        )}

        {activeTab === 'cgu' && (
            <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-display mb-6">Conditions Générales d'Utilisation (CGU)</h1>
                
                <section>
                    <h2 className="font-bold text-lg mb-2">1. Objet</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Les présentes CGU régissent l'utilisation de l'application MiamChef IA. En installant ou en utilisant l'application, l'utilisateur accepte sans réserve les présentes conditions.
                    </p>
                </section>

                <section className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <h2 className="font-bold text-lg mb-2 text-red-800 flex items-center gap-2"><Shield size={20}/> 2. Avertissement Santé (Disclaimer)</h2>
                    <p className="text-red-700 text-sm leading-relaxed font-medium">
                        MiamChef IA est une application d'assistance culinaire et d'information nutritionnelle. 
                        <strong>L'application ne fournit PAS de conseils médicaux.</strong><br/><br/>
                        Les informations nutritionnelles (calories, macros, nutri-score) sont des estimations basées sur des algorithmes et peuvent comporter des marges d'erreur. Elles sont fournies à titre indicatif uniquement.<br/><br/>
                        L'Utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive. En cas de pathologie (diabète, allergies sévères, troubles cardiaques...), l'Utilisateur doit impérativement consulter un professionnel de santé avant de modifier son régime alimentaire. L'Éditeur décline toute responsabilité en cas de problème de santé lié à l'interprétation des données de l'application.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2">3. Utilisation de l'IA</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Les recettes et images sont générées par Intelligence Artificielle (Google Gemini). Bien que nous visons une haute qualité, l'IA peut occasionnellement générer des résultats inattendus ou inexacts. L'utilisateur est invité à faire preuve de bon sens lors de la réalisation des recettes (notamment concernant la cuisson et l'hygiène).
                    </p>
                </section>
            </div>
        )}

        {activeTab === 'cgv' && (
            <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-display mb-6">Conditions Générales de Vente (CGV)</h1>
                
                <section>
                    <h2 className="font-bold text-lg mb-2">1. Prix et Abonnements</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        MiamChef IA propose trois formules d'abonnement :<br/>
                        - <strong>Offre Liberté (Mensuel)</strong> : 4,99 € / mois.<br/>
                        - <strong>Offre Annuelle (Premium)</strong> : 39,99 € / an (soit 3,33€/mois).<br/>
                        - <strong>Offre À Vie (Lifetime)</strong> : 149,99 € (paiement unique).<br/><br/>
                        Les prix sont indiqués en Euros TTC. L'éditeur se réserve le droit de modifier les prix à tout moment, mais les abonnements en cours seront facturés au tarif en vigueur lors de la souscription.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2">2. Période d'Essai Gratuit</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        L'utilisateur bénéficie d'une période d'essai gratuite de <strong>7 jours</strong> à compter de la première installation de l'application. Durant cette période, toutes les fonctionnalités Premium sont accessibles.<br/>
                        Au terme des 7 jours, l'accès à l'application est restreint jusqu'à la souscription d'un abonnement payant.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2">3. Paiement et Renouvellement</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Le paiement est exigible immédiatement à la souscription.
                        Pour les offres Mensuelles et Annuelles, l'abonnement est renouvelé <strong>tacitement et automatiquement</strong> pour une durée identique, sauf résiliation par l'Utilisateur au moins 24h avant l'échéance.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2">4. Droit de Rétractation (Contenu Numérique)</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les contrats de fourniture d'un contenu numérique non fourni sur un support matériel dont l'exécution a commencé après accord préalable exprès du consommateur et renoncement exprès à son droit de rétractation.<br/><br/>
                        En souscrivant à MiamChef IA et en accédant immédiatement aux services Premium, l'Utilisateur accepte l'exécution immédiate du contrat et renonce à son droit de rétractation de 14 jours.
                    </p>
                </section>
            </div>
        )}

      </div>
    </div>
  );
};

export default LegalDocuments;
