import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { storage } from '../utils/storage';
import Onboarding from '../components/Onboarding';
import { useStatic } from '../components/shared/useStatic';
import { Credential } from '../types';
import AddCredentialModal from '../components/AddCredentialModal';
import CredentialsList from '../components/CredentialsList';
import { useTheme } from '../context/ThemeContext';

export default function HomePage() {
    const [credentials, setCredentials] = useStatic<Credential[]>('credentials', []);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const { isDark } = useTheme();

    const handleOnboardingContinue = async () => {
        setShowOnboarding(false);
        await storage.markInitialized();
    };

    useEffect(() => {
        const loadCredentials = async () => {
            const creds = await storage.getAll();
            setCredentials(creds);
        };
        loadCredentials();
    }, []);

    return (
        <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Onboarding
                visible={showOnboarding}
                onContinue={handleOnboardingContinue}
            />

            {!showOnboarding && (
                <CredentialsList
                    credentialList={credentials}
                />
            )}

            <AddCredentialModal />
        </View>
    );
}