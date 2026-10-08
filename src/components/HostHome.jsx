import ShopScreen from '../screens/ShopScreen';
import ExportScreen from '../screens/ExportScreen';
import MarketLandingScreen from '../screens/MarketLandingScreen';

// mb.agrom24.uz and export.agrom24.uz serve the same build as
// market.agrom24.uz; only the "/" landing differs by host, mirroring what a
// server-side rewrite would otherwise do. Every other route stays reachable
// on every host. market.agrom24.uz gets a landing page that links out to the
// other two instead of repeating the full catalogue.
const HOST_HOME = {
    'mb.agrom24.uz': ShopScreen,
    'export.agrom24.uz': ExportScreen,
};

const HostHome = () => {
    const Component = HOST_HOME[window.location.hostname] || MarketLandingScreen;
    return <Component />;
};

export default HostHome;
