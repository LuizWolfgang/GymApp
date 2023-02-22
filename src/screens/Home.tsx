import { FlatList, Heading, HStack, VStack, Text } from "native-base";
import { useState } from "react";

import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";

import { useNavigation } from "@react-navigation/native";

import { AppNavigatorRouterProps } from "@routes/app.tab.routes";


export function Home(){
  const [groups, setGroups] = useState(['ombro', 'costas', 'biceps', 'triceps']);
  const [groupSelected, setGroupSelected] = useState('ombro');

  const navigation = useNavigation<AppNavigatorRouterProps>();

  function handleOpenExerciseDetails(){
    navigation.navigate("exercise")
  }

  return(
    <VStack flex={1}>
      <HomeHeader/>

      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px:8 }}
        my={10}
        maxH={10}
        minH={10}
      />

      <VStack flex={1} px={8}>
        <HStack justifyContent="space-between" mb={5}>
          <Heading color="gray.200" fontSize="md" fontFamily="heading">
                Exercícios
          </Heading>

          <Text color="gray.200" fontSize="sm">
              4
          </Text>
        </HStack>

        <FlatList
          data={[1,2,3,4]}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <ExerciseCard
              onPress={handleOpenExerciseDetails}
            />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 20}}
        />

      </VStack>
    </VStack>
  )
}
