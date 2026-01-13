/**
 * Emergency data structure for NFC hash fragments
 * Compact format optimized for URL hash storage
 */
export interface EmergencyData {
    n: string;      // full name (firstName + lastName)
    b: string;      // blood type
    a: string[];    // allergies (names only)
    c: string[];    // chronic diseases (names only)
    m: string[];    // current medications (name only, active ones)
    e: string;      // emergency contact phone
    t: number;      // timestamp (for freshness check)
}

/**
 * Encode emergency data to base64url string (URL-safe, no padding)
 */
export function encodeEmergencyData(data: EmergencyData): string {
    try {
        const json = JSON.stringify(data);
        // Convert to base64, then make it URL-safe
        const base64 = btoa(unescape(encodeURIComponent(json)));
        // Replace + with -, / with _, and remove padding =
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    } catch (error) {
        console.error('Error encoding emergency data:', error);
        throw new Error('Failed to encode emergency data');
    }
}

/**
 * Decode base64url string back to EmergencyData
 */
export function decodeEmergencyData(hash: string): EmergencyData | null {
    try {
        if (!hash || hash.trim().length === 0) {
            return null;
        }

        // Restore base64 format: replace - with +, _ with /, add padding if needed
        let base64 = hash.replace(/-/g, '+').replace(/_/g, '/');
        
        // Add padding if needed
        while (base64.length % 4) {
            base64 += '=';
        }

        // Decode base64 to JSON string
        const json = decodeURIComponent(escape(atob(base64)));
        
        // Parse JSON to EmergencyData
        const data = JSON.parse(json) as EmergencyData;
        
        // Validate required fields
        if (!data.n || !data.b || !Array.isArray(data.a) || !Array.isArray(data.c) || !Array.isArray(data.m)) {
            console.error('Invalid emergency data structure');
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error decoding emergency data:', error);
        return null;
    }
}

/**
 * Build Smart-Poster URL with embedded emergency data in hash fragment
 * For children mode (offline cache support)
 */
export function buildSmartPosterUrl(data: EmergencyData, baseUrl?: string): string {
    const encoded = encodeEmergencyData(data);
    let base: string;
    
    if (baseUrl) {
        base = baseUrl;
    } else if (typeof window !== 'undefined') {
        // Use current origin and path, but ensure we're on the /card/children route
        const origin = window.location.origin;
        const pathname = window.location.pathname;
        // Remove trailing slash and any route params, then add /card/children
        const basePath = pathname.replace(/\/[^/]*$/, '').replace(/\/$/, '') || '';
        base = `${origin}${basePath}/card/children`;
    } else {
        // Default production URL for children mode
        base = 'https://gallus-anonimus.github.io/LifeLink/card/children';
    }
    
    return `${base}#${encoded}`;
}

/**
 * Extract emergency data from MedicalCardData format
 * Converts full medical card data to compact emergency format
 */
export function extractEmergencyData(
    patient: { imie: string; nazwisko: string; telefon_kontaktowy: string } | null,
    bloodType: string,
    allergies: Array<{ nazwa: string }>,
    chronicDiseases: Array<{ nazwa: string }>,
    medications: Array<{ nazwa: string; do_kiedy: string | null }>
): EmergencyData {
    const fullName = patient 
        ? `${patient.imie} ${patient.nazwisko}`.trim()
        : '';
    
    const emergencyContact = patient?.telefon_kontaktowy || '';

    // Get only active medications (no end date or future end date)
    const now = Date.now();
    const activeMedications = medications
        .filter(med => {
            if (!med.do_kiedy) return true; // No end date = active
            const endDate = new Date(med.do_kiedy).getTime();
            return endDate > now; // End date in future = active
        })
        .map(med => med.nazwa);

    return {
        n: fullName,
        b: bloodType || '',
        a: allergies.map(a => a.nazwa),
        c: chronicDiseases.map(c => c.nazwa),
        m: activeMedications,
        e: emergencyContact,
        t: Date.now()
    };
}
