import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Tab {
  id: string;
  title: string;
  isMinimized: boolean;
  onRestore: () => void;
  onClose: () => void;
}

interface TabContextType {
  tabs: Tab[];
  addTab: (tab: Tab) => void;
  removeTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
  minimizeTab: (id: string) => void;
  restoreTab: (id: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>([]);

  const addTab = (tab: Tab) => {
    setTabs(prevTabs => {
      const existingTabIndex = prevTabs.findIndex(t => t.id === tab.id);
      if (existingTabIndex >= 0) {
        // Update existing tab
        const newTabs = [...prevTabs];
        newTabs[existingTabIndex] = { ...newTabs[existingTabIndex], ...tab };
        return newTabs;
      }
      // Add new tab
      return [...prevTabs, tab];
    });
  };

  const removeTab = (id: string) => {
    setTabs(prevTabs => prevTabs.filter(tab => tab.id !== id));
  };

  const updateTab = (id: string, updates: Partial<Tab>) => {
    setTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === id ? { ...tab, ...updates } : tab
      )
    );
  };

  const minimizeTab = (id: string) => {
    updateTab(id, { isMinimized: true });
  };

  const restoreTab = (id: string) => {
    updateTab(id, { isMinimized: false });
  };

  return (
    <TabContext.Provider value={{
      tabs,
      addTab,
      removeTab,
      updateTab,
      minimizeTab,
      restoreTab
    }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
};