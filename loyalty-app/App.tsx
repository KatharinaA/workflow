import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, Platform } from 'react-native';

import MapScreen from './src/screens/MapScreen';
import BrowseScreen from './src/screens/BrowseScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import BenefitDetailScreen from './src/screens/BenefitDetailScreen';
import NearbyListScreen from './src/screens/NearbyListScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{emoji}</Text>
  );
}

function MapStack({ alertsEnabled }: { alertsEnabled: boolean }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#00529B' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen
        name="MapMain"
        options={{ title: 'Fordelskartet' }}
      >
        {(props) => <MapScreen {...props} alertsEnabled={alertsEnabled} />}
      </Stack.Screen>
      <Stack.Screen
        name="NearbyList"
        options={{ title: 'Fordeler i nærheten' }}
        component={NearbyListScreen}
      />
      <Stack.Screen
        name="BenefitDetail"
        options={({ route }: any) => ({
          title: route.params?.benefit?.businessName ?? 'Fordel',
        })}
        component={BenefitDetailScreen}
      />
    </Stack.Navigator>
  );
}

function BrowseStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#00529B' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen
        name="BrowseMain"
        options={{ title: 'Utforsk fordeler' }}
        component={BrowseScreen}
      />
      <Stack.Screen
        name="BenefitDetail"
        options={({ route }: any) => ({
          title: route.params?.benefit?.businessName ?? 'Fordel',
        })}
        component={BenefitDetailScreen}
      />
    </Stack.Navigator>
  );
}

function ProfileStack({
  alertsEnabled,
  onToggleAlerts,
}: {
  alertsEnabled: boolean;
  onToggleAlerts: (v: boolean) => void;
}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1A1A2E' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="ProfileMain" options={{ title: 'Mine fordeler' }}>
        {(props) => (
          <ProfileScreen
            {...props}
            alertsEnabled={alertsEnabled}
            onToggleAlerts={onToggleAlerts}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="BenefitDetail"
        options={({ route }: any) => ({
          title: route.params?.benefit?.businessName ?? 'Fordel',
        })}
        component={BenefitDetailScreen}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [alertsEnabled, setAlertsEnabled] = useState(false);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#00529B',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="Kart"
          options={{
            title: 'Kart',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🗺️" focused={focused} />,
          }}
        >
          {() => <MapStack alertsEnabled={alertsEnabled} />}
        </Tab.Screen>

        <Tab.Screen
          name="Browse"
          options={{
            title: 'Utforsk',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🔍" focused={focused} />,
          }}
          component={BrowseStack}
        />

        <Tab.Screen
          name="Profil"
          options={{
            title: 'Mine fordeler',
            tabBarIcon: ({ focused }) => <TabIcon emoji="⭐" focused={focused} />,
          }}
        >
          {() => (
            <ProfileStack
              alertsEnabled={alertsEnabled}
              onToggleAlerts={setAlertsEnabled}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 4,
    height: Platform.OS === 'ios' ? 82 : 60,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: Platform.OS === 'ios' ? 0 : 4,
  },
  tabIcon: {
    fontSize: 24,
    opacity: 0.5,
  },
  tabIconFocused: {
    opacity: 1,
  },
});
