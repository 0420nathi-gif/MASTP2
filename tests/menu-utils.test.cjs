const assert = require("node:assert/strict");
const test = require("node:test");
const {
  addMenuItem,
  filterMenuItems,
  isMenuItem,
  removeMenuItem,
  updateMenuItem,
} = require("../constants/menu-utils.cjs");

const menuItems = [
  {
    id: "1",
    name: "Lemon Pasta",
    description: "Fresh basil and parmesan",
    course: "Main",
    price: "18.00",
  },
  {
    id: "2",
    name: "Chocolate Tart",
    description: "Dark chocolate",
    course: "Dessert",
    price: "9.50",
  },
];

test("filters dishes by name, description, and course without case sensitivity", () => {
  assert.deepEqual(filterMenuItems(menuItems, "PASTA"), [menuItems[0]]);
  assert.deepEqual(filterMenuItems(menuItems, "basil"), [menuItems[0]]);
  assert.deepEqual(filterMenuItems(menuItems, "dessert"), [menuItems[1]]);
  assert.deepEqual(filterMenuItems(menuItems, "  "), menuItems);
  assert.deepEqual(filterMenuItems(menuItems, "soup"), []);
});

test("validates saved menu item records", () => {
  assert.equal(isMenuItem(menuItems[0]), true);
  assert.equal(isMenuItem({ ...menuItems[0], price: 18 }), false);
  assert.equal(isMenuItem(null), false);
});

test("adds, updates, and removes dishes without changing other records", () => {
  const added = addMenuItem(menuItems, {
    name: "Tomato Soup",
    description: "Slow roasted tomatoes",
    course: "Starter",
    price: "7.00",
  });
  assert.equal(added.length, 3);
  assert.ok(added[0].id);
  assert.deepEqual(added.slice(1), menuItems);

  const updated = updateMenuItem(added, "1", {
    name: "Lemon Tagliatelle",
  });
  assert.equal(updated[1].name, "Lemon Tagliatelle");
  assert.equal(updated[1].id, "1");
  assert.equal(updated[0], added[0]);

  const removed = removeMenuItem(updated, "2");
  assert.deepEqual(
    removed.map((item) => item.id),
    [added[0].id, "1"],
  );
});
