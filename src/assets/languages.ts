export type Lang = "pl" | "en";
export type LocaleRow = [string, string, string];

export const locales: LocaleRow[] = [
    ["app.title", "Moj LifeLine", "My LifeLine"],
    ["nav.menu.profile", "Profil użytkownika", "User profile"],
    ["nav.menu.dashboard", "Panel główny", "Dashboard"],
    ["nav.menu.card", "Karta pacjenta", "Medical card"],
    ["nav.menu.login", "Przejdź do logowania", "Go to login"],
    ["nav.menu.register"," Zarejestruj się", "Register"],
    ["nav.menu.logout", "Wyloguj się", "Log out"],
    ["button.ok", "OK", "OK"],
    ["button.cancel", "Anuluj", "Cancel"],
    ["button.submit", "zatwierdz", "Submit"],
    ["button.delete", "Usuń", "Delete"],
    ["button.edit", "Edytuj", "Edit"],
    ["button.save", "Zapisz", "Save"],
    ["button.add", "Dodaj", "Add"],

    ["form.FistName", "Imię", "First Name"],
    ["form.MiddleName", "Drugie imię", "Middle Name"],
    ["form.LastName", "Nazwisko", "Last Name"],
    ["form.PESEL", "PESEL", "PESEL"],
    ["form.BirthDate", "Data urodzenia", "Birth Date"],
    ["form.Gender", "Płeć","Gender"],
    ["form.male", "Mężczyzna","Male"],
    ["form.female", "Kobieta","Female"],
    ["form.telephone", "Telefon","Telephone"],

    ["person.info.Contact", "Informacje kontaktowe", "Contact Information"],
    ["medicalcard.bloodtype", "Grupa krwi", "Blood Type"],

    ["auth.Login", "Zaloguj się", "Log in"],
    ["auth.login_title", "Logowanie do Moj LifeLine", "Login to My LifeLine"],
    ["auth.pesel", "PESEL", "PESEL"],
    ["auth.subtitle", "Zarządzaj swoją kartą medyczną online", "Manage your medical card online"],
    ["auth.login_help", "Jeśli potrzebujesz pomocy z logowaniem, skontaktuj się z pomocą techniczną.", "If you need help logging in, contact IT support."],
    ["auth.logout", "Wyloguj się", "Log out"],
    ["auth.email", "Adres e‑mail", "Email address"],
    ["auth.password", "Hasło", "Password"],
    ["auth.forgot", "Zapomniałeś hasła?", "Forgot password?"],
    ["search.user", "znajdz użytkownika", "Find User"],

    ["error.network", "Błąd sieci. Spróbuj ponownie.", "Network error. Try again."],
    ["error.unknown", "Nieznany błąd", "Unknown error"],

    ["logincode.placeholder", "Podaj kod bezpieczeństwa", "Enter security code"],
    ["logincode.error_user_id", "Podaj poprawne ID i kod bezpieczństwa", "Please enter a user ID and code."],
    ["logincode.error_invalid_user", "Złe ID użytkownika", "Invalid user ID."],
    ["logincode.error_invalid_code", "Nieprawidłowy kod bezpieczeństwa dla wybranego profilu.", "Invalid security code for selected profile."],
    ["logincode.success", "Kod zaakceptowany. Zalogowano jako {user}.", "Code accepted. Logged in as {user}."],
    ["logincode.error_generic", "Coś poszło nie tak.", "Something went wrong."],
    ["logincode.subtitle", "Bezpieczny dostęp do panelu pacjenta", "Secure access to patient dashboard"],
    ["logincode.user_id", "ID użytkownika", "User ID"],
    ["logincode.user_id_placeholder", "Wprowadź ID użytkownika", "Enter user ID"],
    ["logincode.profile", "Profil: {user}", "Profile: {user}"],
    ["logincode.security_code", "Kod bezpieczeństwa", "Security Code"],
    ["logincode.clear", "Wyczyść", "Clear"],
    ["logincode.code_help", "Wprowadź 4–8 cyfrowy kod dla wybranego profilu.", "Enter the 4–8 digit code for the selected profile."],
    ["logincode.success_title", "Sukces", "Success"],
    ["logincode.help", "Potrzebujesz pomocy? Skontaktuj się z pomocą techniczną", "Need help? Contact IT support"],


    ["medicalcard.title", "Karta Medyczna", "Medical Card"],
    ["medicalcard.patient_info", "Informacje o Pacjencie", "Parson Information"],
    ["medicalcard.personal_data", "Dane Osobowe", "Personal Data"],
    ["medicalcard.contact_info", "Informacje Kontaktowe", "Contact Information"],
    ["medicalcard.examinations", "Badania", "MedicalCheckup"],
    ["medicalcard.diagnoses", "Rozpoznania", "Diagnoses"],
    ["medicalcard.procedures", "Zabiegi", "Procedures"],
    ["medicalcard.allergies", "Alergie", "Allergies"],
    ["medicalcard.chronic_diseases", "Choroby Przewlekłe", "Chronic Diseases"],
    ["medicalcard.medications", "Leki", "Medications"],
    ["medicalcard.vaccinations", "Szczepienia", "Vaccinations"],
    ["medicalcard.no_data", "Brak danych", "No data available"],
    ["medicalcard.patient_id", "ID Pacjenta", "Parson ID"],
    ["medicalcard.first_name", "Imię", "First Name"],
    ["medicalcard.last_name", "Nazwisko", "Last Name"],
    ["medicalcard.pesel", "PESEL", "PESEL"],
    ["medicalcard.birth_date", "Data Urodzenia", "Birth Date"],
    ["medicalcard.phone", "Telefon", "Phone"],
    ["medicalcard.address", "Adres", "Address"],
    ["medicalcard.contact_person", "Osoba Kontaktowa", "Contact Person"],
    ["medicalcard.contact_phone", "Telefon Kontaktowy", "Contact Phone"],
    ["medicalcard.examination_type", "Typ Badania", "Examination Type"],
    ["medicalcard.result", "Wynik", "Result"],
    ["medicalcard.examination_date", "Data Badania", "Examination Date"],
    ["medicalcard.result_file", "Plik Wyniku", "Result File"],
    ["medicalcard.icd_code", "Kod ICD", "ICD Code"],
    ["medicalcard.description", "Opis", "Description"],
    ["medicalcard.procedure_code", "Kod Procedury", "Procedure Code"],
    ["medicalcard.procedure_date", "Data Zabiegu", "Procedure Date"],
    ["medicalcard.allergy_name", "Nazwa Alergii", "Allergy Name"],
    ["medicalcard.disease_name", "Nazwa Choroby", "Disease Name"],
    ["medicalcard.diagnosis_date", "Data Rozpoznania", "Diagnosis Date"],
    ["medicalcard.notes", "Uwagi", "Notes"],
    ["medicalcard.medication_name", "Nazwa Leku", "Medication Name"],
    ["medicalcard.dose", "Dawka", "Dose"],
    ["medicalcard.frequency", "Częstotliwość", "Frequency"],
    ["medicalcard.from_date", "Od", "From"],
    ["medicalcard.to_date", "Do", "To"],
    ["medicalcard.vaccination_name", "Nazwa Szczepienia", "Vaccination Name"],
    ["medicalcard.vaccination_date", "Data Szczepienia", "Vaccination Date"],
    ["medicalcard.dose_number", "Numer Dawki", "Dose Number"],
    ["medicalcard.loading", "Ładowanie...", "Loading..."],
    ["medicalcard.error", "Błąd podczas ładowania danych", "Error loading data"],
    ["medicalcard.delete_allergy", "Usuń alergię", "Delete allergy"],
    ["medicalcard.vaccine_type", "Typ Szczepionki", "Vaccine Type"],

    ["address.address", "Adres", "Address"],
    ["address.city", "Miasto", "City"],
    ["address.street", "Ulica", "Street"],
    ["address.buildingNumber", "Numer Budynku", "Building Number"],
    ["address.postalCode", "Kod Pocztowy", "Postal Code"],
    ["address.country", "Kraj", "Country"],
];

const indexByKey: Record<string, number> = {};
locales.forEach((row, i) => {
    indexByKey[row[0]] = i;
});

export function t(key: string, lang: Lang = "en"): string {
    const idx = indexByKey[key];
    if (idx === undefined) return "key not found "+ key;
    const row = locales[idx];
    const col = lang === "pl" ? 1 : 2;
    return row[col] ?? "key not found";
}

export function format(translation: string, vars: Record<string, string | number>) {
    return Object.entries(vars).reduce((acc, [k, v]) => {
        return acc.split(`{${k}}`).join(String(v));
    }, translation);
}

export function tt(key: string, lang: Lang = "en", vars?: Record<string, string | number>) {
    const base = t(key, lang);
    return vars ? format(base, vars) : base;
}