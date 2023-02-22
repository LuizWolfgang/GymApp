import { useAuth } from "@hooks/useAuth";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import {useTheme, Box } from 'native-base'


import { AppRoutes } from "./app.tab.routes";
import { AuthRoutes } from "./auth.routes";

export function Routes() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700]

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer>
        { user.id ? <AppRoutes/> :  <AuthRoutes/>}
      </NavigationContainer>
    </Box>
  )
}
