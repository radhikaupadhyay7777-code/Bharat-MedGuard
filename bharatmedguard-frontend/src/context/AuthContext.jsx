import React, { createContext, useContext, useState } from 'react';
import { CURRENT_USER } from '../services/mockData';

const AuthContext = createContext();

const DEMO_ROLES = {
  investigator: {
    name: "Radhika Upadhyay",
    email: "radhika.upadhyay@bharatmedguard.gov.in",
    role: "Security Investigator",
    badgeId: "BMG-SEC-230068",
    department: "National Healthcare Cyber Intelligence Cell",
    permissions: [
      { name: "View Claims & Billing", granted: true },
      { name: "Investigate Anomaly Alerts", granted: true },
      { name: "Execute OCR Forensic Verification", granted: true },
      { name: "Inspect Patient Identity Graph", granted: true },
      { name: "View Immutable Audit Logs", granted: true },
      { name: "Modify System Kernel / Core Settings", granted: false }
    ]
  },
  admin: {
    name: "Vikramaditya Roy",
    email: "admin.roy@bharatmedguard.gov.in",
    role: "System Administrator",
    badgeId: "BMG-ADM-10001",
    department: "Platform Engineering & Kernel Security",
    permissions: [
      { name: "View Claims & Billing", granted: true },
      { name: "Investigate Anomaly Alerts", granted: true },
      { name: "Execute OCR Forensic Verification", granted: true },
      { name: "Inspect Patient Identity Graph", granted: true },
      { name: "View Immutable Audit Logs", granted: true },
      { name: "Modify System Kernel / Core Settings", granted: true }
    ]
  },
  auditor: {
    name: "Dr. Kavita Verma",
    email: "kavita.verma@cghs.gov.in",
    role: "Clinical Auditor",
    badgeId: "BMG-AUD-44912",
    department: "Medical Audit & Clinical Governance",
    permissions: [
      { name: "View Claims & Billing", granted: true },
      { name: "Investigate Anomaly Alerts", granted: true },
      { name: "Execute OCR Forensic Verification", granted: true },
      { name: "Inspect Patient Identity Graph", granted: false },
      { name: "View Immutable Audit Logs", granted: false },
      { name: "Modify System Kernel / Core Settings", granted: false }
    ]
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(DEMO_ROLES.investigator);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = (email, password) => {
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchRole = (roleKey) => {
    if (DEMO_ROLES[roleKey]) {
      setUser(DEMO_ROLES[roleKey]);
    }
  };

  const hasPermission = (permName) => {
    if (!user || !user.permissions) return false;
    const p = user.permissions.find(item => item.name === permName);
    return p ? p.granted : false;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, switchRole, hasPermission, DEMO_ROLES }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
