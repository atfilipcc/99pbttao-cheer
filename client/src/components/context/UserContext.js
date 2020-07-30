import { createContext } from 'react';

export const ContextUser = createContext({
  googleId: 0,
  displayName: '',
  firstName: '',
  lastName: '',
  image: '',
  createdAt: 0,
  sessionId: 0,
  hospitalInfo: {}
});
