import { Stack } from 'expo-router';
import Footer from '../components/Layout/Footer';
import Header from '../components/Layout/Header';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../context/ThemeContext';
import './global.css';

export default function RootLayout() {
    return (
        <ThemeProvider>
            <SafeAreaProvider>
                <Header />
                <Stack screenOptions={{ headerShown: false }} />
                <Footer />
            </SafeAreaProvider>
        </ThemeProvider>
    );
}