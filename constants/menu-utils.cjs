const MENU_STORAGE_VERSION = 2;
const { seedMenuDishes } = require("./seed-menu.cjs");

function isMenuItem(item) {
  return Boolean(
    item &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.description === "string" &&
    typeof item.course === "string" &&
    typeof item.price === "string" &&
    Number.isFinite(Number(item.price.replace(",", "."))) &&
    Number(item.price.replace(",", ".")) > 0 &&
    (item.available === undefined || typeof item.available === "boolean")
  );
}

function filterMenuItems(
  menuItems,
  search,
  courseFilter = "All",
  availabilityFilter = "All",
) {
  const query = search.trim().toLowerCase();
  return menuItems.filter((item) => {
    const matchesQuery =
      !query ||
      `${item.name} ${item.description} ${item.course}`
        .toLowerCase()
        .includes(query);
    const matchesCourse =
      courseFilter === "All" || item.course === courseFilter;
    const isAvailable = item.available !== false;
    const matchesAvailability =
      availabilityFilter === "All" ||
      (availabilityFilter === "Available" && isAvailable) ||
      (availabilityFilter === "Unavailable" && !isAvailable);

    return matchesQuery && matchesCourse && matchesAvailability;
  });
}

function addMenuItem(menuItems, item) {
  return [createMenuItem(item), ...menuItems];
}

function addMenuItems(menuItems, items) {
  return [...items.map(createMenuItem), ...menuItems];
}

function increaseMenuPricesByFiftyPercent(menuItems) {
  return menuItems.map((item) => ({
    ...item,
    price: (
      Math.round(Number(item.price.replace(",", ".")) * 150) / 100
    ).toFixed(2),
  }));
}

function migrateStoredMenu(storedMenu) {
  if (Array.isArray(storedMenu) && storedMenu.every(isMenuItem)) {
    return {
      items: addMenuItems(
        increaseMenuPricesByFiftyPercent(storedMenu),
        seedMenuDishes,
      ),
      needsSave: true,
    };
  }

  if (
    (storedMenu?.version === 1 ||
      storedMenu?.version === MENU_STORAGE_VERSION) &&
    Array.isArray(storedMenu.items) &&
    storedMenu.items.every(isMenuItem)
  ) {
    if (storedMenu.version === MENU_STORAGE_VERSION) {
      return { items: storedMenu.items, needsSave: false };
    }

    return {
      items: addMenuItems(storedMenu.items, seedMenuDishes),
      needsSave: true,
    };
  }

  throw new Error("Saved menu has an invalid format.");
}

function createMenuItem(item) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return { ...item, id, available: true };
}

function updateMenuItem(menuItems, id, updatedItem) {
  return menuItems.map((item) =>
    item.id === id ? { ...item, ...updatedItem, id } : item,
  );
}

function removeMenuItem(menuItems, id) {
  return menuItems.filter((item) => item.id !== id);
}

function toggleMenuItemAvailability(menuItems, id) {
  return menuItems.map((item) =>
    item.id === id
      ? { ...item, available: item.available === false }
      : item,
  );
}

function countAvailableMenuItems(menuItems) {
  return menuItems.filter((item) => item.available !== false).length;
}

function getMenuStatistics(menuItems) {
  const totalItems = menuItems.length;
  const totalPrice = menuItems.reduce(
    (total, item) => total + Number(item.price.replace(",", ".")),
    0,
  );

  return {
    totalItems,
    averagePrice: totalItems > 0 ? totalPrice / totalItems : 0,
    availableItems: countAvailableMenuItems(menuItems),
  };
}

module.exports = {
  addMenuItem,
  addMenuItems,
  countAvailableMenuItems,
  filterMenuItems,
  getMenuStatistics,
  increaseMenuPricesByFiftyPercent,
  isMenuItem,
  MENU_STORAGE_VERSION,
  migrateStoredMenu,
  removeMenuItem,
  toggleMenuItemAvailability,
  updateMenuItem,
};
