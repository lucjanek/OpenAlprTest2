import React from 'react';
import { FlatList, ActivityIndicator, Text, View, TouchableOpacity, Image , Button } from 'react-native';
//import ImagePicker from 'react-native-image-picker'
import { ImagePicker, Permissions } from 'expo';

/* const options = {
  title: 'Wybierz zdjęcie',
  takePhotoButtonTitle: 'Zrób zdjęcie aparatem',
  chooseFromLibraryButtonTitle: 'Wybierz z galerii',
  quality: 1,

}; */

export default class FetchExample extends React.Component {

  /* state = {
    image: null,
    image_b64: null,
    image_width: null,
    image_height: null,
  }; */


  constructor(props){
    super(props);
    this.state ={ 
      isLoading: true,
      dataSource: null,
      image: null,
      image_b64: null,
      image_width: null,
      image_height: null,
    }
  }

  /* askPermissionsAsync = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.READ_EXTERNAL_STORAGE);
  }; */

  _pickImage = async () => {

    this.setState({ 
      isLoading: true
     });

    //await this.askPermissionsAsync();

    let result = await ImagePicker.launchCameraAsync({ 
      base64: true,
    });

    //console.log(result);

    if (!result.cancelled) {
      this.setState({ 
        image: result.uri,
        image_b64: result.base64,
        image_width: result.width,
        image_height: result.height,

       });
      
      var secret_key = 'sk_19ea418a96a8c2c65a57db15'
      var url = 'https://api.openalpr.com/v2/recognize_bytes?recognize_vehicle=1&country=pl&secret_key=' + secret_key

       fetch(url, {
        method: 'POST',
        body: this.state.image_b64,
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("Json response: "+responseJson)
        console.log("Json results: "+responseJson.results)
        this.setState({
          isLoading: false,
          dataSource: responseJson.results,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });

    }


  }

  /* componentDidMount(){
    //pictureSource = '0.jpg'
    var secret_key = 'sk_19ea418a96a8c2c65a57db15'
    var url = 'https://api.openalpr.com/v2/recognize_bytes?recognize_vehicle=1&country=pl&secret_key=' + secret_key
    //const formData = new FormData();
    //formData.append("data",);
    return fetch(url,{
      method: 'POST',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({
          isLoading: false,
          dataSource: responseJson.results,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  } */



  render(){
    let { image , isLoading, dataSource} = this.state;
    console.log("Tutaj " + image);
    console.log("Stan " + isLoading);
    console.log("DataSource " + dataSource);
    
    /* if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    } */
    return(
      <View style={{flex: 1, paddingTop:40}}>

        <Button
          title="Zrób zdjęcie autokrowie"
          onPress={this._pickImage}
        />
        {image &&
          <Image source={{ uri: image }} style={{ width: 400, height: 200, resizeMode: 'center',  alignSelf: 'center' }} />}
        {image &&
        <Text>Numer rejestracyjny: </Text>}
        {image && isLoading &&
        <Text>Trwa wykrywanie</Text>}
        {image && !isLoading && dataSource == ''&&
        <Text>Nic nie wykryto</Text>}
        
        <FlatList
          data={dataSource}
          renderItem={({item}) => <Text>{item.plate}</Text>}
          //keyExtractor={({id}, index) => id}
        />

        {/* <Image style={{width: 200, height: 200}} source={this.state.imageSource != null ? this.state.imageSource : require('./images/sample.jpg')}></Image>
        <TouchableOpacity onPress={this.selectPhoto.bind(this)}>
          <Text>Wybierz</Text>
        </TouchableOpacity> */}


        {/* <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item.plate}</Text>}
          //keyExtractor={({id}, index) => id}
        /> */}
      </View>
    );
  }
}