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
  userId: number | null;
}

interface AuthContextType extends AuthStatus {
  checkAuth: () => Promise<void>; // Expose checkAuth in the context
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}): JSX.Element => {
  const [auth, setAuth] = useState<AuthStatus>({
    isAuthenticated: false,
    username: null,
    userId: null,
  });

  const checkAuth = async (): Promise<void> => {
    try {
      const user = await whoami();
      if (user) {
        setAuth({
          isAuthenticated: true,
          username: user.name,
          userId: user.id,
        });
      } else {
        setAuth({ isAuthenticated: false, username: null, userId: null });
      }
    } catch (error) {
      setAuth({ isAuthenticated: false, username: null, userId: null });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
