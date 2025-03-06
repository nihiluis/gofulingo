import React, { useState } from "react"
import { View, Pressable } from "react-native"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu"
import { EllipsisVertical } from "~/lib/icons/EllipsisVertical"
import { cn } from "~/lib/utils"
import { GofuText } from "../ui/GofuText"

export type VocabularyItemProps = {
  id: number
  text: string
  translations: string[]
  onEdit: (id: number, text: string) => void
  onDelete: (id: number) => void
  className?: string
}

export default function VocabularyItem({
  id,
  text,
  translations,
  onEdit,
  onDelete,
  className,
}: VocabularyItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <View
      className={cn(
        "flex flex-row items-center justify-between p-3 border-b border-border",
        className
      )}>
      <View className="flex-1 flex-col">
        <GofuText className="text-base text-foreground">{text}</GofuText>
        <GofuText className="text-sm text-muted-foreground">
          {translations.join(", ")}
        </GofuText>
      </View>
      <DropdownMenu onOpenChange={setOpen}>
        <DropdownMenuTrigger>
          <Pressable
            className="p-1"
            accessibilityLabel={`Open menu for ${text}`}>
            <EllipsisVertical className="h-5 w-5 text-muted-foreground hover:!text-red-900" />
          </Pressable>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onPress={() => onEdit(id, text)}>
            <GofuText>Edit</GofuText>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onPress={() => onDelete(id)}>
            <GofuText className="text-destructive">Delete</GofuText>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  )
}
