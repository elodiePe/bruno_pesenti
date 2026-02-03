/**
 * Service pour calculer les tarifs de livraison via l'API de la Poste Suisse
 * API: Swiss Post Tariff Calculator (https://postcalc.post.ch/tarcalc)
 */

/**
 * Calcule le tarif de livraison basé sur le poids et le code postal de destination
 * @param {number} weightGrams - Poids en grammes
 * @param {string} zipCode - Code postal suisse de destination (format: 4 chiffres)
 * @returns {Promise<{cost: number, weightLabel: string, error: string|null}>}
 */
export async function calculateShippingCost(weightGrams, zipCode) {
  try {
    // Validation du code postal
    if (!zipCode || !/^\d{4}$/.test(zipCode)) {
      return { 
        cost: 0, 
        weightLabel: '', 
        error: 'Code postal invalide. Veuillez entrer un NPA suisse (4 chiffres).' 
      };
    }

    // Validation du poids
    if (!weightGrams || weightGrams <= 0) {
      return { 
        cost: 0, 
        weightLabel: '', 
        error: 'Poids invalide.' 
      };
    }

    // Convertir les grammes en kilogrammes (l'API demande kg)
    const weightKg = weightGrams / 1000;

    // Déterminer la catégorie de poids et le tarif approprié
    // Format de poids acceptable: 0.001 - 30 kg
    const formattedWeight = Math.min(weightKg, 30);

    // Appel à l'API de la Poste Suisse
    // https://postcalc.post.ch/tarcalc?weight=<weight>&zip=<zipcode>
    const response = await fetch(
      `https://postcalc.post.ch/tarcalc?weight=${formattedWeight}&zip=${zipCode}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // La réponse contient les tarifs
    // Structure: { "A": 12.50, "B": 15.00, ... } où A/B sont les zones
    // Ou utiliser le tarif standard pour la Suisse

    // Tarifs standard de la Poste Suisse pour Colis (Priority Mail)
    // Basé sur le poids - on récupère le tarif approprié
    let shippingCost = 0;
    let weightLabel = '';

    if (weightGrams <= 500) {
      shippingCost = data.price || 8.50; // Tarif jusqu'à 500g
      weightLabel = 'jusqu\'à 500g';
    } else if (weightGrams <= 1000) {
      shippingCost = data.price || 12.50; // Tarif 501g - 1kg
      weightLabel = '501g - 1kg';
    } else if (weightGrams <= 2000) {
      shippingCost = data.price || 16.50; // Tarif 1kg - 2kg
      weightLabel = '1kg - 2kg';
    } else if (weightGrams <= 5000) {
      shippingCost = data.price || 22.50; // Tarif 2kg - 5kg
      weightLabel = '2kg - 5kg';
    } else {
      shippingCost = data.price || 30.00; // Tarif > 5kg
      weightLabel = '> 5kg';
    }

    return {
      cost: shippingCost,
      weightLabel,
      error: null,
      pricePerKg: data.pricePerKg || null,
      zone: data.zone || null
    };
  } catch (error) {
    console.error('Erreur lors du calcul des frais de livraison:', error);
    
    // En cas d'erreur, retourner des tarifs par défaut
    return {
      cost: getDefaultShippingCost(weightGrams),
      weightLabel: getWeightLabel(weightGrams),
      error: null, // On utilise le tarif par défaut sans erreur
      isDefault: true
    };
  }
}

/**
 * Retourne le tarif par défaut basé sur le poids
 * Utilisé en cas d'indisponibilité de l'API
 */
function getDefaultShippingCost(weightGrams) {
  if (weightGrams <= 500) return 8.50;
  if (weightGrams <= 1000) return 12.50;
  if (weightGrams <= 2000) return 16.50;
  if (weightGrams <= 5000) return 22.50;
  return 30.00;
}

/**
 * Retourne le libellé du poids
 */
function getWeightLabel(weightGrams) {
  if (weightGrams <= 500) return 'jusqu\'à 500g';
  if (weightGrams <= 1000) return '501g - 1kg';
  if (weightGrams <= 2000) return '1kg - 2kg';
  if (weightGrams <= 5000) return '2kg - 5kg';
  return '> 5kg';
}

export { getDefaultShippingCost, getWeightLabel };
