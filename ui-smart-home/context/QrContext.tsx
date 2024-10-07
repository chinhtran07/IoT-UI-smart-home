import React, { createContext, useContext, useState, ReactNode } from "react";

// Định nghĩa kiểu cho QRContext
interface QRContextType {
    qrData: string | null;
    setQrData: (data: string | null) => void;
}

// Tạo context với giá trị mặc định
const QRContext = createContext<QRContextType | undefined>(undefined);

// Định nghĩa props cho QRProvider
interface QRProviderProps {
    children: ReactNode;
}

// QRProvider component
export const QRProvider: React.FC<QRProviderProps> = ({ children }) => {
    const [qrData, setQrData] = useState<string | null>(null);

    return (
        <QRContext.Provider value={{ qrData, setQrData }}>
            {children}
        </QRContext.Provider>
    );
};

// Hook để sử dụng QRContext
export const useQR = () => {
    const context = useContext(QRContext);
    if (!context) {
        throw new Error("useQR must be used within a QRProvider");
    }
    return context;
};
