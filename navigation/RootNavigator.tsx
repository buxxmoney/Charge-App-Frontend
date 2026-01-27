// navigation/RootNavigator.tsx

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { spacing } from '../constants/theme';
import { HomeScreen } from '../screens/HomeScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const rootNavigation = useNavigation<any>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnim] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    const toValue = menuOpen ? 0 : 1;
    Animated.spring(menuAnim, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
    setMenuOpen(!menuOpen);
  };

  const handleMenuAction = (action: 'send' | 'deposit' | 'swap') => {
    toggleMenu();
    switch (action) {
      case 'send':
        rootNavigation.navigate('SelectRecipient');
        break;
      case 'deposit':
        rootNavigation.navigate('Receive');
        break;
      case 'swap':
        console.log('Swap pressed');
        break;
    }
  };

  const icons: Record<string, string> = {
    Home: 'home',
    History: 'clock',
    Settings: 'settings',
  };

  const menuTranslateY = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });
  const menuOpacity = menuAnim;
  const plusRotation = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <>
      {/* Full screen backdrop */}
      {menuOpen && (
        <TouchableOpacity 
          style={styles.fullBackdrop} 
          onPress={toggleMenu}
          activeOpacity={1}
        />
      )}
      
      <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom + 8 }]}>
        {/* Expanded menu */}
        {menuOpen && (
          <Animated.View
            style={[
              styles.menuContainer,
              {
                opacity: menuOpacity,
                transform: [{ translateY: menuTranslateY }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuAction('deposit')}
            >
              <Text style={styles.menuLabel}>Receive</Text>
              <View style={[styles.menuIcon, { backgroundColor: '#FFF0E6' }]}>
                <Feather name="arrow-down" size={20} color="#FF9500" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuAction('send')}
            >
              <Text style={styles.menuLabel}>Send</Text>
              <View style={[styles.menuIcon, { backgroundColor: '#F0E6FF' }]}>
                <Feather name="send" size={20} color="#8B5CF6" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuAction('swap')}
            >
              <Text style={styles.menuLabel}>Swap</Text>
              <View style={[styles.menuIcon, { backgroundColor: '#E6F0FF' }]}>
                <Feather name="repeat" size={20} color="#3B82F6" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={styles.tabBarContainer}>
          {/* Left pill with tabs */}
          <View style={styles.pillContainer}>
            {state.routes.map((route: any, index: number) => {
              const isFocused = state.index === index;
              const iconName = icons[route.name] || 'circle';

              const onPress = () => {
                if (menuOpen) return;
                
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  style={styles.tabButton}
                  disabled={menuOpen}
                >
                  <Feather
                    name={iconName as any}
                    size={24}
                    color={menuOpen ? '#999' : (isFocused ? '#fff' : '#666')}
                  />
                </TouchableOpacity>
              );
            })}
            
            {/* Overlay to gray out pill */}
            {menuOpen && <View style={styles.pillOverlay} />}
          </View>

          {/* Right plus button */}
          {state.routes[state.index].name === 'Home' && (
            <TouchableOpacity style={styles.plusButton} onPress={toggleMenu}>
              <Animated.View style={{ transform: [{ rotate: plusRotation }] }}>
                <Feather name="plus" size={28} color="#fff" />
              </Animated.View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

export const RootNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  fullBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pillContainer: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  plusButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 40,
  },
  menuContainer: {
    position: 'absolute',
    right: spacing.lg,
    bottom: 120,
    alignItems: 'flex-end',
    gap: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RootNavigator;