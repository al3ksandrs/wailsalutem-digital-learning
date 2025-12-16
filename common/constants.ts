import { EducationLevel, DayOfWeek } from './types';

export const API_URL = '/api';

// useful for dropdowns
export const EDUCATION_LEVEL_OPTIONS = Object.values(EducationLevel).map((value) => ({
    value,
    label: value,
}));

export const DAY_OF_WEEK_OPTIONS = Object.values(DayOfWeek).map((value) => ({
    value,
    label: value,
}));

// for we just have this, we will need to think about how to resolve this dynamically later
export const DEFAULT_SUBJECTS = [
    'Wiskunde A',
    'Wiskunde B',
    'Natuurkunde',
    'Scheikunde',
    'Biologie',
    'Economie',
    'Geschiedenis',
    'Aardrijkskunde',
    'Engels',
    'Nederlands',
    'Informatica',
];