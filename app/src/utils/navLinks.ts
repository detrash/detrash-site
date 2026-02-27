export const APP_NAV_LINKS = {
  ADMIN_PANEL: '/admin',
  APP: '/dashboard',
  ONBOARDING: '/onboarding',
  PROFILE: '/profile',
  SUBMIT_FORM: '/submit',
  FCW_STATUS: '/fcw-status',
};

export const APP_HEADER_LINKS = [
  { name: 'Dashboard', href: APP_NAV_LINKS.APP, key: 'dashboard' },
  {
    name: 'Submit Form',
    href: APP_NAV_LINKS.SUBMIT_FORM,
    isRecyclerOrWasteAccess: true,
    key: 'submit_form',
  },
  { name: 'FCW Status', href: APP_NAV_LINKS.FCW_STATUS, key: 'fcw-status' },
  {
    name: 'Admin',
    href: APP_NAV_LINKS.ADMIN_PANEL,
    isAdminAccess: true,
    key: 'admin_panel',
  },
];
