import React, { useState } from 'react';
import type { Address, Person, PatientInfoType } from '../../context/types';
import { useLanguage } from '../../context/LanguageContext';

const translations: Record<string, Record<string, string>> = {
  pl: {
    title: 'Rejestracja pacjenta',
    patientData: 'Dane pacjenta',
    firstName: 'Imię',
    middleName: 'Drugie imię',
    lastName: 'Nazwisko',
    phoneNumber: 'Numer telefonu',
    gender: 'Płeć',
    male: 'Male',
    female: 'Female',
    email: 'Email',
    pesel: 'Pesel',
    dateOfBirth: 'Data urodzenia',
    bloodType: 'Grupa krwi',
    address: 'Adres pacjenta',
    country: 'Kraj',
    postalCode: 'Kod pocztowy',
    buildingNumber: 'Numer budynku',
    city: 'Miasto',
    street: 'Ulica',
    useContact: 'Podaj osobę kontaktową',
    contactPerson: 'Osoba kontaktowa',
    register: 'Zarejestruj',
    required: 'Pole wymagane',
    invalidEmail: 'Nieprawidłowy email',
    registeredAlert: 'Zarejestrowano pacjenta (zobacz konsolę)',
    registeringLog: 'Rejestracja pacjenta:',
  },
  en: {
    title: 'Patient registration',
    patientData: 'Patient data',
    firstName: 'First name',
    middleName: 'Middle name',
    lastName: 'Last name',
    phoneNumber: 'Phone number',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    email: 'Email',
    pesel: 'PESEL',
    dateOfBirth: 'Date of birth',
    bloodType: 'Blood type',
    address: 'Patient address',
    country: 'Country',
    postalCode: 'Postal code',
    buildingNumber: 'Building number',
    city: 'City',
    street: 'Street',
    useContact: 'Provide contact person',
    contactPerson: 'Contact person',
    register: 'Register',
    required: 'Required field',
    invalidEmail: 'Invalid email',
    registeredAlert: 'Patient registered (see console)',
    registeringLog: 'Registering patient:',
  },
};

const tLocal = (lang: string, key: string) => {
  const dict = translations[lang] ?? translations.pl;
  return dict[key] ?? key;
};

const emptyAddress = (): Address => ({
  country: '',
  postalCode: '',
  buildingNumber: '',
  city: '',
  street: '',
});

const emptyPerson = (id = 0): Person => ({
  personId: id,
  firstName: '',
  middleName: null,
  lastName: '',
  phoneNumber: '',
  gender: 'Male',
  address: emptyAddress(),
});

export default function Register(): React.ReactElement {
  const { lang } = useLanguage();
  const [patient, setPatient] = useState<PatientInfoType>({
    person: emptyPerson(1),
    contactPerson: null,
    pesel: '',
    bloodType: 'O+',
    email: '',
    dateOfBirth: '',
  });

  const [useContact, setUseContact] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePersonChange = (path: string, value: string | null, isContact = false): void => {
    setPatient(prev => {
      const target = isContact ? (prev.contactPerson ?? emptyPerson(2)) : prev.person;
      const updated = { ...target };
      const parts = path.split('.');
      let cur: Record<string, unknown> = updated as unknown as Record<string, unknown>;
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        if (!cur[key] || typeof cur[key] !== 'object') {
          cur[key] = {};
        }
        cur = cur[key] as Record<string, unknown>;
      }
      cur[parts[parts.length - 1]] = value;
      if (isContact) {
        return { ...prev, contactPerson: updated };
      }
      return { ...prev, person: updated };
    });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!patient.person.firstName) e['person.firstName'] = tLocal(lang, 'required');
    if (!patient.person.lastName) e['person.lastName'] = tLocal(lang, 'required');
    if (!patient.pesel) e['pesel'] = tLocal(lang, 'required');
    if (!patient.email || !/^\S+@\S+\.\S+$/.test(patient.email)) e['email'] = tLocal(lang, 'invalidEmail');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (!validate()) return;
    const payload: PatientInfoType = {
      ...patient,
      contactPerson: useContact ? patient.contactPerson ?? emptyPerson(2) : null,
    };
    console.log(tLocal(lang, 'registeringLog'), payload);
    // Tutaj wysłać payload do API
    alert(tLocal(lang, 'registeredAlert'));
  };

  return (
    <form onSubmit={onSubmit} className="container my-4 p-4 border rounded bg-white">
      <h2 className="mb-4">{tLocal(lang, 'title')}</h2>

      <fieldset className="border p-3 mb-3 rounded">
        <legend className="px-2">{tLocal(lang, 'patientData')}</legend>

        <div className="mb-3">
          <label className="form-label">{tLocal(lang, 'firstName')}</label>
          <input
            className="form-control"
            value={patient.person.firstName}
            onChange={e => handlePersonChange('firstName', e.target.value)}
          />
          {errors['person.firstName'] && <div className="text-danger small">{errors['person.firstName']}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">{tLocal(lang, 'middleName')}</label>
          <input
            className="form-control"
            value={patient.person.middleName ?? ''}
            onChange={e => handlePersonChange('middleName', e.target.value || null)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{tLocal(lang, 'lastName')}</label>
          <input
            className="form-control"
            value={patient.person.lastName}
            onChange={e => handlePersonChange('lastName', e.target.value)}
          />
          {errors['person.lastName'] && <div className="text-danger small">{errors['person.lastName']}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">{tLocal(lang, 'phoneNumber')}</label>
          <input
            className="form-control"
            value={patient.person.phoneNumber}
            onChange={e => handlePersonChange('phoneNumber', e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{tLocal(lang, 'gender')}</label>
          <select className="form-select" value={patient.person.gender} onChange={e => handlePersonChange('gender', e.target.value)}>
            <option value="Male">{tLocal(lang, 'male')}</option>
            <option value="Female">{tLocal(lang, 'female')}</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">{tLocal(lang, 'email')}</label>
          <input className="form-control" value={patient.email} onChange={e => setPatient(p => ({ ...p, email: e.target.value }))} />
          {errors['email'] && <div className="text-danger small">{errors['email']}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">{tLocal(lang, 'pesel')}</label>
          <input className="form-control" value={patient.pesel} onChange={e => setPatient(p => ({ ...p, pesel: e.target.value }))} />
          {errors['pesel'] && <div className="text-danger small">{errors['pesel']}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">{tLocal(lang, 'dateOfBirth')}</label>
          <input type="date" className="form-control" value={patient.dateOfBirth} onChange={e => setPatient(p => ({ ...p, dateOfBirth: e.target.value }))} />
        </div>

        <div className="mb-3">
          <label className="form-label">{tLocal(lang, 'bloodType')}</label>
          <select className="form-select" value={patient.bloodType} onChange={e => setPatient(p => ({ ...p, bloodType: e.target.value as PatientInfoType['bloodType'] }))}>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </fieldset>

      <fieldset className="border p-3 mb-3 rounded">
        <legend className="px-2">{tLocal(lang, 'address')}</legend>

        <div className="mb-3">
          <label className="form-label">{tLocal(lang, 'country')}</label>
          <input className="form-control" value={patient.person.address.country} onChange={e => handlePersonChange('address.country', e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">{tLocal(lang, 'postalCode')}</label>
          <input className="form-control" value={patient.person.address.postalCode} onChange={e => handlePersonChange('address.postalCode', e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">{tLocal(lang, 'buildingNumber')}</label>
          <input className="form-control" value={patient.person.address.buildingNumber} onChange={e => handlePersonChange('address.buildingNumber', e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">{tLocal(lang, 'city')}</label>
          <input className="form-control" value={patient.person.address.city} onChange={e => handlePersonChange('address.city', e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">{tLocal(lang, 'street')}</label>
          <input className="form-control" value={patient.person.address.street} onChange={e => handlePersonChange('address.street', e.target.value)} />
        </div>
      </fieldset>

      <div className="form-check mb-3">
        <input className="form-check-input" type="checkbox" id="useContact" checked={useContact} onChange={e => setUseContact(e.target.checked)} />
        <label className="form-check-label" htmlFor="useContact">{tLocal(lang, 'useContact')}</label>
      </div>

      {useContact && (
        <fieldset className="border p-3 mb-3 rounded">
          <legend className="px-2">{tLocal(lang, 'contactPerson')}</legend>

          <div className="mb-3">
            <label className="form-label">{tLocal(lang, 'firstName')}</label>
            <input
              className="form-control"
              value={patient.contactPerson?.firstName ?? ''}
              onChange={e => handlePersonChange('firstName', e.target.value, true)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">{tLocal(lang, 'lastName')}</label>
            <input
              className="form-control"
              value={patient.contactPerson?.lastName ?? ''}
              onChange={e => handlePersonChange('lastName', e.target.value, true)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">{tLocal(lang, 'phoneNumber')}</label>
            <input
              className="form-control"
              value={patient.contactPerson?.phoneNumber ?? ''}
              onChange={e => handlePersonChange('phoneNumber', e.target.value, true)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">{tLocal(lang, 'gender')}</label>
            <select className="form-select" value={patient.contactPerson?.gender ?? 'Male'} onChange={e => handlePersonChange('gender', e.target.value, true)}>
              <option value="Male">{tLocal(lang, 'male')}</option>
              <option value="Female">{tLocal(lang, 'female')}</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">{tLocal(lang, 'city')}</label>
            <input className="form-control" value={patient.contactPerson?.address.city ?? ''} onChange={e => handlePersonChange('address.city', e.target.value, true)} />
          </div>
        </fieldset>
      )}

      <div className="mt-3">
        <button type="submit" className="btn btn-primary">{tLocal(lang, 'register')}</button>
      </div>
    </form>
  );
}