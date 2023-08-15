import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import axios from 'axios';

const API_KEY = 'YOUR_API_KEY'; // Replace with your ExchangeRate-API key
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

// Define types
interface Rate {
  currency: string;
  rate: number;
}

interface ApiResponse {
  conversion_rates: {
    [key: string]: number;
  };
}

const App: React.FC = () => {
  const [rates, setRates] = useState<Rate[]>([]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get<ApiResponse>(BASE_URL);
        const rateData = response.data.conversion_rates;
        const rateArray: Rate[] = Object.keys(rateData).map(key => ({
          currency: key,
          rate: rateData[key],
        }));
        setRates(rateArray);
      } catch (error) {
        console.error('Error fetching rates:', error);
      }
    };

    fetchRates();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>USD Exchange Rates</Text>
      <FlatList
        data={rates}
        keyExtractor={item => item.currency}
        renderItem={({item}) => (
          <View style={styles.rateContainer}>
            <Text style={styles.currency}>{item.currency}</Text>
            <Text style={styles.rate}>{item.rate.toString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  currency: {
    fontSize: 18,
  },
  rate: {
    fontSize: 18,
  },
});

export default App;
