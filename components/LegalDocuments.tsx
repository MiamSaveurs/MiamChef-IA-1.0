
import React, { useState } from 'react';
import { X, Scale, FileText, Shield, AlertCircle, Lock } from 'lucide-react';

/* 
 * NOTE SYSTÈME POUR L'IA (MÉMOIRE FUTURE) :
 * Si de nouvelles fonctionnalités payantes ou impliquant des données utilisateur sont ajoutées à l'application MiamChef,
 * VOUS DEVEZ IMPÉRATIVEMENT mettre à jour les sections 2 (Fonctionnalités) et 3 (Données) des CGU/CGV ci-dessous.
 * Ces documents doivent évoluer de manière synchrone avec le code.
 */

interface LegalDocumentsProps {
  onClose: () => void;
}

const LegalDocuments: React.FC<LegalDocumentsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'mentions' | 'cgu' | 'cgv' | 'rgpd'>('mentions');

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
                onClick={() => setActiveTab('rgpd')}
                className={`pb-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${activeTab === 'rgpd' ? 'border-chef-green text-chef-green' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                  RGPD & Confidentialité
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
                        L'application <strong>MiamChef</strong> est éditée par :<br/><br/>
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
            </div>
        )}

        {activeTab === 'rgpd' && (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex items-start gap-4 mb-6">
                    <div className="p-3 bg-white rounded-full text-green-600 shadow-sm">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-green-900 mb-2">Engagement Confidentialité Totale</h2>
                        <p className="text-sm text-green-800 leading-relaxed">
                            Chez MiamChef, nous appliquons le principe de <strong>"Privacy by Design"</strong>. 
                            Vos données sont votre propriété exclusive.
                        </p>
                    </div>
                </div>

                <h1 className="text-3xl font-display mb-6">Politique de Confidentialité (RGPD)</h1>
                
                <section>
                    <h2 className="font-bold text-lg mb-2">1. Collecte des Données (Principe de Minimisation)</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Nous ne collectons <strong>AUCUNE donnée personnelle identifiante</strong> (nom, email, adresse) pour l'utilisation basique de l'application.<br/>
                        Les seules données traitées sont :<br/>
                        - Vos préférences alimentaires (Régimes, Allergies).<br/>
                        - Les ingrédients que vous saisissez ou photographiez.<br/>
                        Ces données sont utilisées <strong>exclusivement</strong> pour générer vos recettes et ne sont pas revendues à des tiers.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2">2. Photos et Analyse d'Images (Scan Frigo)</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Lorsque vous utilisez la fonction "Scan Frigo", votre photo est envoyée temporairement à notre partenaire technologique (Google Gemini) pour analyse.<br/><br/>
                        <strong>Garantie de sécurité :</strong><br/>
                        - La photo est traitée de manière éphémère (en mémoire vive).<br/>
                        - Elle n'est <strong>pas stockée</strong> sur nos serveurs après l'analyse.<br/>
                        - Le système a pour instruction stricte d'ignorer les visages ou documents personnels visibles sur la photo.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2">3. Stockage Local (Local Storage)</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Pour votre confort, vos recettes sauvegardées, vos listes de courses et vos préférences sont stockées <strong>localement sur votre appareil</strong> (via IndexedDB et LocalStorage).<br/>
                        Cela signifie que vous seul avez accès à ces données. Si vous effacez les données de votre navigateur, ces informations seront perdues.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2">4. Vos Droits</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Puisque nous ne stockons pas de compte utilisateur centralisé, la suppression de l'application ou le nettoyage du cache de votre navigateur suffit à effacer toutes vos traces.
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
                        Les présentes CGU régissent l'utilisation de l'application MiamChef. En installant ou en utilisant l'application, l'utilisateur accepte sans réserve les présentes conditions.
                    </p>
                </section>

                <section className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <h2 className="font-bold text-lg mb-2 text-red-800 flex items-center gap-2"><Shield size={20}/> 2. Avertissement Santé (Disclaimer)</h2>
                    <p className="text-red-700 text-sm leading-relaxed font-medium">
                        MiamChef est une application d'assistance culinaire et d'information nutritionnelle. 
                        <strong>L'application ne fournit PAS de conseils médicaux.</strong><br/><br/>
                        Les informations nutritionnelles (calories, macros, nutri-score) sont des estimations basées sur des algorithmes et peuvent comporter des marges d'erreur. Elles sont fournies à titre indicatif uniquement.<br/><br/>
                        L'Utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive. En cas de pathologie (diabète, allergies sévères, troubles cardiaques...), l'Utilisateur doit impérativement consulter un professionnel de santé avant de modifier son régime alimentaire. L'Éditeur décline toute responsabilité en cas de problème de santé lié à l'interprétation des données de l'application.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2">3. Utilisation de la technologie</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Les recettes et images sont générées par technologie avancée (Google Gemini). Bien que nous visons une haute qualité, le système peut occasionnellement générer des résultats inattendus ou inexacts. L'utilisateur est invité à faire preuve de bon sens lors de la réalisation des recettes (notamment concernant la cuisson et l'hygiène).
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
                        MiamChef propose trois formules d'abonnement :<br/>
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
                        En souscrivant à MiamChef et en accédant immédiatement aux services Premium, l'Utilisateur accepte l'exécution immédiate du contrat et renonce à son droit de rétractation de 14 jours.
                    </p>
                </section>
            </div>
        )}

      </div>
    </div>
  );
};

export default LegalDocuments;
