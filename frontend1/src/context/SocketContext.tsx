"use client";

// src/context/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';
import { io, Socket } from 'socket.io-client';
import { authService } from '@/services/authService';

// Tạo context để lưu socket và trạng thái kết nối
const SocketContext = createContext<Socket | null>(null);

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = authService.getToken();
      setIsAuthenticated(!!token);
    };

    // Check initial auth state
    checkAuth();

    // Set up interval to check auth state
    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle socket connection
  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const token = authService.getToken();
    
    // Kết nối tới server với token xác thực
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      auth: {
        token: token
      }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [isAuthenticated]); // Depend on authentication state

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
