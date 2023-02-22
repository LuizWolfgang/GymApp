import { useState } from "react";
import { Center, Heading, ScrollView, Skeleton, Text, useToast, VStack } from "native-base";
import { Platform, TouchableOpacity } from "react-native";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ImagePickerAsset } from "expo-image-picker";


export function Profile(){
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [image, setImage] = useState(null);

  const toast = useToast()

  async function handleUserPhoto(){
    const photoSelected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });


    if (photoSelected.canceled) {
      return
    }

    if(photoSelected.assets[0].uri){
      const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri)
      if(photoInfo.size && (photoInfo.size / 1024 / 1024) > 5){
        return toast.show({
          title: 'Essa imagem é muito grande. Escolha uma de até 5MB',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      setImage(photoSelected.assets[0].uri);
    }
  }


  return(
    <VStack flex={1} >
      <ScreenHeader title="Perfil"/>
      <ScrollView contentContainerStyle={ Platform.OS === "ios" && { paddingBottom: 170}}>
        <Center mt={6} px={10}>
          {
            photoIsLoading ?
              <Skeleton
                w={33}
                h={33}
                rounded="full"
                startColor="gray.500"
                endColor={"gray.400"}
              />
              :
              <UserPhoto
                source={{ uri: image }}
                size={33}
                alt="Imagem do usuario"
              />
          }

          <TouchableOpacity onPress={handleUserPhoto}>
            <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
              Alterar Foto
            </Text>
          </TouchableOpacity>

          <Input
            bg="gray.600"
            placeholder="Nome"
          />

          <Input
            bg="gray.600"
            placeholder="E-mail"
          />
        </Center>
        <VStack px="10" mt={12} mb={9}>
          <Heading color="gray.200" mb={4} mt={12} fontFamily="heading">
            Alterar senha
          </Heading>

          <Input
            bg="gray.600"
            placeholder="Senha"
            secureTextEntry
          />
          <Input
            bg="gray.600"
            placeholder="Nova senha"
            secureTextEntry
          />
          <Input
            bg="gray.600"
            placeholder="Confirme a nova senha"
            secureTextEntry
          />

          <Button
            title="atualizar"
            mt={4}
          />
        </VStack>
      </ScrollView>
    </VStack>
  )
}
