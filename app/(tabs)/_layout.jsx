import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarLabel: "Accueil",
        }}
      />
      <Tabs.Screen
        name="Input"
        options={{
          title: "Destination",
          tabBarLabel: "Destination",
        }}
      />
    </Tabs>
  );
}
