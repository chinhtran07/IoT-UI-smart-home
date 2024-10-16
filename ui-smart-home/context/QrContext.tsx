import { createContext, ReactNode, useContext, useState } from "react";

interface QRContextType {
    qrData: string | null;
    setQrData: (data: string | null) => void;
}

const QRContext = createContext<QRContextType | undefined>(undefined);

export const QRProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [qrData, setQrData] = useState<string | null>(null);

    return (
        <QRContext.Provider value={{ qrData, setQrData }}>
            {children}
        </QRContext.Provider>
    );
};

export const useQR = () => {
    const context = useContext(QRContext);
    if (!context) {
        throw new Error("useQR must be used within a QRProvider");
    }
    return context;
};
