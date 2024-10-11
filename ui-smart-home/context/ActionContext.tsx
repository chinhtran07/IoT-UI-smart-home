import React, { createContext, useState, useContext, ReactNode } from 'react';

// Định nghĩa kiểu Action
interface Action {
  id: string;
  description: string;
}

interface ActionContextType {
  actions: Set<Action>;
  addAction: (action: Action) => void;
  removeAction: (id: string) => void;
  resetActions: () => void;
  setActions: (actions: Set<Action>) => void;
}

const ActionContext = createContext<ActionContextType | undefined>(undefined);

// Tạo provider cho context
export const ActionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [actions, setActions] = useState<Set<Action>>(new Set());

  // Hàm để thêm action
  const addAction = (newAction: Action) => {
    setActions((prevActions) => {
      const updatedActions = new Set(prevActions);
      updatedActions.add(newAction);
      return updatedActions;
    });
  };

  // Hàm để xoá action theo id
  const removeAction = (id: string) => {
    setActions((prevActions) => {
      const updatedActions = new Set(prevActions);
      updatedActions.forEach((action) => {
        if (action.id === id) {
          updatedActions.delete(action);
        }
      });
      return updatedActions;
    });
  };

  // Hàm để reset toàn bộ action
  const resetActions = () => {
    setActions(new Set());
  };

  return (
    <ActionContext.Provider value={{ actions, addAction, removeAction, resetActions, setActions }}>
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
