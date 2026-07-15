// Single source of truth for product categories, used by the create/edit
// select, the shop filter sidebar, the header shortcuts, and product/order
// listings. `value` is what's stored on the product and used in ?category=
// query params; `label` is the tUZ() dictionary key for display; `navKey`
// is the i18next key (header.nav.<navKey>) used for the short header label.
export const PRODUCT_CATEGORIES = [
    { value: 'Wheat', label: 'Wheat & Grains', navKey: 'wheat' },
    { value: 'Beans', label: 'Beans & Legumes', navKey: 'beans' },
    { value: 'Sunflower', label: 'Sunflower', navKey: 'sunflower' },
    { value: 'Vegetables', label: 'Vegetables', navKey: 'vegetables' },
    { value: 'Fruits', label: 'Fresh Fruits', navKey: 'fresh_fruits' },
    { value: 'Dairy', label: 'Dairy', navKey: 'dairy' },
];

export const getCategoryLabel = (value) => {
    const found = PRODUCT_CATEGORIES.find((c) => c.value === value);
    return found ? found.label : value;
};
