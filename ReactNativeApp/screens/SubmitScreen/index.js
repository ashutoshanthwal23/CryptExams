import React, { useState } from 'react';
import { Text, View, ActivityIndicator, ToastAndroid, SafeAreaView, ScrollView, StatusBar, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import styles from './styles';
import UserInput from '../../components/UserInput';
import SendButton from '../../components/SendButton';
import UploadButton from '../../components/UploadButton';
import Constants from 'expo-constants';

const backendUrl = Constants.expoConfig?.extra?.backenedUrl;

const SubmitScreen = () => {
  const [roll, setRoll] = useState("");
  const [fileName, setFileName] = useState("No file chosen");
  const [testId, setTestId] = useState("");
  const [fileData, setFileData] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const uploadPdf = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
      if (!file.canceled && file.assets.length > 0) {
        const pickedFile = file.assets[0]; 
        setFileName(pickedFile.name);
        createPdfToUpload(pickedFile);
        
      } else {
        setFileName("No file chosen");
      }
    } catch (error) {
      console.log(error);
      console.warn("Could not read file");
    }
  }

  const createPdfToUpload = (response) => {
    let { name, size, uri } = response;
    let nameParts = name.split('.');
    let fileType = nameParts[nameParts.length - 1];
    var fileToUpload = {
      name: name,
      size: size,
      uri: uri,
      type: "application/" + fileType
    };
    setFileData(fileToUpload);
  }

  const sendData = () => {
    let formdata = new FormData();

    formdata.append("testId", testId);
    formdata.append("rollNumber", roll);
    formdata.append("file", fileData);


    const API_URL = Platform.select({
      ios: backendUrl,  // iOS Simulator
      android: backendUrl,  // Android Emulator
      default: backendUrl, // Replace with your local IP for real devices
    });

    setShowLoader(true);
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formdata
      }).then((response) => {
        setShowLoader(false);
        return response.text();
      }).then((res) => {
        console.log(res);
        ToastAndroid.show(res, ToastAndroid.SHORT);
      }).catch((error) => {
        setShowLoader(false);
        console.log(error);
      })
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight, }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        {showLoader &&
          <View style={styles.loadingScreen}>
            <ActivityIndicator size="large" color="#549CF8" />
            <Text style={styles.loadingText}>Please Wait...</Text>
          </View>
        }

        <UserInput label="Roll No" placeholder="Enter roll number" setState={setRoll} />
        <UserInput label="Test Id" placeholder="Enter test id" setState={setTestId} />

        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>Attachments</Text>
          <UploadButton label="Choose PDF" func={uploadPdf} />
          <Text style={styles.pdfInfoText}>{fileName}</Text>
        </View>

        <SendButton label="Submit" func={sendData} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default SubmitScreen;