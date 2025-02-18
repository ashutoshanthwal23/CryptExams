import React, { useState } from 'react';
import { Text, View, ScrollView, SafeAreaView, StatusBar, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import styles from './styles';
import CryptoES from 'crypto-es';
import * as SMS from 'expo-sms';
import UserInput from '../../components/UserInput';
import SendButton from '../../components/SendButton';
import UploadButton from '../../components/UploadButton';
import Constants from 'expo-constants';

const mobileNumber = Constants.expoConfig?.extra?.sendMsgToNumber;

const KeyScreen = () => {
  const [roll, setRoll] = useState("");
  const [fileName, setFileName] = useState("No file chosen");
  const [testId, setTestId] = useState("");
  const [sha256String, setsha256String] = useState("");

  const uploadPdf = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
  
      if (!file.canceled && file.assets.length > 0) {
        const pickedFile = file.assets[0]; 
        setFileName(pickedFile.name);
        await readFile(pickedFile.uri); 
      } else {
        setFileName("No file chosen");
      }
    } catch (error) {
      console.log(error);
      console.warn("Could not read file");
    }
  };
  

  const readFile = async (fileUri) => {
    try {
      const fileBuffer = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
      generateSHAKey(fileBuffer);
    } catch (error) {
      console.log(error);
    }
  }

  const generateSHAKey = (data) => {
    const hash = CryptoES.SHA256(data);
    const hashStr = hash.toString(CryptoES.enc.Hex);
    console.log("Sha256", hashStr);
    setsha256String(hashStr);
  }

  
const sendSms = async () => {

  try {
      // Check if SMS is available
      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        console.log("SMS not available on this device");
        return;
      }
  
      // Message content
      const message = sha256String + "%" + testId + "%" + roll;

      // Send SMS
      const result = await SMS.sendSMSAsync([mobileNumber], message);
   
    } catch (error) {
      console.error("Failed to send SMS:", error);
      Alert.alert("Error", "An error occurred while sending the message.");
    }
};
  

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight, }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <UserInput label="Roll No" placeholder="Enter roll no" setState={setRoll} />
        <UserInput label="Test Id" placeholder="Enter test id" setState={setTestId} />

        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>Attachments</Text>
          <UploadButton label="Choose PDF" func={uploadPdf} />
          <Text style={styles.pdfInfoText}>{fileName}</Text>
        </View>

        <SendButton label="Send SMS" func={sendSms} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default KeyScreen;