

export interface Address {
    country: string;
    postalCode: string;
    buildingNumber: string;
    city: string;
    street: string;
}

export interface AddressProp {
    address?: Address | null;
}

export interface Person  {
    personId: number,
    firstName: string,
    middleName?: string| null ,
    lastName: string,
    phoneNumber: string,
    gender: "MALE" | "FEMALE",
    address: Address,
}

export interface PatientInfoType {
    person: Person;
    contactPerson?: Person | null;
    pesel: string
    bloodType:  "A-" | "A+" | "B-" | "B+" | "AB-" | "AB+" | "O-"| "O+";
    email: string;
    dateOfBirth: string;
}

export interface PatientInfoProps {
    patient: PatientInfoType,
    onDataSaved?: () => void;
}

export interface FetcheData {
    patient: PatientInfoType;
    card: Card;

}

export interface Card {
    allergies: Allergy[];
    chronicDiseases: ChronicDisease[];
    medicalCheckups: MedicalCheckup[];
    medicalDiagnoses: Diagnosis[];
    medicalProcedures: Procedure[];
    medicines: Medication[];
    vaccinations: Vaccination[];
}

export interface Medication {
    medicineId: number,
    name: string,
    notes?: string | null,
    dosage: string,
    frequency: string,
    startDate: string,
    endDate?: string | null
}

export interface MedicationsProps {
    medications: Medication[];
}

export interface Allergy {
    allergyId: number;
    name: string;
    description: string;
}

export interface AllergiesProps {
    allergies?: Allergy[];
}

export interface ChronicDisease {
    diseaseId: number;
    name: string;
    diagnosisDate: string;
    notes: string;
}

export interface ChronicDiseasesProps {
    chronicdiseases?: ChronicDisease[];
}

export interface Diagnosis {
    diagnosisId: number;
    icdCode: string;
    description: string;
    diagnosisDate: string;
}

export interface DiagnosesEditProps {
    diagnoses: Diagnosis[];
}

export interface MedicalCheckupType {
    checkupId: number;
    details: string;
    date: string;
}

export interface Procedure {
    procedureId: number;
    cptCode: string;
    procedureDescription: string;
    date: string;
    procedureDate?: string;
}

export interface ProcedureApiResponse {
    procedureId: number;
    cptCode: string;
    procedureDescription: string;
    date?: string;
    procedureDate?: string;
}

export interface ProceduresEditProps {
    procedures: Procedure[];
}

export interface Vaccination {
    vaccinationId: number,
    doseNumber: number,
    vaccinationDate: string,
    notes?: string | null,
    vaccine: Vaccine
}

export interface Vaccine {
    vaccineId: number,
    name: string
}

export interface VaccinationsProps {
    vaccinations: Vaccination[];
}

export interface MedicalCheckup {
    checkupId: number,
    checkupDetails: string,
    checkupDate: string,
}

export interface MedicalCheckupProps {
    medicalcheckups: MedicalCheckup[];
}

// Medication Tracker Types
export interface MedicationSchedule {
    scheduleId: number;
    medicineId: number;
    medicineName: string;
    dosage: string;
    scheduledTime: string; // HH:mm format
    days: string[]; // e.g., ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]
    notes?: string | null;
    isActive: boolean;
}

export interface MedicationIntake {
    intakeId: number;
    scheduleId: number;
    medicineName: string;
    dosage: string;
    scheduledTime: string;
    takenAt?: string | null; // ISO date-time if taken
    status: "PENDING" | "TAKEN" | "MISSED" | "SKIPPED";
    date: string; // ISO date
}

export interface MedicationScheduleCreate {
    medicineId: number;
    scheduledTime: string;
    days: string[];
    notes?: string;
}

export interface TodayMedicationsResponse {
    items: MedicationIntake[];
}
