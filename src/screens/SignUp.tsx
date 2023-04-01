import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from "native-base";

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'

import { Input } from "@components/Input";
import { Button } from "@components/Button";

import { useNavigation } from "@react-navigation/native";

import { useForm, Controller } from "react-hook-form";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";

import { useState } from "react";
import { useAuth } from "@hooks/useAuth";
import { Platform } from "react-native";

type FormDataProps = {
  name: string;
  email:string;
  password:string;
  passwordConfirm:string;
}

export function SignUp(){
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const toast = useToast();
  const { singIn } = useAuth();

  const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome'),
    email:  yup.string().required('Informe o e-mail').email('E-mail inválido'),
    password: yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 digitos'),
    passwordConfirm: yup.string().required('Confirme a senha').oneOf([yup.ref('password'), null], 'As senhas não conferem.')
  }).required();

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  });

  // example axios
  // async function handleSignUp({ name, email, password} : FormDataProps){
  //   await fetch('http://192.168.2.1:3333/users',{
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ name, email, password})
  //   }).then(response => response.json())
  //     .then(data => console.log(data))
  // }

  async function handleSignUp({name, email, password}: FormDataProps){
    try {
      setIsLoading(true);

      await api.post('/users', { name, email, password })
      await singIn(email, password);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possivel criar a conta. Tente mais tarde'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1}}
      showsVerticalScrollIndicator={false}
    >

      <VStack flex={1} px={10} pb={Platform.OS === 'ios' ? 80 : 16}>
        <Image
          source={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg/>

          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>
        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Crie sua conta
          </Heading>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="passwordConfirm"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Confirmar senha"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors.passwordConfirm?.message}
              />
            )}
          />

          <Button
            title="Criar e acessar"
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>

        <Button
          onPress={() => navigation.goBack()}
          title="Voltar para o login"
          variant="outline"
          mt={12}
        />

      </VStack>
    </ScrollView>

  );
}
