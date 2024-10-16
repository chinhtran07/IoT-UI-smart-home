import { createContext, ReactNode, useContext, useState } from "react";

export interface Action {
    id: string | null;
    description: string | null;
}

interface ActionContextType {
    actions: Set<Action>;
    addAction: (action: Action) => void;
    removeAction: (id: string) => void;
    resetActions: () => void;
    setActions: (actions: Set<Action>) => void;
}

const ActionContext = createContext<ActionContextType | undefined>(undefined);

export const ActionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [actions, setActions] = useState<Set<Action>>(new Set());
  
    const addAction = (newAction: Action) => {
      setActions((prevActions) => {
        const updatedActions = new Set(prevActions);
        updatedActions.add(newAction);
        return updatedActions;
      });
    };
  
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
  
    const resetActions = () => {
      setActions(new Set());
    };
  
    return (
      <ActionContext.Provider value={{ actions, addAction, removeAction, resetActions, setActions }}>
        {children}
      </ActionContext.Provider>
    );
  };

  export const useActionContext = (): ActionContextType => {
    const context = useContext(ActionContext);
    if (context === undefined) {
      throw new Error('useActionContext must be used within an ActionProvider');
    }
    return context;
  };