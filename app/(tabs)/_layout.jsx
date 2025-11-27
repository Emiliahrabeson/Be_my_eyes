import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarLabel: "Accueil",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Camera"
        options={{
          title: "Camera",
          tabBarLabel: "Camera",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Input"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
