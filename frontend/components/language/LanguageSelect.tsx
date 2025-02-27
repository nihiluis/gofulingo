import React from "react"
import { View, TouchableOpacity } from "react-native"
import { GofuText } from "../ui/GofuText"
import { useAtom } from "jotai"
import { languageAtom } from "~/state/language"
import { AVAILABLE_LANGUAGES, Language } from "~/lib/constants"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { ChevronDown } from "~/lib/icons/ChevronDown"

export default function LanguageSelect() {
  return (
    <View className="flex-row items-center">
      <LanguageSelectDropdown />
    </View>
  )
}

function LanguageSelectDropdown() {
  const [language, setLanguage] = useAtom(languageAtom)
  const [open, setOpen] = React.useState(false)

  const handleSelectLanguage = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage)
    setOpen(false)
  }

  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <TouchableOpacity className="flex-row items-center gap-1 px-2 py-1 rounded-md">
          <GofuText className="text-4xl">{language.flag}</GofuText>
        </TouchableOpacity>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {AVAILABLE_LANGUAGES.map((lang) => (
          <DropdownMenuItem key={lang.code} onPress={() => handleSelectLanguage(lang)}>
            <View className="flex-row items-center gap-4">
              <GofuText className="text-4xl">{lang.flag}</GofuText>
              <GofuText className="text-lg">{lang.name}</GofuText>
            </View>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
