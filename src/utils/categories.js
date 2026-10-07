// Single source of truth for product categories, used by the create/edit
// select, the shop filter sidebar, the header shortcuts, and product/order
// listings. `value` is what's stored on the product and used in ?category=
// query params; `navKey` is the i18next key (header.nav.<navKey>), which is
// fully translated for every locale already, so it's the only label source
// categories should use — the old `label` field was plain English text run
// through the (Uzbek-keyed) tUZ() dictionary, which never matched anything
// and silently showed English to every user in every language.
export const PRODUCT_CATEGORIES = [
    { value: 'Wheat', navKey: 'wheat' },
    { value: 'Beans', navKey: 'beans' },
    { value: 'Sunflower', navKey: 'sunflower' },
    { value: 'Vegetables', navKey: 'vegetables' },
    { value: 'Fruits', navKey: 'fresh_fruits' },
    { value: 'Dairy', navKey: 'dairy' },
];

// `t` is the function returned by react-i18next's useTranslation().
export const getCategoryLabel = (value, t) => {
    const found = PRODUCT_CATEGORIES.find((c) => c.value === value);
    if (!found) return value;
    return t ? t(`header.nav.${found.navKey}`) : value;
};
