import { Stack } from 'expo-router';
import Footer from '../components/Layout/Footer';
import Header from '../components/Layout/Header';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <Header />
            <Stack screenOptions={{ headerShown: false }} />
            <Footer />
        </SafeAreaProvider>
    );
}