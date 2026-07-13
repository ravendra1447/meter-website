import { useState, useCallback } from 'react';

export function useBluetooth() {
  const [device, setDevice] = useState(null);
  const [server, setServer] = useState(null);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [receivedData, setReceivedData] = useState([]);
  const [logs, setLogs] = useState([]);

  const addLog = useCallback((type, message, data = null) => {
    setLogs(prev => [...prev, {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      type, // 'info', 'request', 'response', 'error'
      message,
      data
    }]);
  }, []);

  const connect = useCallback(async (serviceUuidStr) => {
    setIsConnecting(true);
    setError(null);
    try {
      if (!navigator.bluetooth) {
        throw new Error("Web Bluetooth API is not available in this browser.");
      }

      addLog('info', 'Requesting Bluetooth Device...');
      const serviceUuid = serviceUuidStr ? serviceUuidStr.toLowerCase() : undefined;
      const options = {
        acceptAllDevices: !serviceUuid,
      };

      if (serviceUuid) {
        options.filters = [{ services: [serviceUuid] }];
      } else {
        options.optionalServices = ['0000ffe0-0000-1000-8000-00805f9b34fb', 'battery_service', 'device_information'];
      }

      const selectedDevice = await navigator.bluetooth.requestDevice(options);
      
      addLog('info', `Connecting to GATT Server on ${selectedDevice.name}...`);
      selectedDevice.addEventListener('gattserverdisconnected', onDisconnected);
      
      const gattServer = await selectedDevice.gatt.connect();
      
      addLog('info', `Connected successfully to ${selectedDevice.name}`);
      setDevice(selectedDevice);
      setServer(gattServer);
      setIsConnecting(false);
      return { device: selectedDevice, server: gattServer };
    } catch (err) {
      console.error("Bluetooth connection error:", err);
      let errorMessage = err.message;
      
      // Provide a more user-friendly error if Bluetooth is off or unsupported
      if (err.message.includes("Bluetooth adapter not available")) {
        errorMessage = "Your device's Bluetooth is turned OFF or not supported. Please turn on Bluetooth in your Windows/Mobile settings and use Chrome or Edge.";
      } else if (err.message.includes("User cancelled")) {
        errorMessage = "Scanning cancelled. You must select a meter from the browser popup to connect.";
      }
      
      setError(errorMessage);
      addLog('error', `Connection failed: ${errorMessage}`);
      setIsConnecting(false);
      throw err;
    }
  }, [addLog]);

  const onDisconnected = useCallback((event) => {
    const disconnectedDevice = event.target;
    addLog('error', `Device ${disconnectedDevice.name} disconnected.`);
    setDevice(null);
    setServer(null);
  }, [addLog]);

  const disconnect = useCallback(() => {
    if (device && device.gatt.connected) {
      addLog('info', 'Disconnecting from device...');
      device.gatt.disconnect();
    }
  }, [device, addLog]);

  const readCharacteristic = useCallback(async (serviceUuid, characteristicUuid) => {
    if (!server) throw new Error("No GATT server connected.");
    try {
      addLog('request', `Reading characteristic ${characteristicUuid}...`);
      const service = await server.getPrimaryService(serviceUuid);
      const characteristic = await service.getCharacteristic(characteristicUuid);
      const value = await characteristic.readValue();
      const decoder = new TextDecoder('utf-8');
      const textValue = decoder.decode(value);
      
      addLog('response', `Read success`, textValue);
      return textValue;
    } catch (err) {
      addLog('error', `Read failed: ${err.message}`);
      setError(err.message);
      throw err;
    }
  }, [server, addLog]);
  
  const writeCharacteristic = useCallback(async (serviceUuid, characteristicUuid, dataString) => {
    if (!server) throw new Error("No GATT server connected.");
    try {
      addLog('request', `Writing to ${characteristicUuid}`, dataString);
      const service = await server.getPrimaryService(serviceUuid);
      const characteristic = await service.getCharacteristic(characteristicUuid);
      
      const encoder = new TextEncoder();
      await characteristic.writeValue(encoder.encode(dataString));
      addLog('response', `Write success`);
    } catch (err) {
      addLog('error', `Write failed: ${err.message}`);
      setError(err.message);
      throw err;
    }
  }, [server, addLog]);

  const startNotifications = useCallback(async (serviceUuid, characteristicUuid) => {
    if (!server) throw new Error("No GATT server connected.");
    try {
      addLog('info', `Starting notifications for ${characteristicUuid}...`);
      const service = await server.getPrimaryService(serviceUuid);
      const characteristic = await service.getCharacteristic(characteristicUuid);
      
      await characteristic.startNotifications();
      addLog('info', `Notifications started`);
      
      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = event.target.value;
        const decoder = new TextDecoder('utf-8');
        const textValue = decoder.decode(value);
        
        addLog('response', `Notification received`, textValue);
        
        setReceivedData(prev => [...prev, {
          timestamp: new Date().toISOString(),
          raw: textValue
        }].slice(-50)); // Keep last 50 for quick view
      });
      
    } catch (err) {
      addLog('error', `Failed to start notifications: ${err.message}`);
      setError(err.message);
      throw err;
    }
  }, [server, addLog]);

  const simulateConnection = useCallback(() => {
    setIsConnecting(true);
    setError(null);
    addLog('info', 'Starting Simulated Connection (Hardware Bypass)...');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockDevice = { 
          id: `sim-${Math.floor(Math.random()*10000)}`, 
          name: 'Simulated Smart Meter',
          gatt: { connected: true, disconnect: () => onDisconnected({ target: mockDevice }) }
        };
        
        let intervalId = null;
        
        const mockServer = {
          getPrimaryService: async () => ({
            getCharacteristic: async (charUuid) => ({
              readValue: async () => new TextEncoder().encode(JSON.stringify({ voltage: 230, current: 5.2, power: 1196 })),
              writeValue: async (data) => {
                const text = new TextDecoder().decode(data);
                addLog('info', `[SIMULATOR] Device received command: ${text}`);
              },
              startNotifications: async () => {
                if (intervalId) clearInterval(intervalId);
                intervalId = setInterval(() => {
                  const simulatedData = `Live: ${230 + Math.floor(Math.random()*5 - 2)}V | ${(5 + Math.random()).toFixed(2)}A`;
                  
                  addLog('response', `Notification received`, simulatedData);
                  setReceivedData(prev => [...prev, {
                    timestamp: new Date().toISOString(),
                    raw: simulatedData
                  }].slice(-50));
                }, 2000);
              },
              addEventListener: () => {} // Mock event listener
            })
          })
        };
        
        setDevice(mockDevice);
        setServer(mockServer);
        setIsConnecting(false);
        addLog('info', 'Connected successfully to Simulated Meter');
        resolve({ device: mockDevice, server: mockServer });
      }, 1500);
    });
  }, [addLog]);

  return {
    device,
    server,
    error,
    isConnecting,
    receivedData,
    logs,
    connect,
    simulateConnection,
    disconnect,
    readCharacteristic,
    writeCharacteristic,
    startNotifications,
    setReceivedData, // Allow manual clear
    setLogs
  };
}
