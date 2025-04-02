// src/context/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';
import { io, Socket } from 'socket.io-client';

// Tạo context để lưu socket và trạng thái kết nối
const SocketContext = createContext<Socket | null>(null);

// URL backend của bạn (cập nhật nếu cần)
const SOCKET_SERVER_URL = "http://localhost:5000";  // Thay đổi URL theo cấu hình của bạn

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Kết nối tới server
    const newSocket = io(SOCKET_SERVER_URL, { transports: ['websocket'] });
    setSocket(newSocket);

    return () => {
      // Đóng kết nối khi component unmount
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
