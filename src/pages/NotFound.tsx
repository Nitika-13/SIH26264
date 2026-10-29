import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-display font-bold text-navy mb-2">404</h1>
      <h2 className="text-xl font-semibold text-ink mb-3">Page Not Found</h2>
      <div className="kesari-rule mx-auto mb-4" />
      <p className="text-sm text-muted mb-8">
        The requested official page or complaint record does not exist or may have been relocated.
      </p>
      <Link to="/">
        <Button variant="primary">Return to Homepage</Button>
      </Link>
    </div>
  );
};
