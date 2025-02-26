import { View, TouchableOpacity } from "react-native"
import { usePathname } from "expo-router"
import { GofuText } from "~/components/ui/GofuText"
import { Menu } from "~/lib/icons/Menu"
import { useNavigation, DrawerActions } from "@react-navigation/native"

export function TopBar() {
  const pathname = usePathname()
  const navigation = useNavigation()

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer())
  }

  return (
    <View className="w-full h-16 px-4 flex-row items-center justify-between bg-white border-b border-gray-200">
      <TouchableOpacity onPress={openDrawer} className="p-2">
        <Menu size={24} color="#333" />
      </TouchableOpacity>

      <GofuText className="text-lg font-semibold">
        {pathname === "/" ? "Home" : pathname.replace("/", "")}
      </GofuText>

      <View className="w-10" />
    </View>
  )
}
