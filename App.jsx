import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { Provider } from 'react-redux';

import OnboardingScreen from './src/screens/OnboardingScreen';
import MainScreen from './src/screens/MainScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import RulesScreen from './src/screens/RulesScreen';
import CustomLegendsScreen from './src/screens/CustomLegendsScreen';
import AddNewLegendScreen from './src/screens/AddNewLegendScreen';
import store from './src/store/store';
import SetupGameScreen from './src/screens/SetupGameScreen';
import GameCategoryScreen from './src/screens/GameCategoryScreen';
import PlayScreen from './src/screens/PlayScreen';
import StatsScreen from './src/screens/StatsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    const [firstLaunch, setFirstLaunch] = useState(null);
    const [fontsLoaded] = Font.useFonts({
        'Montserrat-Bold': require('./src/assets/fonts/MontserratAlternates-Bold.ttf'),
        'Montserrat-SemiBold': require('./src/assets/fonts/MontserratAlternates-SemiBold.ttf'),
        'Inter-Regular': require('./src/assets/fonts/MontserratAlternates-Regular.ttf'),
    });

    useEffect(() => {
        AsyncStorage.getItem('onboardingShown').then(value => {
            if (value === null) {
                setFirstLaunch(true);
            } else {
                setFirstLaunch(false);
            }
        });
    }, []);

    if (!fontsLoaded || firstLaunch === null) {
        return <AppLoading />;
    }

    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {firstLaunch && (
                        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                    )}
                    <Stack.Screen name="Main" component={MainScreen} />
                    <Stack.Screen name="Settings" component={SettingsScreen} />
                    <Stack.Screen name="Rules" component={RulesScreen} />
                    <Stack.Screen name="CustomLegends" component={CustomLegendsScreen} />
                    <Stack.Screen name="AddNewLegend" component={AddNewLegendScreen} />
                    <Stack.Screen name="SetupGame" component={SetupGameScreen} />
                    <Stack.Screen name="GameCategory" component={GameCategoryScreen} />
                    <Stack.Screen name="Play" component={PlayScreen} />
                    <Stack.Screen name="Stats" component={StatsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}
