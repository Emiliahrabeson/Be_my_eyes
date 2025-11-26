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
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
      {/* <Tabs.Screen
        name="destinationContext"
        options={{
          href: null,
        }}
      /> */}
    </Tabs>
  );
}
