const assert = require("node:assert/strict");
const test = require("node:test");
const {
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
} = require("../constants/menu-utils.cjs");
const { seedMenuDishes } = require("../constants/seed-menu.cjs");

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

test("combines course and availability filters with search", () => {
  const items = [
    menuItems[0],
    { ...menuItems[1], available: false },
    {
      id: "3",
      name: "Lemon Sorbet",
      description: "Fresh citrus",
      course: "Dessert",
      price: "6.00",
    },
  ];

  assert.deepEqual(
    filterMenuItems(items, "lemon", "Dessert", "Available"),
    [items[2]],
  );
  assert.deepEqual(
    filterMenuItems(items, "", "Dessert", "Unavailable"),
    [items[1]],
  );
  assert.deepEqual(filterMenuItems(items, "", "Main", "Available"), [
    items[0],
  ]);
});

test("validates saved menu item records", () => {
  assert.equal(isMenuItem(menuItems[0]), true);
  assert.equal(isMenuItem({ ...menuItems[0], price: 18 }), false);
  assert.equal(isMenuItem({ ...menuItems[0], available: "yes" }), false);
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
  assert.equal(added[0].available, true);
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

test("adds multiple dishes in entry order and marks them available", () => {
  const dishes = [
    {
      name: "Tomato Soup",
      description: "Slow roasted tomatoes",
      course: "Starter",
      price: "7.00",
    },
    {
      name: "Roast Chicken",
      description: "Herb-roasted chicken with seasonal vegetables",
      course: "Main",
      price: "22.00",
    },
    {
      name: "Berry Spritz",
      description: "Sparkling berries and lime",
      course: "Drinks",
      price: "5.50",
    },
    {
      name: "Chocolate Tart",
      description: "Dark chocolate",
      course: "Dessert",
      price: "9.50",
    },
  ];

  const added = addMenuItems(menuItems, dishes);

  assert.deepEqual(
    added.slice(0, dishes.length).map(({ name }) => name),
    dishes.map(({ name }) => name),
  );
  assert.ok(added.slice(0, dishes.length).every((item) => item.id));
  assert.ok(
    added.slice(0, dishes.length).every((item) => item.available === true),
  );
  assert.deepEqual(added.slice(dishes.length), menuItems);
});

test("increases existing dish prices by 50% while preserving the other fields", () => {
  const updated = increaseMenuPricesByFiftyPercent(menuItems);

  assert.deepEqual(
    updated.map(({ price }) => price),
    ["27.00", "14.25"],
  );
  assert.deepEqual(
    updated.map(({ id, name, description, course }) => ({
      id,
      name,
      description,
      course,
    })),
    menuItems.map(({ id, name, description, course }) => ({
      id,
      name,
      description,
      course,
    })),
  );
  assert.deepEqual(menuItems.map(({ price }) => price), ["18.00", "9.50"]);
});

test("migrates legacy menu prices once and preserves prices on later loads", () => {
  const firstLoad = migrateStoredMenu(menuItems);

  assert.equal(firstLoad.needsSave, true);
  assert.equal(firstLoad.items.length, menuItems.length + 20);
  assert.deepEqual(
    firstLoad.items.slice(20).map(({ price }) => price),
    ["27.00", "14.25"],
  );

  const nextLoad = migrateStoredMenu({
    version: MENU_STORAGE_VERSION,
    items: firstLoad.items,
  });

  assert.equal(nextLoad.needsSave, false);
  assert.deepEqual(nextLoad.items, firstLoad.items);
});

test("adds 20 dishes to version 1 menus without changing existing dish prices", () => {
  const versionOneMenu = {
    version: 1,
    items: menuItems.map((item, index) => ({
      ...item,
      price: index === 0 ? "27.00" : "14.25",
    })),
  };
  const migration = migrateStoredMenu(versionOneMenu);

  assert.equal(migration.needsSave, true);
  assert.equal(migration.items.length, menuItems.length + 20);
  assert.deepEqual(
    migration.items.slice(20).map(({ price }) => price),
    ["27.00", "14.25"],
  );
  assert.deepEqual(
    migration.items.slice(0, 20).map(({ name }) => name),
    seedMenuDishes.map(({ name }) => name),
  );
});

test("starts an empty menu with the 20 seeded dishes", () => {
  const migration = migrateStoredMenu([]);

  assert.equal(migration.needsSave, true);
  assert.equal(migration.items.length, 20);
  assert.ok(migration.items.every(isMenuItem));
});

test("seed dishes have an average price of R175 and stay between R150 and R200", () => {
  const prices = seedMenuDishes.map(({ price }) => Number(price));
  const average = prices.reduce((total, price) => total + price, 0) / prices.length;

  assert.equal(seedMenuDishes.length, 20);
  assert.equal(average, 175);
  assert.ok(prices.every((price) => price >= 150 && price <= 200));
});

test("rejects malformed or unsupported saved menu data", () => {
  assert.throws(() => migrateStoredMenu([{ ...menuItems[0], price: 18 }]));
  assert.throws(() =>
    migrateStoredMenu({ version: MENU_STORAGE_VERSION + 1, items: menuItems }),
  );
});

test("tracks availability while treating existing dishes as available", () => {
  assert.equal(countAvailableMenuItems(menuItems), menuItems.length);

  const unavailable = toggleMenuItemAvailability(menuItems, "1");
  assert.equal(unavailable[0].available, false);
  assert.equal(countAvailableMenuItems(unavailable), 1);

  const availableAgain = toggleMenuItemAvailability(unavailable, "1");
  assert.equal(availableAgain[0].available, true);
  assert.equal(countAvailableMenuItems(availableAgain), 2);
});

test("calculates total items, average price, and available items", () => {
  assert.deepEqual(getMenuStatistics([]), {
    totalItems: 0,
    averagePrice: 0,
    availableItems: 0,
  });
  assert.deepEqual(getMenuStatistics(menuItems), {
    totalItems: 2,
    averagePrice: 13.75,
    availableItems: 2,
  });
  assert.deepEqual(
    getMenuStatistics(toggleMenuItemAvailability(menuItems, "1")),
    {
      totalItems: 2,
      averagePrice: 13.75,
      availableItems: 1,
    },
  );
});
