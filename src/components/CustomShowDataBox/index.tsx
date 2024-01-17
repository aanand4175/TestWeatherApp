import {StyleSheet, View, Text, FlatList} from 'react-native';
import {vh, vw} from '../../constants';

const CustomShowDataBox = (props: any) => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      style={style.customDataBox}
      data={props.data}
      renderItem={({item}) => {
        return (
          <View style={style.flatList}>
            <View style={style.dateTimeView}>
              <Text style={style.dataTemp}>
                Date : {item.dt_txt.substring(0, 10)}
              </Text>
              <Text style={style.dataTemp}>
                Time : {item.dt_txt.substring(11)}
              </Text>
            </View>
            <Text style={style.dataTemp}>
              Temperature : {item.main.temp_min}-{item.main.temp_max} (Min -
              Max)
            </Text>
            <Text style={style.dataTemp}>Humidity : {item.main.humidity}</Text>
            <Text style={style.dataTemp}>
              Wind : Speed - {item.wind.speed} , Degree - {item.wind.deg}
            </Text>
            <Text style={style.dataTemp}>
              {' '}
              Weather: {item.weather[0].description}
            </Text>
          </View>
        );
      }}></FlatList>
  );
};
const style = StyleSheet.create({
  customDataBox: {
    width: vw(320),
    alignSelf: 'center',
  },
  dataTemp: {
    color: 'white',
    fontSize: vw(18),
    marginTop: vh(8),
  },
  dateTimeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flatList: {
    width: vw(320),
    height: vh(200),
    marginTop: vh(16),
    paddingVertical: vh(20),
  },
});
export default CustomShowDataBox;
