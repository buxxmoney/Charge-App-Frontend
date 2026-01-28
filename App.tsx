import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WalletProvider } from './context/WalletContext';
import RootNavigator from './navigation/RootNavigator';
import { ReceiveScreen } from './screens/ReceiveScreen';
import { SelectRecipientScreen } from './screens/SelectRecipientsScreen';
import { SendAmountScreen } from './screens/SendAmountScreen';
import { ConfirmSendScreen } from './screens/ConfirmSendScreen';
import { CashScreen } from './screens/CashScreen';
import { CurrencyDetailScreen } from './screens/CurrencyDetailScreen';
import { DepositEFTScreen } from './screens/DepositEFTScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <WalletProvider>
        <NavigationContainer>
        <StatusBar style="light" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={RootNavigator} />
            <Stack.Screen
              name="Receive"
              component={ReceiveScreen}
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="SelectRecipient"
              component={SelectRecipientScreen}
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="SendAmount"
              component={SendAmountScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="ConfirmSend"
              component={ConfirmSendScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="Cash"
              component={CashScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="CurrencyDetail"
              component={CurrencyDetailScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="DepositEFT"
              component={DepositEFTScreen}
              options={{ animation: 'slide_from_right' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </WalletProvider>
    </SafeAreaProvider>
  );
}