// Centralized route paths - import this wherever you need route references
export const APP_ROUTES = {
  LOGIN: '/login',
  TPO_LOGIN: '/tpo_login',
  USER_REGISTRATION: '/user_registration',
  FORGOT_PASSWORD: '/forgot_password',
  CREATE_PROFILE: '/create_profile',
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile_edit',
  NOTIFICATION: '/notification',
  DASHBOARD: '/dashboard',
  LOGOUT: '/logout',
  TPO_ADMIN: '/tpo_admin',
  TPO: {
    SEARCH: '/tpo/search',
    POST_JOB: '/tpo/post_job'
  },
  JOB_DETAILS: (id: string) => `/job_details/${id}`,
  VIEW_PROFILE: (id: string) => `/view_profile/${id}`,
  DOWNLOAD: (type: string, id: string, course: string) => `/download/${type}/${id}/${course}`
} as const;
