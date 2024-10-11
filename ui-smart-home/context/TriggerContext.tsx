// TriggerContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Trigger {
    id?:string,
    type: "time" | "device";
    startTime?: string;
    endTime?: string;
    deviceId?: string;
    comparator?: string;
    deviceStatus?: any;
}

interface TriggerContextType {
    triggers: Trigger[];
    addTrigger: (trigger: Trigger) => void;
    removeTrigger: (index: number) => void;
    resetTriggers: () => void; // Thêm phương thức reset
    setTriggers: (trigges: Trigger[]) => void;
}

const TriggerContext = createContext<TriggerContextType | undefined>(undefined);

export const TriggerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [triggers, setTriggers] = useState<Trigger[]>([]);

    const addTrigger = (trigger: Trigger) => {
        setTriggers((prev) => [...prev, trigger]);
    };

    const removeTrigger = (index: number) => {
        setTriggers((prev) => prev.filter((_, i) => i !== index));
    };

    const resetTriggers = () => {
        setTriggers([]); // Đặt triggers về rỗng
    };

    return (
        <TriggerContext.Provider value={{ triggers, addTrigger, removeTrigger, resetTriggers, setTriggers }}>
            {children}
        </TriggerContext.Provider>
    );
};

export const useTriggerContext = () => {
    const context = useContext(TriggerContext);
    if (!context) {
        throw new Error("useTriggerContext must be used within a TriggerProvider");
    }
    return context;
};
