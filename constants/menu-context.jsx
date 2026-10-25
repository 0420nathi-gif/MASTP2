import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  addMenuItem as addMenuItemToList,
  isMenuItem,
  removeMenuItem as removeMenuItemFromList,
  toggleMenuItemAvailability,
  updateMenuItem as updateMenuItemInList,
} from "./menu-utils.cjs";

const MENU_STORAGE_KEY = "@frna/menu-items";
const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState("");
  const [saveStatus, setSaveStatus] = useState("loading");
  const [hasLoaded, setHasLoaded] = useState(false);
  const saveQueue = useRef(Promise.resolve());
  const saveSequence = useRef(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadMenu = async () => {
      try {
        const storedMenu = await AsyncStorage.getItem(MENU_STORAGE_KEY);
        const parsedMenu = storedMenu ? JSON.parse(storedMenu) : [];

        if (!Array.isArray(parsedMenu) || !parsedMenu.every(isMenuItem)) {
          throw new Error("Saved menu has an invalid format.");
        }

        if (isMounted) setMenuItems(parsedMenu);
      } catch (error) {
        console.error("Failed to load the saved menu.", error);
        if (isMounted) {
          setSaveStatus("error");
          setStorageError(
            "Your saved menu couldn't be loaded. Try restarting the app or contact support if the problem continues.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setHasLoaded(true);
        }
      }
    };

    loadMenu();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoaded || storageError) return;

    const saveMenu = async () => {
      const sequence = ++saveSequence.current;
      const serializedMenu = JSON.stringify(menuItems);
      setSaveStatus("saving");
      saveQueue.current = saveQueue.current.then(
        () => AsyncStorage.setItem(MENU_STORAGE_KEY, serializedMenu),
      ).then(
        () => {
          if (isMounted.current && sequence === saveSequence.current) {
            setSaveStatus("saved");
          }
        },
        (error) => {
          console.error("Failed to save the menu.", error);
          if (isMounted.current && sequence === saveSequence.current) {
            setSaveStatus("error");
            setStorageError(
              "Your latest menu changes couldn't be saved. Check your device storage.",
            );
          }
        },
      );
    };

    saveMenu();
  }, [hasLoaded, menuItems, storageError]);

  const addItem = (item) => {
    setMenuItems((current) => addMenuItemToList(current, item));
  };

  const updateItem = (id, updatedItem) => {
    setMenuItems((current) => updateMenuItemInList(current, id, updatedItem));
  };

  const removeItem = (id) => {
    setMenuItems((current) => removeMenuItemFromList(current, id));
  };

  const toggleItemAvailability = (id) => {
    setMenuItems((current) => toggleMenuItemAvailability(current, id));
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        addItem,
        updateItem,
        removeItem,
        toggleItemAvailability,
        isLoading,
        storageError,
        saveStatus,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu must be used inside MenuProvider");
  return context;
}
