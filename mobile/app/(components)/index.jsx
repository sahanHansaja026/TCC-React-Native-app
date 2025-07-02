import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createMaterialTopTabNavigator();

export default function ComponentIndex() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
        tabBarIndicatorStyle: styles.tabIndicator,
        tabBarLabel: ({ focused }) => (
          <Text style={[styles.tabLabel, focused && styles.activeTabLabel]}>
            {route.name}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Buy" component={HomeScreen} />
      <Tab.Screen name="Sell" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    margin: 10,
    overflow: 'hidden',
  },
  tabItem: {
    borderRadius: 25,
  },
  tabIndicator: {
    backgroundColor: '#000',
    height: '100%',
    borderRadius: 25,
  },
  tabLabel: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeTabLabel: {
    color: '#fff',
  },
});
