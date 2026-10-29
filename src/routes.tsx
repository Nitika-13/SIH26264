import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { FileComplaint } from './pages/FileComplaint';
import { MyComplaints } from './pages/MyComplaints';
import { CaseDetail } from './pages/CaseDetail';
import { Track } from './pages/Track';
import { OfficerInbox } from './pages/OfficerInbox';
import { Leadership } from './pages/Leadership';
import { DesignGallery } from './pages/DesignGallery';
import { NotFound } from './pages/NotFound';
import { ProtectedRoute } from './components/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/track" element={<Track />} />
      <Route path="/design" element={<DesignGallery />} />

      <Route
        path="/file"
        element={
          <ProtectedRoute allowedRoles={['complainant', 'admin']}>
            <FileComplaint />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my"
        element={
          <ProtectedRoute allowedRoles={['complainant', 'admin']}>
            <MyComplaints />
          </ProtectedRoute>
        }
      />

      <Route
        path="/case/:code"
        element={
          <ProtectedRoute allowedRoles={['complainant', 'officer', 'senior', 'admin']}>
            <CaseDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/officer"
        element={
          <ProtectedRoute allowedRoles={['officer', 'senior', 'admin']}>
            <OfficerInbox />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leadership"
        element={
          <ProtectedRoute allowedRoles={['senior', 'admin']}>
            <Leadership />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
