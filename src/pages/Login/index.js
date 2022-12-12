import React, { useState, useContext} from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Container, Title, Input, Button, ButtonText, SignUpButton, SignUpText} from './styles'
import { AuthContext } from '../../contexts/auth';

import * as Animatable from 'react-native-animatable';

const TitleAnimated = Animatable.createAnimatableComponent(Title)

export default function Login(){
    const [login, setLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {singUp, signIn, loadingAuth} = useContext(AuthContext);

    function toggleLogin(){
        
        setLogin(!login);
        setEmail("");
        setName("");
        setPassword("");
        
    }

   async function handleSignUp(){
        if(email === '' || password === '' || name === ''  ){
            console.log("Preencha todos os campos")
            return;
        }
       await singUp(email, password, name);
    }
    
    async function handleSignIn(){
        if(password === '' || email === ''){
            console.log("Preencha todos os campos!");
            return;
        }
        await signIn(email, password);
    }

  
   if(login){
    return(
        <Container>
            <TitleAnimated animation={"flipInY"}>Dev<Text style={{color: "#E52236"}}>Post</Text></TitleAnimated>
            <Input 
                placeholder="seuemail@email.com"
                value={email}
                onChangeText={ (text) => setEmail(text)}
            />
            <Input 
                placeholder="*******"
                value={password}
                onChangeText={ (text) => setPassword(text)}
                secureTextEntry={true}
            />
            <Button onPress={handleSignIn}>
                {loadingAuth ? (
                    <ActivityIndicator size={20} color="#FFF" />
                ):
                (
                    <ButtonText>Acessar</ButtonText>
                )
                }
                
            </Button>

            <SignUpButton onPress={ toggleLogin}>
                <SignUpText>Criar uma conta</SignUpText>
            </SignUpButton>
        </Container>
    )
   }

    return(
        <Container>
            <TitleAnimated animation={"pulse"}>Dev<Text style={{color: "#E52236"}}>Post</Text></TitleAnimated>
            <Input 
                placeholder="Seu Nome"
                value={name}
                onChangeText={ (text) => setName(text)}
            />
            <Input 
                placeholder="seuemail@email.com"
                value={email}
                onChangeText={ (text) => setEmail(text)}
            />
            <Input 
                placeholder="*******"
                value={password}
                onChangeText={ (text) => setPassword(text)}
                secureTextEntry={true}
            />
            <Button onPress={handleSignUp}>
            {loadingAuth ? (
                    <ActivityIndicator size={20} color="#FFF" />
                 ): 
                 (<ButtonText>Cadastrar</ButtonText>)
            }
                
            </Button>

            <SignUpButton onPress={ toggleLogin }>
                <SignUpText>Já tenho uma conta</SignUpText>
            </SignUpButton>
        </Container>
   )
}