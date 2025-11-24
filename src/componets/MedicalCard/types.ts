export interface Pacjent {
    id_pacjenta: number;
    imie: string;
    nazwisko: string;
    pesel: string;
    data_urodzenia: string;
    telefon: string;
    adres: string;
    osoba_kontaktowa: string;
    telefon_kontaktowy: string;
}

export interface Badanie {
    id_badania: number;
    id_wizyty: number;
    typ_badania: string;
    wynik: string;
    data_badania: string;
    plik_wyniku: string | null;
}

export interface Rozpoznanie {
    id_rozpoznania: number;
    id_wizyty: number;
    kod_icd: string;
    opis: string;
}

export interface Zabieg {
    id_zabiegu: number;
    id_wizyty: number;
    kod_procedury: string;
    opis: string;
    data_zabiegu: string;
}

export interface Alergia {
    id_alergii: number;
    id_pacjenta: number;
    nazwa: string;
    opis: string;
}

export interface ChorobaPrzewlekla {
    id_choroby: number;
    id_pacjenta: number;
    nazwa: string;
    data_rozpoznania: string;
    uwagi: string;
}

export interface Lek {
    id_leku: number;
    id_pacjenta: number;
    nazwa: string;
    dawka: string;
    czestotliwosc: string;
    od_kiedy: string;
    do_kiedy: string | null;
}

export interface Szczepienie {
    id_szczepienia: number;
    id_pacjenta: number;
    nazwa: string;
    data_szczepienia: string;
    dawka_nr: number;
    uwagi: string | null;
}

export interface MedicalCardData {
    pacjent: Pacjent | null;
    badania: Badanie[];
    rozpoznania: Rozpoznanie[];
    zabiegi: Zabieg[];
    alergie: Alergia[];
    choroby_przewlekle: ChorobaPrzewlekla[];
    leki: Lek[];
    szczepienia: Szczepienie[];
}

