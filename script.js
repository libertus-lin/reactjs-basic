import NetInfo from '@react-native-community/netinfo';
import WifiManager from 'react-native-wifi-reborn';
import Icon from 'react-native-vector-icons/FontAwesome';
import BackgroundTimer from 'react-native-background-timer';

const backgroundImage = require('./cyber_security.jpg');
const App = () => {
   const [wifiList, setWifiList] = useState([]);
   const [selectedNetwork, setSelectedNetwork] = useState(null);
   const [password, setPassword] = useState('');
   const [pingResult, setPingResult] = useState(null);
   const [spoofingResult, setSpoofingResult] = useState(null);
   const [location, setLocation] = useState(null);
   const [connectionTime, setConnectionTime] = useState(null);

   useEffect(() => {
      if (WifiManager !== null) {
         WifiManager.loadWifiList((wifiArray) => {
            setWifiList(wifiArray);
         });
      } else {
         console.error('WifiManager is null');
      }
   }, []);

   const fetchWifiList = async () => {
      try {
         const list = await WifiManager.loadWifiList();
         setWifiList(list);
      } catch (error) {
         console.log('Error fetching Wi-Fi list:', error);
      }
   };

   const connectToNetwork = async () => {
      try {
         await WifiManager.connectToProtectedSSID(selectedNetwork.SSID, password);
         console.log('Connected to network:', selectedNetwork.SSID);
         setPingResult(null);
         setSpoofingResult(null);
         setLocation(null);
         setConnectionTime(null);
         startNetworkInfoUpdates();
      } catch (error) {
         console.log('Error connecting to network:', error);
      }
   };

   const startNetworkInfoUpdates = () => {
      BackgroundTimer.runBackgroundTimer(() => {
         checkPing();
         checkDNS();
         getLocation();
         getConnectionTime();
      }, 5000);
   };

   const checkPing = async () => {
      try {
         const response = await NetInfo.fetch('isConnected');
         setPingResult(response.isConnected ? 'Connected' : 'Disconnected');
      } catch (error) {
         console.log('Error checking ping:', error);
      }
   };

   const checkDNS = async () => {
      try {
         const response = await NetInfo.fetch('isConnectionExpensive');
         setSpoofingResult(response.isConnectionExpensive ? 'Spoofed' : 'Not spoofed');
      } catch (error) {
         console.log('Error checking DNS spoofing:', error);
      }
   };

   // Get current location
   const getLocation = async () => {
      try {
         const location = await new Promise((resolve) => {
            setTimeout(() => {
               resolve('Unknown');
            }, 1000);
         });
         setLocation(location);
      } catch (error) {
         console.log('Error getting location:', error);
      }
   };

   // Get connection time
   const getConnectionTime = async () => {
      try {
         const connectionTime = await new Promise((resolve) => {
            setTimeout(() => {
               resolve('Unknown');
            }, 1000);
         });
         setConnectionTime(connectionTime);
      } catch (error) {
         console.log('Error getting connection time:', error);
      }
   };

   return (
      <ImageBackground source={backgroundImage} style={styles.container}>
         <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
               <Text style={styles.headerText}>Wi-Fi Security Checker</Text>
            </View>
            <View style={styles.content}>
               <Text style={styles.label}>Available Wi-Fi Networks:</Text>
               {wifiList.map((wifi, index) => (
                  <TouchableOpacity key={index} style={styles.networkItem} onPress={() => setSelectedNetwork(wifi)}>
                     <Text style={styles.networkName}>{wifi.SSID}</Text>
                     <Text style={styles.networkSignal}>{wifi.level} dBm</Text>
                  </TouchableOpacity>
               ))}
               {selectedNetwork && (
                  <View style={styles.selectedNetworkContainer}>
                     <Text style={styles.selectedNetworkText}>
                        Selected Network: {selectedNetwork.SSID}
                     </Text>
                     <TextInput style={styles.passwordInput} placeholder="Enter Password" onChangeText={(text) =>
                        setPassword(text)}
                        secureTextEntry
                     />
                     <TouchableOpacity style={styles.connectButton} onPress={connectToNetwork}>
                        <Text style={styles.connectButtonText}>Connect</Text>
                     </TouchableOpacity>
                  </View>
               )}
               <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Ping Result:</Text>
                  <Text style={styles.infoText}>{pingResult}</Text>
               </View>
               <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>DNS Spoofing:</Text>
                  <Text style={styles.infoText}>{spoofingResult}</Text>
               </View>
               <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Location:</Text>
                  <Text style={styles.infoText}>{location}</Text>
               </View>
               <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Connection Time:</Text>
                  <Text style={styles.infoText}>{connectionTime}</Text>
               </View>
            </View>
         </ScrollView>
      </ImageBackground>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      resizeMode: 'cover',
   },
   scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   header: {
      marginTop: 50,
      marginBottom: 30,
   },
   headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
   },
   content: {
      width: '80%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: 10,
      padding: 20,
   },
   label: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 10,
   },
   networkItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.2)',
   },
   networkName: {
      flex: 1,
      color: 'white',
      fontSize: 16,
   },
   networkSignal: {
      color: 'white',
      fontSize: 14,
   },
   selectedNetworkContainer: {
      marginVertical: 20,
   },
   selectedNetworkText: {
      color: 'white',
      fontSize: 16,
      marginBottom: 10,
   },
   passwordInput: {
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
   },
   connectButton: {
      backgroundColor: 'green',
      borderRadius: 5,
      paddingVertical: 12,
      alignItems: 'center',
   },
   connectButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
   },
   infoContainer: {
      marginTop: 20,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.2)',
      paddingTop: 10,
   },
   infoLabel: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
   },
   infoText: {
      color: 'white',
      fontSize: 14,
      marginTop: 5,
   },
});

export default App;