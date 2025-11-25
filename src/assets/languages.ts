export type Lang = "pl" | "en";
export type LocaleRow = [string, string, string];

export const locales: LocaleRow[] = [
    ["nav.menu.profile", "Profil użytkownika", "User profile"],
    ["nav.menu.dashboard", "Panel główny", "Dashboard"],
    ["nav.menu.card", "Karta pacjenta", "Medical card"],
    ["nav.menu.login", "Przejdź do logowania", "Go to login"],
    ["nav.menu.register"," Zarejestruj się", "Register"],
    ["nav.menu.logout", "Wyloguj się", "Log out"],
    ["nav.menu.languages", "Wybierz język", "Choose language"],
    ["nav.menu.about", "O nas", "About us"],
    ["nav.menu.nfc", "Skanuj NFC", "Scan NFC"],
    ["nfc.scan", "Zeskanuj kartę NFC", "Scan NFC card"],
    ["nfc.scanning", "Skanowanie...", "Scanning..."],
    ["nfc.title", "Szybkie skanowanie NFC", "Quick NFC scan"],
    [
        "nfc.subtitle",
        "Przyłóż kartę lub opaskę, aby otworzyć kartę medyczną.",
        "Hold the card or wristband near your phone to open the record."
    ],
    [
        "nfc.hint_ready",
        "Gotowy do skanowania - upewnij się, że NFC jest włączone.",
        "Ready to scan - make sure NFC is enabled."
    ],
    [
        "nfc.hint_scanning",
        "Przytrzymaj kartę blisko górnej części telefonu.",
        "Keep the card near the top of the phone."
    ],
    ["nfc.unsupported", "Twoja przeglądarka nie obsługuje NFC.", "Your browser does not support NFC."],
    ["nfc.permission", "Udziel zgody na użycie NFC.", "Please allow access to NFC."],
    ["nfc.read_error", "Nie udało się odczytać karty NFC.", "Could not read the NFC tag."],
    ["nfc.no_serial", "Nie znaleziono numeru seryjnego.", "Serial number was not found."],
    ["nfc.generic", "Nie udało się uruchomić skanowania NFC.", "Could not start NFC scanning."],
    ["nfc.scan_success", "Karta NFC została zeskanowana pomyślnie.", "NFC card scanned successfully."],
    ["nfc.management.title", "Zarządzanie kartą NFC", "NFC Tag Management"],
    ["nfc.management.register_title", "Zarejestruj kartę NFC", "Register NFC Tag"],
    ["nfc.management.deregister_title", "Wyrejestruj kartę NFC", "Deregister NFC Tag"],
    ["nfc.management.tag_uid", "ID karty NFC", "NFC Tag UID"],
    ["nfc.management.tag_uid_placeholder", "Wprowadź ID karty lub użyj skanowania", "Enter tag ID or use scan"],
    ["nfc.management.code", "Kod bezpieczeństwa NFC", "NFC Security Code"],
    ["nfc.management.code_placeholder", "Wprowadź kod bezpieczeństwa", "Enter security code"],
    ["nfc.register.register", "Zarejestruj kartę", "Register Tag"],
    ["nfc.register.registering", "Rejestrowanie...", "Registering..."],
    ["nfc.register.success", "Karta NFC została zarejestrowana pomyślnie.", "NFC tag registered successfully."],
    ["nfc.register.error_fields", "Proszę wypełnić wszystkie pola.", "Please fill in all fields."],
    ["nfc.register.error_invalid", "Nieprawidłowe dane.", "Invalid data."],
    ["nfc.register.error_unauthorized", "Wymagane uwierzytelnienie.", "Authentication required."],
    ["nfc.register.error_generic", "Wystąpił błąd podczas rejestracji.", "An error occurred during registration."],
    ["nfc.register.error_network", "Błąd połączenia z serwerem. Sprawdź połączenie internetowe.", "Network error. Please check your internet connection."],
    ["nfc.deregister.deregister", "Wyrejestruj kartę", "Deregister Tag"],
    ["nfc.deregister.deregistering", "Wyrejestrowywanie...", "Deregistering..."],
    ["nfc.deregister.success", "Karta NFC została wyrejestrowana pomyślnie.", "NFC tag deregistered successfully."],
    ["nfc.deregister.confirm", "Czy na pewno chcesz wyrejestrować kartę NFC?", "Are you sure you want to deregister the NFC tag?"],
    ["nfc.deregister.description", "Wyrejestrowanie karty NFC spowoduje usunięcie powiązania między kartą a Twoim kontem.", "Deregistering the NFC tag will remove the association between the tag and your account."],
    ["nfc.deregister.error_unauthorized", "Wymagane uwierzytelnienie.", "Authentication required."],
    ["nfc.deregister.error_not_found", "Nie znaleziono zarejestrowanej karty NFC.", "No registered NFC tag found."],
    ["nfc.deregister.error_generic", "Wystąpił błąd podczas wyrejestrowania.", "An error occurred during deregistration."],
    ["nfc.deregister.error_network", "Błąd połączenia z serwerem. Sprawdź połączenie internetowe.", "Network error. Please check your internet connection."],
    ["button.close", "Zamknij", "Close"],
    ["button.ok", "OK", "OK"],
    ["button.cancel", "Anuluj", "Cancel"],
    ["button.submit", "zatwierdz", "Submit"],
    ["button.delete", "Usuń", "Delete"],
    ["button.edit", "Edytuj", "Edit"],
    ["button.save", "Zapisz", "Save"],
    ["button.saving", "Zapisywanie...", "Saving..."],
    ["button.add", "Dodaj", "Add"],
    ["loading", "Ładowanie...", "Loading..."],
    ["no_items", "Brak danych", "No items"],
    ["childrenmode.title", "Tryb dziecięcy", "Children Mode"],

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
    ["auth.login_title", "Logowanie do Moj LifeLink", "Login to My LifeLink"],
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
    ["medicalcard.patient_info", "Informacje o Pacjencie", "Person Information"],
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
    ["medicalcard.patient_id", "ID Pacjenta", "Person ID"],
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
    ["medicalcard.select_vaccine", "Wybierz szczepionkę", "Select vaccine"],
    ["medicalcard.procedure_code", "Kod Procedury", "Procedure Code"],
    ["medicalcard.procedure_date", "Data Zabiegu", "Procedure Date"],
    ["medicalcard.start_date", "Data rozpoczęcia", "Start date"],
    ["medicalcard.end_date", "Data zakończenia", "End date"],

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