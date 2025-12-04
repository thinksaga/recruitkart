export type Role =
    | 'ADMIN'
    | 'SUPPORT'
    | 'OPERATOR'
    | 'TAS'
    | 'CANDIDATE'
    | 'FINANCIAL_CONTROLLER'
    | 'COMPLIANCE_OFFICER'
    | 'COMPANY_ADMIN'
    | 'COMPANY_MEMBER'
    | 'INTERVIEWER'
    | 'DECISION_MAKER';

export const ROLE_ACCESS_MATRIX: Record<string, Role[]> = {
    // Admin Routes
    '/admin': ['ADMIN'],
    '/admin/organizations': ['ADMIN'],
    '/admin/submissions': ['ADMIN'],
    '/admin/analytics': ['ADMIN'],
    '/admin/tickets': ['ADMIN', 'SUPPORT'],
    '/admin/audit': ['ADMIN'],
    '/admin/users': ['ADMIN', 'SUPPORT', 'OPERATOR'],

    // API Routes - Admin
    '/api/admin': ['ADMIN'],
    '/api/admin/users': ['ADMIN', 'SUPPORT', 'OPERATOR'],
    '/api/admin/tickets': ['ADMIN', 'SUPPORT'],

    // API Routes - TAS
    '/api/tas': ['TAS'],

    // API Routes - Company
    '/api/company': ['COMPANY_ADMIN', 'COMPANY_MEMBER', 'INTERVIEWER', 'DECISION_MAKER'],
    '/api/company/jobs': ['COMPANY_ADMIN', 'COMPANY_MEMBER'], // Creation might be restricted to Admin in code
    '/api/company/billing': ['COMPANY_ADMIN', 'FINANCIAL_CONTROLLER'],

    // API Routes - Candidate
    '/api/candidate': ['CANDIDATE'],

    // Operator Routes
    '/operator': ['OPERATOR', 'ADMIN'],
    '/operator/analytics': ['OPERATOR', 'ADMIN'],
    '/operator/jobs': ['OPERATOR', 'ADMIN'],
    '/operator/organizations': ['OPERATOR', 'ADMIN'],

    // TAS Routes
    '/tas': ['TAS'],
    '/tas/candidates': ['TAS'],
    '/tas/credits': ['TAS'],
    '/tas/interviews': ['TAS'],
    '/tas/jobs': ['TAS'],
    '/tas/profile': ['TAS'],
    '/tas/submissions': ['TAS'],

    // Company Routes
    '/dashboard/company': ['COMPANY_ADMIN', 'COMPANY_MEMBER', 'INTERVIEWER', 'DECISION_MAKER'],
    '/dashboard/company/jobs/new': ['COMPANY_ADMIN'], // Only Admin can post jobs
    '/dashboard/company/billing': ['COMPANY_ADMIN', 'FINANCIAL_CONTROLLER'],

    // Candidate Routes
    '/candidate': ['CANDIDATE'],
    '/candidate/profile': ['CANDIDATE'],
    '/candidate/applications': ['CANDIDATE'],

    // Support
    '/support': ['SUPPORT', 'ADMIN'],
};

export const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/pricing',
    '/for-companies',
    '/for-recruiters',
    '/about',
    '/verification-pending', // Accessible to logged-in users pending verification
];

export const API_PUBLIC_ROUTES = [
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/logout',
    '/api/auth/verify',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/webhooks/stripe', // If applicable
];
