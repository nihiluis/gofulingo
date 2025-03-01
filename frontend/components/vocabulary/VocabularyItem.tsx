import React, { useState } from "react"
import { View, Text, Pressable } from "react-native"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu"
import { EllipsisVertical } from "~/lib/icons/EllipsisVertical"
import { cn } from "~/lib/utils"

export type VocabularyItemProps = {
  id: number
  text: string
  onEdit: (id: number, text: string) => void
  onDelete: (id: number) => void
  className?: string
}

export default function VocabularyItem({
  id,
  text,
  onEdit,
  onDelete,
  className,
}: VocabularyItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <View className={cn(
      "flex flex-row items-center justify-between p-3 border-b border-border",
      className
    )}>
      <Text className="text-base text-foreground">{text}</Text>
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
            <Text>Edit</Text>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onPress={() => onDelete(id)}>
            <Text className="text-destructive">Delete</Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  )
}
