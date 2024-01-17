import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
  RefreshControl,
  PermissionsAndroid,
} from 'react-native';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Geolocation from 'react-native-geolocation-service';
import {object, string} from 'yup';
import {colors, fonts, images, strings, vh, vw} from './src/constants';
import CustomShowDataBox from './src/components/CustomShowDataBox';

const App = () => {
  // State
  const [city, setCity] = useState('');
  const [data, setData] = useState<any>({});
  const [forcastData, setForcastData] = useState<any>({});
  const [latitude, setLatitude] = useState('');
  const [longitute, setLongitude] = useState('');
  const [valid, setValid] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, [latitude, longitute]);

  // Validation City Name
  const createCity = async () => {
    let userSchema = object({
      city: string().min(3, strings.err_city).required(),
    });
    userSchema.isValid({city: city}).then((valid: any) => {
      setValid(valid);
      valid;
    });
  };

  // Request Location Permission
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: strings.locationTitle,
          message: strings.locationMessage,
          buttonNeutral: strings.buttonNeutral,
          buttonNegative: strings.cancel,
          buttonPositive: strings.ok,
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition((info: any) => {
          setLatitude(info.coords.latitude);
          setLongitude(info.coords.longitude);
          getDataByLatAndLon();
        });
      } else {
        Alert.alert(strings.permissionDenied);
      }
    } catch (err) {
      Alert.alert('error==>', err + '');
    }
  };

  // Get Data By Lattitude and Longitude
  const getDataByLatAndLon = () => {
    setRefreshing(true);
    if (latitude != undefined && longitute != undefined) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitute}&units=metric&appid=d491c71f31fa7ec9767a6445da3e4338`,
        )
        .then((response: any) => {
          setData(response);
          setRefreshing(false);
          setValid(true);
          setCity('');
        })
        .catch((err: any) => {
          Alert.alert('error==>', err + '');
          setRefreshing(false);
        });
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitute}&units=metric&appid=d491c71f31fa7ec9767a6445da3e4338`,
        )
        .then((response: any) => {
          setRefreshing(false);
          setForcastData(response);
        })
        .catch((err: any) => {
          Alert.alert('error==>', err + '');
          setRefreshing(false);
        });
    }
  };

  // Get Data By City Name
  const getDataByCity = () => {
    setRefreshing(true);
    if (valid) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=d491c71f31fa7ec9767a6445da3e4338`,
        )
        .then((response: any) => {
          setRefreshing(false);
          setData(response);
        })
        .catch((err: any) => {
          setRefreshing(false);
          setValid(false);
          setData({});
          Alert.alert('error==>', err + '');
        });
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=d491c71f31fa7ec9767a6445da3e4338`,
        )
        .then((response: any) => {
          setRefreshing(false);
          setForcastData(response);
        })
        .catch((err: any) => {
          Alert.alert('error==>', err + '');
          setRefreshing(false);
        });
    }
  };

  return (
    <ImageBackground style={style.images} source={images.background}>
      <StatusBar backgroundColor={colors.statusBar} />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={style.keyboardAppearance}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              if (city !== '') {
                createCity();
                getDataByCity();
              } else {
                getDataByLatAndLon();
              }
            }}
          />
        }>
        <TextInput
          style={style.textInput}
          onChangeText={(text: any) => setCity(text.trim())}
          placeholder={strings.placeholder_city}
          keyboardAppearance="dark"
          value={city}
        />
        {!valid && (
          <Text style={style.validationMessage}>{strings.err_city_}</Text>
        )}
        <TouchableOpacity
          onPress={() => {
            createCity();
            getDataByCity();
          }}
          style={style.searchButton}
          activeOpacity={0.6}>
          <Text style={style.searchText}>{strings.search}</Text>
        </TouchableOpacity>
        {data['data'] && (
          <>
            <Text style={style.cityName}>{data.data.name}</Text>

            <View style={style.showCurrentTemperatureView}>
              <Text style={style.temperature}>{data.data.main.temp}</Text>
              <Image style={style.degreeCelsius} source={images.celsius} />
              <TouchableOpacity
                onPress={() => {
                  if (city !== '') {
                    createCity();
                    getDataByCity();
                  } else {
                    getDataByLatAndLon();
                  }
                }}
                activeOpacity={0.5}>
                <Image style={style.reloadImg} source={images.reload} />
              </TouchableOpacity>
            </View>

            <View style={style.currentWeatherTextView}>
              <Text style={style.currentWeatherText}>
                {strings.weatherForcast}
              </Text>
            </View>
            {forcastData['data'] && (
              <CustomShowDataBox data={forcastData.data.list} />
            )}
          </>
        )}
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};
const style = StyleSheet.create({
  textInput: {
    width: vw(335),
    height: vh(60),
    borderWidth: vw(1),
    borderRadius: vw(8),
    alignSelf: 'center',
    backgroundColor: colors.white,
    marginTop: vh(16),
    paddingLeft: vw(16),
    color: colors.black,
  },
  mainScreen: {
    flex: 1,
  },
  images: {
    flex: 1,
  },
  searchButton: {
    width: vw(130),
    height: vh(50),
    borderRadius: vw(8),
    alignSelf: 'center',
    backgroundColor: colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: vh(16),
  },
  searchText: {
    color: colors.white,
    fontSize: vw(16),
    fontFamily: fonts.ibmBold,
  },
  currentWeatherText: {
    color: colors.white,
    marginLeft: vw(16),

    fontSize: vw(29),
    fontFamily: fonts.ibmBold,
  },
  currentWeatherTextView: {
    justifyContent: 'center',
    height: vh(40),
    marginTop: vh(8),
  },
  keyboardAppearance: {
    backgroundColor: colors.black_1,
  },
  temperature: {
    color: colors.white,
    fontFamily: fonts.ibmBold,
    fontSize: vw(60),
  },
  degreeCelsius: {
    height: vh(55),
    width: vw(60),
    tintColor: colors.white,
  },
  reloadImg: {
    height: vh(30),
    width: vw(30),
    tintColor: colors.white,
    marginTop: vh(-30),
    marginLeft: vw(5),
  },
  showCurrentTemperatureView: {
    flexDirection: 'row',
    width: vw(360),
    height: vh(150),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    color: colors.white,
    marginLeft: vw(16),
    fontSize: vw(40),
    fontFamily: fonts.ibmBold,
    marginTop: vh(16),
  },
  validationMessage: {
    color: 'red',
    marginLeft: vw(16),
    fontFamily: fonts.ibmMedium,
    fontSize: vw(18),
    marginTop: vw(8),
  },
});
export default App;
