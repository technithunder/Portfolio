import { useState, createContext } from 'react';

export const SidebarContext = createContext({});

export const SidebarProvider = ({ children }) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [collapseSidebar, setCollapseSidebar] = useState(false);
  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };
  const closeSidebar = () => {
    setSidebarToggle(false);
  };
  const openSideBar = () => {
    setCollapseSidebar(!collapseSidebar);
  };
  const closeSideBar = () => {
    setCollapseSidebar(false);
  };

  return (
    <SidebarContext.Provider
      value={{
        sidebarToggle,
        toggleSidebar,
        closeSidebar,
        openSideBar,
        closeSideBar,
        collapseSidebar
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
