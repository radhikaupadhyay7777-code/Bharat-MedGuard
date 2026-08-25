import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      title: "Critical Claim BM-1024 Flagged",
      category: "Claims Intelligence",
      description: "Duplicate hash collision & 3.4x baseline deviation in CityCare Apex.",
      severity: "critical",
      time: "Just now",
      read: false
    },
    {
      id: "notif-2",
      title: "Impossible Travel Velocity: P-102",
      category: "Identity Intelligence",
      description: "Concurrent admissions recorded in Delhi & Bengaluru within 135 mins.",
      severity: "high",
      time: "12m ago",
      read: false
    },
    {
      id: "notif-3",
      title: "OCR Document Mismatch in DOC-901",
      category: "Medical Documents",
      description: "Discharge summary shows Gastritis, claim billed for Coronary Angioplasty.",
      severity: "high",
      time: "25m ago",
      read: true
    },
    {
      id: "notif-4",
      title: "Brute-force Token Replay Blocked",
      category: "Network Cyber Defence",
      description: "Scapy engine isolated rogue gateway packet from 45.133.1.88.",
      severity: "medium",
      time: "1h ago",
      read: true
    }
  ]);

  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = 'toast-' + Date.now();
    const newToast = { id, ...toast };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
        markAsRead,
        addToast,
        toasts,
        removeToast
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-lg border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              toast.severity === 'critical'
                ? 'bg-bmg-midnight/95 border-red-500/50 text-red-100 shadow-red-glow'
                : toast.severity === 'high'
                ? 'bg-bmg-midnight/95 border-orange-500/50 text-orange-100 shadow-amber-glow'
                : 'bg-bmg-midnight/95 border-bmg-cyan/50 text-cyan-100 shadow-cyan-glow'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold tracking-wider uppercase text-bmg-cyan">
                  {toast.category || 'System Alert'}
                </p>
                <h4 className="font-semibold text-sm mt-0.5 text-white">{toast.title}</h4>
                <p className="text-xs text-slate-300 mt-1">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white text-xs ml-2"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
