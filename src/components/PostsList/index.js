import React, {useState, useContext} from "react";
import { Container, Name, Header, Avatar, ContentView, Content, Actions, LikeButton, Like,
TimePost} from './styles'
import MaterialIcons from 'react-native-vector-icons/Entypo'
import { formatDistance} from 'date-fns';
import { ptBR } from "date-fns/locale";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function PostsList({data, userId}){
    const navigation = useNavigation();
    const [likePost, setLikePost] = useState(data?.likes)
    function formatTimePost(){
        const datePost = new Date(data.createdAt.seconds * 1000);

        return formatDistance(
            new Date(),
            datePost,
            {
                locale: ptBR
            }
        )
    }

   async function handleLikePost(id, likes){
        const docId = `${userId}_${id}` 
        
        const doc = await firestore().collection('likes')
        .doc(docId).get();

        //verificar se o post ja foi curtido pelo user logado
        if(doc.exists){
            await firestore().collection('posts').doc(id).update({
                likes: likes-1
            })

            await firestore().collection('likes').doc(docId)
            .delete()
            .then(()=>{
                setLikePost(likes -1)
            })

            return;
        }

        //se não entrou no IF, precisamos dar o like:

        await firestore().collection('likes').doc(docId)
        .set({
            postId: id,
            userId: userId
        })

        await firestore().collection('posts').doc(id).update({
            likes: likes + 1
        })
        .then(()=>{
            setLikePost(likes + 1)
        })
    }
    return(
        <Container>
           <Header onPress={ () => navigation.navigate("PostsUsers", { title: data.autor, userId: data.userId})}>
            {data.avatarUrl ? (
                    <Avatar 
                    source={{uri: data.avatarUrl}}
                />
                ): (
                    <Avatar 
                        source={require('../../assets/images/avatar.png')}
                    />
                )}
                <Name numberOfLine={1}>{data?.autor}</Name>
           </Header>
           <ContentView>
            <Content>{data?.content}</Content>
           </ContentView>
           <Actions>
            <LikeButton onPress={() => handleLikePost(data.id, likePost)}>
                <Like>{likePost === 0 ? '' : likePost}</Like>
                <MaterialIcons name={likePost === 0 ? 'heart-outlined' : 'heart'} size={20} color="#e52246" />
            </LikeButton>
            <TimePost> {formatTimePost()}</TimePost>
           </Actions>
        </Container>
    )
}