import { PhoneNumber, PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { AdminParticipant, RegisteredByUser } from '../core/interfaces/admin-participant.interface';

export function participantFullName(person?: Partial<Pick<AdminParticipant, 'firstName' | 'secondName' | 'firstLastName' | 'secondLastName'>> | null): string {
  return [person?.firstName, person?.secondName, person?.firstLastName, person?.secondLastName]
    .filter((part) => !!part && part.trim().length > 0)
    .join(' ')
    .trim();
}

export function participantLocation(participant: Pick<AdminParticipant, 'city' | 'state'>): string {
  return [participant.city, participant.state].filter((part) => !!part && part.trim().length > 0).join(' / ');
}

export function assignedUserFullName(participant: { registeredBy?: RegisteredByUser | null }): string {
  return participantFullName(participant.registeredBy);
}

export function messagingPhone(participant: Pick<AdminParticipant, 'phoneNumber' | 'country'>): string | null {
  if (!participant.phoneNumber) return null;
  const phoneUtil = PhoneNumberUtil.getInstance();
  let phone: PhoneNumber;
  try {
    phone = phoneUtil.parseAndKeepRawInput(participant.phoneNumber, participant.country?.iso?.toUpperCase());
  } catch (error) {
    const parseErrors = [
      'Invalid country calling code',
      'The string supplied did not seem to be a phone number',
      'Phone number too short after IDD',
      'The string supplied is too short to be a phone number',
      'The string supplied is too long to be a phone number',
    ];
    if (!(error instanceof Error) || !parseErrors.includes(error.message)) throw error;
    return null;
  }
  return phoneUtil.isValidNumber(phone)
    ? phoneUtil.format(phone, PhoneNumberFormat.E164).replace('+', '')
    : null;
}

export function participantEmailLink(email: string): string {
  return `mailto:${encodeURIComponent(email.trim())}`;
}
