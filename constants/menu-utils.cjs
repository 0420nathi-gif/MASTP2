function isMenuItem(item) {
  return Boolean(
    item &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.description === "string" &&
    typeof item.course === "string" &&
    typeof item.price === "string"
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
  return [{ ...item, id }, ...menuItems];
}

function updateMenuItem(menuItems, id, updatedItem) {
  return menuItems.map((item) =>
    item.id === id ? { ...item, ...updatedItem, id } : item,
  );
}

function removeMenuItem(menuItems, id) {
  return menuItems.filter((item) => item.id !== id);
}

module.exports = {
  addMenuItem,
  filterMenuItems,
  isMenuItem,
  removeMenuItem,
  updateMenuItem,
};
