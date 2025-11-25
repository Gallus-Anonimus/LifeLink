import React, { useState } from 'react';
import { Card, Row, Col, Form, Button, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { IconUserPlus, IconUser, IconMapPin, IconPhone, IconMail, IconCalendar, IconDroplet, IconId, IconLock } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import type { Address, Person, PatientInfoType } from '../../context/types';
import { useLanguage } from '../../context/LanguageContext';
import {changeDate, fetchApi} from "../../context/utils.ts";

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
    password: 'Hasło',
    confirmPassword: 'Potwierdź hasło',
    passwordMismatch: 'Hasła nie pasują do siebie',
    passwordTooShort: 'Hasło musi mieć co najmniej 8 znaków',
    registeredAlert: 'Zarejestrowano pacjenta (zobacz konsolę)',
    registeringLog: 'Rejestracja pacjenta:',
    registering: 'Rejestrowanie...',
    registrationSuccess: 'Rejestracja zakończona pomyślnie! Przekierowywanie...',
    registrationError: 'Błąd rejestracji',
    errorPeselExists: 'Pacjent z podanym PESEL już istnieje',
    errorInvalidData: 'Nieprawidłowe dane',
    errorGeneric: 'Wystąpił błąd podczas rejestracji',
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
    password: 'Password',
    confirmPassword: 'Confirm password',
    passwordMismatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 8 characters',
    registeredAlert: 'Patient registered (see console)',
    registeringLog: 'Registering patient:',
    registering: 'Registering...',
    registrationSuccess: 'Registration successful! Redirecting...',
    registrationError: 'Registration error',
    errorPeselExists: 'Patient with the given PESEL already exists',
    errorInvalidData: 'Invalid data',
    errorGeneric: 'An error occurred during registration',
  },
};

const tLocal = (lang: string, key: string) => {
  const dict = translations[lang] ?? translations.pl;
  return dict[key] ?? key;
};

const GENDER_OPTIONS: Person['gender'][] = ['MALE', 'FEMALE'];

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
  gender: 'MALE',
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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

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
    if (!password) e['password'] = tLocal(lang, 'required');
    else if (password.length < 8) e['password'] = tLocal(lang, 'passwordTooShort');
    if (!confirmPassword) e['confirmPassword'] = tLocal(lang, 'required');
    else if (password !== confirmPassword) e['confirmPassword'] = tLocal(lang, 'passwordMismatch');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const payload = {
      email: patient.email,
      password: password,
      pesel: patient.pesel,
      dateOfBirth: changeDate(patient.dateOfBirth) || undefined,
      bloodType: patient.bloodType,
      person: {
        firstName: patient.person.firstName,
        middleName: patient.person.middleName || undefined,
        lastName: patient.person.lastName,
        phoneNumber: patient.person.phoneNumber || undefined,
        gender: patient.person.gender,
        address: {
          country: patient.person.address.country || 'POLAND',
          postalCode: patient.person.address.postalCode || undefined,
          city: patient.person.address.city || undefined,
          street: patient.person.address.street || undefined,
          buildingNumber: patient.person.address.buildingNumber || undefined,
        },
      },
      emergencyContact: useContact && patient.contactPerson ? {
        firstName: patient.contactPerson.firstName,
        middleName: patient.contactPerson.middleName || undefined,
        lastName: patient.contactPerson.lastName,
        phoneNumber: patient.contactPerson.phoneNumber || undefined,
        gender: patient.contactPerson.gender,
        address: {
          country: patient.contactPerson.address.country || 'POLAND',
          postalCode: patient.contactPerson.address.postalCode || undefined,
          city: patient.contactPerson.address.city || undefined,
          street: patient.contactPerson.address.street || undefined,
          buildingNumber: patient.contactPerson.address.buildingNumber || undefined,
        },
      } : undefined,
    };

    try {
      const response = await fetchApi('POST', '/auth/register', {
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 409) {
          setSubmitError(tLocal(lang, 'errorPeselExists'));
        } else if (response.status === 400) {
          const details = errorData.details || {};
          const errorMessages = Object.values(details).flat() as string[];
          setSubmitError(errorMessages.join(', ') || tLocal(lang, 'errorInvalidData'));
        } else {
          setSubmitError(errorData.details || tLocal(lang, 'errorGeneric'));
        }
        setIsSubmitting(false);
        return;
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : tLocal(lang, 'errorGeneric'));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-5 bg-light" style={{ minHeight: "calc(100vh - 140px)" }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4 p-md-5">
            {/* Header */}
            <Row className="align-items-center mb-4">
              <Col xs="auto">
                <div
                  className="d-flex align-items-center justify-content-center rounded"
                  style={{
                    width: 56,
                    height: 56,
                    background: "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  <IconUserPlus stroke={2} />
                </div>
              </Col>
              <Col>
                <h4 className="mb-1">{tLocal(lang, 'title')}</h4>
                <small className="text-muted">{tLocal(lang, 'patientData')}</small>
              </Col>
            </Row>

            <Form onSubmit={onSubmit} noValidate>
              {submitSuccess && (
                <Alert variant="success" className="mb-4">
                  {tLocal(lang, 'registrationSuccess')}
                </Alert>
              )}
              {submitError && (
                <Alert variant="danger" className="mb-4" dismissible onClose={() => setSubmitError(null)}>
                  <strong>{tLocal(lang, 'registrationError')}:</strong> {submitError}
                </Alert>
              )}

              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <IconUser size={20} className="text-primary" />
                  <h5 className="mb-0 fw-semibold">{tLocal(lang, 'patientData')}</h5>
                </div>
                
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">{tLocal(lang, 'firstName')} <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={patient.person.firstName}
                      onChange={e => handlePersonChange('firstName', e.target.value)}
                      isInvalid={!!errors['person.firstName']}
                    />
                    <Form.Control.Feedback type="invalid">{errors['person.firstName']}</Form.Control.Feedback>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">{tLocal(lang, 'middleName')}</Form.Label>
                    <Form.Control
                      type="text"
                      value={patient.person.middleName ?? ''}
                      onChange={e => handlePersonChange('middleName', e.target.value || null)}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">{tLocal(lang, 'lastName')} <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={patient.person.lastName}
                      onChange={e => handlePersonChange('lastName', e.target.value)}
                      isInvalid={!!errors['person.lastName']}
                    />
                    <Form.Control.Feedback type="invalid">{errors['person.lastName']}</Form.Control.Feedback>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">{tLocal(lang, 'gender')}</Form.Label>
                    <Form.Select
                      value={patient.person.gender}
                      onChange={e => handlePersonChange('gender', e.target.value as Person['gender'])}
                    >
                      {GENDER_OPTIONS.map(option => (
                        <option key={option} value={option}>
                          {tLocal(lang, option === 'MALE' ? 'male' : 'female')}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">{tLocal(lang, 'phoneNumber')}</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <IconPhone size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type="tel"
                        value={patient.person.phoneNumber}
                        onChange={e => handlePersonChange('phoneNumber', e.target.value)}
                      />
                    </InputGroup>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">{tLocal(lang, 'email')} <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <IconMail size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        value={patient.email}
                        onChange={e => setPatient(p => ({ ...p, email: e.target.value }))}
                        isInvalid={!!errors['email']}
                      />
                      <Form.Control.Feedback type="invalid">{errors['email']}</Form.Control.Feedback>
                    </InputGroup>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">{tLocal(lang, 'password')} <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <IconLock size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        isInvalid={!!errors['password']}
                      />
                      <Form.Control.Feedback type="invalid">{errors['password']}</Form.Control.Feedback>
                    </InputGroup>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">{tLocal(lang, 'confirmPassword')} <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <IconLock size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        isInvalid={!!errors['confirmPassword']}
                      />
                      <Form.Control.Feedback type="invalid">{errors['confirmPassword']}</Form.Control.Feedback>
                    </InputGroup>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">{tLocal(lang, 'pesel')} <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <IconId size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={patient.pesel}
                        onChange={e => setPatient(p => ({ ...p, pesel: e.target.value }))}
                        isInvalid={!!errors['pesel']}
                      />
                      <Form.Control.Feedback type="invalid">{errors['pesel']}</Form.Control.Feedback>
                    </InputGroup>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">{tLocal(lang, 'dateOfBirth')}</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <IconCalendar size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type="date"
                        value={patient.dateOfBirth}
                        onChange={e => setPatient(p => ({ ...p, dateOfBirth: e.target.value }))}
                      />
                    </InputGroup>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">{tLocal(lang, 'bloodType')}</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <IconDroplet size={18} />
                      </InputGroup.Text>
                      <Form.Select
                        value={patient.bloodType}
                        onChange={e => setPatient(p => ({ ...p, bloodType: e.target.value as PatientInfoType['bloodType'] }))}
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </Form.Select>
                    </InputGroup>
                  </Col>
                </Row>
              </div>

              {/* Address Section */}
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <IconMapPin size={20} className="text-primary" />
                  <h5 className="mb-0 fw-semibold">{tLocal(lang, 'address')}</h5>
                </div>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">{tLocal(lang, 'country')}</Form.Label>
                    <Form.Control
                      type="text"
                      value={patient.person.address.country}
                      onChange={e => handlePersonChange('address.country', e.target.value)}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">{tLocal(lang, 'postalCode')}</Form.Label>
                    <Form.Control
                      type="text"
                      value={patient.person.address.postalCode}
                      onChange={e => handlePersonChange('address.postalCode', e.target.value)}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">{tLocal(lang, 'city')}</Form.Label>
                    <Form.Control
                      type="text"
                      value={patient.person.address.city}
                      onChange={e => handlePersonChange('address.city', e.target.value)}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">{tLocal(lang, 'street')}</Form.Label>
                    <Form.Control
                      type="text"
                      value={patient.person.address.street}
                      onChange={e => handlePersonChange('address.street', e.target.value)}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">{tLocal(lang, 'buildingNumber')}</Form.Label>
                    <Form.Control
                      type="text"
                      value={patient.person.address.buildingNumber}
                      onChange={e => handlePersonChange('address.buildingNumber', e.target.value)}
                    />
                  </Col>
                </Row>
              </div>
              <div className="mb-4">
                <Form.Check
                  type="checkbox"
                  id="useContact"
                  checked={useContact}
                  onChange={e => setUseContact(e.target.checked)}
                  label={tLocal(lang, 'useContact')}
                  className="mb-3 fw-semibold"
                />

                {useContact && (
                  <div className="ps-3 border-start border-primary border-3">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <IconUser size={20} className="text-primary" />
                      <h6 className="mb-0 fw-semibold">{tLocal(lang, 'contactPerson')}</h6>
                    </div>

                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label className="fw-semibold">{tLocal(lang, 'firstName')}</Form.Label>
                        <Form.Control
                          type="text"
                          value={patient.contactPerson?.firstName ?? ''}
                          onChange={e => handlePersonChange('firstName', e.target.value, true)}
                        />
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Label className="fw-semibold">{tLocal(lang, 'lastName')}</Form.Label>
                        <Form.Control
                          type="text"
                          value={patient.contactPerson?.lastName ?? ''}
                          onChange={e => handlePersonChange('lastName', e.target.value, true)}
                        />
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Label className="fw-semibold">{tLocal(lang, 'phoneNumber')}</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <IconPhone size={18} />
                          </InputGroup.Text>
                          <Form.Control
                            type="tel"
                            value={patient.contactPerson?.phoneNumber ?? ''}
                            onChange={e => handlePersonChange('phoneNumber', e.target.value, true)}
                          />
                        </InputGroup>
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Label className="fw-semibold">{tLocal(lang, 'gender')}</Form.Label>
                        <Form.Select
                          value={patient.contactPerson?.gender ?? 'MALE'}
                          onChange={e => handlePersonChange('gender', e.target.value as Person['gender'], true)}
                        >
                          {GENDER_OPTIONS.map(option => (
                            <option key={option} value={option}>
                              {tLocal(lang, option === 'MALE' ? 'male' : 'female')}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Label className="fw-semibold">{tLocal(lang, 'city')}</Form.Label>
                        <Form.Control
                          type="text"
                          value={patient.contactPerson?.address.city ?? ''}
                          onChange={e => handlePersonChange('address.city', e.target.value, true)}
                        />
                      </Col>
                    </Row>
                  </div>
                )}
              </div>

              <div className="d-grid">
                <Button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className="d-flex justify-content-center align-items-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                    border: "none",
                    padding: "12px",
                    fontWeight: 600,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      {tLocal(lang, 'registering')}
                    </>
                  ) : (
                    <>
                      <IconUserPlus size={20} />
                      {tLocal(lang, 'register')}
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}