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

function filterMenuItems(menuItems, search) {
  const query = search.trim().toLowerCase();
  if (!query) return menuItems;

  return menuItems.filter((item) =>
    `${item.name} ${item.description} ${item.course}`
      .toLowerCase()
      .includes(query),
  );
}

function addMenuItem(menuItems, item) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return [{ ...item, id, available: true }, ...menuItems];
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
  countAvailableMenuItems,
  filterMenuItems,
  getMenuStatistics,
  isMenuItem,
  removeMenuItem,
  toggleMenuItemAvailability,
  updateMenuItem,
};
