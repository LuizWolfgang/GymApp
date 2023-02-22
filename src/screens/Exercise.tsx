import { Heading, HStack, Icon, VStack, Text, Image, Box, ScrollView } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

import { Feather } from '@expo/vector-icons'

import { AppNavigatorRouterProps } from "@routes/app.tab.routes";


import BodySvg from '@assets/body.svg'
import SeriesDvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'
import { Button } from "@components/Button";

export function Exercise(){
  const navigation = useNavigation<AppNavigatorRouterProps>();

  return(
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            as={Feather} name="arrow-left" color="green.500" size={6}
          />
        </TouchableOpacity>
        <HStack justifyContent="space-between" mt={4} mb={8} alignItems="center"  fontFamily="heading">
          <Heading color="gray.100" fontSize="lg" flexShrink={1}>
            Puxada frontal
          </Heading>

          <HStack alignItems="center">
            <BodySvg/>
            <Text color="gray.200" ml={1} textTransform="capitalize">
              Costas
            </Text>
          </HStack>
        </HStack>
      </VStack>
      <ScrollView>
        <VStack p={8}>
          <Image
            source={{ uri: 'http://conteudo.imguol.com.br/c/entretenimento/0c/2019/12/03/remada-unilateral-com-halteres-1575402100538_v2_600x600.jpg'}}
            alt="Imagem do exercicio"
            w="full"
            h={80}
            mb={3}
            resizeMode="cover"
            rounded="lg"
            overflow="hidden"
          />

          <Box bg="gray.600" rounded="md" pb={4} px={4}>
            <HStack alignItems="center" justifyContent="space-around" mb={6} mt={5}>
              <HStack>
                <SeriesDvg/>
                <Text color="gray.200" ml={2}>3 series</Text>
              </HStack>
              <HStack>
                <SeriesDvg/>
                <Text color="gray.200" ml={2}>12 repetiçoes</Text>
              </HStack>
            </HStack>
            <Button
              title="Marcar como realizado"
            />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  )
}
