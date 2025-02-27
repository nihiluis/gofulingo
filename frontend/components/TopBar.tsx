import { View, TouchableOpacity } from "react-native"
import { usePathname } from "expo-router"
import { Menu } from "~/lib/icons/Menu"
import { useNavigation, DrawerActions } from "@react-navigation/native"
import CenterLayout from "./layout/CenterLayout"
import LanguageSelect from "./language/LanguageSelect"
export function TopBar({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname()
  const navigation = useNavigation()

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer())
  }

  return (
    <View className="w-full h-16 px-4 flex-row items-center justify-between">
      <TouchableOpacity
        onPress={openDrawer}
        className="p-2 absolute left-4 z-10">
        <Menu size={24} color="#333" />
      </TouchableOpacity>

      <CenterLayout>
        <LanguageSelect />
      </CenterLayout>
    </View>
  )
}
