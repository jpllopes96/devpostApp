import React, {useState, useContext, useCallback} from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Container, ButtonPost, ListPost} from './styles';
import Feather from 'react-native-vector-icons/Feather'
import Header from '../../components/Header';
import { AuthContext } from '../../contexts/auth'
import firestore from '@react-native-firebase/firestore'
import PostsList from '../../components/PostsList/';

export default function Home(){
    const { user } = useContext(AuthContext);
    const navigation = useNavigation();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const [lastItem, setLastItem] = useState('');
    const [emptyList, setEmptyList] = useState(false);

    useFocusEffect(
        useCallback(()=>{
            let isActive = true

            async function fetchPosts(){
              await firestore().collection('posts')
                .orderBy('createdAt', 'desc')
                .limit(5).get()
                .then((snapshot)=>{
                    if(isActive){
                        setPosts([]);
                        const postList =[]
                        snapshot.docs.map(item => {
                            postList.push({
                                ...item.data(), 
                                id: item.id
                            })
                        })
                        setEmptyList(!!snapshot.empty)
                        setPosts(postList);
                        setLastItem(snapshot.docs[snapshot.docs.length -1] )
                        setLoading(false)
                    }
                    
                })
            }

            fetchPosts();
            //quando desmontar o componente, sair da home
            return () =>{
                isActive = false;
            }
            

        }, [])
    );

    //Buscar mais posts uqando puxar a lista para cima
    async function handleRefreshPost(){
        setLoadingRefresh(true)
        await firestore().collection('posts')
              .orderBy('createdAt', 'desc')
              .limit(5).get()
              .then((snapshot)=>{
                setPosts([]);
                const postList =[]
                snapshot.docs.map(item => {
                    postList.push({...item.data(),  id: item.id})
                })
                setEmptyList(false)
                setPosts(postList);
                setLastItem(snapshot.docs[snapshot.docs.length -1] )
                setLoading(false)
                  
            })
        setLoadingRefresh(false)
          
    }

    //buscar mais posts quando chegar ao final
    async function getListPost(){
        if(emptyList){
            //se a lista estivar vazia
            setLoading(false);
            return  null;
        }
        if(loading){
            return;
        }
        firestore().collection('posts')
        .orderBy('createdAt', 'desc')
        .limit(5)
        .startAfter(lastItem)
        .get()
        .then( (snapshot) =>{
            const postList = [];
            snapshot.docs.map( u =>{
                postList.push({
                    ...u.data(),
                    id: u.id
                })
            })
            setEmptyList(!!snapshot.empty);
            setLastItem(snapshot.docs[snapshot.docs.length - 1]);
            setPosts(oldPosts => [...oldPosts, ...postList])
            setLoading(false)
        } )
    }

    return(
        <Container>
            <Header />
            { loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size={50} color="#e52246" />
                </View>
            ):(
                <ListPost
                    onEndReached={getListPost}
                    onEndReachedThreshold={0.1}
                    showsVerticalScrollIndicator={false}
                    refreshing={loadingRefresh}
                    onRefresh={ handleRefreshPost}
                    data={posts}
                    renderItem={ ({item}) => (<PostsList data={item} userId={user?.uid} />)}
                    
                />
            )
            
            }
          
            <ButtonPost activeOpacity={0.8} onPress={ () => navigation.navigate("NewPost")}>
                <Feather 
                    name='edit-2'
                    color='#FFF'
                    size={25}
                />
            </ButtonPost>
        </Container>
    )
}