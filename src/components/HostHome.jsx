import ShopScreen from '../screens/ShopScreen';
import ExportScreen from '../screens/ExportScreen';
import HomeScreen from '../screens/HomeScreen';

// mb.agrom24.uz and export.agrom24.uz serve the same build as
// market.agrom24.uz; only the "/" landing differs by host, mirroring what a
// server-side rewrite would otherwise do. Every other route stays reachable
// on every host.
const HOST_HOME = {
    'mb.agrom24.uz': ShopScreen,
    'export.agrom24.uz': ExportScreen,
};

const HostHome = () => {
    const Component = HOST_HOME[window.location.hostname] || HomeScreen;
    return <Component />;
};

export default HostHome;
