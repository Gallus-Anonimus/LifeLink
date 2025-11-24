

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
    gender: "Male" | "Female",
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
}

export interface FetcheData {
    patient: PatientInfoType;
    card: Card[];

}

export interface Card {
    allergies: Allergy[];
    chronicDiseases: ChronicDisease[];
    medicalCheckups: MedicalCheckup[];
    diagnoses: Diagnosis[];
    procedures: Procedure[];
    medications: Medication[];
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

export interface MedicalCheckupProps {
    medicalCheckup: MedicalCheckup[];
}

export interface Procedure {
    procedureId: number;
    cptCode: string;
    procedureDescription: string;
    date: string;
}

export interface ProceduresEditProps {
    procedures: Procedure[];
}

export interface Vaccination {
    vaccinationId: number,
    doseNumber: number,
    vaccinationDate: string,
    notes?: string | null,
    vaccine: Vaccine[]
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
