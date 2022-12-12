import React, {useState, useLayoutEffect, useContext} from 'react';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage'
import { AuthContext } from '../../contexts/auth';
import { Container, Input, Button, ButtonText } from './styles';

export default function NewPost(){
    const [post, setPost] = useState("");
    const navigation = useNavigation();
    const { user } = useContext(AuthContext)

    async function handlePost(){
        if(post === ''){
            alert("Digite um conteudo para postar")
            return;
        }
        let avatarUrl = null;
        try{
            let response = await storage().ref('users').child(user?.uid).getDownloadURL()
            avatarUrl = response;
        }catch( error ){
            avatarUrl = null
        }
        await firestore().collection('posts')
        .add({
            createdAt: new Date(),
            content: post,
            autor: user?.name,
            userId: user?.uid,
            likes: 0,
            avatarUrl,
        })
        .then(()=>{
            setPost('');
            console.log('Post criado com sucesso');  
        })
        .catch((error)=>{
            console.log(error)
        })
        navigation.goBack();
    }

    useLayoutEffect(()=> {
        navigation.setOptions({
            headerRight: () =>(
                <Button onPress={ handlePost }>
                    <ButtonText>Compartilhar</ButtonText>
                </Button>
            )
            }    
        )


    }, [navigation, post]);


    return(
        <Container>
            <Input 
                placeholder="Digite aqui seu post..."
                value={post}
                onChangeText={ (text) => setPost(text)}
                autoCorrect={false}
                multiline={true}
                placeholderTextColor="#DDD"
                maxLength={300}
            />
        </Container>
    )
}