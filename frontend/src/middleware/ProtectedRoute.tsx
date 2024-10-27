import React, { useEffect, useState } from 'react';

import Modal from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowModal(true);
    }
  }, [isAuthenticated]);

  const handleCloseModal = (): void => {
    setShowModal(false);
  };

  return (
    <>
      {isAuthenticated ? element : null}
      {showModal && (
        <Modal
          message="You need to be logged in to access this page."
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ProtectedRoute;
