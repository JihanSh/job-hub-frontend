import { createContext, useContext, useState, useEffect } from "react";

// Create UserContext
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const profileImage = localStorage.getItem("profileImage");

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); 
        setUser({ name: decoded.name, profileImage });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use UserContext
export const useUser = () => useContext(UserContext);
