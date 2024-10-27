import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';

import { whoami } from '../api/authService';

interface AuthStatus {
  isAuthenticated: boolean;
  username: string | null;
}

const AuthContext = createContext<AuthStatus | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}): ReactNode => {
  const [auth, setAuth] = useState<AuthStatus>({
    isAuthenticated: false,
    username: null,
  });

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        const username = await whoami();
        setAuth({ isAuthenticated: true, username });
      } catch (error) {
        setAuth({ isAuthenticated: false, username: null });
      }
    };
    checkAuth();
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthStatus => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
