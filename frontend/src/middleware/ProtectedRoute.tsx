import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Modal from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowModal(true);
    }
  }, [isAuthenticated]);

  const handleCloseModal = (): void => {
    setShowModal(false);
    navigate('/');
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
