import {Dimensions, PixelRatio} from 'react-native';
export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;
export const DesignHeight = 812;
export const DesignWidth = 375;
const {width: SCREEN_WIDTH} = Dimensions.get('window');
export const {width: winWidth, height: winHeight} = Dimensions.get('window');
const IPHONE_6_SCREEN_WIDTH = 375;
// It is based on the screen width of your design layouts e.g Height 600 x Width 375
const scale = SCREEN_WIDTH / 375;
export const smallDevice = screenWidth <= IPHONE_6_SCREEN_WIDTH;
export const largeDevice = screenWidth > IPHONE_6_SCREEN_WIDTH;
export function normalize(size: any) {
  return PixelRatio.roundToNearestPixel(size * scale);
}

export const vw = (width: any) => {
  let percent = (width / DesignWidth) * 100;
  const elemWidth = parseFloat(percent + '%');
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

export const vh = (height: any) => {
  let percent = (height / DesignHeight) * 100;
  const elemHeight = parseFloat(percent + '%');
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

//medium.com/building-with-react-native/how-to-develop-responsive-uis-with-react-native-1x03-a448097c9503
const widthPercentageToDP = (widthPercent: any) => {
  // const screenWidth = Dimensions.get('window').width;
  // Convert string input to decimal number
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};
const heightPercentageToDP = (heightPercent: any) => {
  // const screenHeight = Dimensions.get('window').height;
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};
export {widthPercentageToDP, heightPercentageToDP};

export default {
  vh,
  vw,
  DesignHeight,
  DesignWidth,
  screenWidth,
  screenHeight,
  smallDevice,
  largeDevice,
};
