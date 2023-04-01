import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from "native-base";
import { useAuth } from "@hooks/useAuth";

import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

import { useForm, Controller } from "react-hook-form"

import { Input } from "@components/Input";
import { Button } from "@components/Button";

import { useNavigation } from "@react-navigation/native";
import { AppError } from "@utils/AppError";
import { useRef, useState } from "react";
import { Platform } from "react-native";

type FormData = {
  email: string,
  password: string
}

export function SignIn(){
  const [ loading, setLoading ] = useState(false)
  const { singIn } = useAuth();
  const toast = useToast();
  const ref = useRef(0)
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  async function handleSignIn({ email, password}: FormData){
    try {

      setLoading(true)
      await singIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.'

      setLoading(false)

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1}} showsVerticalScrollIndicator={false}>
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
            Acesse sua conta
          </Heading>

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Informe o email',
              pattern: {
                value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'E-mail inválido'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="E-mail"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
                autoCapitalize="none"
                ref={ref}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Informe a senha',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Senha"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Button
            title="Acessar"
            onPress={handleSubmit(handleSignIn)}
            isLoading={loading}
          />
        </Center>
        <Center mt={24}>
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
          Ainda não tem acesso?
          </Text>
          <Button
            onPress={() => navigation.navigate('signUp')}
            title="Criar conta"
            variant="outline"
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
