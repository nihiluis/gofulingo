import React, { useState } from 'react'
import { View, Text, FlatList } from 'react-native'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import VocabularyItem, { VocabularyItemProps } from './VocabularyItem'
import { VocabularyList as VocabularyListType } from '~/lib/api/getVocabulary'

type VocabularyListProps = {
  vocabulary: VocabularyListType
  onAddVocabulary: () => void
  onEditVocabulary: (id: number, text: string) => void
  onDeleteVocabulary: (id: number) => void
}

export default function VocabularyList({
  vocabulary,
  onAddVocabulary,
  onEditVocabulary,
  onDeleteVocabulary
}: VocabularyListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredVocabulary = React.useMemo(() => 
    vocabulary.filter(item =>
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [vocabulary, searchQuery]
  )

  return (
    <View className="flex-1">
      <View className="flex-row items-center gap-2 mb-4 p-4">
        <Input
          className="flex-1"
          placeholder="Search vocabulary..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button variant="default" onPress={onAddVocabulary}>
          <Text className="text-primary-foreground">Add</Text>
        </Button>
      </View>

      {filteredVocabulary.length === 0 ? (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-muted-foreground text-center">
            {vocabulary.length === 0 
              ? "No vocabulary items found. Add your first one!" 
              : "No results found for your search."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredVocabulary}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <VocabularyItem
              id={item.id}
              text={item.text}
              onEdit={onEditVocabulary}
              onDelete={onDeleteVocabulary}
            />
          )}
        />
      )}
    </View>
  )
}
