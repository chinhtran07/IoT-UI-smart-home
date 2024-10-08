import React, { createContext, useState, useContext, ReactNode } from 'react';

// Định nghĩa kiểu Action
interface Action {
  _id: string;
  description: string;
}

interface ActionContextType {
  actions: Action[];
  addAction: (action: Action) => void;
  removeAction: (_id: string) => void;
  resetActions: () => void;
}

const ActionContext = createContext<ActionContextType | undefined>(undefined);

// Tạo provider cho context
export const ActionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [actions, setActions] = useState<Action[]>([]);

  // Hàm để thêm action
  const addAction = (newAction: Action) => {
    setActions((prevActions) => [...prevActions, newAction]);
  };

  // Hàm để xoá action theo index
  const removeAction = (_id: string) => {
    setActions((prevActions) => prevActions.filter((action) => action._id !== _id));
  };

  // Hàm để reset toàn bộ action
  const resetActions = () => {
    setActions([]);
  };

  return (
    <ActionContext.Provider value={{ actions, addAction, removeAction, resetActions }}>
      {children}
    </ActionContext.Provider>
  );
};

// Hook để sử dụng ActionContext
export const useActionContext = (): ActionContextType => {
  const context = useContext(ActionContext);
  if (context === undefined) {
    throw new Error('useActionContext must be used within an ActionProvider');
  }
  return context;
};
