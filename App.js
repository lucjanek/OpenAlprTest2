import React from 'react';
import { FlatList, ActivityIndicator, Text, View, TouchableOpacity, Image , Button } from 'react-native';
import { ImagePicker, Permissions } from 'expo';


export default class FetchExample extends React.Component {

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


  _pickImage = async () => {	

    await Permissions.askAsync(Permissions.CAMERA);	
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

    this.setState({ 
      isLoading: true
     });

    let result = await ImagePicker.launchCameraAsync({ 
      base64: true,
    });

   
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
        //console.log("Json response: "+responseJson)
        //console.log("Json results: "+responseJson.results)
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

  render(){
    let { image , isLoading, dataSource} = this.state;
    //console.log("Foto " + image);
    //console.log("Stan " + isLoading);
    //console.log("DataSource " + dataSource);
    
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
        />

        
      </View>
    );
  }
}